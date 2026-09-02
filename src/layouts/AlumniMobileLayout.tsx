import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPlus } from 'lucide-react';
import AlumniHome from '../pages/mobile/AlumniHome';
import AlumniRegister from '../pages/mobile/AlumniRegister';
import RegistrationStatus from '../pages/mobile/RegistrationStatus';
import type { AlumniRegistration } from '../types/Registration';

interface AlumniMobileLayoutProps {
  onLogout: () => void;
}

const AlumniMobileLayout = ({ onLogout }: AlumniMobileLayoutProps) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [registration, setRegistration] = useState<AlumniRegistration | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="alumni-mobile-app">
      {/* Mobile app header */}
      <header className="mobile-header">
        <div className="mobile-header-left">
          <img src="/icons/logo.png" alt="ACC Alumni" className="mobile-logo" width={32} height={32} />
          <span className="mobile-header-title">ACC Alumni</span>
        </div>
        <div className="mobile-header-right">
          {/* Register button until registration is complete; afterwards a
              logout shortcut (there is no profile page). */}
          {registration ? (
            <button
              className="mobile-header-icon-btn"
              aria-label="Log out"
              onClick={handleLogout}
            >
              <LogOut size={20} />
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
        <AlumniHome onCheckStatus={() => setShowStatus(true)} />
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