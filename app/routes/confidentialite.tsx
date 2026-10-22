import { LegalInfoList, LegalList, LegalNote, LegalSubheading } from "~/components/legal/LegalBlocks";
import { LegalPage, type LegalSection } from "~/components/legal/LegalPage";
import { ExternalTextLink, MailtoLink, TextLink, textLinkClasses } from "~/components/legal/TextLink";
import { MissingContact, SiteValue, ToComplete } from "~/components/legal/ToComplete";
import { canReceiveMessages, hasContactEmail, isContactFormActive, siteConfig } from "~/config/site";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "~/lib/contact";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/confidentialite";

// Valeurs à compléter dans app/config/site.ts (rubriques « legal » et « contact »).
const legal = siteConfig.legal;
const formProvider = siteConfig.contact.formProvider;
const formProviderPrivacyUrl = formProvider.privacyUrl.trim();
// Typée « string » : l'adresse peut être renseignée plus tard dans les réglages.
const contactEmail: string = siteConfig.contact.email.trim();
const rateLimitMinutes = Math.round(RATE_LIMIT_WINDOW_MS / 60_000);

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Politique de confidentialité",
    description: `Comment ${siteConfig.name} utilise vos données : formulaire de contact, finalités, durée de conservation, droits prévus par le RGPD, cookies et stockage local.`,
    path: "/confidentialite",
  });
}

/**
 * Comment exercer ses droits : seulement les moyens de contact qui fonctionnent
 * réellement (formulaire relié à un service d'envoi, e-mail renseigné).
 */
