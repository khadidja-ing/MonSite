import { describe, expect, it, vi } from "vitest";
import type { Service, Tool } from "~/data/types";
import {
  applyContactPrefill,
  buildContactPayload,
  buildMailtoHref,
  checkRateLimit,
  detectBot,
  formatMessageForCopy,
  formatWaitMinutes,
  getAllSubjects,
  getServiceGroupLabel,
  getSubjectHint,
  getSubjectLabel,
  getSubmitLabel,
  hasErrors,
  isValidEmail,
  messageCounterText,
  MIN_FILL_TIME_MS,
  pickTypedValues,
  prefillFromSearchParams,
  RATE_LIMIT_MAX,
  RATE_LIMIT_STORAGE_KEY,
  RATE_LIMIT_WINDOW_MS,
  readRecentSends,
  recordSend,
  submitContact,
  validateContact,
  validateContactField,
  type ContactValues,
  type StorageLike,
} from "./contact";

function makeService(slug: string, overrides: Partial<Service> = {}): Service {
  return {
    slug,
    title: `Service ${slug}`,
    icon: "compass",
    summary: "Résumé",
    description: "Description",
    benefits: [],
    audience: [],
    status: "en-preparation",
    ...overrides,
  };
}

function makeTool(slug: string, name: string): Tool {
  return {
    slug,
    name,
    publisher: "Éditeur",
    website: "https://example.com",
    category: "texte",
    tagline: "Accroche",
    description: "Description",
    uses: ["Usage"],
    access: "a-confirmer",
    sources: [],
    lastChecked: "2026-10-14",
  };
}

const services = [makeService("formation"), makeService("conseil", { status: "disponible" })];
const tools = [makeTool("assistant-x", "Assistant X")];

const valid: ContactValues = {
  name: "Camille Martin",
  email: "camille.martin@exemple.fr",
  subject: "information",
  message: "Bonjour, je voudrais savoir quel outil choisir pour résumer mes notes.",
};

/** Faux stockage local, en mémoire. */
function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

function okResponse(status = 200): Response {
  return new Response("{}", { status, headers: { "Content-Type": "application/json" } });
}

describe("sujets", () => {
  it("propose les sujets généraux et un sujet par prestation, dans l'ordre", () => {
    expect(getAllSubjects(services).map((s) => s.value)).toEqual([
      "information",
      "service:formation",
      "service:conseil",
      "signaler-erreur",
      "suggerer-outil",
      "partenariat",
      "autre",
    ]);
  });

  it("nomme les prestations « Prestation : <titre> »", () => {
    expect(getSubjectLabel("service:formation", services)).toBe("Prestation : Service formation");
    expect(getSubjectLabel("signaler-erreur", services)).toBe("Signaler une erreur sur une fiche");
    expect(getSubjectLabel("inconnu", services)).toBeUndefined();
  });

  it("indique « en préparation » dans le groupe seulement si toutes les prestations le sont", () => {
    expect(getServiceGroupLabel([makeService("a"), makeService("b")])).toBe("Prestations (en préparation)");
    expect(getServiceGroupLabel(services)).toBe("Prestations");
    expect(getServiceGroupLabel([])).toBe("Prestations");
  });

  it("donne un conseil honnête selon le statut de la prestation", () => {
    expect(getSubjectHint("service:formation", services)).toMatch(/en préparation/);
    expect(getSubjectHint("service:conseil", services)).not.toMatch(/en préparation/);
    expect(getSubjectHint("signaler-erreur", services)).toMatch(/fiche concernée/);
    expect(getSubjectHint("information", services)).toBeUndefined();
  });

  it("parle au présent seulement si un message peut nous parvenir", () => {
    const can = { canReceiveMessages: true };
    const cannot = { canReceiveMessages: false };
    expect(getSubjectHint("service:formation", services, can)).toMatch(/votre message permet simplement/);
    expect(getSubjectHint("service:formation", services, cannot)).toMatch(
      /dès que le formulaire de contact sera activé, votre message permettra/,
    );
    expect(getSubjectHint("service:formation", services, cannot)).not.toMatch(/permet simplement/);
    expect(getSubjectHint("suggerer-outil", services, can)).toMatch(/Chaque suggestion est vérifiée/);
    expect(getSubjectHint("suggerer-outil", services, cannot)).toMatch(
      /Une fois le formulaire de contact activé, chaque suggestion sera vérifiée/,
    );
    // Les simples conseils de rédaction restent les mêmes.
    expect(getSubjectHint("service:conseil", services, cannot)).toBe(getSubjectHint("service:conseil", services, can));
    expect(getSubjectHint("signaler-erreur", services, cannot)).toBe(getSubjectHint("signaler-erreur", services, can));
  });

  it("ne promet un envoi sur le bouton que si le formulaire est relié à un service", () => {
    expect(getSubmitLabel(true)).toBe("Envoyer le message");
    expect(getSubmitLabel(false)).toBe("Vérifier mon message");
    expect(getSubmitLabel(false)).not.toMatch(/envoy/i);
  });
});

