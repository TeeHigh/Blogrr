import React, { useState } from "react";
// import { Camera, Upload, X } from "react-icons";
import useAvatarUpload from "../hooks/useAvatarUpload"; // Import your hook
import { Camera, Upload, User, X } from "lucide-react";

interface AvatarUploadProps {
  initialAvatar: (string | File | null)[],
  onChange: (avatar: File, preview: string) => void,
  showUploadOptions: boolean,
  setShowUploadOptions: React.Dispatch<React.SetStateAction<boolean>>
};

const AvatarUpload = ({ initialAvatar, onChange, showUploadOptions, setShowUploadOptions }: AvatarUploadProps) => {
  const { avatar, uploadingAvatar: isUploadingAvatar, handleAddAvatar, handleRemoveAvatar } =
    useAvatarUpload(initialAvatar);

  console.log("initial avatar:", initialAvatar);

  const [preview, setPreview] = useState("");

  const previewAvatar = initialAvatar[1] ?? preview; //the preview of the avatar is saved at index 1
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if(!file) return;
    if (previewAvatar) handleRemovePreview;
    if (file) {
      console.log(file);
      const avatarPreview = URL.createObjectURL(file);
      setPreview(avatarPreview)
      onChange(file, avatarPreview); // Notify parent component of the change
    
      setShowUploadOptions(false);
    }
  };

  const handleRemovePreview = () => {
  if (preview) {
    URL.revokeObjectURL(preview);
    setPreview("");               
    onChange(null as any, "");    
  }
  setShowUploadOptions(false);
};

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {previewAvatar ? (
          <img
            src={previewAvatar as string}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-16 w-16 text-gray-400" />
        )}
      </div>
      <button
        onClick={() => setShowUploadOptions(true)}
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
              {previewAvatar ? "Change avatar" : "Upload image (max size 2MB)*"}
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
                onClick={handleRemovePreview}
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