function HowToReachUs() {
  if (!canReceiveMessages) {
    return (
      <>
        Pour exercer ces droits, vous pourrez nous adresser votre demande dès que le formulaire de
        contact sera activé. <MissingContact />
      </>
    );
  }
  return (
    <>
      Pour exercer ces droits, contactez-nous
      {isContactFormActive && (
        <>
          {" "}
          via le <TextLink to="/contact">formulaire de contact</TextLink> (sujet « Autre demande »)
        </>
      )}
      {isContactFormActive && hasContactEmail && " ou"}
      {hasContactEmail && (
        <>
          {" "}
          par e-mail à <MailtoLink email={contactEmail} />
        </>
      )}
      .
    </>
  );
}

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Qui est responsable de vos données ?",
    content: (
      <>
        <p>
          Le responsable du traitement est la personne ou l'organisme qui décide pourquoi et comment
          vos données sont utilisées. Pour ce site, il s'agit de l'éditeur&nbsp;:
        </p>
        <LegalInfoList
          items={[
            {
              label: "Responsable",
              value: <SiteValue value={legal.publisherName} missing="nom ou raison sociale de l'éditeur" />,
            },
            {
              label: "Adresse",
              value: <SiteValue value={legal.address} missing="adresse postale de l'éditeur" />,
            },
            {
              label: "Contact",
              value: hasContactEmail ? (
                <MailtoLink email={contactEmail} />
              ) : isContactFormActive ? (
                <TextLink to="/contact">Formulaire de contact</TextLink>
              ) : (
                <MissingContact />
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "donnees",
    title: "Quelles données sont collectées ?",
    content: (
      <>
        <p>
          Vous pouvez consulter tout le site sans créer de compte et sans donner d'information
          personnelle. Le site ne propose ni compte utilisateur, ni lettre d'information
          (newsletter), ni espace membre.
        </p>
        <LegalSubheading>Le formulaire de contact</LegalSubheading>
        <p>
          {isContactFormActive
            ? "Si vous nous écrivez via le formulaire de contact, les informations suivantes nous sont transmises\u00a0:"
            : "Lorsque l'envoi en ligne du formulaire de contact sera activé, les informations suivantes nous seront transmises\u00a0:"}
        </p>
        <LegalList>
          <li>votre nom&nbsp;;</li>
          <li>votre adresse e-mail&nbsp;;</li>
          <li>le sujet choisi&nbsp;;</li>
          <li>le contenu de votre message{isContactFormActive ? "\u00a0;" : "."}</li>
          {isContactFormActive && (
            <li>
              des données techniques liées à l'envoi (adresse IP, type de navigateur), que le service
              d'envoi du formulaire reçoit automatiquement.
            </li>
          )}
        </LegalList>
        <p>
          Nous vous conseillons de ne pas inscrire d'informations sensibles dans votre message (données
          de santé, coordonnées bancaires, mots de passe…).
        </p>
        {!isContactFormActive && (
          <LegalNote>
            Pour le moment, l'envoi en ligne du formulaire n'est pas encore activé&nbsp;: les informations
            que vous y saisissez restent dans votre navigateur et ne sont transmises à personne.
          </LegalNote>
        )}
        <LegalSubheading>Les données techniques de connexion</LegalSubheading>
        <p>
          Comme pour tout site Internet, l'hébergeur peut enregistrer automatiquement des données
          techniques lors de votre visite (adresse IP, date et heure, page consultée, type de
          navigateur), pour assurer la sécurité et le bon fonctionnement du service. Leur durée de
          conservation est indiquée dans la{" "}
          <a href="#conservation" className={textLinkClasses}>
            rubrique sur la conservation des données
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "finalites",
    title: "Pourquoi ces données sont-elles utilisées ?",
    content: (
      <>
        <p>
          {canReceiveMessages
            ? "Les informations que vous nous envoyez servent uniquement à\u00a0:"
            : "Lorsque l'envoi de messages sera possible, les informations que vous nous enverrez serviront uniquement à\u00a0:"}
        </p>
        <LegalList>
          <li>lire et répondre à votre demande (question, signalement d'erreur, suggestion d'outil…) ;</li>
          <li>donner suite à votre intérêt pour un service, si c'est l'objet de votre message ;</li>
          <li>corriger une fiche si vous nous signalez une erreur.</li>
        </LegalList>
        <p>
          Elles ne sont ni vendues, ni louées, ni utilisées pour vous envoyer de la publicité ou une
          lettre d'information.
        </p>
      </>
    ),
  },
  {
    id: "base-legale",
    title: "Sur quelle base légale ?",
    content: (
      <>
        <p>
          Le règlement général sur la protection des données (RGPD, règlement (UE) 2016/679) impose que
          chaque utilisation de données personnelles repose sur une « base légale ». Ici&nbsp;:
        </p>
        <LegalList>
          <li>
            répondre à une demande que vous nous adressez relève de l'<strong>intérêt légitime</strong>{" "}
            de l'éditeur à traiter les messages qu'il reçoit (article 6, paragraphe 1, point f du RGPD)&nbsp;;
          </li>
          <li>
            lorsque votre demande concerne un service, il peut s'agir de{" "}
            <strong>mesures précontractuelles</strong> prises à votre demande (article 6, paragraphe 1,
            point b).
          </li>
        </LegalList>
        <p>
          <ToComplete label="À confirmer">base légale retenue, à valider lors de la relecture juridique</ToComplete>
        </p>
      </>
    ),
  },
  {
    id: "destinataires",
    title: "Qui peut accéder à vos données ?",
    content: (
      <>
        <p>
          Vos données sont destinées uniquement à l'éditeur du site. Elles peuvent aussi être traitées,
          pour son compte, par les prestataires techniques nécessaires au fonctionnement du site&nbsp;:
        </p>
        <LegalList>
          <li>
            le service d'envoi du formulaire, qui {isContactFormActive ? "transmet" : "transmettra"} votre
            message à l'éditeur{isContactFormActive ? "" : " une fois l'envoi en ligne activé"}&nbsp;:{" "}
            <SiteValue value={formProvider.name} missing="nom du service d'envoi utilisé" /> (lieu de
            traitement des données&nbsp;:{" "}
            <SiteValue value={formProvider.location} missing="pays ou région où le service traite les données" />
            ,{" "}
            {formProviderPrivacyUrl ? (
              <ExternalTextLink href={formProviderPrivacyUrl}>politique de confidentialité du service</ExternalTextLink>
            ) : (
              <ToComplete>lien vers la politique de confidentialité du service</ToComplete>
            )}
            )&nbsp;;
          </li>
          <li>
            l'hébergeur du site&nbsp;:{" "}
            <SiteValue value={legal.hostName} missing="nom de l'hébergeur choisi" />.
          </li>
        </LegalList>
        <p>
          Si l'un de ces prestataires traite des données en dehors de l'Union européenne, la garantie qui
          encadre ce transfert (par exemple une décision d'adéquation de la Commission européenne ou des
          clauses contractuelles types) est précisée ici.{" "}
          <ToComplete label="À vérifier">
            transfert ou non hors de l'Union européenne, selon le lieu de traitement de chaque prestataire,
            et garantie applicable le cas échéant
          </ToComplete>
        </p>
      </>
    ),
  },
  {
    id: "conservation",
    title: "Combien de temps sont-elles conservées ?",
    content: (
      <>
        <p>
          Vos messages ne sont pas conservés indéfiniment&nbsp;: ils sont gardés pendant une durée limitée,
          adaptée au traitement de votre demande et à son éventuel suivi, puis supprimés.
        </p>
        <LegalInfoList
          items={[
            {
              label: "Vos messages",
              value: (
                <SiteValue
                  value={legal.messageRetention}
                  missing={"durée de conservation des messages — suggestion\u00a0: au maximum 3 ans après le dernier échange"}
                />
              ),
            },
            {
              label: "Journaux techniques de l'hébergeur",
              value: (
                <SiteValue value={legal.hostLogRetention} missing="durée de conservation fixée par l'hébergeur choisi" />
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "droits",
    title: "Quels sont vos droits ?",
    content: (
      <>
        <p>Conformément au RGPD, et dans les conditions qu'il prévoit, vous pouvez demander&nbsp;:</p>
        <LegalList>
          <li>
            <strong>l'accès</strong> à vos données&nbsp;: savoir si nous détenons des informations sur vous et
            en obtenir une copie&nbsp;;
          </li>
          <li>
            <strong>la rectification</strong>&nbsp;: corriger des informations inexactes ou incomplètes&nbsp;;
          </li>
          <li>
            <strong>l'effacement</strong>&nbsp;: faire supprimer vos données&nbsp;;
          </li>
          <li>
            <strong>l'opposition</strong>&nbsp;: refuser à tout moment, pour des raisons tenant à votre
            situation particulière, que vos données soient utilisées lorsque cette utilisation repose sur
            l'intérêt légitime de l'éditeur&nbsp;;
          </li>
          <li>
            <strong>la limitation</strong>&nbsp;: demander le « gel » temporaire de l'utilisation de vos
            données, par exemple le temps de vérifier une contestation&nbsp;;
          </li>
          <li>
            <strong>la portabilité</strong>&nbsp;: lorsque l'utilisation de vos données repose sur des
            mesures précontractuelles (article 6, paragraphe 1, point b), recevoir les données que vous
            nous avez fournies dans un format courant, pour les transmettre à un autre organisme.
          </li>
        </LegalList>
        <p>
          <HowToReachUs /> Une preuve d'identité ne vous sera demandée qu'en cas de doute raisonnable sur
          votre identité. Le RGPD prévoit une réponse dans un délai d'un mois, qui peut être prolongé
          dans certains cas.
        </p>
      </>
    ),
  },
  {
    id: "reclamation",
    title: "Réclamation auprès de l'autorité de contrôle",
    content: (
      <p>
        {canReceiveMessages ? "Si vous estimez, après nous avoir contactés," : "Si vous estimez"} que vos
        droits ne sont pas respectés, vous pouvez
        adresser une réclamation à l'autorité de contrôle compétente (en France&nbsp;: la{" "}
        <ExternalTextLink href="https://www.cnil.fr">CNIL</ExternalTextLink>).{" "}
        <ToComplete label="À confirmer">autorité compétente selon le pays de l'éditeur</ToComplete>
      </p>
    ),
  },
  {
    id: "securite",
    title: "Sécurité",
    content: (
      <>
        <p>
          L'éditeur prend des mesures raisonnables pour protéger vos données&nbsp;: connexion chiffrée
          (HTTPS) entre votre navigateur et le site, accès aux messages réservé à l'éditeur, et choix de
          prestataires présentant des garanties de sécurité.
        </p>
        <p>
          <ToComplete label="À vérifier">activation du HTTPS chez l'hébergeur lors de la mise en ligne</ToComplete>
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies et stockage local",
    content: (
      <>
        <p>
          Un cookie est un petit fichier enregistré par un site dans votre navigateur. À ce jour, le
          site <strong>ne dépose aucun cookie</strong> et n'utilise{" "}
          <strong>aucun outil de mesure d'audience ni aucun traceur publicitaire</strong>.
        </p>
        <p>
          Pendant votre visite, le site garde en mémoire dans votre navigateur, le temps de la session
          (dans son « stockage de session », ou <span lang="en">sessionStorage</span>), la position de
          défilement des pages consultées, pour vous ramener au bon endroit quand vous revenez en
          arrière. Cette information n'est jamais transmise, ni à nous ni à un tiers, et s'efface à la
          fermeture de l'onglet.
        </p>
        <p>
          Une autre petite valeur technique peut être enregistrée dans votre navigateur (dans son
          « stockage local », ou <span lang="en">localStorage</span>) uniquement pour limiter les envois
          abusifs du formulaire de contact&nbsp;: il s'agit de l'heure de vos derniers envois réussis, qui
          permet de limiter le nombre de messages à {RATE_LIMIT_MAX} toutes les {rateLimitMinutes} minutes.
          Cette valeur n'est jamais transmise, ni à nous ni à un tiers. Vous pouvez la supprimer à tout
          moment en effaçant les données de navigation du site dans votre navigateur.
          {!isContactFormActive &&
            " Tant que l'envoi en ligne du formulaire n'est pas activé, aucune valeur de ce type n'est enregistrée."}
        </p>
        <p>
          Les polices de caractères sont hébergées sur le site lui-même&nbsp;: votre visite ne déclenche
          aucune requête vers Google Fonts ou un autre service de polices.
        </p>
        <p>
          Si une mesure d'audience était ajoutée plus tard, cette page serait mise à jour et, lorsque
          la loi l'exige, votre accord vous serait demandé au préalable grâce à un dispositif de
          consentement.
        </p>
      </>
    ),
  },
  {
    id: "modifications",
    title: "Modification de cette politique",
    content: (
      <p>
        Cette politique peut évoluer, par exemple si un nouveau service ou un nouvel outil technique
        est ajouté au site. La date de dernière mise à jour est indiquée en haut de cette page. Pour
        toute question, consultez aussi les <TextLink to="/mentions-legales">mentions légales</TextLink>.
      </p>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro={"Quelles données sont collectées, pourquoi, combien de temps elles sont conservées et comment exercer vos droits. En bref\u00a0: le site collecte le strict minimum."}
      sections={sections}
    />
  );
}
