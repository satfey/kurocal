import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-[var(--dusk-950,#1c1229)]/40 backdrop-blur-sm animate-[fade-in-scale_0.2s_ease]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:max-w-md bg-[var(--surface)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-c)] shadow-[var(--shadow-cute-lg)] max-h-[90vh] overflow-y-auto animate-modal-in"
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-[var(--surface)]/95 backdrop-blur border-b border-[var(--border-c)] rounded-t-3xl">
          <h2 className="font-display font-bold text-lg text-[var(--text-main)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid place-items-center w-8 h-8 rounded-full text-[var(--text-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
