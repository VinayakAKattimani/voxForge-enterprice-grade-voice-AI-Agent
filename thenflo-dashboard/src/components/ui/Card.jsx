import React from "react";

export default function Card({ children, className = "", padded = true, ...rest }) {
  return (
    <div
      className={`rounded border border-line bg-surface ${padded ? "p-5" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="text-[15px] font-semibold text-ink">{title}</div>
        {subtitle && <div className="mt-0.5 text-[13px] text-ink2">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
