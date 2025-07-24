import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Camera,
  User,
  Heart,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  EyeOff,
  Eye,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import useRegister from "../hooks/useRegister";
import { RegisterFormData } from "../types/types";

const GENRES = [
  "Technology",
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "Design",
  "UI/UX",
  "Graphic Design",
  "Product Design",
  "Business",
  "Entrepreneurship",
  "Marketing",
  "Finance",
  "Lifestyle",
  "Travel",
  "Food",
  "Health & Fitness",
  "Science",
  "Education",
  "Politics",
  "Environment",
  "Entertainment",
  "Gaming",
  "Movies",
  "Music",
  "Sports",
  "Photography",
  "Art",
  "Writing",
];

const SAMPLE_AVATARS = [
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150",
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: "",
    bio: "",
    genres: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null);

  const { user, emailToVerify, emailVerified } = useAuth();
  const {registerUser, isPending} = useRegister();

  if (!emailVerified) {
    return <Navigate to="/register" replace />;
  }

  if (user?.genres && user?.genres.length > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  const checkUsernameAvailability = async (username: string) => {
    try {
      const res = await api.get(`/api/check-username/`, {
        params: { username },
      });
      setUsernameStatus(res.data.exists ? "taken" : "available");
    } catch (error) {
      console.error("Username check failed:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.fullname.trim()) {
      newErrors.name = "Name is required";
    } else if (profileData.fullname.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!profileData.password) {
      newErrors.password = "Password is required";
    } else if (profileData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!profileData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (profileData.password !== profileData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
  };

  const handleGenreToggle = (genre: string) => {
    setProfileData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleComplete = async () => {
    setLoading(true);

    const {confirmPassword, ...filteredProfileData} = profileData;

    const formData: RegisterFormData = {
      email: emailToVerify,
      ...filteredProfileData
    }

    registerUser(formData);
    console.log(formData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          profileData.fullname.trim().length > 1 &&
          profileData.username.trim().length >= 3 &&
          profileData.password.length >= 6
        );
      case 2:
        return true;
      case 3:
        return profileData.bio.trim().length > 0;
      case 4:
        return profileData.genres.length >= 3;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Set up your account
              </h2>
              <p className="text-gray-600">Choose your username and password</p>
            </div>

            <div className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={profileData.fullname}
                    onChange={(e) =>
                      handleInputChange("fullname", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-light focus:border-transparent ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username.trim().toLowerCase()}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase(),
                    }))
                  }
                  onBlur={() => {
                    if (profileData.username.trim()) {
                      checkUsernameAvailability(profileData.username);
                    }
                  }}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                    usernameStatus === "taken"
                      ? " ring-2 ring-cancel"
                      : "focus:ring-2 focus:ring-secondary-light focus:border-transparent"
                  }`}
                  placeholder="johndoe123"
                />
              </div>
              {usernameStatus === "taken" && (
                <InputMessage type="error">
                  Username is already taken
                </InputMessage>
              )}
              {usernameStatus === "available" && (
                <InputMessage type="success">
                  Username is available
                </InputMessage>
              )}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={profileData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-light focus:border-transparent ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {profileData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                            passwordStrength(profileData.password)
                          )}`}
                          style={{
                            width: `${
                              (passwordStrength(profileData.password) / 4) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {getStrengthText(
                          passwordStrength(profileData.password)
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={profileData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-light focus:border-transparent ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {profileData.confirmPassword &&
                  profileData.password === profileData.confirmPassword && (
                    <InputMessage type="success">Passwords Match</InputMessage>
                  )}
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
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
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => setShowAvatarOptions(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showAvatarOptions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Choose Avatar
                      </h3>
                      <button
                        onClick={() => setShowAvatarOptions(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {SAMPLE_AVATARS.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setProfileData((prev) => ({ ...prev, avatar }));
                            setShowAvatarOptions(false);
                          }}
                          className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-colors ${
                            profileData.avatar === avatar
                              ? "border-blue-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <button
                        onClick={() => {
                          // In a real app, this would open file picker
                          alert("File upload would be implemented here");
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Upload custom image
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                You can skip this step and add a photo later
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tell us about yourself
              </h2>
              <p className="text-gray-600">
                Write a brief bio that describes who you are and what you write
                about
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

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                What are you interested in?
              </h2>
              <p className="text-gray-600">
                Select at least 3 topics you're passionate about
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profileData.genres.includes(genre)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Selected: {profileData.genres.length} / {GENRES.length}
                {profileData.genres.length < 3 && (
                  <span className="text-orange-600 ml-2">
                    (Select at least 3)
                  </span>
                )}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 4
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 4) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Setting up..." : "Complete Setup"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type InputMessageProps = {
  children: string;
  type: "success" | "error";
};

const InputMessage = ({ children, type }: InputMessageProps) => {
  const isSuccess = type === "success";

  return (
    <div className={`flex items-center gap-1 mt-1`}>
      {isSuccess ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-cancel" />
      )}
      <span
        className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}
      >
        {children}
      </span>
    </div>
  );
};
