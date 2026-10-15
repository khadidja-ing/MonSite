import { LegalInfoList, LegalList, LegalNote } from "~/components/legal/LegalBlocks";
import { LegalPage, type LegalSection } from "~/components/legal/LegalPage";
import { TextLink, textLinkClasses } from "~/components/legal/TextLink";
import { SiteValue, ToComplete } from "~/components/legal/ToComplete";
import { siteConfig } from "~/config/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/mentions-legales";

// Valeurs à compléter dans app/config/site.ts (rubrique « legal »).
const legal = siteConfig.legal;
// Typée « string » : l'adresse peut être renseignée plus tard dans les réglages.
const contactEmail: string = siteConfig.contact.email;
const siteLabel = `${siteConfig.name}${siteConfig.isNameProvisional ? " (nom provisoire)" : ""}`;

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Mentions légales",
    description: `Mentions légales de ${siteConfig.name} : éditeur du site, directeur de la publication, hébergeur, propriété intellectuelle et marques des outils cités.`,
    path: "/mentions-legales",
  });
}

function ContactValue() {
  return contactEmail ? (
    <a href={`mailto:${contactEmail}`} className={textLinkClasses}>
      {contactEmail}
    </a>
  ) : (
    <>
      <ToComplete>adresse e-mail ou numéro de téléphone de l'éditeur</ToComplete>
      <span className="mt-1 block text-sm text-ink-600">
        En attendant&nbsp;: <TextLink to="/contact">formulaire de contact</TextLink>
      </span>
    </>
  );
}

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <>
        <p>
          Le site <strong>{siteLabel}</strong> est édité par&nbsp;:
        </p>
        <LegalInfoList
          items={[
            {
              label: "Nom ou raison sociale",
              value: <SiteValue value={legal.publisherName} missing="nom ou raison sociale de l'éditeur" />,
            },
            {
              label: "Statut juridique",
              value: (
                <SiteValue
                  value={legal.legalStatus}
                  missing="statut (ex. particulier, entrepreneur individuel, société…)"
                />
              ),
            },
            {
              label: "Adresse",
              value: <SiteValue value={legal.address} missing="adresse postale de l'éditeur" />,
            },
            {
              label: "Immatriculation",
              value: (
                <SiteValue
                  value={legal.registrationNumber}
                  missing="numéro SIREN ou SIRET, le cas échéant"
                />
              ),
            },
            { label: "Contact", value: <ContactValue /> },
          ]}
        />
        <LegalNote>
          À vérifier avant la mise en ligne&nbsp;: les informations exigées dépendent du statut de
          l'éditeur (particulier, entrepreneur individuel, société) et du pays où il est établi. En
          France, elles sont fixées par la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
          l'économie numérique (LCEN).
        </LegalNote>
      </>
    ),
  },
  {
    id: "publication",
    title: "Directeur ou directrice de la publication",
    content: (
      <>
        <p>
          La personne responsable des contenus publiés sur le site est&nbsp;:{" "}
          <SiteValue
            value={legal.publicationDirector}
            missing="nom de la personne responsable de la publication"
          />
          .
        </p>
      </>
    ),
  },
  {
    id: "hebergeur",
    title: "Hébergement",
    content: (
      <>
        <p>
          L'hébergeur est l'entreprise qui stocke les fichiers du site et les rend accessibles sur
          Internet.
        </p>
        <LegalInfoList
          items={[
            {
              label: "Hébergeur",
              value: <SiteValue value={legal.hostName} missing="nom de l'hébergeur choisi" />,
            },
            {
              label: "Coordonnées",
              value: (
                <SiteValue
                  value={legal.hostAddress}
                  missing="adresse et numéro de téléphone de l'hébergeur"
                />
              ),
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          Les contenus originaux du site (textes, présentation des fiches, mise en page, logo et
          éléments graphiques) sont protégés par le droit d'auteur. Sauf mention contraire, ils
          appartiennent à l'éditeur du site.
        </p>
        <p>
          Toute reproduction, représentation ou réutilisation, totale ou partielle, sans autorisation
          écrite préalable est interdite, en dehors des exceptions prévues par la loi (par exemple une
          courte citation accompagnée de la source).
        </p>
        <p>
          Les polices de caractères (Inter et Plus Jakarta Sans) et les icônes (Lucide) utilisées sur
          le site sont des ressources libres, employées conformément à leurs licences respectives.
        </p>
      </>
    ),
  },
  {
    id: "marques",
    title: "Marques et noms d'outils cités",
    content: (
      <>
        <p>
          Les noms d'outils, de services et d'entreprises cités sur le site, notamment dans le
          catalogue, sont des marques qui appartiennent à leurs propriétaires respectifs. Ils sont
          mentionnés uniquement pour informer et aider à identifier ces outils.
        </p>
        <LegalList>
          <li>
            Sauf indication contraire explicite, {siteConfig.name} n'est ni affilié à ces entreprises,
            ni sponsorisé, ni approuvé par elles.
          </li>
          <li>
            Les logos officiels ne sont pas reproduits&nbsp;: chaque outil est représenté par ses initiales.
          </li>
          <li>
            Si vous êtes titulaire d'une marque citée et souhaitez demander une modification, vous
            pouvez <TextLink to="/contact">nous écrire</TextLink>.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "liens",
    title: "Liens vers d'autres sites",
    content: (
      <>
        <p>
          Le site contient des liens vers des sites extérieurs, en particulier les sites officiels des
          outils présentés et les sources utilisées pour rédiger les fiches. Ces liens s'ouvrent dans
          un nouvel onglet.
        </p>
        <p>
          L'éditeur n'a aucun contrôle sur ces sites et n'est pas responsable de leur contenu, de leurs
          offres ni de leur politique de confidentialité. Pour en savoir plus, consultez les{" "}
          <TextLink to="/conditions-utilisation">conditions d'utilisation</TextLink>.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Nous contacter",
    content: (
      <>
        <p>
          Pour toute question concernant le site ou ces mentions légales, utilisez le{" "}
          <TextLink to="/contact">formulaire de contact</TextLink>
          {contactEmail ? (
            <>
              {" "}
              ou écrivez à{" "}
              <a
                href={`mailto:${contactEmail}`}
                className={textLinkClasses}
              >
                {contactEmail}
              </a>
            </>
          ) : null}
          .
        </p>
        <p>
          Pour les questions liées à vos données personnelles, consultez la{" "}
          <TextLink to="/confidentialite">politique de confidentialité</TextLink>.
        </p>
      </>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Les informations qui permettent d'identifier l'éditeur et l'hébergeur du site, ainsi que les règles qui s'appliquent à ses contenus."
      sections={sections}
    />
  );
}
