import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clientApi from "@/services/clientApi";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to hit a protected endpoint
        await clientApi.get("/users/profiles/me");
        setIsAuthenticated(true);
        router.push("/dashboard");
      } catch (error) {
        // If even refresh fails, interceptor redirects to /login
        // But we also handle it here as a safety net
        console.log("Not authenticated:", error.response?.data);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src="/spin-loader.gif" alt="Loading..." width={50} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
