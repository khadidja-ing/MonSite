import { LegalList, LegalNote } from "~/components/legal/LegalBlocks";
import { LegalPage, type LegalSection } from "~/components/legal/LegalPage";
import { TextLink } from "~/components/legal/TextLink";
import { ToComplete } from "~/components/legal/ToComplete";
import { siteConfig } from "~/config/site";
import { services } from "~/data/services";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/conditions-utilisation";

const siteName = siteConfig.name;
const servicesInPreparation = services.filter((service) => service.status === "en-preparation").length;
const allServicesInPreparation = services.length > 0 && servicesInPreparation === services.length;

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Conditions d'utilisation",
    description: `Conditions d'utilisation de ${siteName} : accès gratuit au site, caractère informatif des fiches d'outils, liens vers des sites tiers et signalement d'erreurs.`,
    path: "/conditions-utilisation",
  });
}

/** Paragraphe sur les services, selon leur statut réel (lu dans les données). */
function ServicesStatusText() {
  if (services.length === 0) {
    return (
      <p>
        Aucun service n'est proposé à ce jour. Si des services sont proposés plus tard, leurs conditions
        seront précisées avant tout engagement.
      </p>
    );
  }
  return (
    <>
      <p>
        La page <TextLink to="/services">Services</TextLink> présente des prestations d'accompagnement
        en intelligence artificielle.{" "}
        {allServicesInPreparation
          ? "Elles sont toutes en cours de préparation : elles ne sont pas encore proposées et leur présentation ne constitue pas une offre commerciale."
          : servicesInPreparation > 0
            ? "Celles qui portent l'étiquette « En préparation » ne sont pas encore proposées : leur présentation ne constitue pas une offre commerciale."
            : "Leur présentation est fournie à titre d'information et ne constitue pas, à elle seule, une offre commerciale."}
      </p>
      <p>
        Manifester votre intérêt via le formulaire de contact ne vous engage à rien. Toute prestation
        éventuelle ferait l'objet d'un échange préalable et de conditions particulières, communiquées
        avant tout engagement.
      </p>
    </>
  );
}

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet",
    content: (
      <>
        <p>
          Ces conditions d'utilisation expliquent les règles qui s'appliquent lorsque vous consultez le
          site {siteName}
          {siteConfig.isNameProvisional ? " (nom provisoire)" : ""}. Ce site aide à découvrir des outils
          et des services d'intelligence artificielle, à comprendre à quoi ils servent et à choisir
          ceux qui correspondent à vos besoins.
        </p>
        <p>
          En naviguant sur le site, vous acceptez ces conditions. Si vous ne les acceptez pas, nous vous
          invitons simplement à ne pas utiliser le site.
        </p>
      </>
    ),
  },
  {
    id: "acces",
    title: "Accès au site",
    content: (
      <>
        <p>
          Le site est accessible gratuitement, sans inscription ni création de compte. Les frais de
          connexion à Internet (abonnement, données mobiles) restent à votre charge.
        </p>
        <p>
          L'éditeur s'efforce de maintenir le site accessible, mais ne peut pas garantir qu'il le soit
          en permanence&nbsp;: il peut être interrompu, par exemple pour une maintenance, une mise à jour ou
          en cas d'incident technique.
        </p>
      </>
    ),
  },
  {
    id: "information",
    title: "Des informations fournies à titre indicatif",
    content: (
      <>
        <p>
          Les fiches d'outils présentent des informations sur des produits édités par des entreprises
          tierces&nbsp;: à quoi ils servent, comment y accéder (gratuit, freemium, payant…), etc. Ces
          informations&nbsp;:
        </p>
        <LegalList>
          <li>sont fournies pour vous orienter, à titre indicatif ;</li>
          <li>
            ont été vérifiées à la date indiquée sur chaque fiche, à partir des sources citées&nbsp;;
          </li>
          <li>
            peuvent évoluer à tout moment, car les éditeurs modifient régulièrement leurs offres, leurs
            tarifs et leurs fonctionnalités.
          </li>
        </LegalList>
        <p>
          Avant de vous inscrire, de payer ou de confier des données à un outil, vérifiez toujours les
          informations à jour sur son site officiel. Les contenus du site ne constituent ni un conseil
          professionnel personnalisé (juridique, financier, technique…), ni une recommandation d'achat.
        </p>
      </>
    ),
  },
  {
    id: "outils-tiers",
    title: "Liens externes et outils tiers",
    content: (
      <>
        <p>
          Le site contient des liens vers les sites officiels des outils présentés et vers d'autres
          sources. L'éditeur n'a aucun contrôle sur ces sites et n'est pas responsable de leur contenu,
          de leur disponibilité, de leurs offres ni de leurs conditions.
        </p>
        <p>
          L'utilisation d'un outil tiers est soumise à ses propres conditions d'utilisation et à sa
          propre politique de confidentialité. Prenez le temps de les lire, en particulier avant de
          saisir des informations personnelles ou confidentielles dans un outil d'intelligence
          artificielle.
        </p>
        <LegalNote>
          À ce jour, le site ne contient aucun lien sponsorisé. Si cela devait changer, ces liens
          seraient clairement signalés comme tels.
        </LegalNote>
      </>
    ),
  },
  {
    id: "services",
    title: "Services présentés",
    content: <ServicesStatusText />,
  },
  {
    id: "contact",
    title: "Utilisation du formulaire de contact",
    content: (
      <>
        <p>Le formulaire de contact est à votre disposition pour toute question ou suggestion. En l'utilisant, vous vous engagez à :</p>
        <LegalList>
          <li>fournir des informations exactes, en particulier votre adresse e-mail ;</li>
          <li>ne pas envoyer de contenu illicite, injurieux ou portant atteinte aux droits d'autrui ;</li>
          <li>ne pas envoyer de messages automatisés ou publicitaires.</li>
        </LegalList>
        <p>
          L'utilisation de vos données est décrite dans la{" "}
          <TextLink to="/confidentialite">politique de confidentialité</TextLink>.
        </p>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "Propriété intellectuelle",
    content: (
      <p>
        Les contenus originaux du site sont protégés par le droit d'auteur, et les noms d'outils cités
        appartiennent à leurs propriétaires respectifs. Le détail figure dans les{" "}
        <TextLink to="/mentions-legales#propriete-intellectuelle">mentions légales</TextLink>.
      </p>
    ),
  },
  {
    id: "signalement",
    title: "Signaler une erreur",
    content: (
      <p>
        Malgré le soin apporté aux fiches, une information peut être inexacte ou dépassée. Si vous
        repérez une erreur, vous pouvez la{" "}
        <TextLink to="/contact?sujet=signaler-erreur">signaler via le formulaire de contact</TextLink>,
        en précisant la fiche concernée et la correction à apporter. Chaque signalement est vérifié
        avant une éventuelle correction.
      </p>
    ),
  },
  {
    id: "modification",
    title: "Modification des conditions",
    content: (
      <p>
        Ces conditions peuvent être modifiées à tout moment, notamment pour suivre l'évolution du site
        ou de la réglementation. La version applicable est celle publiée sur cette page, à la date de
        votre visite&nbsp;; la date de dernière mise à jour est indiquée en haut de page.
      </p>
    ),
  },
  {
    id: "droit-applicable",
    title: "Droit applicable",
    content: (
      <p>
        Ces conditions sont soumises au{" "}
        <ToComplete>droit applicable (par exemple le droit français si l'éditeur est établi en France)</ToComplete>
        . En cas de litige, une solution amiable sera recherchée en priorité&nbsp;; à défaut, les tribunaux
        compétents seront ceux désignés par{" "}
        <ToComplete>règle de compétence à préciser selon le statut de l'éditeur</ToComplete>.
      </p>
    ),
  },
];

export default function ConditionsUtilisationPage() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      intro={"Les règles d'utilisation du site, expliquées simplement\u00a0: ce que vous pouvez en attendre, ses limites et vos possibilités de nous signaler une erreur."}
      sections={sections}
    />
  );
}
