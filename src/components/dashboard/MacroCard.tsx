import type { ReactNode } from "react";

type MacroCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  percent?: number;
  barColorClass?: string;
};

export function MacroCard({ icon, label, value, sublabel, percent, barColorClass }: MacroCardProps) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border-c)] p-4 shadow-[var(--shadow-cute)] transition-transform hover:-translate-y-0.5">
      <div className="flex items-center gap-2 text-[var(--text-soft)]">
        <span className="grid place-items-center w-8 h-8 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          {icon}
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="mt-3 font-display text-2xl font-bold text-[var(--text-main)]">{value}</div>
      {sublabel && <div className="text-xs text-[var(--text-faint)] mt-0.5">{sublabel}</div>}
      {typeof percent === "number" && (
        <div className="mt-3 h-2 rounded-full bg-[var(--ring-track)] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColorClass ?? "bg-[var(--primary)]"}`}
            style={{ width: `${Math.min(100, percent)}%` }}
          />
        </div>
      )}
    </div>
  );
}
