import { Mail } from "lucide-react";
import type { Ref } from "react";
import { buttonClasses } from "~/components/ui/Button";
import { Notice } from "~/components/ui/Notice";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, type BotSignal } from "~/lib/contact";
import { CopyMessageButton } from "./CopyMessageButton";

/** Résultat d'une tentative d'envoi, affiché sous le bouton « Envoyer ». */
export type ContactOutcome =
  | { kind: "success" }
  | { kind: "not-configured" }
  | { kind: "error"; message: string }
  | { kind: "rate-limited"; wait: string }
  | { kind: "bot"; signal: BotSignal };

const windowMinutes = Math.round(RATE_LIMIT_WINDOW_MS / 60_000);

interface ContactResultProps {
  outcome: ContactOutcome;
  /** Texte complet du message, pour le bouton « Copier mon message ». */
  copyText: string;
  /** Lien « mailto: » prérempli, seulement si une adresse e-mail est configurée. */
  mailtoHref: string | null;
  ref?: Ref<HTMLDivElement>;
}

function MailtoLink({ href }: { href: string }) {
  return (
    <a href={href} className={buttonClasses("secondary", "md")}>
      <Mail aria-hidden="true" />
      Envoyer par e-mail
    </a>
  );
}

/**
 * Message de résultat. La zone reçoit le focus après l'envoi : elle est
 * lue par les lecteurs d'écran et visible à l'écran.
 */
export function ContactResult({ outcome, copyText, mailtoHref, ref }: ContactResultProps) {
  const urgent =
    outcome.kind === "error" ||
    outcome.kind === "rate-limited" ||
    (outcome.kind === "bot" && outcome.signal === "honeypot");

  return (
    <div ref={ref} tabIndex={-1} role={urgent ? "alert" : "status"} className="animate-fade-in rounded-2xl">
      {outcome.kind === "success" && (
        <Notice tone="success" title="Merci, votre message a bien été envoyé.">
          <p>
            Le service d'envoi a confirmé sa réception. Si une réponse est nécessaire, elle vous sera
            adressée à l'adresse e-mail que vous avez indiquée. Le formulaire a été vidé&nbsp;: vous pouvez
            écrire un nouveau message si besoin.
          </p>
        </Notice>
      )}

      {outcome.kind === "not-configured" && (
        <Notice tone="warning" title={"L'envoi en ligne n'est pas encore activé\u00a0: votre message n'a pas été envoyé."}>
          <p>
            Le service qui transmettra les messages n'est pas encore en place, donc rien n'a été
            transmis. Votre texte est conservé dans le formulaire.{" "}
            {mailtoHref
              ? "Vous pouvez nous l'envoyer directement par e-mail, ou le copier pour le garder de côté."
              : "Vous pouvez le copier pour le garder de côté et nous l'envoyer une fois l'envoi en ligne activé."}
          </p>
          <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row">
            {mailtoHref && <MailtoLink href={mailtoHref} />}
            <CopyMessageButton text={copyText} />
          </div>
        </Notice>
      )}

      {outcome.kind === "error" && (
        <Notice tone="error" title="Votre message n'a pas pu être envoyé.">
          <p>{outcome.message}</p>
          <p className="mt-1">
            Votre texte est conservé&nbsp;: cliquez de nouveau sur « Envoyer le message » pour réessayer.
          </p>
          <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row">
            {mailtoHref && <MailtoLink href={mailtoHref} />}
            <CopyMessageButton text={copyText} />
          </div>
        </Notice>
      )}

      {outcome.kind === "rate-limited" && (
        <Notice tone="warning" title="Merci de patienter un peu avant un nouvel envoi.">
          <p>
            Pour éviter les envois abusifs, ce formulaire accepte au maximum {RATE_LIMIT_MAX} messages
            en {windowMinutes} minutes depuis un même navigateur. Vous pourrez envoyer un nouveau
            message dans {outcome.wait} environ. Votre texte est conservé dans le formulaire.
          </p>
        </Notice>
      )}

      {outcome.kind === "bot" && outcome.signal === "too-fast" && (
        <Notice tone="info" title="Encore un petit instant…">
          <p>
            Le formulaire a été envoyé très peu de temps après l'ouverture de la page, ce qui ressemble
            à un envoi automatique. Patientez quelques secondes, puis cliquez de nouveau sur « Envoyer
            le message ».
          </p>
        </Notice>
      )}

      {outcome.kind === "bot" && outcome.signal === "honeypot" && (
        <Notice tone="warning" title="Votre message n'a pas pu être envoyé.">
          <p>
            Un champ invisible, normalement laissé vide, a été rempli&nbsp;: cela arrive avec les robots, et
            parfois avec le remplissage automatique du navigateur. Rechargez la page, puis réessayez.
          </p>
        </Notice>
      )}
    </div>
  );
}
