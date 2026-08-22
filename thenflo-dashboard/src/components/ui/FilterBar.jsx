import React from "react";
import { ChevronDown } from "lucide-react";

export function Select({ value, onChange, options, icon: Icon }) {
  return (
    <div className="relative flex items-center">
      {Icon && <Icon size={13} className="pointer-events-none absolute left-2.5 text-ink3" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-lg border border-line bg-surface py-2 pr-7 text-[13px] font-medium text-ink outline-none ${Icon ? "pl-8" : "pl-3"}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-ink3" />
    </div>
  );
}

export default function FilterBar({ children }) {
  return <div className="flex flex-wrap items-center gap-2.5">{children}</div>;
}
