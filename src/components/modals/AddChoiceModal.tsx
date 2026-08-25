import { Camera, PenLine } from "lucide-react";
import { Modal } from "../ui/Modal";

type AddChoiceModalProps = {
  onClose: () => void;
  onChooseScan: () => void;
  onChooseManual: () => void;
};

export function AddChoiceModal({ onClose, onChooseScan, onChooseManual }: AddChoiceModalProps) {
  return (
    <Modal title="How would you like to add food? ♡" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onChooseScan}
          className="flex items-center gap-3 rounded-2xl border border-[var(--border-c)] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-4 text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white/20 text-white shrink-0">
            <Camera size={20} />
          </span>
          <div>
            <p className="font-display font-bold text-white">📸 Scan with AI</p>
            <p className="text-xs text-white/85 mt-0.5">Snap a photo and let AI estimate it ✦</p>
          </div>
        </button>

        <button
          type="button"
          onClick={onChooseManual}
          className="flex items-center gap-3 rounded-2xl border border-[var(--border-c)] bg-[var(--bg-soft)] p-4 text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] shrink-0">
            <PenLine size={20} />
          </span>
          <div>
            <p className="font-display font-bold text-[var(--text-main)]">✏️ Enter manually</p>
            <p className="text-xs text-[var(--text-soft)] mt-0.5">Type in the details yourself</p>
          </div>
        </button>
      </div>
    </Modal>
  );
}
