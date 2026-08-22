import React from "react";

export default function UsageMeter({ label, used, limit, unit = "" }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const tone = pct > 90 ? "bg-danger" : pct > 70 ? "bg-warn" : "bg-signal";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
        <span className="font-medium text-ink2">{label}</span>
        <span className="font-data text-ink">
          {used}
          {unit} / {limit}
          {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface2">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
