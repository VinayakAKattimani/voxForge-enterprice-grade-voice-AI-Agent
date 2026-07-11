import { useNavigate } from 'react-router-dom';
import { IconMenu, IconSearch, IconBell, IconSun, IconMoon } from '../ui/icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './layout.css';

export default function Topbar({ onOpenMobileNav, title }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onOpenMobileNav} aria-label="Open menu">
          <IconMenu width={20} height={20} />
        </button>
        {title && <h1 className="topbar-title">{title}</h1>}
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <IconSearch width={16} height={16} />
          <input placeholder="Search conversations, documents…" />
        </div>
        <button className="topbar-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <IconMoon width={17} height={17} /> : <IconSun width={17} height={17} />}
        </button>
        <button className="topbar-icon-btn" aria-label="Notifications">
          <IconBell width={17} height={17} />
          <span className="topbar-notif-dot" />
        </button>
        <button className="topbar-user-chip" onClick={() => navigate('/profile')}>
          <span className="topbar-avatar">{user?.avatarInitials || 'U'}</span>
        </button>
      </div>
    </header>
  );
}
