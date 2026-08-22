import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Loading\u2026" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <Loader2 size={22} className="animate-spin text-signal" />
      <div className="text-[13px] text-ink2">{label}</div>
    </div>
  );
}

export function LoadingRow({ label = "Loading\u2026" }) {
  return (
    <div className="flex items-center gap-2 px-5 py-4 text-[13px] text-ink2">
      <Loader2 size={14} className="animate-spin text-signal" />
      {label}
    </div>
  );
}
