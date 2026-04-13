import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (!isProduction ? "http://localhost:5000/api" : "");

if (!apiBaseUrl && typeof window !== "undefined") {
  // Keep the app bootable while making misconfiguration obvious in deployed clients.
  console.error(
    "NEXT_PUBLIC_API_URL is missing in production. Configure it in Vercel env variables.",
  );
}

const clientApi = axios.create({
  baseURL: apiBaseUrl || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];
let csrfToken = null;
let csrfLoadingPromise = null;
let sessionInvalid = false;

// Resolve/reject all queued requests
const processQueue = (error) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

const needsCsrf = (method) =>
  ["post", "put", "patch", "delete"].includes(
    String(method || "").toLowerCase(),
  );

const isAuthPath = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/signup") ||
  url.includes("/auth/logout") ||
  url.includes("/auth/refresh-token");

const ensureCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (!csrfLoadingPromise) {
    csrfLoadingPromise = clientApi
      .get("/auth/csrf-token", { __skipAuthRefresh: true })
      .then((res) => {
        csrfToken = res?.data?.csrfToken || null;
        return csrfToken;
      })
      .finally(() => {
        csrfLoadingPromise = null;
      });
  }
  return csrfLoadingPromise;
};

clientApi.interceptors.request.use(async (config) => {
  const url = String(config.url || "");
  if (needsCsrf(config.method) && !url.includes("/auth/csrf-token")) {
    const token = csrfToken || (await ensureCsrfToken());
    if (token) {
      config.headers = config.headers || {};
      config.headers["x-csrf-token"] = token;
    }
  }
  return config;
});

// auto-refresh on 401
clientApi.interceptors.response.use(
  (res) => {
    const url = String(res?.config?.url || "");
    if (url.includes("/auth/login") || url.includes("/auth/signup")) {
      sessionInvalid = false;
    }
    return res;
  },

  async (error) => {
    const originalRequest = error.config;

    // Network errors / timeouts have no config — reject cleanly without crashing
    if (!originalRequest || !originalRequest.url) {
      return Promise.reject(error);
    }

    if (sessionInvalid && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // If the refresh endpoint itself failed, flush the queue and reject.
    // Do NOT redirect here — let each caller handle auth errors themselves.
    if (originalRequest.url.includes("/auth/refresh-token")) {
      processQueue(error);
      sessionInvalid = true;
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthPath(originalRequest.url) &&
      !originalRequest.__skipAuthRefresh
    ) {
      // Queue parallel requests while a refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => clientApi(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await clientApi.post("/auth/refresh-token", null, {
          __skipAuthRefresh: true,
        });
        sessionInvalid = false;
        processQueue(null);
        return clientApi(originalRequest);
      } catch (err) {
        sessionInvalid = true;
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
