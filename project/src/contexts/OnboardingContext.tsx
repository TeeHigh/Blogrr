import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import api from "../api";
import { RegisterFormData } from "../types/types";
import { useAuth } from "./AuthContext";
import useAvatarUpload from "../hooks/useAvatarUpload";

type ProfileDataType = {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
  bio: string;
  genres: string[];
};

type OnboardingContextType = {
  GENRES: string[];
  currentStep: number;
  profileData: ProfileDataType;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setProfileData: Dispatch<
    SetStateAction<{
      fullname: string;
      username: string;
      password: string;
      confirmPassword: string;
      avatar: File | null;
      bio: string;
      genres: string[];
    }>
  >;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>;
  errors: Record<string, string>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  usernameStatus: string | null;
  setUsernameStatus: Dispatch<SetStateAction<string | null>>;
  avatarPreview: string | null;
  setAvatarPreview: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  checkUsernameAvailability: (username: string) => Promise<void>;
  handleInputChange: (field: string, value: string) => void;
  handleGenreToggle: (genre: string) => void;
  handleComplete: () => Promise<void>;
  passwordStrength: (password: string) => number;
  getStrengthColor: (strength: number) => void;
  getStrengthText: (strength: number) => ReactNode;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const GENRES = [
    "Technology",
    "Web Development",
    "Mobile Development",
    "AI & Machine Learning",
    "Design",
    "Business",
    "Entrepreneurship",
    "Marketing",
    "Finance",
    "Lifestyle",
    "Travel",
    "Food",
    "Health & Fitness",
    "Science",
    "Education",
    "Politics",
    "Environment",
    "Entertainment",
    "Gaming",
    "Movies",
    "Music",
    "Sports",
    "Photography",
    "Art",
    "Writing",
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null as File | null,
    bio: "",
    genres: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { emailToVerify } = useAuth();
  const {handleAddAvatar} = useAvatarUpload();

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
  };

  const handleGenreToggle = (genre: string) => {
    setProfileData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleComplete = async () => {
    setLoading(true);

    const avatarToUpload = profileData.avatar
      ? await handleAddAvatar(profileData.avatar)
      : null;

    try {
      const { confirmPassword, ...filteredProfileData } = profileData;

      const formData: RegisterFormData = {
        ...filteredProfileData,
        avatar: avatarToUpload?.secure_url,
        email: emailToVerify,
      };

      console.log(formData);
      // await registerUser(formData);
    } catch (error) {
      console.error("Error during complete:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    try {
      const res = await api.get(`/api/check-username/`, {
        params: { username },
      });
      setUsernameStatus(res.data.exists ? "taken" : "available");
    } catch (error) {
      console.error("Username check failed:", error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        GENRES,
        currentStep,
        profileData,
        setCurrentStep,
        setProfileData,
        usernameStatus,
        setUsernameStatus,
        avatarPreview,
        setAvatarPreview,
        showConfirmPassword,
        setShowConfirmPassword,
        errors,
        setErrors,
        showPassword,
        setShowPassword,
        loading,
        setLoading,
        handleInputChange,
        handleComplete,
        handleGenreToggle,
        checkUsernameAvailability,
        passwordStrength,
        getStrengthColor,
        getStrengthText,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within a OnboardingProvider"
    );
  }
  return context;
};
