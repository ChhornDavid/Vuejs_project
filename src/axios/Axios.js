import axios from 'axios';

// API Base URLs
// 'http://172.19.202.96:8000/api'
// 'http://localhost:8000/api'

const api = axios.create({
  baseURL: 'http://172.19.202.96:8000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Access token management
let accessToken = localStorage.getItem('auth_token');

function setAccessToken(token) {
  accessToken = token;
  localStorage.setItem('auth_token', token);
}

function clearAuth() {
  accessToken = null;
  localStorage.removeItem('auth_token');
  sessionStorage.clear();
  window.location.href = '/login';
}

// Refresh queue
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  try {
    const response = await api.post('/refresh');
    const { access_token } = response.data;

    if (!access_token) throw new Error('No access token received');

    setAccessToken(access_token);
    return access_token;
  } catch (error) {
    clearAuth();
    throw error;
  }
}

// Request interceptor
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

