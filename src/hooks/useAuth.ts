import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types/User';

export const MOCK_ADMIN_USER: User = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

// Mock alumni account. After login the alumni user is routed to the mobile
// experience (AlumniMobileLayout). This mirrors alumniData[id=1].
export const MOCK_ALUMNI_USER: User = {
  id: 1,
  name: 'John Michael Santos',
  email: 'alumni@example.com',
  role: 'alumni'
};

const STORAGE_KEY = 'alumni_auth_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<User> => {
    // Mock authentication - accepts the demo accounts below.
    // This will be replaced with real API calls when the backend is implemented.
    const demoAccounts: Record<string, { user: User; password: string }> = {
      [MOCK_ADMIN_USER.email]: { user: MOCK_ADMIN_USER, password: 'admin123' },
      [MOCK_ALUMNI_USER.email]: { user: MOCK_ALUMNI_USER, password: 'alumni123' }
    };

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const account = demoAccounts[email.toLowerCase()];
        if (account && password === account.password) {
          const loggedInUser: User = { ...account.user, email };
          if (rememberMe) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
          }
          setUser(loggedInUser);
          resolve(loggedInUser);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, loading, login, logout };
};