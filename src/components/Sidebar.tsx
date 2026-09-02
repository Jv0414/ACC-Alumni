import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  GraduationCap,
  Settings,
  LogOut,
  X,
  UserCheck
} from 'lucide-react';

export interface SidebarNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  // Only highlight this item when the path matches exactly (index routes).
  end?: boolean;
}

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  // When provided, the sidebar shows the Logout button in its footer. Only
  // the admin/staff dashboard passes this - the alumni portal sidebar
  // intentionally has no logout.
  onLogout?: () => void;
  // Optional overrides so other portals (e.g. the alumni self-service portal)
  // can reuse this sidebar with their own navigation. Defaults keep the
  // admin/staff navigation items.
  navItems?: SidebarNavItem[];
  logoTitle?: string;
  logoSubtitle?: string;
  // Extra classes for special placements (e.g. hover-reveal on the portal home).
  className?: string;
}

const defaultNavItems: SidebarNavItem[] = [
  { path: '/upcoming-grads', label: 'Upcoming Graduates', icon: UserCheck },
  { path: '/alumni', label: 'Alumni', icon: GraduationCap },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const Sidebar = ({
  mobileOpen,
  onCloseMobile,
  onLogout,
  navItems = defaultNavItems,
  logoTitle = 'ACC Alumni',
  logoSubtitle = 'ACC Alumni Management System',
  className = ''
}: SidebarProps) => {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''} ${className}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <img src="/icons/logo.png" alt="ACC Alumni logo" className="logo-img" width={40} height={40} />
            </div>
            <div className="logo-text">
              <span className="logo-title">{logoTitle}</span>
              {logoSubtitle && <span className="logo-subtitle">{logoSubtitle}</span>}
            </div>
          </div>
          <button className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              onClick={onCloseMobile}
            >
              <item.icon size={20} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {onLogout && (
          <div className="sidebar-footer">
            <button className="nav-item nav-item-logout" onClick={onLogout}>
              <LogOut size={20} />
              <span className="nav-label">Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;