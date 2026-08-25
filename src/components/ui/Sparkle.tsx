type SparkleProps = {
  className?: string;
  glyph?: "✦" | "✧" | "♡" | "⋆";
};

export function Sparkle({ className = "", glyph = "✦" }: SparkleProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none text-[var(--accent)] ${className}`}
    >
      {glyph}
    </span>
  );
}

export function SparkleField({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <span className="absolute text-lavender-300 dark:text-lavender-500/60 text-lg animate-float" style={{ top: "8%", left: "6%", animationDelay: "0s" }}>✦</span>
      <span className="absolute text-pink-300 text-sm animate-float" style={{ top: "20%", right: "10%", animationDelay: "1.2s" }}>♡</span>
      <span className="absolute text-lavender-300 dark:text-lavender-500/60 text-xs animate-float" style={{ bottom: "15%", left: "14%", animationDelay: "0.6s" }}>✧</span>
    </div>
  );
}