describe("validateContact", () => {
  it("n'a aucune erreur pour un formulaire correct", () => {
    expect(validateContact(valid, { services })).toEqual({});
    expect(hasErrors(validateContact(valid, { services }))).toBe(false);
  });

  it("signale tous les champs obligatoires vides", () => {
    const errors = validateContact({ name: "", email: "", subject: "", message: "" }, { services });
    expect(Object.keys(errors)).toEqual(["name", "email", "subject", "message"]);
    expect(errors.name).toBe("Indiquez votre nom.");
    expect(hasErrors(errors)).toBe(true);
  });

  it("ignore les espaces au début et à la fin", () => {
    const errors = validateContact({ name: "   ", email: "  ", subject: " ", message: "        " }, { services });
    expect(errors.name).toBe("Indiquez votre nom.");
    expect(errors.message).toBe("Écrivez votre message.");
    expect(validateContact({ ...valid, name: "  Al  ", email: ` ${valid.email} ` }, { services })).toEqual({});
  });

  it("contrôle la longueur du nom (2 à 80 caractères)", () => {
    expect(validateContactField("name", { ...valid, name: "A" }, { services })).toMatch(/au moins 2/);
    expect(validateContactField("name", { ...valid, name: "Al" }, { services })).toBeUndefined();
    expect(validateContactField("name", { ...valid, name: "a".repeat(80) }, { services })).toBeUndefined();
    expect(validateContactField("name", { ...valid, name: "a".repeat(81) }, { services })).toMatch(/80 caractères/);
  });

  it("contrôle le format de l'adresse e-mail", () => {
    for (const email of ["prenom.nom@exemple.fr", "a+b@sous.domaine.co.uk", "x@y.io"]) {
      expect(isValidEmail(email)).toBe(true);
    }
    for (const email of ["prenom", "prenom@", "@exemple.fr", "a@b", "a b@c.fr", "a@b..fr", "a@@b.fr", "a@b.c"]) {
      expect(isValidEmail(email)).toBe(false);
    }
    expect(validateContactField("email", { ...valid, email: "pas-une-adresse" }, { services })).toMatch(/ne semble pas valide/);
    expect(isValidEmail(`${"a".repeat(250)}@b.fr`)).toBe(false);
  });

  it("n'accepte que les sujets de la liste", () => {
    expect(validateContactField("subject", { ...valid, subject: "service:formation" }, { services })).toBeUndefined();
    expect(validateContactField("subject", { ...valid, subject: "service:inexistant" }, { services })).toMatch(/pas reconnu/);
    expect(validateContactField("subject", { ...valid, subject: "spam" }, { services })).toMatch(/pas reconnu/);
  });

  it("contrôle la longueur du message (20 à 2 000 caractères)", () => {
    expect(validateContactField("message", { ...valid, message: "Trop court" }, { services })).toMatch(
      /20 caractères minimum \(actuellement 10\)/,
    );
    expect(validateContactField("message", { ...valid, message: "a".repeat(20) }, { services })).toBeUndefined();
    expect(validateContactField("message", { ...valid, message: "a".repeat(2000) }, { services })).toBeUndefined();
    expect(validateContactField("message", { ...valid, message: "a".repeat(2001) }, { services })).toMatch(/trop long/);
  });
});

