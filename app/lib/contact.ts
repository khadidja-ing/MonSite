/**
 * Logique du formulaire de contact (/contact).
 *
 * Ces fonctions ne dépendent pas de l'affichage : sujets proposés,
 * vérification des champs, préremplissage depuis l'adresse de la page,
 * protections contre les envois abusifs et envoi vers le service de
 * formulaire (type Formspree). Elles sont vérifiées par des tests
 * automatiques (contact.test.ts).
 *
 * IMPORTANT — protections contre les abus : le champ piège, le délai minimal
 * et la limite d'envois ci-dessous ne fonctionnent que dans le navigateur.
 * Un robot qui envoie directement des requêtes au service de formulaire les
 * contourne sans difficulté. Ils filtrent les robots les plus simples et les
 * clics répétés, mais une vraie protection (filtre anti-spam, limite par
 * adresse IP, captcha si besoin) doit aussi être activée sur le service qui
 * reçoit les messages.
 */
import { canReceiveMessages } from "~/config/site";
import { services as allServices } from "~/data/services";
import { tools as allTools } from "~/data/tools";
import type { Service, Tool } from "~/data/types";

/* ------------------------------------------------------------------ */
/* Sujets                                                              */
/* ------------------------------------------------------------------ */

/** Sujets généraux (hors services). */
export type GeneralSubject =
  | "information"
  | "signaler-erreur"
  | "suggerer-outil"
  | "partenariat"
  | "autre";

export interface SubjectOption {
  value: string;
  label: string;
}

export const SERVICE_SUBJECT_PREFIX = "service:";

const generalSubjectLabels: Record<GeneralSubject, string> = {
  information: "Demande d'information",
  "signaler-erreur": "Signaler une erreur sur une fiche",
  "suggerer-outil": "Suggérer un outil",
  partenariat: "Partenariat",
  autre: "Autre demande",
};

/** Sujets proposés avant le groupe « Prestations ». */
export const leadingSubjects: SubjectOption[] = [
  { value: "information", label: generalSubjectLabels.information },
];

/** Sujets proposés après le groupe « Prestations ». */
export const trailingSubjects: SubjectOption[] = (
  ["signaler-erreur", "suggerer-outil", "partenariat", "autre"] as const
).map((value) => ({ value, label: generalSubjectLabels[value] }));

export function isGeneralSubject(value: string): value is GeneralSubject {
  return Object.prototype.hasOwnProperty.call(generalSubjectLabels, value);
}

export function serviceSubject(slug: string): string {
  return `${SERVICE_SUBJECT_PREFIX}${slug}`;
}

/** Un sujet par prestation : "service:<slug>" → « Prestation : <titre> ». */
export function getServiceSubjects(services: Service[] = allServices): SubjectOption[] {
  return services.map((service) => ({
    value: serviceSubject(service.slug),
    label: `Prestation : ${service.title}`,
  }));
}

/** Titre du groupe de prestations dans la liste des sujets, selon leur statut réel. */
export function getServiceGroupLabel(services: Service[] = allServices): string {
  const allInPreparation =
    services.length > 0 && services.every((service) => service.status === "en-preparation");
  return allInPreparation ? "Prestations (en préparation)" : "Prestations";
}

/** Tous les sujets acceptés, dans l'ordre d'affichage. */
export function getAllSubjects(services: Service[] = allServices): SubjectOption[] {
  return [...leadingSubjects, ...getServiceSubjects(services), ...trailingSubjects];
}

export function getSubjectLabel(value: string, services: Service[] = allServices): string | undefined {
  return getAllSubjects(services).find((subject) => subject.value === value)?.label;
}

export function isValidSubject(value: string, services: Service[] = allServices): boolean {
  return getAllSubjects(services).some((subject) => subject.value === value);
}

/** Retrouve la prestation correspondant à un sujet "service:<slug>". */
export function getSubjectService(value: string, services: Service[] = allServices): Service | undefined {
  if (!value.startsWith(SERVICE_SUBJECT_PREFIX)) return undefined;
  const slug = value.slice(SERVICE_SUBJECT_PREFIX.length);
  return services.find((service) => service.slug === slug);
}

