import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary";
import { CloudinaryUploadResponse } from "../types/types";
import { useAvatarContext } from "../contexts/AvatarContext";
import api from "../api";

const useAvatarUpload = (
  initialAvatar: CloudinaryUploadResponse | null = null
) => {
  const [avatar, setAvatar] = useState<CloudinaryUploadResponse | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { setShowUploadOptions } = useAvatarContext();

  useEffect(() => {
    if (initialAvatar) {
      setAvatar(initialAvatar);
    }
  }, [initialAvatar]);

  const handleAddAvatar = async (
    file: File
  ): Promise<CloudinaryUploadResponse | null> => {
    if (!file) {
      // return null;
      throw new Error("No file provided");
    }

    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(
        `File is too large. Please upload an image under ${MAX_SIZE_MB}MB.`
      );
      throw new Error("File too large");
      // return null;
    }

    setUploadingAvatar(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      // Make sure uploadToCloudinary returns CloudinaryUploadResponse
      const res = await uploadToCloudinary(file);

      console.log(res);
      setAvatar(res);
      // setAvatarPublicId(public_id);
      setShowUploadOptions(false);

      toast.success("Image upload successful!", { id: toastId });

      return res;
    } catch (err) {
      toast.error("Upload failed", { id: toastId });
      console.error(err);
      throw err;
    } finally {
      setUploadingAvatar(false);
    }
  };

  // const handleRemoveAvatar = async () => {
  //   const toastId = toast.loading("Removing avatar...");

  //   if (!avatar?.public_id) {
  //     toast.error("No avatar to remove", { id: toastId });
  //     return;
  //   }

  //   setUploadingAvatar(true);

  //   try {
  //     await deleteFromCloudinary(avatar.public_id);
  //     setAvatar(null);
  //     toast.success("Avatar removed", { id: toastId });
  //   } catch (error) {
  //     console.error("Failed to remove avatar:", error);
  //     toast.error("Failed to remove avatar", { id: toastId });
  //   } finally {
  //     setUploadingAvatar(false);
  //   }
  // };

  const handleRemoveAvatar = async () => {
    const toastId = toast.loading("Removing avatar...");

    if (!avatar?.public_id) {
      toast.error("No avatar to remove", { id: toastId });
      return;
    }

    setUploadingAvatar(true);

    try {
      await api.delete(`/delete-avatar/${avatar.public_id}/`);
      setAvatar(null);
      toast.success("Avatar removed", { id: toastId });
    } catch (error) {
      console.error("Failed to remove avatar:", error);
      toast.error("Failed to remove avatar", { id: toastId });
    } finally {
      setUploadingAvatar(false);
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
