import { createContext, useContext, useState } from "react";

type AvatarContextType = {
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  return (
    <AvatarContext.Provider
      value={{ avatar, setAvatar, uploading, setUploading }}
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
