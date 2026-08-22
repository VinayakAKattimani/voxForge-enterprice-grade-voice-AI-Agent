import React from "react";

export default function FormField({ label, value, onChange, hint, type = "text", options, placeholder }) {
  return (
    <div>
      <div className="mb-1.5 text-[12.5px] font-semibold text-ink">{label}</div>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2.5 text-[13px] text-ink outline-none focus:border-signal"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface2 px-3 py-2.5 text-[13px] text-ink outline-none focus:border-signal"
        />
      )}
      {hint && <div className="mt-1 text-[11.5px] text-ink3">{hint}</div>}
    </div>
  );
}
