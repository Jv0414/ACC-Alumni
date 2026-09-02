import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CircleUserRound, FileSearch, Home, UserPlus } from 'lucide-react';
import Sidebar, { type SidebarNavItem } from '../components/Sidebar';
import Navbar from '../components/Navbar';
import type { AlumniRegistration } from '../types/Registration';

interface AlumniSystemLayoutProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

// Shared data handed down to every page rendered inside this layout.
export interface AlumniPortalContext {
  user: { name: string; email: string; role: string } | null;
  registration: AlumniRegistration | null;
  setRegistration: (registration: AlumniRegistration) => void;
}

const alumniNavItems: SidebarNavItem[] = [
  { path: '/alumni', label: 'Home', icon: Home, end: true },
  { path: '/alumni/profile', label: 'My Profile', icon: CircleUserRound },
  { path: '/alumni/registration', label: 'Registration', icon: UserPlus },
  { path: '/alumni/status', label: 'Check Status', icon: FileSearch }
];

const pageTitles: Record<string, string> = {
  '/alumni': 'Home',
  '/alumni/profile': 'My Profile',
  '/alumni/registration': 'Alumni Registration',
  '/alumni/status': 'Check Registration Status'
};

// Alumni self-service portal. Reuses the same system shell as the
// admin/staff dashboard (sidebar + navbar + content area) with its own
// navigation and pages. Registration state lives here so a submission on
// the Registration page is instantly reflected on Home and My Profile.
const AlumniSystemLayout = ({ user, onLogout }: AlumniSystemLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registration, setRegistration] = useState<AlumniRegistration | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const pageTitle = pageTitles[location.pathname] || 'ACC Alumni';

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={handleLogout}
        navItems={alumniNavItems}
        logoTitle="ACC Alumni"
        logoSubtitle="Alumni Self-Service Portal"
      />
      <div className="app-main">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          pageTitle={pageTitle}
          onLogout={handleLogout}
        />
        <main className="app-content">
          <Outlet context={{ user, registration, setRegistration } satisfies AlumniPortalContext} />
        </main>
      </div>
    </div>
  );
};

export default AlumniSystemLayout;