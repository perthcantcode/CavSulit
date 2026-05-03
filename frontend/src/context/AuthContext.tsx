import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<any>(() => { try { return JSON.parse(localStorage.getItem('cavsulit_user') || 'null'); } catch { return null; } });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cavsulit_token', data.token);
    localStorage.setItem('cavsulit_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (form: any) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('cavsulit_token', data.token);
    localStorage.setItem('cavsulit_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('cavsulit_token');
    localStorage.removeItem('cavsulit_user');
    setUser(null);
  };

  const updateUser = (u: any) => {
    localStorage.setItem('cavsulit_user', JSON.stringify(u));
    setUser(u);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
