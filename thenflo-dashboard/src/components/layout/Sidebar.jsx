import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home, Mic, BarChart3, BookOpen, Workflow, Bot, Sliders, Users, CreditCard,
  Settings2, Sun, Moon, LogOut,
} from "lucide-react";
import { NAV_SECTIONS } from "../../utils/constants.js";
import { useTheme } from "../../hooks/useTheme.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { initials } from "../../utils/format.js";

const ICONS = { Home, Mic, BarChart3, BookOpen, Workflow, Bot, Sliders, Users, CreditCard, Settings2 };

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [expanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-[39] bg-black/40 md:hidden" />
      )}
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{ width: expanded ? 236 : 68 }}
        className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col overflow-hidden border-r border-line bg-surface transition-[width] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] max-md:w-[236px] ${
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 flex-shrink-0 items-center gap-2.5 border-b border-line px-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-signal to-pulse">
            <span className="font-data text-xs font-extrabold text-[#04141B]">TF</span>
          </div>
          <div className={`overflow-hidden whitespace-nowrap transition-opacity duration-150 ${expanded ? "opacity-100" : "opacity-0"}`}>
            <div className="text-sm font-bold leading-tight text-ink">ThenFLo</div>
            <div className="text-[10.5px] font-medium text-ink3">AI Demo Engineer</div>
          </div>
        </div>

        {/* Nav */}
        <div className="tf-scroll flex-1 overflow-y-auto p-2.5">
          {NAV_SECTIONS.map((group) => (
            <div key={group.section} className="mb-4">
              <div
                className={`mb-1.5 h-3.5 whitespace-nowrap px-2 text-[10.5px] font-bold uppercase tracking-wide text-ink3 transition-opacity duration-150 ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                {group.section}
              </div>
              {group.items.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    title={!expanded ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `mb-0.5 flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                        isActive ? "bg-signalDim text-signalText" : "text-ink2 hover:bg-surfaceHover"
                      }`
                    }
                  >
                    <Icon size={17} strokeWidth={2} className="flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-opacity duration-150 ${expanded ? "opacity-100" : "opacity-0"}`}>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-line p-2.5">
          <button
            onClick={toggleTheme}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-ink2 hover:bg-surfaceHover"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span className={`whitespace-nowrap text-[13.5px] font-semibold transition-opacity duration-150 ${expanded ? "opacity-100" : "opacity-0"}`}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-pulseDim">
              <span className="text-xs font-bold text-pulseText">{initials(user?.name || "?")}</span>
            </div>
            <div className={`flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-150 ${expanded ? "opacity-100" : "opacity-0"}`}>
              <div className="text-[12.5px] font-semibold leading-tight text-ink">{user?.name}</div>
              <div className="text-[11px] text-ink3">{user?.company}</div>
            </div>
            {expanded && (
              <button onClick={logout} title="Log out" className="flex-shrink-0 text-ink3 hover:text-danger">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
