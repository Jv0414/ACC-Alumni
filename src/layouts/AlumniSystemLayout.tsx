import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, FileSearch, Home, UserPlus } from 'lucide-react';
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
  { path: '/alumni/registration', label: 'Registration', icon: UserPlus },
  { path: '/alumni/status', label: 'Check Status', icon: FileSearch }
];

const pageTitles: Record<string, string> = {
  '/alumni': 'Home',
  '/alumni/registration': 'Alumni Registration',
  '/alumni/status': 'Check Registration Status'
};

// Alumni self-service portal. Reuses the same system shell as the
// admin/staff dashboard (sidebar + navbar + content area) with its own
// navigation and pages. Registration state lives here so a submission on
// the Registration page is instantly reflected on Home.
const AlumniSystemLayout = ({ user, onLogout }: AlumniSystemLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registration, setRegistration] = useState<AlumniRegistration | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const pageTitle = pageTitles[location.pathname] || 'ACC Alumni';

  // On the portal home page the sidebar parks off-canvas and slides in while
  // the cursor hovers the handle button on the left edge (on mobile it opens
  // via the navbar menu button as a drawer). Other pages keep the sidebar
  // visible as usual.
  const isPortalHome = location.pathname === '/alumni';

  return (
    <div className="app-layout">
      {isPortalHome && (
        <button type="button" className="sidebar-hover-handle" aria-label="Show navigation menu">
          <ChevronRight size={18} />
        </button>
      )}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        navItems={alumniNavItems}
        logoTitle="ACC Alumni"
        // No portal subtitle - the sidebar brand shows just "ACC Alumni".
        logoSubtitle=""
        className={isPortalHome ? 'sidebar-hover-hidden' : ''}
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