import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import { NAV_SECTIONS } from "../utils/constants.js";

function titleForPath(pathname) {
  for (const group of NAV_SECTIONS) {
    for (const item of group.items) {
      if (pathname === item.path || pathname.startsWith(item.path + "/")) return item.label;
    }
  }
  return "Dashboard";
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="ml-[68px] transition-[margin-left] duration-200 max-md:ml-0">
        <Topbar title={titleForPath(location.pathname)} onMenu={() => setMobileOpen(true)} />
        <div className="max-w-[1320px] p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
