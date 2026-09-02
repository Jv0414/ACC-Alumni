import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Landmark, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SCHOOL_MILESTONES = [
  { year: '1941', label: 'Idea of a college in Aklan conceived' },
  { year: '1945', label: 'Articles of Incorporation and By-Laws approved' },
  { year: '1945', label: 'First Board of Trustees elected' },
  { year: 'Today', label: 'Aklan College alumni community' }
];

// Public landing page. Visitors see this first when entering the website;
// signing in to the portal or dashboard is one click away.
const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <header className="home-navbar">
        <div className="home-brand">
          <img src="/icons/logo.png" alt="ACC logo" />
          <span>ACC Alumni</span>
        </div>
        <nav className="home-nav-actions">
          {user ? (
            <Link to="/alumni" className="btn btn-primary btn-sm">
              Continue to Portal
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={14} />
              Sign In
            </Link>
          )}
        </nav>
      </header>

      <section className="home-hero">
        <img src="/images/accbuild.jpg" alt="" aria-hidden="true" className="home-hero-img" />
        <div className="home-hero-overlay">
          <span className="home-hero-badge">
            <GraduationCap size={14} />
            Alumni Management System
          </span>
          <h1>Connecting Aklan College alumni, past and present</h1>
          <p>
            Register as an alumnus, track fellow graduates, and stay connected with
            your alma mater &mdash; from elementary to college.
          </p>
          <div className="home-hero-actions">
            {user ? (
              <Link to="/alumni" className="btn btn-flat alumni-btn-light">
                Continue to Portal
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-flat alumni-btn-light">
                <LogIn size={16} />
                Alumni Sign In
              </Link>
            )}
            <a href="#home-history" className="btn btn-flat alumni-btn-ghost">
              <Landmark size={16} />
              School History
            </a>
          </div>
        </div>
      </section>

      <main className="home-main">
        <section id="home-history" className="alumni-card">
          <div className="alumni-card-header">
            <h3><Landmark size={16} /> School History</h3>
            <span className="alumni-card-tag">Est. 1945</span>
          </div>

          <div className="alumni-school-history">
            <p>
              The noble idea of establishing an educational institution in the college level in
              Aklan offering academic courses had its inception before the last war. The
              inclusive months of August &ndash; October, 1941 were devoted to its organization.
              The outbreak of the War stalled its foundation.
            </p>
            <p>
              After the liberation, prominent men and educators in Aklan adhered and joined
              efforts to organize. On August 18, 1945, in a meeting of stockholders, the
              Articles of Incorporation and By-Laws drafted by the Peralta Committee were
              approved and submitted to the Securities and Exchange Commission, and the
              first Board of Trustees was elected.
            </p>

            <div className="alumni-milestones">
              {SCHOOL_MILESTONES.map((milestone) => (
                <div key={milestone.label} className="alumni-milestone">
                  <span className="alumni-milestone-year">{milestone.year}</span>
                  <span>{milestone.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>ACC Alumni Management System &middot; Aklan College &middot; Est. 1945</p>
      </footer>
    </div>
  );
};

export default Home;