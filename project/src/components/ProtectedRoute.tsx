import { Navigate, useLocation, Outlet } from "react-router-dom";
import OverlayLoader from "./OverlayLoader";
import useVerifyAuth from "../hooks/authHooks/useVerifyAuth";

export default function ProtectedRoute() {
  const location = useLocation();

  const { isVerifyingAuth = true, isAuthenticated = false } = useVerifyAuth();

  if (isVerifyingAuth) return <OverlayLoader />;

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isAuthenticated) {
    return <Outlet />;
  }
}
