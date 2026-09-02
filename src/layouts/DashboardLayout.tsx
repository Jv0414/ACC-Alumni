import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

interface DashboardLayoutProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  children?: ReactNode;
}

const pageTitles: Record<string, string> = {
  '/alumni': 'ACC Alumni',
  '/employment': 'Employment Tracking',
  '/events': 'Events Management',
  '/surveys': 'Surveys',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings'
};

const DashboardLayout = ({ onLogout }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      />
      <div className="app-main">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          pageTitle={pageTitle}
          onLogout={handleLogout}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;