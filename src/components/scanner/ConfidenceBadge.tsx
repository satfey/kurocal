import type { ConfidenceLevel } from "../../types";

const CONFIG: Record<ConfidenceLevel, { label: string; sparkles: number; color: string }> = {
  high: { label: "High confidence", sparkles: 3, color: "var(--primary)" },
  medium: { label: "Medium confidence", sparkles: 2, color: "var(--accent)" },
  low: { label: "Please double-check", sparkles: 1, color: "var(--warn)" },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const meta = CONFIG[level];
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: meta.color }}>
      {"✦".repeat(meta.sparkles)}
      <span className="text-[var(--text-faint)] font-medium">{meta.label}</span>
    </span>
  );
}