describe("message prérempli", () => {
  const prefilledMessage = "Fiche concernée : Assistant X (/outils/assistant-x)\n\n";

  it("refuse un message identique au texte prérempli", () => {
    const values = { ...valid, subject: "signaler-erreur", message: `  ${prefilledMessage}  ` };
    expect(validateContact(values, { services, prefilledMessage }).message).toMatch(/Décrivez votre demande/);
  });

  it("accepte le message dès qu'une précision est ajoutée", () => {
    const values = { ...valid, subject: "signaler-erreur", message: `${prefilledMessage}Le prix indiqué a changé.` };
    expect(validateContact(values, { services, prefilledMessage })).toEqual({});
  });
});

describe("messageCounterText", () => {
  it("indique ce qui manque, le total ou le dépassement", () => {
    expect(messageCounterText(0)).toBe("Encore 20 caractères minimum");
    expect(messageCounterText(19)).toBe("Encore 1 caractère minimum");
    expect(messageCounterText(20)).toMatch(/^20 \/ 2\s000 caractères$/);
    expect(messageCounterText(2010)).toMatch(/\(10 en trop\)$/);
  });
});

describe("prefillFromSearchParams", () => {
  const catalog = { services, tools };
  const prefill = (query: string) => prefillFromSearchParams(new URLSearchParams(query), catalog);

  it("choisit la prestation demandée si elle existe", () => {
    expect(prefill("service=formation")).toEqual({ subject: "service:formation" });
    expect(prefill("service=inconnue")).toEqual({});
  });

  it("choisit les sujets « signaler une erreur » et « suggérer un outil »", () => {
    expect(prefill("sujet=signaler-erreur")).toEqual({ subject: "signaler-erreur" });
    expect(prefill("sujet=suggerer-outil")).toEqual({ subject: "suggerer-outil" });
    expect(prefill("sujet=n-importe-quoi")).toEqual({});
  });

  it("préremplit le message avec la fiche concernée quand l'outil existe", () => {
    expect(prefill("sujet=signaler-erreur&outil=assistant-x")).toEqual({
      subject: "signaler-erreur",
      message: "Fiche concernée : Assistant X (/outils/assistant-x)\n\n",
    });
    expect(prefill("sujet=signaler-erreur&outil=inconnu")).toEqual({ subject: "signaler-erreur" });
  });

  it("n'utilise l'outil qu'avec le sujet « signaler une erreur »", () => {
    expect(prefill("outil=assistant-x")).toEqual({});
    expect(prefill("sujet=suggerer-outil&outil=assistant-x")).toEqual({ subject: "suggerer-outil" });
  });

  it("ne renvoie rien sans paramètre", () => {
    expect(prefill("")).toEqual({});
  });
});

describe("applyContactPrefill", () => {
  const empty: ContactValues = { name: "", email: "", subject: "", message: "" };
  const report = { subject: "signaler-erreur", message: "Fiche concernée : Assistant X (/outils/assistant-x)\n\n" };

  it("remplit le sujet et le message d'un formulaire vide", () => {
    expect(applyContactPrefill(empty, report)).toEqual({ ...empty, ...report });
    expect(applyContactPrefill(empty, {})).toEqual(empty);
  });

  it("ne remplace jamais un message déjà rédigé", () => {
    const typed = { ...empty, message: "Mon propre message" };
    expect(applyContactPrefill(typed, report).message).toBe("Mon propre message");
  });

  it("remplace l'ancien texte prérempli resté tel quel", () => {
    const current = { ...empty, message: report.message };
    const next = { subject: "signaler-erreur", message: "Fiche concernée : Autre (/outils/autre)\n\n" };
    expect(applyContactPrefill(current, next, { previousPrefill: report.message }).message).toBe(next.message);
  });

  it("garde le sujet choisi avant que la page soit active", () => {
    const typed = { ...empty, subject: "information" };
    expect(applyContactPrefill(typed, report, { keepSubject: true }).subject).toBe("information");
    // Sans sujet déjà choisi, le préremplissage s'applique quand même.
    expect(applyContactPrefill(empty, report, { keepSubject: true }).subject).toBe("signaler-erreur");
    // Changement d'adresse ensuite (lien cliqué sur la page) : le sujet suit l'adresse.
    expect(applyContactPrefill(typed, report).subject).toBe("signaler-erreur");
  });
});

