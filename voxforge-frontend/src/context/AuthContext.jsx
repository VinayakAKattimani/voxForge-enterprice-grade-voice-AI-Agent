import { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest, registerRequest, currentUser } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.sessionStorage.getItem('voxforge-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persist = (u) => {
    setUser(u);
    try { window.sessionStorage.setItem('voxforge-user', JSON.stringify(u)); } catch { /* no-op */ }
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginRequest(email, password);
      persist(res.user);
      return res.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerRequest(payload);
      persist(res.user);
      return res.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { window.sessionStorage.removeItem('voxforge-user'); } catch { /* no-op */ }
  }, []);

  // Convenience for demo purposes — skip auth screens quickly.
  const loginAsDemo = useCallback(() => persist(currentUser), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
