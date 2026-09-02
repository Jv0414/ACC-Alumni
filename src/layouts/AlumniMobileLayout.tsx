import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MobileTab } from '../types/mobile';
import { CircleUserRound, UserPlus } from 'lucide-react';
import AlumniHome from '../pages/mobile/AlumniHome';
import AlumniProfile from '../pages/mobile/AlumniProfile';
import AlumniRegister from '../pages/mobile/AlumniRegister';
import RegistrationStatus from '../pages/mobile/RegistrationStatus';
import type { AlumniRegistration } from '../types/Registration';

interface AlumniMobileLayoutProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const AlumniMobileLayout = ({ user, onLogout }: AlumniMobileLayoutProps) => {
  const [tab, setTab] = useState<MobileTab>('home');
  const [showRegister, setShowRegister] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [registration, setRegistration] = useState<AlumniRegistration | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const headerTitle = tab === 'home' ? 'ACC Alumni' : 'Profile';

  return (
    <div className="alumni-mobile-app">
      {/* Mobile app header */}
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-header-left"
          onClick={() => setTab('home')}
          aria-label="Go to home"
        >
          <img src="/icons/logo.png" alt="ACC Alumni" className="mobile-logo" width={32} height={32} />
          <span className="mobile-header-title">{headerTitle}</span>
        </button>
        <div className="mobile-header-right">
          {/* Only the Register button until registration is complete;
              afterwards it is replaced by the Profile shortcut. */}
          {registration ? (
            <button
              className={`mobile-header-icon-btn${tab === 'profile' ? ' is-active' : ''}`}
              aria-label="Profile"
              onClick={() => setTab('profile')}
            >
              <CircleUserRound size={20} />
            </button>
          ) : (
            <button
              className="mobile-register-btn"
              aria-label="Register"
              onClick={() => setShowRegister(true)}
            >
              <UserPlus size={18} />
              <span>Register</span>
            </button>
          )}
        </div>
      </header>

      {/* Scrollable screen content */}
      <main className="mobile-content">
        {tab === 'home' && <AlumniHome onCheckStatus={() => setShowStatus(true)} />}
        {tab === 'profile' && (
          <AlumniProfile
            user={user}
            registration={registration}
            onStartRegistration={() => setShowRegister(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Full-screen registration sheet */}
      <AlumniRegister
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={setRegistration}
      />

      {/* Full-screen registration status sheet */}
      <RegistrationStatus isOpen={showStatus} onClose={() => setShowStatus(false)} />
    </div>
  );
};

export default AlumniMobileLayout;