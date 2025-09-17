// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  onboardingComplete: boolean;
  emailToVerify: string;
  emailAvailable: boolean;
  emailVerified: boolean;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
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
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{
        user,
        onboardingComplete,
        emailVerified,
        emailAvailable,
        emailToVerify,
        loading,
        setUser,
        setLoading,
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