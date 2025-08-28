import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";


type AvatarContextType = {
  avatar: string;
  setAvatar: Dispatch<SetStateAction<string>>;
  uploading: boolean;
  setUploading: Dispatch<SetStateAction<boolean>>;
  showUploadOptions: boolean;
  setShowUploadOptions: Dispatch<SetStateAction<boolean>>;
  SAMPLE_AVATARS: string[];
};

const SAMPLE_AVATARS = [
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150",
];

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  return (
    <AvatarContext.Provider
      value={{
        avatar,
        setAvatar,
        uploading,
        setUploading,
        showUploadOptions,
        setShowUploadOptions,
        SAMPLE_AVATARS,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatarContext must be used within an AvatarProvider");
  }
  return context;
};
