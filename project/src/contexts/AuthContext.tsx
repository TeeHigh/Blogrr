// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { User } from "../types/types";
import api from "../api";
import { AxiosResponse } from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  emailToVerify: string;
  emailAvailable: boolean;
  emailVerified: boolean;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: (auth: boolean) => void;
  setOnboardingComplete: (status: boolean) => void;
  setEmailToVerify: (email: string) => void;
  setEmailAvailable: (status: boolean) => void;
  setEmailVerified: (status: boolean) => void;
  setLoading: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const [auth, setAuth] = useState()({})
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState<string>("");

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res: AxiosResponse<{ user: User }> = await api.get("/api/verify-auth/");
  //       console.log("Auth verification response:", res);

  //       if (res.status === 200 && res.data.user) {
  //         const fetchedUser = res.data.user;
  //         setUser(fetchedUser);
  //         setIsAuthenticated(true);
  //         setEmailVerified(!!fetchedUser.email);
  //         setOnboardingComplete(!!fetchedUser.fullname && !!fetchedUser.email);
  //       }
  //     } catch (error) {
  //       console.error("Error verifying auth on mount:", error);
  //       // Clear all state on auth failure
  //       setUser(null);
  //       setIsAuthenticated(false);
  //       setEmailVerified(false);
  //       setOnboardingComplete(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        onboardingComplete,
        emailVerified,
        emailAvailable,
        emailToVerify,
        loading,
        setUser,
        setLoading,
        setIsAuthenticated,
        setOnboardingComplete,
        setEmailToVerify,
        setEmailVerified,
        setEmailAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;