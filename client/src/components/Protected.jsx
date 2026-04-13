import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import clientApi from "@/services/clientApi";
import Loader from "@/components/Loader";
import { reset as resetAuth } from "@/config/redux/reducer/authReducer";
import { reset as resetProfile } from "@/config/redux/reducer/profileReducer";
import { reset as resetConnection } from "@/config/redux/reducer/connectionReducer";

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
      } catch (error) {
        console.log("Not authenticated:", error.response?.data);
        dispatch(resetAuth());
        dispatch(resetProfile());
        dispatch(resetConnection());
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
