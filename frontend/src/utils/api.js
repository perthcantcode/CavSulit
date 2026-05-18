import axios from 'axios';
import { auth } from '../lib/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ─── KEY FIX ──────────────────────────────────────────────────────────────────
// Previously this read a token from localStorage which could be expired (Firebase
// tokens last only 1 hour). Now we always ask Firebase for the current token.
// getIdToken() returns the cached token if it's still valid, or silently fetches
// a new one if it has expired — so this has zero performance cost in the normal case.
api.interceptors.request.use(async (cfg) => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken(); // auto-refreshes when expired
    cfg.headers.Authorization = `Bearer ${token}`;
    // Keep localStorage in sync for any code that reads it directly
    localStorage.setItem('cavsulit_token', token);
  }
  return cfg;
});
// ─────────────────────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cavsulit_token');
      localStorage.removeItem('cavsulit_user');
    }
    return Promise.reject(err);
  }
);

export default api;