/**
 * Conseil affiché sous la liste des sujets, selon le sujet choisi.
 *
 * Tant qu'aucun moyen de contact ne fonctionne (formulaire non activé et pas
 * d'e-mail), les conseils parlent au futur : aucun message ne peut encore
 * nous parvenir. `options.canReceiveMessages` sert surtout aux tests.
 */
export function getSubjectHint(
  value: string,
  services: Service[] = allServices,
  options: { canReceiveMessages?: boolean } = {},
): string | undefined {
  const canReceive = options.canReceiveMessages ?? canReceiveMessages;
  const service = getSubjectService(value, services);
  if (service) {
    if (service.status !== "en-preparation") {
      return "Décrivez en quelques lignes votre situation et ce que vous aimeriez obtenir.";
    }
    return canReceive
      ? "Cette prestation est en préparation\u00a0: votre message permet simplement de manifester votre intérêt, sans aucun engagement."
      : "Cette prestation est en préparation\u00a0: dès que le formulaire de contact sera activé, votre message permettra simplement de manifester votre intérêt, sans aucun engagement.";
  }
  switch (value) {
    case "signaler-erreur":
      return "Précisez la fiche concernée, l'information à corriger et, si possible, la source qui permet de la vérifier (page officielle de l'outil, par exemple).";
    case "suggerer-outil":
      return canReceive
        ? "Indiquez le nom de l'outil, l'adresse de son site officiel et ce à quoi il sert. Chaque suggestion est vérifiée avant un éventuel ajout."
        : "Indiquez le nom de l'outil, l'adresse de son site officiel et ce à quoi il sert. Une fois le formulaire de contact activé, chaque suggestion sera vérifiée avant un éventuel ajout.";
    case "partenariat":
      return "Présentez brièvement votre structure et l'idée de partenariat que vous proposez.";
    default:
      return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Vérification des champs                                             */
/* ------------------------------------------------------------------ */

/*
 * Note : dans les textes affichés, « \u00a0 » est une espace insécable. Placée
 * avant « : », elle évite qu'un deux-points se retrouve seul en début de ligne.
 */

export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Ordre des champs dans le formulaire (utile pour le récapitulatif des erreurs). */
export const contactFields: ContactField[] = ["name", "email", "subject", "message"];

export const emptyContactValues: ContactValues = { name: "", email: "", subject: "", message: "" };

/**
 * Libellé du bouton du formulaire. On ne promet « Envoyer » que si le
 * formulaire est relié à un service d'envoi ; sinon, le bouton vérifie le
 * message puis propose de le copier (ou de l'envoyer par e-mail).
 */
export function getSubmitLabel(formActive: boolean): string {
  return formActive ? "Envoyer le message" : "Vérifier mon message";
}

/**
 * Valeurs déjà saisies dans les champs avant que la page soit active.
 *
 * Les pages sont pré-générées : on peut écrire dans le formulaire avant que
 * JavaScript soit chargé. `read` renvoie le contenu actuel d'un champ ; seuls
 * les champs non vides sont gardés, pour ne rien effacer au démarrage.
 */
export function pickTypedValues(read: (field: ContactField) => string | null | undefined): Partial<ContactValues> {
  const typed: Partial<ContactValues> = {};
  for (const field of contactFields) {
    const value = read(field);
    if (value != null && value.trim() !== "") typed[field] = value;
  }
  return typed;
}

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;
const EMAIL_MAX = 254;

/**
 * Vérification simple et volontairement tolérante : un seul « @ », pas
 * d'espace, et un domaine avec au moins un point (ex. prenom@exemple.fr).
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

export function isValidEmail(email: string): boolean {
  const value = email.trim();
  return value.length <= EMAIL_MAX && EMAIL_PATTERN.test(value);
}

const numberFormatter = new Intl.NumberFormat("fr-FR");

/** 2000 → « 2 000 » (espace insécable, à la française). */
export function formatCount(value: number): string {
  return numberFormatter.format(value);
}

/** Retire les espaces superflus au début et à la fin de chaque champ. */
export function trimContactValues(values: ContactValues): ContactValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  };
}

export interface ValidationOptions {
  services?: Service[];
  /**
   * Début de message prérempli depuis l'adresse (ex. « Fiche concernée : … »).
   * Un message identique à ce texte est refusé : il faut y ajouter sa demande.
   */
  prefilledMessage?: string;
}

