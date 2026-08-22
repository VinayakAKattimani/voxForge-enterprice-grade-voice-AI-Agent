import React from "react";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`-mb-px border-b-2 px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
            active === t.key ? "border-signal text-ink" : "border-transparent text-ink2 hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function VerticalTabs({ tabs, active, onChange }) {
  return (
    <div className="flex w-[190px] flex-shrink-0 flex-col gap-0.5 max-md:w-full max-md:flex-row max-md:overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[13px] font-semibold transition-colors whitespace-nowrap ${
            active === t.key ? "bg-signalDim text-signalText" : "text-ink2 hover:bg-surfaceHover"
          }`}
        >
          {t.icon && <t.icon size={15} />}
          {t.label}
        </button>
      ))}
    </div>
  );
}
