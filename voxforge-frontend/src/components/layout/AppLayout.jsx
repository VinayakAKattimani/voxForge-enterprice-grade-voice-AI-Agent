import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './layout.css';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/conversation': 'Voice Conversation',
  '/history': 'Conversation History',
  '/knowledge-base': 'Knowledge Base',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className={`app-shell ${collapsed ? 'app-shell-collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="app-main">
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} title={TITLES[pathname]} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
