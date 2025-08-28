import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useOnboardingContext } from "../../contexts/OnboardingContext";
import { InputMessage } from "../../pages/Onboarding";
import { useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";

function BiodataStep() {
  const {
    profileData,
    setProfileData,
    errors,
    usernameStatus,
    handleInputChange,
    setShowConfirmPassword,
    checkUsernameAvailability,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    getStrengthColor,
    getStrengthText,
    passwordStrength,
  } = useOnboardingContext();

  const debouncedUsername = useDebounce(profileData.username, 1000);

  useEffect(() => {
    if (debouncedUsername.length > 2 && debouncedUsername.trim()) {
      checkUsernameAvailability(debouncedUsername);
    }
  }, [debouncedUsername]);

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
              onChange={(e) => handleInputChange("fullname", e.target.value)}
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
            onChange={(e) => {
              setProfileData((prev) => ({
                ...prev,
                username: e.target.value.toLowerCase(),
              }));
              // setDebouncedUsername(e.target.value.toLowerCase());
            }}
            maxLength={15}
            onKeyUp={() => {
              if (profileData.username.trim()) {
                checkUsernameAvailability(profileData.username);
              }
            }}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
              profileData.username && usernameStatus === "taken"
                ? " ring-2 ring-cancel"
                : "focus:ring-2 focus:ring-secondary-light focus:border-transparent"
            }`}
            placeholder="johndoe123"
          />
        </div>
        {profileData.username &&
          (usernameStatus === "taken" ? (
            <InputMessage type="error">Username is already taken</InputMessage>
          ) : (
            <InputMessage type="success">Username is available</InputMessage>
          ))}
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
              onChange={(e) => handleInputChange("password", e.target.value)}
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
                  {getStrengthText(passwordStrength(profileData.password))}
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
                errors.confirmPassword ? "border-red-300" : "border-gray-300"
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
}

export default BiodataStep;
