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
      <span className="brand-symbol" aria-hidden="true">
        M<span>+</span>
      </span>
      {compact ? null : (
        <span className="brand-name">
          modz<span>.dev</span>
        </span>
      )}
    </div>
  );
}