/** Vérifie un seul champ ; renvoie le message d'erreur ou undefined. */
export function validateContactField(
  field: ContactField,
  values: ContactValues,
  { services = allServices, prefilledMessage }: ValidationOptions = {},
): string | undefined {
  const value = values[field].trim();
  switch (field) {
    case "name":
      if (!value) return "Indiquez votre nom.";
      if (value.length < NAME_MIN) return `Votre nom doit contenir au moins ${NAME_MIN} caractères.`;
      if (value.length > NAME_MAX) return `Votre nom ne peut pas dépasser ${NAME_MAX} caractères.`;
      return undefined;
    case "email":
      if (!value) return "Indiquez votre adresse e-mail, pour que nous puissions vous répondre.";
      if (!isValidEmail(value))
        return "Cette adresse e-mail ne semble pas valide. Exemple attendu\u00a0: prenom.nom@exemple.fr";
      return undefined;
    case "subject":
      if (!value) return "Choisissez le sujet de votre message.";
      if (!isValidSubject(value, services)) return "Ce sujet n'est pas reconnu\u00a0: choisissez-en un dans la liste.";
      return undefined;
    case "message":
      if (!value) return "Écrivez votre message.";
      if (prefilledMessage && value === prefilledMessage.trim())
        return "Décrivez votre demande à la suite du texte déjà indiqué (par exemple, l'erreur constatée et la correction à apporter).";
      if (value.length < MESSAGE_MIN)
        return `Votre message est un peu court\u00a0: ${MESSAGE_MIN} caractères minimum (actuellement ${value.length}).`;
      if (value.length > MESSAGE_MAX)
        return `Votre message est trop long\u00a0: ${formatCount(MESSAGE_MAX)} caractères maximum (actuellement ${formatCount(value.length)}).`;
      return undefined;
  }
}

/** Vérifie tout le formulaire. Un objet vide signifie « aucune erreur ». */
export function validateContact(values: ContactValues, options: ValidationOptions = {}): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of contactFields) {
    const error = validateContactField(field, values, options);
    if (error) errors[field] = error;
  }
  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return contactFields.some((field) => Boolean(errors[field]));
}

/** Texte du compteur de caractères du message. */
export function messageCounterText(length: number): string {
  if (length > MESSAGE_MAX) {
    return `${formatCount(length)} / ${formatCount(MESSAGE_MAX)} caractères (${formatCount(length - MESSAGE_MAX)} en trop)`;
  }
  if (length < MESSAGE_MIN) {
    const missing = MESSAGE_MIN - length;
    return `Encore ${missing} caractère${missing > 1 ? "s" : ""} minimum`;
  }
  return `${formatCount(length)} / ${formatCount(MESSAGE_MAX)} caractères`;
}

/* ------------------------------------------------------------------ */
/* Préremplissage depuis l'adresse de la page                          */
/* ------------------------------------------------------------------ */

export interface ContactPrefill {
  subject?: string;
  message?: string;
}

/** Début du message prérempli quand on signale une erreur sur une fiche. */
export function toolReportMessage(tool: Pick<Tool, "name" | "slug">): string {
  return `Fiche concernée : ${tool.name} (/outils/${tool.slug})\n\n`;
}

/**
 * Lit l'adresse de la page pour préremplir le formulaire :
 * - ?service=<slug> → sujet « Prestation : … » (si la prestation existe) ;
 * - ?sujet=signaler-erreur, ?sujet=suggerer-outil (ou un autre sujet général) → ce sujet ;
 * - ?sujet=signaler-erreur&outil=<slug> → message commençant par la fiche concernée
 *   (si l'outil existe).
 * Les valeurs inconnues sont ignorées. Si « sujet » et « service » sont tous
 * deux présents et valides, « sujet » l'emporte.
 */
export function prefillFromSearchParams(
  params: URLSearchParams,
  catalog: { services?: Service[]; tools?: Tool[] } = {},
): ContactPrefill {
  const services = catalog.services ?? allServices;
  const tools = catalog.tools ?? allTools;
  const prefill: ContactPrefill = {};

  const serviceSlug = params.get("service")?.trim();
  if (serviceSlug && services.some((service) => service.slug === serviceSlug)) {
    prefill.subject = serviceSubject(serviceSlug);
  }

  const topic = params.get("sujet")?.trim();
  if (topic && isGeneralSubject(topic)) {
    prefill.subject = topic;
  }

  const toolSlug = params.get("outil")?.trim();
  if (prefill.subject === "signaler-erreur" && toolSlug) {
    const tool = tools.find((item) => item.slug === toolSlug);
    if (tool) prefill.message = toolReportMessage(tool);
  }

  return prefill;
}

