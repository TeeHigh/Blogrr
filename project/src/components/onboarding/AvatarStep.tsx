import { Camera } from "lucide-react";
import AvatarUpload from "../AvatarUpload";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import { useAvatarContext } from "../../contexts/AvatarContext";
import useAvatarUpload from "../../hooks/useAvatarUpload";

function AvatarStep() {
  const {profileData, setProfileData, avatarPreview, setAvatarPreview} = useOnboardingContext();
  const {showUploadOptions, setShowUploadOptions} = useAvatarContext();

  const { avatar,  } =
    useAvatarUpload();

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
          <Camera className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Add a profile picture
        </h2>
        <p className="text-gray-600">
          Help others recognize you in the community
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <AvatarUpload
            initialAvatar={[avatar || profileData.avatar, avatarPreview]}
            onChange={(avatar: File, preview: string) => {
              console.log("Preview", preview);
              setProfileData((prev) => ({
                ...prev,
                avatar: avatar,
              }));
              setAvatarPreview(preview);
            }}
            setShowUploadOptions={setShowUploadOptions}
            showUploadOptions={showUploadOptions}
          />
        </div>

        <p className="text-sm text-gray-500">
          You can skip this step and add a photo later
        </p>
      </div>
    </div>
  );
}

export default AvatarStep;
