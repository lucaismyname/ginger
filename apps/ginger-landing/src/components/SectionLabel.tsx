import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p className="mb-2 flex items-center gap-2 font-pixel text-[0.80em] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
      <Icon
        aria-hidden
        className="size-[1em] shrink-0 text-orange-600 dark:text-orange-500"
        strokeWidth={2}
      />
      {children}
    </p>
  );
}
