import { Navigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useRegister from "../hooks/authHooks/useRegister";
import { useOnboardingContext } from "../contexts/OnboardingContext";
import BiodataStep from "../components/onboarding/BiodataStep";
import AvatarStep from "../components/onboarding/AvatarStep";
import BioSummaryStep from "../components/onboarding/BioSummaryStep";
import GenreStep from "../components/onboarding/GenreStep";

const { currentStep, profileData, setCurrentStep, handleComplete, loading, errors } =
  useOnboardingContext();

const NO_OF_STEPS = 4;

export default function Onboarding() {
  const { user, emailVerified } = useAuth();
  const { isPending } = useRegister();

  if (!emailVerified) {
    return <Navigate to="/register" replace />;
  }

  if (user?.genres && user?.genres.length > 0) {
    return <Navigate to="/dashboard" replace />;
  }

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


  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          profileData.fullname.trim().length > 1 &&
          profileData.username.trim().length >= 3 &&
          profileData.password.length >= 6 &&
          !errors.length
        );
      case 2:
        return !uploadingAvatar;
      case 3:
        return profileData.bio.trim().length > 0;
      case 4:
        return profileData.genres.length >= 3;
      default:
        return !errors.length;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BiodataStep />
        );
      case 2:
        return (
          <AvatarStep />
        );

      case 3:
        return (
          <BioSummaryStep />
        );

      case 4:
        return (
          <GenreStep />
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
              Step {currentStep} of {NO_OF_STEPS}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 4) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / NO_OF_STEPS) * 100}%` }}
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

            {currentStep < NO_OF_STEPS ? (
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

export const InputMessage = ({ children, type }: InputMessageProps) => {
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
