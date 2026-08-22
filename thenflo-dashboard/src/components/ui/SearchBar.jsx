import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search\u2026", className = "" }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 ${className}`}>
      <Search size={14} className="text-ink3" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-ink3"
      />
    </div>
  );
}
