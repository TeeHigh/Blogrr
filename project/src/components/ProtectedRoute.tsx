import { Navigate, useLocation, Outlet } from "react-router-dom";
import OverlayLoader from "./OverlayLoader";
import useUser from "../hooks/blogHooks/useUser";

export default function ProtectedRoute() {
  const location = useLocation();

  // const { isVerifyingAuth, data, isAuthenticated } = useVerifyAuth();
  const {data = []} = useUser();

  if(!data) return <OverlayLoader />;
  const user = data ? data.author : null;

  // console.log(isAuthenticated);
  // console.log(data);
  console.log(user);
  // const isAuthenticated = data ? data.isAuthenticated : false;

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}