describe("pickTypedValues", () => {
  it("garde uniquement les champs déjà remplis dans la page", () => {
    const dom: Record<string, string | undefined> = {
      name: "Camille",
      email: "   ",
      subject: "",
      message: "Bonjour, voici ma question.",
    };
    expect(pickTypedValues((field) => dom[field])).toEqual({
      name: "Camille",
      message: "Bonjour, voici ma question.",
    });
  });

  it("ne renvoie rien si aucun champ n'est rempli ou lisible", () => {
    expect(pickTypedValues(() => "")).toEqual({});
    expect(pickTypedValues(() => undefined)).toEqual({});
    expect(pickTypedValues(() => null)).toEqual({});
  });
});

describe("copie et lien e-mail", () => {
  it("met en forme le message à copier", () => {
    expect(formatMessageForCopy({ ...valid, name: " Camille Martin " }, services)).toBe(
      `Sujet : Demande d'information\nNom : Camille Martin\nE-mail : ${valid.email}\n\n${valid.message}`,
    );
  });

  it("ne crée un lien e-mail que si une adresse est configurée", () => {
    expect(buildMailtoHref("", valid, services)).toBeNull();
    const href = buildMailtoHref("contact@exemple.fr", valid, services);
    expect(href).toMatch(/^mailto:contact@exemple\.fr\?subject=/);
    expect(decodeURIComponent(href!.split("subject=")[1].split("&")[0])).toBe("Demande d'information");
    expect(href).toContain(encodeURIComponent(valid.message));
  });
});

describe("detectBot", () => {
  it("repère le champ piège rempli", () => {
    expect(detectBot({ honeypot: "https://spam.example", startedAt: 0, now: 60_000 })).toBe("honeypot");
  });

  it("repère un envoi trop rapide ou sans heure d'affichage", () => {
    expect(detectBot({ honeypot: "", startedAt: 1_000, now: 1_000 + MIN_FILL_TIME_MS - 1 })).toBe("too-fast");
    expect(detectBot({ honeypot: "", startedAt: null, now: 10_000 })).toBe("too-fast");
  });

  it("laisse passer un envoi humain", () => {
    expect(detectBot({ honeypot: "", startedAt: 1_000, now: 1_000 + MIN_FILL_TIME_MS })).toBeNull();
  });
});

