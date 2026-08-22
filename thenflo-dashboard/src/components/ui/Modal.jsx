import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer, width = 400 }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="fade-in rounded-xl border border-line bg-surface p-5 shadow-card"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[15px] font-bold text-ink">{title}</div>
          <button onClick={onClose} className="text-ink3">
            <X size={17} />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-5 flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}
