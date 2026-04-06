import { io } from "socket.io-client";

let socketSingleton = null;

export function getSocketBaseUrl() {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/$/, "");
  }
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return api.replace(/\/api\/?$/, "");
}

export function getSocket() {
  if (typeof window === "undefined") return null;
  if (socketSingleton?.connected) return socketSingleton;
  const url = getSocketBaseUrl();
  socketSingleton = io(url, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
  });
  return socketSingleton;
}

export function disconnectSocket() {
  if (socketSingleton) {
    socketSingleton.disconnect();
    socketSingleton = null;
  }
}
