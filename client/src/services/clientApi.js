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

//  Resolve/reject queued requests
const processQueue = (error) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

//  RESPONSE INTERCEPTOR
clientApi.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    //  Prevent retry loop on refresh endpoint
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      //  Queue requests while refreshing
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

        //  Instead of redirect, emit event or return error
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default clientApi;
