import React, { createContext, useContext, useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, sendEmailVerification } from 'firebase/auth';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cavsulit_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    localStorage.setItem('cavsulit_token', token);
    const { data } = await api.get('/auth/me');
    localStorage.setItem('cavsulit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    localStorage.setItem('cavsulit_token', token);
    const { data } = await api.get('/auth/me');
    localStorage.setItem('cavsulit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (form) => {
    const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
    if (form.email.endsWith('@cvsu.edu.ph')) {
      await sendEmailVerification(result.user);
    }
    const token = await result.user.getIdToken();
    localStorage.setItem('cavsulit_token', token);
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('cavsulit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('cavsulit_token');
    localStorage.removeItem('cavsulit_user');
    setUser(null);
  };

  const updateUser = (u) => {
    localStorage.setItem('cavsulit_user', JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);