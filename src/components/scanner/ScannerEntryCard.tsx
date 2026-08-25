import { Camera } from "lucide-react";
import { Bunny } from "../mascot/Bunny";

type ScannerEntryCardProps = {
  onClick: () => void;
};

export function ScannerEntryCard({ onClick }: ScannerEntryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden rounded-3xl border border-[var(--border-c)] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-5 sm:p-6 text-left shadow-[var(--shadow-cute-lg)] transition-transform hover:-translate-y-0.5 hover:scale-[1.005] active:scale-[0.99]"
    >
      <span className="absolute top-4 right-24 text-white/40 text-xl animate-float" aria-hidden="true">✦</span>
      <span className="absolute bottom-4 right-14 text-white/30 text-sm animate-float" style={{ animationDelay: "1s" }} aria-hidden="true">♡</span>

      <div className="flex items-center gap-4">
        <span className="relative shrink-0">
          <Bunny mood="sparkle" className="w-16 h-16 sm:w-20 sm:h-20" />
          <span className="absolute -bottom-1 -right-1 grid place-items-center w-8 h-8 rounded-full bg-white shadow-md text-[var(--primary)]">
            <Camera size={16} />
          </span>
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">📸 Scan my food ♡</h2>
          <p className="text-sm text-white/85 mt-0.5">Take a photo &amp; let AI do the counting ✦</p>
        </div>
      </div>
    </button>
  );
}
