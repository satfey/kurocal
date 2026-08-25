import { Bunny } from "../mascot/Bunny";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 border-b border-[var(--border-c)] bg-[var(--bg)]/90 backdrop-blur-lg px-4 py-3 flex items-center gap-2.5">
      <Bunny mood="happy" className="w-9 h-9" />
      <div>
        <h1 className="font-display font-bold text-base text-[var(--text-main)] leading-none">KuroCal ♡</h1>
        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">your cute little food diary ✦</p>
      </div>
    </header>
  );
}
