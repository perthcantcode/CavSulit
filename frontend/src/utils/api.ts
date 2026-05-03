import axios from 'axios';

const api = axios.create({ baseURL: 'https://cavsulit-production.up.railway.app/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cavsulit_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cavsulit_token');
      localStorage.removeItem('cavsulit_user');
    }
    return Promise.reject(err);
  }
);

export default api;
