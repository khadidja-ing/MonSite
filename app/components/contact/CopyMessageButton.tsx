import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/Button";

/** Ancienne méthode de copie, pour les navigateurs sans accès au presse-papiers moderne. */
function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Bouton « Copier mon message », avec un retour clair (réussite ou échec). */
export function CopyMessageButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Si le message change, le bouton redevient disponible.
  useEffect(() => {
    setState("idle");
  }, [text]);

  async function copy() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = legacyCopy(text);
    setState(ok ? "copied" : "failed");
  }

  return (
    <div>
      <Button variant="secondary" onClick={copy}>
        {state === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {state === "copied" ? "Message copié" : "Copier mon message"}
      </Button>
      {/* Zone toujours présente pour que le résultat soit annoncé par les lecteurs d'écran. */}
      <p aria-live="polite" className="text-sm">
        {state !== "idle" && (
          <span className="mt-2 block">
            {state === "copied"
              ? "Votre message (sujet, nom, e-mail et texte) est copié\u00a0: vous pouvez le coller où vous le souhaitez, par exemple dans un document ou un e-mail."
              : "La copie automatique n'a pas fonctionné. Sélectionnez le texte de votre message dans le formulaire, puis copiez-le (Ctrl + C, ou appui long sur mobile)."}
          </span>
        )}
      </p>
    </div>
  );
}
