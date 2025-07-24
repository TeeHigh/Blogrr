// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject,
} from "react";
import { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  emailToVerify: string;
  emailAvailable: boolean;
  emailVerified: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: (auth: boolean) => void;
  setOnboardingComplete: (status: boolean) => void;
  setEmailToVerify: (email: string) => void;
  setEmailAvailable: (status: boolean) => void;
  setEmailVerified: (status: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  // const [emailToVerify, setEmailToVerify] = useState<string>("");

  const emailToVerify = useRef<string>("");

  const setEmailToVerify = (email: string) => {
    emailToVerify.current = email;
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);
        setEmailVerified(!!parsedUser.emailVerified);
        setOnboardingComplete(!!parsedUser.name && !!parsedUser.emailVerified);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setEmailVerified(false);
        setOnboardingComplete(false);
      }
    } catch (error) {
      console.error("Error loading auth from localStorage", error);
      setUser(null);
      setIsAuthenticated(false);
      setEmailVerified(false);
      setOnboardingComplete(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setOnboardingComplete(false);
    setEmailVerified(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        onboardingComplete,
        emailVerified,
        emailAvailable,
        emailToVerify: emailToVerify.current,
        setUser,
        setIsAuthenticated,
        setOnboardingComplete,
        setEmailToVerify,
        setEmailVerified,
        setEmailAvailable,
        logout,
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
