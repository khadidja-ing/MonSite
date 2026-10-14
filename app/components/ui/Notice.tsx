import { CircleAlert, Info, CircleCheck, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

type Tone = "info" | "warning" | "success" | "error";

const styles: Record<Tone, { box: string; icon: typeof Info }> = {
  info: { box: "bg-brand-50 text-brand-950 ring-brand-100", icon: Info },
  warning: { box: "bg-amber-50 text-amber-950 ring-amber-200", icon: TriangleAlert },
  success: { box: "bg-emerald-50 text-emerald-950 ring-emerald-200", icon: CircleCheck },
  error: { box: "bg-red-50 text-red-950 ring-red-200", icon: CircleAlert },
};

/**
 * Encadré d'information. Utilisé notamment pour signaler un contenu
 * provisoire ou une information à confirmer.
 */
export function Notice({
  tone = "info",
  title,
  children,
  className,
  role,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  role?: "status" | "alert";
}) {
  const { box, icon: Icon } = styles[tone];
  return (
    <div role={role} className={cn("flex gap-3 rounded-2xl p-4 text-sm ring-1 ring-inset", box, className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-1 leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
