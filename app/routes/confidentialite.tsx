import { LegalInfoList, LegalList, LegalNote, LegalSubheading } from "~/components/legal/LegalBlocks";
import { LegalPage, type LegalSection } from "~/components/legal/LegalPage";
import { ExternalTextLink, TextLink, textLinkClasses } from "~/components/legal/TextLink";
import { SiteValue, ToComplete } from "~/components/legal/ToComplete";
import { siteConfig } from "~/config/site";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "~/lib/contact";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/confidentialite";

// Valeurs à compléter dans app/config/site.ts (rubriques « legal » et « contact »).
const legal = siteConfig.legal;
// Typées « string » : ces adresses peuvent être renseignées plus tard dans les réglages.
const contactEmail: string = siteConfig.contact.email;
const formEndpoint: string = siteConfig.contact.formEndpoint;
const formIsActive = formEndpoint.trim() !== "";
const rateLimitMinutes = Math.round(RATE_LIMIT_WINDOW_MS / 60_000);

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Politique de confidentialité",
    description: `Comment ${siteConfig.name} utilise vos données : formulaire de contact, finalités, durée de conservation, droits prévus par le RGPD, cookies et stockage local.`,
    path: "/confidentialite",
  });
}

/** Moyens d'exercer ses droits : formulaire, et e-mail s'il est configuré. */
function HowToReachUs() {
  return (
    <>
      le <TextLink to="/contact">formulaire de contact</TextLink> (sujet « Autre demande »)
      {contactEmail ? (
        <>
          {" "}
          ou par e-mail à{" "}
          <a href={`mailto:${contactEmail}`} className={textLinkClasses}>
            {contactEmail}
          </a>
        </>
      ) : null}
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
              value: contactEmail ? (
                <a href={`mailto:${contactEmail}`} className={textLinkClasses}>
                  {contactEmail}
                </a>
              ) : (
                <TextLink to="/contact">Formulaire de contact</TextLink>
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
        <p>Si vous nous écrivez via le formulaire de contact, les informations suivantes sont transmises :</p>
        <LegalList>
          <li>votre nom ;</li>
          <li>votre adresse e-mail ;</li>
          <li>le sujet choisi ;</li>
          <li>le contenu de votre message.</li>
        </LegalList>
        <p>
          Nous vous conseillons de ne pas inscrire d'informations sensibles dans votre message (données
          de santé, coordonnées bancaires, mots de passe…).
        </p>
        {!formIsActive && (
          <LegalNote>
            Pour le moment, l'envoi en ligne du formulaire n'est pas encore activé&nbsp;: les informations
            que vous y saisissez restent dans votre navigateur et ne sont transmises à personne.
          </LegalNote>
        )}
        <LegalSubheading>Les données techniques de connexion</LegalSubheading>
        <p>
          Comme pour tout site Internet, l'hébergeur peut enregistrer automatiquement des données
          techniques lors de votre visite (adresse IP, date et heure, page consultée, type de
          navigateur), pour assurer la sécurité et le bon fonctionnement du service.{" "}
          <ToComplete>nature et durée de conservation de ces journaux, selon l'hébergeur choisi</ToComplete>
        </p>
      </>
    ),
  },
  {
    id: "finalites",
    title: "Pourquoi ces données sont-elles utilisées ?",
    content: (
      <>
        <p>Les informations envoyées via le formulaire servent uniquement à :</p>
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
            le service d'envoi du formulaire, qui transmet votre message à l'éditeur&nbsp;:{" "}
            <ToComplete>nom du service utilisé et lieu de traitement des données</ToComplete>&nbsp;;
          </li>
          <li>
            l'hébergeur du site&nbsp;:{" "}
            <SiteValue value={legal.hostName} missing="nom de l'hébergeur choisi" />.
          </li>
        </LegalList>
        <p>
          Si l'un de ces prestataires traite des données en dehors de l'Union européenne, les garanties
          qui encadrent ce transfert seront précisées ici.
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
        <p>
          <ToComplete label="À définir">
            durée précise de conservation — suggestion&nbsp;: au maximum 3 ans après le dernier échange
          </ToComplete>
        </p>
      </>
    ),
  },
  {
    id: "droits",
    title: "Quels sont vos droits ?",
    content: (
      <>
        <p>Conformément au RGPD, vous pouvez à tout moment demander :</p>
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
            <strong>l'opposition</strong>&nbsp;: refuser que vos données soient utilisées, pour des raisons
            tenant à votre situation particulière&nbsp;;
          </li>
          <li>
            <strong>la limitation</strong>&nbsp;: demander le « gel » temporaire de l'utilisation de vos
            données, par exemple le temps de vérifier une contestation&nbsp;;
          </li>
          <li>
            <strong>la portabilité</strong>&nbsp;: recevoir vos données dans un format courant, pour les
            transmettre à un autre organisme.
          </li>
        </LegalList>
        <p>
          Pour exercer ces droits, contactez-nous via <HowToReachUs />. Une preuve d'identité ne vous
          sera demandée qu'en cas de doute raisonnable sur votre identité. Le RGPD prévoit une réponse
          dans un délai d'un mois, qui peut être prolongé dans certains cas.
        </p>
      </>
    ),
  },
  {
    id: "reclamation",
    title: "Réclamation auprès de l'autorité de contrôle",
    content: (
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez
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
          Une petite valeur technique peut être enregistrée dans votre navigateur (dans son « stockage
          local », ou <span lang="en">localStorage</span>) uniquement pour limiter les envois abusifs
          du formulaire de contact&nbsp;: il s'agit de l'heure de vos derniers envois réussis, qui permet de
          limiter le nombre de messages à {RATE_LIMIT_MAX} toutes les {rateLimitMinutes} minutes. Cette
          valeur n'est jamais transmise, ni à nous ni à un tiers. Vous pouvez la supprimer à tout moment
          en effaçant les données de navigation du site dans votre navigateur.
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
