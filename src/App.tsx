import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import type { ReactNode } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import AlumniSystemLayout from './layouts/AlumniSystemLayout';
import UpcomingGrads from './pages/UpcomingGrads';
import AlumniSystemHome from './pages/alumni/Home';
import AlumniSystemProfile from './pages/alumni/Profile';
import AlumniSystemRegister from './pages/alumni/Register';
import AlumniSystemStatus from './pages/alumni/Status';
import Home from './pages/Home';
import Login from './pages/Login';
import Alumni from './pages/Alumni';
import AlumniProfile from './pages/AlumniProfile';
import Settings from './pages/Settings';
import Loading from './components/Loading';

interface ProtectedRouteProps {
  user: { name: string; email: string; role: string } | null;
  children: ReactNode;
}

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const { user, loading, login, logout } = useAuth();
  const isAlumni = user?.role === 'alumni';

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />

        {isAlumni ? (
          /* Alumni accounts (any device) -> alumni self-service portal */
          <Route
            path="/alumni"
            element={
              <ProtectedRoute user={user}>
                <AlumniSystemLayout user={user} onLogout={logout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<AlumniSystemHome />} />
            <Route path="profile" element={<AlumniSystemProfile />} />
            <Route path="registration" element={<AlumniSystemRegister />} />
            <Route path="status" element={<AlumniSystemStatus />} />
          </Route>
        ) : (
          /* Admin/staff -> admin/staff dashboard (responsive down to mobile) */
          <Route
            element={
              <ProtectedRoute user={user}>
                <DashboardLayout user={user} onLogout={logout} />
              </ProtectedRoute>
            }
          >
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/alumni/:id" element={<AlumniProfile />} />
            <Route path="/upcoming-grads" element={<UpcomingGrads />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        )}

        {/* Public landing page - visitors see the home page first. */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;