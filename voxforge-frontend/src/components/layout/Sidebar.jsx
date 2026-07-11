import { NavLink } from 'react-router-dom';
import {
  IconDashboard, IconMic, IconHistory, IconKnowledge, IconSettings,
  IconProfile, IconLogout, IconChevronLeft, IconClose,
} from '../ui/icons';
import { useAuth } from '../../context/AuthContext';
import './layout.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/conversation', label: 'Voice Conversation', icon: IconMic },
  { to: '/history', label: 'Conversation History', icon: IconHistory },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: IconKnowledge },
  { to: '/settings', label: 'Settings', icon: IconSettings },
  { to: '/profile', label: 'Profile', icon: IconProfile },
];

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="sidebar-brand-mark">V</span>
            {!collapsed && <span className="sidebar-brand-name">VoxForge</span>}
          </div>
          <button className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close menu">
            <IconClose width={18} height={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onCloseMobile}
              title={collapsed ? label : undefined}
            >
              <Icon width={18} height={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-collapse-btn" onClick={onToggleCollapse}>
            <IconChevronLeft width={16} height={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
            {!collapsed && <span>Collapse</span>}
          </button>
          <div className="sidebar-user">
            <span className="sidebar-avatar">{user?.avatarInitials || 'U'}</span>
            {!collapsed && (
              <div className="sidebar-user-meta">
                <span className="sidebar-user-name">{user?.name}</span>
                <span className="sidebar-user-role">{user?.role}</span>
              </div>
            )}
            {!collapsed && (
              <button className="sidebar-logout" onClick={logout} title="Log out">
                <IconLogout width={16} height={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
