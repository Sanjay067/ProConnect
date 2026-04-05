import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import clientApi from "@/services/clientApi";
import Loader from "@/components/Loader";
import { getConnectionsOverview } from "@/config/redux/action/connectionAction";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await clientApi.get("/users/profiles/me");
        setIsAuthenticated(true);
        dispatch(getConnectionsOverview());
      } catch (error) {
        console.log("Not authenticated:", error.response?.data);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, dispatch]);

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
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