/**
 * Applique le préremplissage lu dans l'adresse sans écraser ce que la
 * personne a déjà écrit :
 * - le message prérempli ne remplace qu'un message vide, ou le texte
 *   prérempli précédent (`previousPrefill`) resté tel quel ;
 * - avec `keepSubject`, un sujet déjà choisi est conservé (sujet choisi
 *   avant que la page soit active, par exemple).
 */
export function applyContactPrefill(
  current: ContactValues,
  prefill: ContactPrefill,
  { previousPrefill, keepSubject = false }: { previousPrefill?: string; keepSubject?: boolean } = {},
): ContactValues {
  const next = { ...current };
  if (prefill.subject && !(keepSubject && current.subject.trim() !== "")) {
    next.subject = prefill.subject;
  }
  if (prefill.message && (current.message.trim() === "" || current.message === previousPrefill)) {
    next.message = prefill.message;
  }
  return next;
}

/* ------------------------------------------------------------------ */
/* Copie du message et lien e-mail                                     */
/* ------------------------------------------------------------------ */

/** Texte complet du message, pour le copier ou l'envoyer par e-mail. */
export function formatMessageForCopy(values: ContactValues, services: Service[] = allServices): string {
  const v = trimContactValues(values);
  const subject = getSubjectLabel(v.subject, services) ?? "Non précisé";
  return [`Sujet : ${subject}`, `Nom : ${v.name}`, `E-mail : ${v.email}`, "", v.message].join("\n");
}

