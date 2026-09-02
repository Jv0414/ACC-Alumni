import { Menu, LogIn } from 'lucide-react';

interface NavbarProps {
  // Omit on pages rendered without a sidebar (e.g. the portal home page)
  // so the mobile menu button is hidden there as well.
  onMenuClick?: () => void;
  pageTitle: string;
  // Clicking "Log in" ends the current session and returns to the login page
  // so the user can sign in again (e.g. with a different account).
  onLogout: () => void;
}

const Navbar = ({ onMenuClick, pageTitle, onLogout }: NavbarProps) => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {onMenuClick && (
          <button className="navbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
            <Menu size={22} />
          </button>
        )}
        <h2 className="navbar-title">{pageTitle}</h2>
      </div>

      <div className="navbar-right">
        <button className="btn btn-primary btn-flat navbar-login-btn" onClick={onLogout}>
          <LogIn size={16} />
          Log in
        </button>
      </div>
    </header>
  );
};

export default Navbar;