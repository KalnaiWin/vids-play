import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api"
      : import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

export default axiosInstance;

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    if (url.includes("auth/refresh")) {
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.resolve({ data: null });
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.resolve({ data: null });
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance(originalRequest))
        .catch(() => Promise.resolve({ data: null }));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axiosInstance.get("/auth/refresh", { withCredentials: true });
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch {
      processQueue(new Error("Refresh failed"));
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.resolve({ data: null });
    } finally {
      isRefreshing = false;
    }
  },
);
