import { Plus } from "lucide-react";
import { Bunny } from "../mascot/Bunny";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      <Bunny mood="sleepy" className="w-28 h-28 animate-float" />
      <h3 className="font-display font-bold text-lg text-[var(--text-main)] mt-2">{title}</h3>
      <p className="text-sm text-[var(--text-soft)] mt-1 max-w-xs">{subtitle}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] text-white font-semibold px-5 py-2.5 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
