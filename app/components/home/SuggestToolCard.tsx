import { ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { canReceiveMessages } from "~/config/site";

/** Carte qui complète la grille des catégories : proposer un outil manquant. */
export function SuggestToolCard() {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-dashed border-ink-300 bg-ink-50/50 p-6 transition-colors hover:border-brand-300 hover:bg-brand-50/40">
      <span className="flex size-11 items-center justify-center rounded-xl bg-white text-accent-700 ring-1 ring-ink-200 ring-inset">
        <Lightbulb aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink-950">Un outil vous manque ?</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        {canReceiveMessages
          ? "Proposez-le-nous : s'il correspond à nos critères, il sera vérifié puis ajouté au catalogue."
          : "Dès que le formulaire de contact sera activé, vous pourrez nous le proposer : s'il correspond à nos critères, il sera vérifié puis ajouté au catalogue."}
      </p>
      <div className="mt-auto flex items-center justify-between pt-5 text-sm">
        <Link
          to="/contact?sujet=suggerer-outil"
          className="rounded font-semibold text-brand-700 after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:underline"
        >
          {canReceiveMessages ? "Suggérer un outil" : "Préparer ma suggestion"}
        </Link>
        <ArrowRight
          aria-hidden="true"
          className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </article>
  );
}