/** Lien « mailto: » prérempli ; null si aucune adresse e-mail n'est configurée. */
export function buildMailtoHref(
  email: string,
  values: ContactValues,
  services: Service[] = allServices,
): string | null {
  const to = email.trim();
  if (!to) return null;
  const subject = getSubjectLabel(values.subject.trim(), services) ?? "Prise de contact";
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    formatMessageForCopy(values, services),
  )}`;
}

/* ------------------------------------------------------------------ */
/* Protections contre les envois abusifs (côté navigateur uniquement)  */
/* ------------------------------------------------------------------ */

/**
 * Nom du champ piège : invisible pour les humains, il est souvent rempli
 * automatiquement par les robots. S'il contient quelque chose, on n'envoie rien.
 */
export const HONEYPOT_FIELD = "site_web";

/** Délai minimal entre l'affichage du formulaire et l'envoi. */
export const MIN_FILL_TIME_MS = 3_000;

export type BotSignal = "honeypot" | "too-fast";

/**
 * Détecte les signes d'un envoi automatique :
 * - le champ piège est rempli ;
 * - le formulaire est envoyé moins de 3 secondes après son affichage
 *   (ou avant que l'heure d'affichage soit connue).
 */
export function detectBot({
  honeypot,
  startedAt,
  now,
  minFillTimeMs = MIN_FILL_TIME_MS,
}: {
  honeypot: string;
  startedAt: number | null;
  now: number;
  minFillTimeMs?: number;
}): BotSignal | null {
  if (honeypot.trim() !== "") return "honeypot";
  if (startedAt === null || now - startedAt < minFillTimeMs) return "too-fast";
  return null;
}

/** Nombre maximal d'envois réussis sur la période ci-dessous. */
export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
/** Clé utilisée dans le stockage local du navigateur. */
export const RATE_LIMIT_STORAGE_KEY = "contact-envois";

/** Ce dont la limite d'envois a besoin (localStorage, ou un faux stockage dans les tests). */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Stockage local du navigateur, ou null s'il est indisponible (navigation privée, blocage…). */
export function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Heures (en millisecondes) des envois réussis encore dans la période. */
export function readRecentSends(storage: StorageLike | null, now: number): number[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (time): time is number =>
        typeof time === "number" && Number.isFinite(time) && time <= now && now - time < RATE_LIMIT_WINDOW_MS,
    );
  } catch {
    return [];
  }
}

export interface RateLimitStatus {
  limited: boolean;
  /** Envois encore possibles sur la période. */
  remaining: number;
  /** Temps d'attente avant de pouvoir envoyer à nouveau (0 si non limité). */
  retryAfterMs: number;
}

export function checkRateLimit(storage: StorageLike | null, now: number): RateLimitStatus {
  const recent = readRecentSends(storage, now);
  if (recent.length < RATE_LIMIT_MAX) {
    return { limited: false, remaining: RATE_LIMIT_MAX - recent.length, retryAfterMs: 0 };
  }
  // On redevient libre quand le plus ancien des envois comptés sort de la période.
  const sorted = [...recent].sort((a, b) => a - b);
  const oldestCounted = sorted[sorted.length - RATE_LIMIT_MAX];
  return {
    limited: true,
    remaining: 0,
    retryAfterMs: Math.max(0, oldestCounted + RATE_LIMIT_WINDOW_MS - now),
  };
}

/** Enregistre un envoi réussi. Sans effet si le stockage est indisponible. */
export function recordSend(storage: StorageLike | null, now: number): void {
  if (!storage) return;
  try {
    const recent = [...readRecentSends(storage, now), now].slice(-RATE_LIMIT_MAX);
    storage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(recent));
  } catch {
    // Stockage plein ou refusé : la limite côté navigateur ne s'applique simplement pas.
  }
}

/** « 1 minute », « 4 minutes » (arrondi à la minute supérieure, au moins 1). */
export function formatWaitMinutes(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60_000));
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}

/* ------------------------------------------------------------------ */
/* Envoi                                                               */
/* ------------------------------------------------------------------ */

export type SubmitResult =
  | { status: "success" }
  | { status: "not-configured" }
  | { status: "error"; reason: "network" | "timeout" | "server"; message: string };

export const SUBMIT_TIMEOUT_MS = 15_000;

/** Données envoyées au service de formulaire (format compatible Formspree). */
export function buildContactPayload(values: ContactValues, services: Service[] = allServices) {
  const v = trimContactValues(values);
  const subjectLabel = getSubjectLabel(v.subject, services) ?? v.subject;
  return {
    name: v.name,
    email: v.email,
    subject: subjectLabel,
    subjectCode: v.subject,
    message: v.message,
    // Objet de l'e-mail de notification (champ reconnu par Formspree).
    _subject: `Contact — ${subjectLabel}`,
  };
}

function serverErrorMessage(status: number): string {
  if (status === 429) {
    return "Le service d'envoi reçoit trop de messages pour le moment. Votre message n'a pas été envoyé\u00a0: réessayez un peu plus tard.";
  }
  if (status >= 500) {
    return `Le service d'envoi rencontre un problème temporaire (code ${status}). Votre message n'a pas été envoyé\u00a0: réessayez dans quelques instants.`;
  }
  return `Le service d'envoi a refusé le message (code ${status}). Vérifiez les informations saisies puis réessayez.`;
}

/**
 * Envoie le message au service de formulaire.
 * - Adresse d'envoi vide → { status: "not-configured" }, sans aucune requête.
 * - Réponse « OK » du service → { status: "success" }.
 * - Sinon (réseau, délai de 15 s dépassé, erreur du service) → { status: "error", message }.
 */
export async function submitContact(
  values: ContactValues,
  endpoint: string,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number; services?: Service[] } = {},
): Promise<SubmitResult> {
  const url = endpoint.trim();
  if (!url) return { status: "not-configured" };

  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs ?? SUBMIT_TIMEOUT_MS);

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(buildContactPayload(values, options.services)),
      signal: controller.signal,
    });
    if (response.ok) return { status: "success" };
    return { status: "error", reason: "server", message: serverErrorMessage(response.status) };
  } catch {
    if (timedOut) {
      return {
        status: "error",
        reason: "timeout",
        message:
          "Le service d'envoi met trop de temps à répondre. Votre message n'a peut-être pas été envoyé\u00a0: vérifiez votre connexion puis réessayez.",
      };
    }
    return {
      status: "error",
      reason: "network",
      message:
        "Impossible de joindre le service d'envoi. Vérifiez votre connexion à Internet, puis réessayez.",
    };
  } finally {
    clearTimeout(timer);
  }
}
