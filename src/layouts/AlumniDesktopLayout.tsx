import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, UserPlus } from 'lucide-react';
import AlumniHome from '../pages/desktop/AlumniHome';
import AlumniProfile from '../pages/desktop/AlumniProfile';
import AlumniRegister from '../pages/desktop/AlumniRegister';
import RegistrationStatus from '../pages/desktop/RegistrationStatus';
import type { AlumniRegistration } from '../types/Registration';
import { formatFullName, getInitials } from '../utils/formatters';

type AlumniDesktopTab = 'home' | 'profile';

interface AlumniDesktopLayoutProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const AlumniDesktopLayout = ({ user, onLogout }: AlumniDesktopLayoutProps) => {
  const [tab, setTab] = useState<AlumniDesktopTab>('home');
  const [showRegister, setShowRegister] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [registration, setRegistration] = useState<AlumniRegistration | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="alumni-desktop-app">
      {/* Desktop navbar */}
      <header className="alumni-navbar">
        <div className="alumni-navbar-inner">
          <button className="alumni-brand" onClick={() => setTab('home')} aria-label="Go to home">
            <span className="alumni-brand-logo">
              <img src="/icons/logo.png" alt="ACC Alumni logo" width={38} height={38} />
            </span>
            <span className="alumni-brand-text">
              <span className="alumni-brand-title">ACC Alumni</span>
              <span className="alumni-brand-subtitle">Alumni Management System</span>
            </span>
          </button>

          <nav className="alumni-nav">
            <button
              className={`alumni-nav-link${tab === 'home' ? ' is-active' : ''}`}
              onClick={() => setTab('home')}
            >
              <Home size={18} />
              Home
            </button>
          </nav>

          <div className="alumni-navbar-actions">
            {/* Register button until registration is complete; afterwards it is
                replaced by the profile shortcut chip. */}
            {registration ? (
              <button
                className={`alumni-user-chip${tab === 'profile' ? ' is-active' : ''}`}
                onClick={() => setTab('profile')}
                aria-label="My profile"
              >
                <span className="alumni-user-avatar">{getInitials(registration.fullName)}</span>
                <span className="alumni-user-name">
                  {formatFullName(registration.fullName, registration.suffix)}
                </span>
              </button>
            ) : (
              <button className="btn btn-primary alumni-register-cta" onClick={() => setShowRegister(true)}>
                <UserPlus size={16} />
                Register
              </button>
            )}

            <button className="alumni-logout-btn" onClick={handleLogout} title="Log out" aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="alumni-desktop-content">
        {tab === 'home' && (
          <AlumniHome onCheckStatus={() => setShowStatus(true)} />
        )}
        {tab === 'profile' && (
          <AlumniProfile
            user={user}
            registration={registration}
            onStartRegistration={() => setShowRegister(true)}
          />
        )}
      </main>

      {/* Desktop registration modal */}
      <AlumniRegister
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={setRegistration}
      />

      {/* Desktop registration status modal */}
      <RegistrationStatus isOpen={showStatus} onClose={() => setShowStatus(false)} />
    </div>
  );
};

export default AlumniDesktopLayout;