describe("limite d'envois", () => {
  const start = 1_000_000_000;

  it("autorise 3 envois puis bloque pendant la période", () => {
    const storage = memoryStorage();
    for (let i = 0; i < RATE_LIMIT_MAX; i += 1) {
      expect(checkRateLimit(storage, start + i * 1000).limited).toBe(false);
      recordSend(storage, start + i * 1000);
    }
    const status = checkRateLimit(storage, start + 5_000);
    expect(status.limited).toBe(true);
    expect(status.remaining).toBe(0);
    expect(status.retryAfterMs).toBe(RATE_LIMIT_WINDOW_MS - 5_000);
  });

  it("libère un envoi quand le plus ancien sort de la période", () => {
    const storage = memoryStorage();
    recordSend(storage, start);
    recordSend(storage, start + 60_000);
    recordSend(storage, start + 120_000);
    expect(checkRateLimit(storage, start + RATE_LIMIT_WINDOW_MS - 1).limited).toBe(true);
    const later = checkRateLimit(storage, start + RATE_LIMIT_WINDOW_MS);
    expect(later).toEqual({ limited: false, remaining: 1, retryAfterMs: 0 });
  });

  it("ne garde que les envois récents", () => {
    const storage = memoryStorage();
    recordSend(storage, start);
    recordSend(storage, start + RATE_LIMIT_WINDOW_MS + 1);
    expect(JSON.parse(storage.data[RATE_LIMIT_STORAGE_KEY])).toEqual([start + RATE_LIMIT_WINDOW_MS + 1]);
  });

  it("ignore un contenu de stockage illisible ou incohérent", () => {
    expect(readRecentSends(memoryStorage({ [RATE_LIMIT_STORAGE_KEY]: "pas du json" }), start)).toEqual([]);
    expect(readRecentSends(memoryStorage({ [RATE_LIMIT_STORAGE_KEY]: '{"a":1}' }), start)).toEqual([]);
    expect(
      readRecentSends(memoryStorage({ [RATE_LIMIT_STORAGE_KEY]: JSON.stringify(["x", start, start + 99]) }), start),
    ).toEqual([start]);
  });

  it("fonctionne sans stockage et résiste à un stockage qui refuse l'accès", () => {
    expect(checkRateLimit(null, start).limited).toBe(false);
    expect(() => recordSend(null, start)).not.toThrow();
    const broken: StorageLike = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(checkRateLimit(broken, start).limited).toBe(false);
    expect(() => recordSend(broken, start)).not.toThrow();
  });

  it("arrondit l'attente à la minute supérieure", () => {
    expect(formatWaitMinutes(1)).toBe("1 minute");
    expect(formatWaitMinutes(60_000)).toBe("1 minute");
    expect(formatWaitMinutes(60_001)).toBe("2 minutes");
  });
});

describe("submitContact", () => {
  it("ne fait aucune requête si l'adresse d'envoi est vide", async () => {
    const fetchImpl = vi.fn();
    expect(await submitContact(valid, "", { fetchImpl })).toEqual({ status: "not-configured" });
    expect(await submitContact(valid, "   ", { fetchImpl })).toEqual({ status: "not-configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("envoie le message en JSON et confirme si le service répond OK", async () => {
    const fetchImpl = vi.fn(async () => okResponse(200));
    const result = await submitContact({ ...valid, name: " Camille Martin " }, "https://formspree.io/f/test", {
      fetchImpl,
      services,
    });
    expect(result).toEqual({ status: "success" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://formspree.io/f/test");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Accept: "application/json", "Content-Type": "application/json" });
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(init.body as string)).toEqual(buildContactPayload(valid, services));
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: "Camille Martin",
      subject: "Demande d'information",
      subjectCode: "information",
    });
  });

  it("renvoie une erreur en français si le service répond une erreur", async () => {
    const server = await submitContact(valid, "https://x.test", { fetchImpl: async () => okResponse(500) });
    expect(server).toMatchObject({ status: "error", reason: "server" });
    expect(server.status === "error" && server.message).toMatch(/problème temporaire \(code 500\)/);

    const refused = await submitContact(valid, "https://x.test", { fetchImpl: async () => okResponse(422) });
    expect(refused.status === "error" && refused.message).toMatch(/refusé/);

    const tooMany = await submitContact(valid, "https://x.test", { fetchImpl: async () => okResponse(429) });
    expect(tooMany.status === "error" && tooMany.message).toMatch(/trop de messages/);
  });

  it("renvoie une erreur réseau si le service est injoignable", async () => {
    const result = await submitContact(valid, "https://x.test", {
      fetchImpl: async () => {
        throw new TypeError("Failed to fetch");
      },
    });
    expect(result).toMatchObject({ status: "error", reason: "network" });
    expect(result.status === "error" && result.message).toMatch(/Impossible de joindre/);
  });

  it("abandonne après le délai maximal", async () => {
    const fetchImpl = (_url: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      });
    const result = await submitContact(valid, "https://x.test", { fetchImpl, timeoutMs: 20 });
    expect(result).toMatchObject({ status: "error", reason: "timeout" });
    expect(result.status === "error" && result.message).toMatch(/trop de temps/);
  });
});
