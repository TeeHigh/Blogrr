import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthorized } = useAuth();

  if (isAuthorized === null) return <Loader />;
  return isAuthorized ? children : <Navigate to="/login" replace />;
}