import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('enviro_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data);
    localStorage.setItem('enviro_user', JSON.stringify(data));
    setAuthModalOpen(false);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data);
    localStorage.setItem('enviro_user', JSON.stringify(data));
    setAuthModalOpen(false);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('enviro_user');
  };

  const value = {
    user,
    role: user?.role || 'GUEST',
    isInvestor: user?.role === 'INVESTOR',
    isAdmin: user?.role === 'ADMIN',
    investorId: user?.investorId || 1,
    login,
    register,
    logout,
    authModalOpen,
    setAuthModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
