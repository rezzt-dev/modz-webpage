import { Boxes } from "lucide-react";

import { cn } from "@/lib/utils";

export function Wordmark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.08)]">
        <Boxes className="size-4" strokeWidth={2.4} />
      </span>
      {compact ? null : (
        <span className="text-sm font-semibold tracking-[0.24em] text-white uppercase">
          modz
        </span>
      )}
    </div>
  );
}
