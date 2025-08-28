import { User } from "lucide-react";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import useAvatarUpload from "../../hooks/useAvatarUpload";

function BioSummaryStep() {
  const { profileData, setProfileData} = useOnboardingContext();
  // const {avatar} = useAvatarUpload();

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        {/* <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div> */}
        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center mx-auto justify-center overflow-hidden">
          {profileData.avatar ? (
            <img
              src={profileData.avatar?.url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-blue-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          Write a brief bio that describes who you are and what you write about
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={profileData.bio}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, bio: e.target.value }))
          }
          placeholder="I'm a passionate writer who loves to share insights about..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          maxLength={200}
        />
        <div className="text-right">
          <span className="text-sm text-gray-500">
            {profileData.bio.length}/200 characters
          </span>
        </div>
      </div>
    </div>
  );
}

export default BioSummaryStep;
