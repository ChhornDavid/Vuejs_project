import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await api.post("/refresh", {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;
        sessionStorage.setItem("auth_token", newToken);

        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        sessionStorage.removeItem("auth_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
