import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mb_token');
    const stored = localStorage.getItem('mb_user');
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch { /* invalid */ }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('mb_token', token);
    localStorage.setItem('mb_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('mb_token');
    localStorage.removeItem('mb_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem('mb_user', JSON.stringify(merged));
    setUser(merged);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};