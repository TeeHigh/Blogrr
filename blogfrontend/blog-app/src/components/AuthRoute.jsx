import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default AuthRoute