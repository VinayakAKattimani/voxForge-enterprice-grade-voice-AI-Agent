import React from "react";
import { Menu, Search, Bell } from "lucide-react";

export default function Topbar({ title, onMenu }) {
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-bg px-6">
      <div className="flex items-center gap-3.5">
        <button onClick={onMenu} className="text-ink md:hidden">
          <Menu size={20} />
        </button>
        <div className="text-[17px] font-bold text-ink">{title}</div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="hidden w-[260px] items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 md:flex">
          <Search size={14} className="text-ink3" />
          <input
            placeholder={"Search sessions, flows, docs\u2026"}
            className="w-full border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-ink3"
          />
        </div>
        <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-line bg-surface">
          <Bell size={16} className="text-ink2" />
          <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
      </div>
    </div>
  );
}
