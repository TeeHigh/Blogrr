import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authFreeEndpoints = [
      "/user/register/",
      "/token/",
      "/token/refresh/",
      "/posts/",
      "/check-username/",
      "/check-email/",
      "/verify-otp/",
      "/send-otp/",
    ];

    const url = config.url?.replace(config.baseURL || "", "") || "";

    if (!authFreeEndpoints.some((endpoint) => url.includes(endpoint))) {
      const token = localStorage.getItem("access_token");
      if (token && config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/token/refresh/")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
          const access = (res.data as { access: string }).access;

          localStorage.setItem("access_token", access);

          if (
            originalRequest.headers &&
            typeof originalRequest.headers.set === "function"
          ) {
            originalRequest.headers.set("Authorization", `Bearer ${access}`);
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
