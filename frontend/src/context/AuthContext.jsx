import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cavsulit_user')) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const freshToken = await firebaseUser.getIdToken(true);
        localStorage.setItem('cavsulit_token', freshToken);
        try {
          const { data } = await api.get('/auth/me');
          localStorage.setItem('cavsulit_user', JSON.stringify(data));
          setUser(data);
        } catch {
          localStorage.removeItem('cavsulit_token');
          localStorage.removeItem('cavsulit_user');
          setUser(null);
        }
      } else {
        // FIX: redirect to /login on session expiry, not landing page
        const hadUser = !!localStorage.getItem('cavsulit_user');
        localStorage.removeItem('cavsulit_token');
        localStorage.removeItem('cavsulit_user');
        setUser(null);
        if (hadUser && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token  = await result.user.getIdToken(true);
    localStorage.setItem('cavsulit_token', token);
    const { data } = await api.get('/auth/me');
    localStorage.setItem('cavsulit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token  = await result.user.getIdToken(true);
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
    const token = await result.user.getIdToken(true);
    localStorage.setItem('cavsulit_token', token);
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('cavsulit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const resendVerification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('cavsulit_token');
    localStorage.removeItem('cavsulit_user');
    setUser(null);
    // FIX: redirect to /login on explicit logout
    window.location.href = '/login';
  };

  const updateUser = (u) => {
    localStorage.setItem('cavsulit_user', JSON.stringify(u));
    setUser(u);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, updateUser, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);