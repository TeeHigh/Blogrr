import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { verifyEmailOtpApi } from "../../services/authService";

export default function useVerifyOtp() {
  const {
    setEmailVerified,
  } = useAuth();
  const navigate = useNavigate();

  const {
    mutateAsync: verifyOtp,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (otpData: { email: string; otp: string }) =>
      verifyEmailOtpApi(otpData),

    onSuccess: () => {
      setEmailVerified(true);
      navigate("/onboarding");
    },

    onError: (error) => {
      console.error("Error verifying OTP:", error);
    },
  });

  return { verifyOtp, isPending, isSuccess, isError, error };
}
