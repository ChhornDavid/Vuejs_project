import axios from 'axios';
//'http://172.19.202.96:8000/api'
//'http://localhost:8000/api'
const api = axios.create({
  baseURL: 'http://172.19.202.96:8000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // This sends cookies with requests
});

// Token management
function getAccessToken() {
  return localStorage.getItem('auth_token');
}

function setAccessToken(token) {
  localStorage.setItem('auth_token', token);
}

function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.setItem('isLoggedIn', 'false');
  sessionStorage.clear();
}

// Refresh token queue system
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken() {
  try {
    // withCredentials: true will automatically send the HttpOnly refresh token cookie
    const response = await api.post('/refresh'); // Changed to POST as it's more appropriate
    
    const { access_token } = response.data;
    
    if (!access_token) {
      throw new Error('No access token received');
    }
    
    setAccessToken(access_token);
    return access_token;
  } catch (error) {
    clearAuth();
    window.location.href = '/login'; // Redirect to login page
    throw error; // Re-throw to prevent subsequent requests from proceeding
  }
}

// Request interceptor
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only handle 401 errors and avoid retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
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
        // Clear auth and redirect if refresh fails
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For non-401 errors or already retried requests
    return Promise.reject(error);
  }
);

export default api;