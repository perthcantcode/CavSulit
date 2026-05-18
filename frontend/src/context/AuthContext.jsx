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
    try {
      return JSON.parse(localStorage.getItem('cavsulit_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true); // true until Firebase resolves

  // ─── KEY FIX ────────────────────────────────────────────────────────────────
  // Firebase tokens expire after 1 hour. This listener fires on every app load
  // and whenever the token is silently refreshed by Firebase. It keeps
  // localStorage.cavsulit_token always fresh so the backend never sees an
  // expired token and returns "No token" / 401.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // getIdToken(true) forces a refresh if the token is expired or close to it.
        // Without the "true" flag it returns the cached (possibly expired) token.
        const freshToken = await firebaseUser.getIdToken(true);
        localStorage.setItem('cavsulit_token', freshToken);

        // Sync the user profile from our backend (picks up badge changes etc.)
        try {
          const { data } = await api.get('/auth/me');
          localStorage.setItem('cavsulit_user', JSON.stringify(data));
          setUser(data);
        } catch {
          // /auth/me failed — clear stale session
          localStorage.removeItem('cavsulit_token');
          localStorage.removeItem('cavsulit_user');
          setUser(null);
        }
      } else {
        // Firebase says no one is signed in — clear everything
        localStorage.removeItem('cavsulit_token');
        localStorage.removeItem('cavsulit_user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken(true);
    localStorage.setItem('cavsulit_token', token);
    const { data } = await api.get('/auth/me');
    localStorage.setItem('cavsulit_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken(true);
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
  };

  const updateUser = (u) => {
    localStorage.setItem('cavsulit_user', JSON.stringify(u));
    setUser(u);
  };

  // Don't render children until Firebase has resolved the auth state.
  // Without this, protected pages briefly flash before redirect.
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, updateUser, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);