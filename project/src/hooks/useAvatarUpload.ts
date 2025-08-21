import { useState } from "react";
import toast from "react-hot-toast";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary";
import { useAvatarContext } from "../contexts/AvatarContext";

const useAvatarUpload = (initialAvatar: string = "") => {
  const [avatar, setAvatar] = useState(initialAvatar);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPublicId, setAvatarPublicId] = useState("");

  // const {avatar, setAvatar, uploading, setUploading} = useAvatarContext();

  const handleAddAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(file);

    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(
        `File is too large. Please upload an image under ${MAX_SIZE_MB}MB.`
      );
      return;
    }

    setUploadingAvatar(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const { secureUrl, publicId } = await uploadToCloudinary(file);
      setAvatar(secureUrl);
      setAvatarPublicId(publicId);
      toast.success("Image upload successful!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const toastId = toast.loading("Removing avatar...");

    try {
      await deleteFromCloudinary(avatarPublicId);
      setAvatar("");
      toast.success("Avatar removed", { id: toastId });
    } catch (error) {
      console.error("Failed to remove avatar:", error);
      toast.error("Failed to remove avatar", { id: toastId });
    }
  };

  return {
    avatar,
    uploadingAvatar,
    setUploadingAvatar,
    handleAddAvatar,
    handleRemoveAvatar,
    setAvatar,
  };
};

export default useAvatarUpload;
