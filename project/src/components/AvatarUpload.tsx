import React, { useEffect, useState } from "react";
import useAvatarUpload from "../hooks/useAvatarUpload";
import { Camera, Upload, User, X } from "lucide-react";
import { CloudinaryUploadResponse } from "../types/types";


interface AvatarUploadProps {
  initialAvatar: CloudinaryUploadResponse |  null;
  onChange: (avatar: CloudinaryUploadResponse) => void;
  showUploadOptions: boolean;
  setShowUploadOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const AvatarUpload = ({
  initialAvatar,
  onChange,
  showUploadOptions,
  setShowUploadOptions,
}: AvatarUploadProps) => {
  const {
    avatar,
    uploadingAvatar,
    handleAddAvatar,
    handleRemoveAvatar,
  } = useAvatarUpload(initialAvatar);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    
    handleAddAvatar(file);
    // onChange(newAvatar?.secureUrl ?? null);
  };

  useEffect(() => {
    if (avatar) {
      onChange(avatar);
    }
  }, [avatar]);

  useEffect(() =>{
    setIsUploadingAvatar(uploadingAvatar);
  }, [uploadingAvatar])

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {avatar ? (
          <img
            src={avatar.url}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-16 w-16 text-gray-400" />
        )}
      </div>
      <button
        onClick={() => {
          setShowUploadOptions(true);
          console.log(showUploadOptions);
        }}
        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
        disabled={isUploadingAvatar}
      >
        <Camera className="h-4 w-4" />
      </button>

      {showUploadOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Avatar
              </h3>
              <button
                onClick={() => setShowUploadOptions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label
              htmlFor="avatar-upload"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer mb-3"
            >
              <Upload className="h-4 w-4" />
              {avatar ? "Change avatar" : "Upload image (max size 2MB)*"}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploadingAvatar}
            />

            {avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                disabled={isUploadingAvatar}
              >
                <X className="h-4 w-4" /> Remove Photo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
