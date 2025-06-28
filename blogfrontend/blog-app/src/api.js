import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    // Endpoints that should NOT have the Authorization header
    const authFreeEndpoints = [
      "/user/register/",
      "/token/",
      "/token/refresh/",
      "/blogs/",
    ];

    // Remove baseURL if present to match the endpoint
    const url = config.url.replace(config.baseURL, "");

    if (!authFreeEndpoints.some((endpoint) => url.includes(endpoint))) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 and not already trying to refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/refresh/")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await api.post("/token/refresh/", { refresh: refreshToken });
          localStorage.setItem("access_token", res.data.access);
          // Update the Authorization header and retry the original request
          originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
