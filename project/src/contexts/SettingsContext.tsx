import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  User as UserIcon,
  Trash2,
  Shield,
  Bell,
  Globe,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { CloudinaryUploadResponse, ProfileSettingsFormData, User} from "../types/types";
import useUpdateAccount from "../hooks/accountHooks/useUpdateAccount";

type SettingsContextType = {
  tabs: { id: string; name: string; icon: React.ElementType }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  setSaving: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (status: boolean) => void;
  showAvatarModal: boolean;
  setShowAvatarModal: Dispatch<SetStateAction<boolean>>;
  profileData: {
    username: string;
    fullname: string;
    email: string;
    bio: string;
    avatar: string | CloudinaryUploadResponse;
  };
  setProfileData: React.Dispatch<
    React.SetStateAction<{
      fullname: string;
      username: string;
      email: string;
      bio: string;
      avatar: string | CloudinaryUploadResponse;
    }>
  >;
  passwordData?: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordData?: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >;
  showPasswords?: {
    current: boolean;
    new: boolean;
    confirm: boolean;
  };
  setShowPasswords?: React.Dispatch<
    React.SetStateAction<{
      current: boolean;
      new: boolean;
      confirm: boolean;
    }>
  >;
  notifications?: {
    emailUpdates: boolean;
    collaborationRequests: boolean;
    newFollowers: boolean;
    weeklyDigest: boolean;
  };
  setNotifications?: React.Dispatch<
    React.SetStateAction<{
      emailUpdates: boolean;
      collaborationRequests: boolean;
      newFollowers: boolean;
      weeklyDigest: boolean;
    }>
  >;
  handleProfileSave?: () => Promise<void>;
  handlePasswordChange?: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { updateProfile } = useUpdateAccount();

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "privacy", name: "Privacy", icon: Globe },
    { id: "account", name: "Account", icon: Trash2 },
  ];

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    username: user?.username || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        username: user?.username || "",
      });
    }
  }, [user]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    collaborationRequests: true,
    newFollowers: false,
    weeklyDigest: true,
  });

  const handleProfileSave = async () => {
    setSaving(true);

    // Compare new data vs original user
    const updatedData: Partial<ProfileSettingsFormData> = {};
    if (profileData.fullname !== user?.fullname) {
      updatedData.fullname = profileData.fullname;
    }
    if (profileData.username !== user?.username) {
      updatedData.username = profileData.username;
    }
    if (profileData.email !== user?.email) {
      updatedData.email = profileData.email;
    }
    if (profileData.bio !== user?.bio) {
      updatedData.bio = profileData.bio;
    }
    if (profileData.avatar !== user?.avatar) {
      updatedData.avatar = profileData.avatar;
    }

    if (Object.keys(updatedData).length === 0) {
      // Nothing changed
      setSaving(false);
      return;
    }

    try {
      updateProfile(updatedData);
      // alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      // In a real app, this would call an API to change password
      alert("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <SettingsContext.Provider
      value={{
        tabs,
        activeTab,
        setActiveTab,
        loading,
        setSaving,
        showDeleteConfirm,
        setShowDeleteConfirm,
        showAvatarModal,
        setShowAvatarModal,
        profileData,
        setProfileData,
        passwordData,
        setPasswordData,
        showPasswords,
        setShowPasswords,
        notifications,
        setNotifications,
        handleProfileSave,
        handlePasswordChange,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
