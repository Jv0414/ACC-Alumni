import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  GraduationCap,
  Settings,
  LogOut,
  X,
  ChevronLeft
} from 'lucide-react';

export interface SidebarNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  // Only highlight this item when the path matches exactly (index routes).
  end?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
  // Optional overrides so other portals (e.g. the alumni self-service portal)
  // can reuse this sidebar with their own navigation. Defaults keep the
  // admin/staff navigation items.
  navItems?: SidebarNavItem[];
  logoTitle?: string;
  logoSubtitle?: string;
}

const defaultNavItems: SidebarNavItem[] = [
  { path: '/alumni', label: 'Alumni', icon: GraduationCap },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const Sidebar = ({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onLogout,
  navItems = defaultNavItems,
  logoTitle = 'ACC Alumni',
  logoSubtitle = 'ACC Alumni Management System'
}: SidebarProps) => {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <img src="/icons/logo.png" alt="ACC Alumni logo" className="logo-img" width={40} height={40} />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <span className="logo-title">{logoTitle}</span>
                <span className="logo-subtitle">{logoSubtitle}</span>
              </div>
            )}
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
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item nav-item-logout" onClick={onLogout} title={collapsed ? 'Logout' : undefined}>
            <LogOut size={20} />
            {!collapsed && <span className="nav-label">Logout</span>}
          </button>
          <button className="sidebar-collapse-btn" onClick={onToggleCollapse} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <ChevronLeft size={18} className={collapsed ? 'rotate-180' : ''} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;