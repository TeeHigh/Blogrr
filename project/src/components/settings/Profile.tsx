import { Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { CloudinaryUploadResponse } from "../../types/types";
import AvatarUpload from "../AvatarUpload";

function Profile() {
  const { user } = useAuth();
  const {
    profileData,
    setProfileData,
    loading,
    handleProfileSave,
    showAvatarModal,
    setShowAvatarModal,
  } = useSettings();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h3>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6">
          <AvatarUpload
            initialAvatar={
              user?.avatar && user.avatar.secure_url ? user.avatar : null
            }
            onChange={(avatar: CloudinaryUploadResponse) => {
              if (avatar) {
                setProfileData((prev) => ({
                  ...prev,
                  avatar,
                }));
              }
            }}
            showUploadOptions={showAvatarModal}
            setShowUploadOptions={setShowAvatarModal}
          />
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl text-gray-800">
                {profileData.fullname}
              </h2>
              <h4 className="font-medium text-gray-500">
                {"@"}
                {profileData.username}
              </h4>
            </div>
            <h4 className="font-medium text-gray-700">Profile Picture</h4>
            <p className="text-sm text-gray-600">
              Click the camera icon to change your avatar
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed bg-gray-50 text-gray-500"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.fullname}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed bg-gray-50 text-gray-500"
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, bio: e.target.value }))
            }
            rows={4}
            maxLength={300}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {profileData.bio.length}/300 characters
          </p>
        </div>

        <button
          onClick={handleProfileSave}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
