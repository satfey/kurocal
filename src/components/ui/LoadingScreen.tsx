import { Bunny } from "../mascot/Bunny";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--bg)]">
      <Bunny mood="sleepy" className="w-20 h-20 animate-float" />
      <p className="text-sm font-semibold text-[var(--text-soft)]">Warming up your diary ♡</p>
    </div>
  );
}
