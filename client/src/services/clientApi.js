import axios from "axios";

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

// Resolve/reject all queued requests
const processQueue = (error) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

// auto-refresh on 401
clientApi.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    // Network errors / timeouts have no config — reject cleanly without crashing
    if (!originalRequest || !originalRequest.url) {
      return Promise.reject(error);
    }

    // If the refresh endpoint itself failed, flush the queue and reject.
    // Do NOT redirect here — let each caller handle auth errors themselves.
    if (originalRequest.url.includes("/auth/refresh-token")) {
      processQueue(error);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue parallel requests while a refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => clientApi(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await clientApi.post("/auth/refresh-token");
        processQueue(null);
        return clientApi(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default clientApi;
