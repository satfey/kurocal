import { useEffect, useState } from "react";

type CalorieRingProps = {
  percent: number; // 0-100 (already clamped)
  isOver: boolean;
  size?: number;
};

export function CalorieRing({ percent, isOver, size = 176 }: CalorieRingProps) {
  const [animated, setAnimated] = useState(0);
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(percent));
    return () => cancelAnimationFrame(raf);
  }, [percent]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isOver ? "var(--warn)" : "url(#ring-gradient)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold" style={{ color: isOver ? "var(--warn)" : "var(--primary-dark)" }}>
          {percent}%
        </span>
        <span className="text-[11px] text-[var(--text-faint)] mt-0.5">of goal</span>
      </div>
    </div>
  );
}
