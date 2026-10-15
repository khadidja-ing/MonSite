import { ChevronDown, Info, LoaderCircle, Lock, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { TextLink } from "~/components/legal/TextLink";
import { Button } from "~/components/ui/Button";
import { siteConfig } from "~/config/site";
import { services } from "~/data/services";
import {
  buildMailtoHref,
  checkRateLimit,
  contactFields,
  detectBot,
  emptyContactValues,
  formatMessageForCopy,
  formatWaitMinutes,
  getBrowserStorage,
  getServiceGroupLabel,
  getServiceSubjects,
  getSubjectHint,
  HONEYPOT_FIELD,
  leadingSubjects,
  MESSAGE_MAX,
  MESSAGE_MIN,
  messageCounterText,
  NAME_MAX,
  prefillFromSearchParams,
  recordSend,
  submitContact,
  trailingSubjects,
  validateContact,
  validateContactField,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "~/lib/contact";
import { cn } from "~/lib/cn";
import { useHydrated } from "~/lib/use-hydrated";
import { ContactResult, type ContactOutcome } from "./ContactResult";
import { controlClasses, describedBy, fieldIds, FormField } from "./FormField";

// Typées « string » : ces adresses peuvent être renseignées plus tard dans les réglages.
const formEndpoint: string = siteConfig.contact.formEndpoint;
const contactEmail: string = siteConfig.contact.email;
const isOnlineSendingActive = formEndpoint.trim() !== "";

const serviceSubjects = getServiceSubjects(services);
const serviceGroupLabel = getServiceGroupLabel(services);

const fieldLabels: Record<ContactField, string> = {
  name: "Nom",
  email: "Adresse e-mail",
  subject: "Sujet",
  message: "Message",
};

/** Préremplissage lu dans l'adresse de la page (?service=…, ?sujet=…, ?outil=…). */
function applyPrefill(current: ContactValues, params: URLSearchParams, previousPrefill: string | undefined) {
  const prefill = prefillFromSearchParams(params);
  const next = { ...current };
  if (prefill.subject) next.subject = prefill.subject;
  // On ne remplace jamais un message déjà rédigé par la personne.
  if (prefill.message && (current.message.trim() === "" || current.message === previousPrefill)) {
    next.message = prefill.message;
  }
  return { values: next, prefilledMessage: prefill.message };
}

export function ContactForm() {
  const hydrated = useHydrated();
  const [searchParams] = useSearchParams();
  const paramsKey = searchParams.toString();
  // Un seul formulaire par page : des identifiants fixes et lisibles suffisent.
  const uid = "contact";
  const ids: Record<ContactField, string> = {
    name: `${uid}-nom`,
    email: `${uid}-email`,
    subject: `${uid}-sujet`,
    message: `${uid}-message`,
  };
  const honeypotId = `${uid}-site-web`;
  const counterId = `${uid}-compteur`;
  const summaryTitleId = `${uid}-erreurs-titre`;
  const subjectHintId = `${uid}-sujet-conseil`;

  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  /** Vrai après la première tentative d'envoi : on vérifie alors chaque champ en sortie. */
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<ContactOutcome | null>(null);
  const [prefilledMessage, setPrefilledMessage] = useState<string | undefined>(undefined);
  /** Compteur annoncé aux lecteurs d'écran, après une courte pause de frappe. */
  const [announcedCount, setAnnouncedCount] = useState("");
  /** Incrémenté pour déplacer le focus après un envoi (récapitulatif ou résultat). */
  const [focusRequest, setFocusRequest] = useState<{ target: "summary" | "result"; id: number } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number | null>(null);
  const appliedParams = useRef<string | null>(null);
  const typedOnce = useRef(false);

  // Heure d'affichage du formulaire (sert à repérer les envois automatiques trop rapides).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Préremplissage depuis l'adresse, seulement une fois la page active dans le navigateur.
  useEffect(() => {
    if (!hydrated || appliedParams.current === paramsKey) return;
    appliedParams.current = paramsKey;
    const params = new URLSearchParams(paramsKey);
    setValues((current) => applyPrefill(current, params, prefilledMessage).values);
    setPrefilledMessage(prefillFromSearchParams(params).message);
  }, [hydrated, paramsKey, prefilledMessage]);

  // Déplace le focus vers le récapitulatif des erreurs ou le message de résultat.
  useEffect(() => {
    if (!focusRequest) return;
    const element = focusRequest.target === "summary" ? summaryRef.current : resultRef.current;
    element?.focus();
  }, [focusRequest]);

  const messageLength = values.message.trim().length;
  const counterText = messageCounterText(messageLength);

  // Annonce le compteur aux lecteurs d'écran une seconde après la dernière frappe.
  useEffect(() => {
    if (!typedOnce.current) return;
    const timer = setTimeout(() => setAnnouncedCount(counterText), 1000);
    return () => clearTimeout(timer);
  }, [counterText]);

  const validationOptions = { services, prefilledMessage };

  function updateField(field: ContactField, value: string) {
    if (field === "message") typedOnce.current = true;
    const next = { ...values, [field]: value };
    setValues(next);
    // Après une tentative d'envoi, l'erreur disparaît dès que le champ est corrigé.
    if (attempted && errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateContactField(field, next, validationOptions) }));
    }
  }

  function handleBlur(field: ContactField) {
    if (!attempted) return;
    setErrors((current) => ({ ...current, [field]: validateContactField(field, values, validationOptions) }));
  }

  function focusField(field: ContactField) {
    const element = document.getElementById(ids[field]);
    element?.focus();
    element?.scrollIntoView({ block: "center" });
  }

  function showOutcome(next: ContactOutcome) {
    setOutcome(next);
    setFocusRequest({ target: "result", id: Date.now() });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    setAttempted(true);
    const found = validateContact(values, validationOptions);
    setErrors(found);
    if (contactFields.some((field) => found[field])) {
      setOutcome(null);
      setFocusRequest({ target: "summary", id: Date.now() });
      return;
    }

    const now = Date.now();
    const honeypot = String(new FormData(event.currentTarget).get(HONEYPOT_FIELD) ?? "");
    const botSignal = detectBot({ honeypot, startedAt: startedAt.current, now });
    if (botSignal) {
      showOutcome({ kind: "bot", signal: botSignal });
      return;
    }

    const storage = getBrowserStorage();
    const limit = checkRateLimit(storage, now);
    if (limit.limited) {
      showOutcome({ kind: "rate-limited", wait: formatWaitMinutes(limit.retryAfterMs) });
      return;
    }

    setSending(true);
    setOutcome(null);
    const result = await submitContact(values, formEndpoint, { services });
    setSending(false);

    if (result.status === "success") {
      recordSend(storage, Date.now());
      setValues(emptyContactValues);
      setErrors({});
      setAttempted(false);
      setPrefilledMessage(undefined);
      typedOnce.current = false;
      setAnnouncedCount("");
      formRef.current?.reset();
      startedAt.current = Date.now();
      showOutcome({ kind: "success" });
    } else if (result.status === "not-configured") {
      showOutcome({ kind: "not-configured" });
    } else {
      showOutcome({ kind: "error", message: result.message });
    }
  }

  const errorList = contactFields.filter((field) => errors[field]);
  const subjectHint = getSubjectHint(values.subject, services);
  const messageTooLong = messageLength > MESSAGE_MAX;
  const messageTooShort = messageLength > 0 && messageLength < MESSAGE_MIN;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={`${uid}-titre`}
      aria-busy={sending}
      className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-100 sm:p-8"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 id={`${uid}-titre`} className="text-2xl font-bold tracking-tight">
          Écrire un message
        </h2>
        <p className="text-sm text-ink-500">Tous les champs sont obligatoires.</p>
      </div>

      {!isOnlineSendingActive && (
        <div className="mt-5 flex gap-3 rounded-2xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700 ring-1 ring-ink-100 ring-inset">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
          <p>
            <strong className="font-semibold text-ink-900">L'envoi en ligne n'est pas encore activé.</strong>{" "}
            Vous pouvez déjà rédiger votre message&nbsp;: au moment de l'envoi, nous vous indiquerons comment
            le conserver.
          </p>
        </div>
      )}

      {/* Récapitulatif des erreurs, qui reçoit le focus après une tentative d'envoi incomplète. */}
      {attempted && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={summaryTitleId}
          className="mt-6 rounded-2xl bg-red-50 p-4 ring-1 ring-red-200 ring-inset sm:p-5"
        >
          <h3 id={summaryTitleId} className="text-base font-semibold text-red-950">
            {errorList.length === 1
              ? "Une information est à corriger avant l'envoi"
              : `${errorList.length} informations sont à corriger avant l'envoi`}
          </h3>
          <ul className="mt-2 space-y-0.5 text-sm">
            {errorList.map((field) => (
              <li key={field}>
                <a
                  href={`#${ids[field]}`}
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                  className="inline-flex min-h-10 items-center rounded py-1 font-medium text-red-800 underline decoration-red-300 underline-offset-2 hover:decoration-red-800"
                >
                  {fieldLabels[field]}&nbsp;: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <FormField id={ids.name} label={fieldLabels.name} error={errors.name}>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            maxLength={NAME_MAX + 20}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={() => handleBlur("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy(errors.name && fieldIds(ids.name).error)}
            className={controlClasses}
          />
        </FormField>

        <FormField id={ids.email} label={fieldLabels.email} error={errors.email}>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            aria-required="true"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy(errors.email && fieldIds(ids.email).error)}
            className={controlClasses}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField id={ids.subject} label={fieldLabels.subject} error={errors.subject}>
            <div className="relative">
              <select
                id={ids.subject}
                name="subject"
                required
                aria-required="true"
                value={values.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                onBlur={() => handleBlur("subject")}
                aria-invalid={errors.subject ? true : undefined}
                aria-describedby={describedBy(
                  subjectHint && subjectHintId,
                  errors.subject && fieldIds(ids.subject).error,
                )}
                className={cn(controlClasses, "appearance-none truncate pr-10", !values.subject && "text-ink-500")}
              >
                <option value="">Choisissez un sujet…</option>
                {leadingSubjects.map((subject) => (
                  <option key={subject.value} value={subject.value} className="text-ink-950">
                    {subject.label}
                  </option>
                ))}
                {serviceSubjects.length > 0 && (
                  <optgroup label={serviceGroupLabel} className="text-ink-950">
                    {serviceSubjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </optgroup>
                )}
                {trailingSubjects.map((subject) => (
                  <option key={subject.value} value={subject.value} className="text-ink-950">
                    {subject.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-ink-500"
              />
            </div>
          </FormField>
          {subjectHint && (
            <p
              id={subjectHintId}
              className="mt-2 flex gap-2 rounded-xl bg-accent-50 px-3.5 py-2.5 text-sm leading-relaxed text-accent-800"
            >
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{subjectHint}</span>
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <FormField
            id={ids.message}
            label={fieldLabels.message}
            hint={`Expliquez votre demande en quelques phrases (entre ${MESSAGE_MIN} et 2 000 caractères). Évitez d'y inscrire des informations sensibles.`}
            error={errors.message}
            footer={
              <p
                id={counterId}
                className={cn(
                  "shrink-0 text-sm tabular-nums sm:ml-auto sm:text-right",
                  messageTooLong ? "font-medium text-red-700" : messageTooShort ? "text-ink-600" : "text-ink-500",
                )}
              >
                {counterText}
              </p>
            }
          >
            <textarea
              id={ids.message}
              name="message"
              rows={7}
              required
              aria-required="true"
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              onBlur={() => handleBlur("message")}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy(
                fieldIds(ids.message).hint,
                counterId,
                errors.message && fieldIds(ids.message).error,
              )}
              className={cn(controlClasses, "min-h-40 resize-y leading-relaxed")}
            />
          </FormField>
          <p aria-live="polite" className="sr-only">
            {announcedCount}
          </p>
        </div>
      </div>

      {/*
        Champ piège : invisible pour les visiteurs et ignoré par les lecteurs d'écran.
        Les robots qui remplissent tous les champs le remplissent aussi.
      */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={honeypotId}>Ne pas remplir ce champ</label>
        <input id={honeypotId} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {/* Sans JavaScript, le bouton reste désactivé : on explique pourquoi. */}
      <noscript>
        <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 ring-1 ring-amber-200 ring-inset">
          Ce formulaire a besoin de JavaScript pour fonctionner. Activez-le dans les réglages de votre
          navigateur, puis rechargez la page.
        </p>
      </noscript>

      <div className="mt-8 flex flex-col gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex gap-2 text-sm leading-relaxed text-ink-600 sm:max-w-sm">
          <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-400" />
          <span>
            Vos informations servent uniquement à répondre à votre demande. En savoir plus&nbsp;:{" "}
            <TextLink to="/confidentialite">politique de confidentialité</TextLink>.
          </span>
        </p>
        <Button type="submit" size="lg" disabled={!hydrated || sending} className="w-full sm:w-auto">
          {sending ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              Envoyer le message
            </>
          )}
        </Button>
      </div>

      {outcome && (
        <div className="mt-6">
          <ContactResult
            ref={resultRef}
            outcome={outcome}
            copyText={formatMessageForCopy(values, services)}
            mailtoHref={buildMailtoHref(contactEmail, values, services)}
          />
        </div>
      )}
    </form>
  );
}
