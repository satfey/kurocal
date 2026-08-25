import { createPortal } from "react-dom";
import { Bunny } from "../mascot/Bunny";

type ConfirmDialogProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

export function ConfirmDialog({ title, description, confirmLabel = "Yes, do it", onConfirm, onCancel, danger }: ConfirmDialogProps) {
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#1c1229]/40 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-sm bg-[var(--surface)] rounded-3xl border border-[var(--border-c)] shadow-[var(--shadow-cute-lg)] p-6 text-center animate-modal-in"
      >
        <Bunny mood="wink" className="w-16 h-16 mx-auto" />
        <h3 className="font-display font-bold text-lg text-[var(--text-main)] mt-2">{title}</h3>
        {description && <p className="text-sm text-[var(--text-soft)] mt-1">{description}</p>}
        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-[var(--border-c)] py-2.5 font-semibold text-[var(--text-soft)] hover:bg-[var(--bg-soft)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-2xl py-2.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 ${
              danger ? "bg-[var(--warn)]" : "bg-[var(--primary)]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
