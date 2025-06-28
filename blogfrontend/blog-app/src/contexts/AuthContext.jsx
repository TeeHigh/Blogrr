import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
    // eslint-disable-next-line
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      const response = await api.post("/api/token/refresh/", { refresh: refreshToken });
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}