import { useMutation } from "@tanstack/react-query";
import { sendOtpToEmailApi } from "../services/authService";

export default function useSendOtp() {
  const {
    mutate: sendOtp,
    data,
    isPending: isSendingOtp,
  } = useMutation({
    mutationFn: (email: string) => sendOtpToEmailApi(email),
    onSuccess: () => {
      // Handle success, e.g., show a success message or redirect
      console.log("OTP sent successfully");
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
      console.error("Error sending OTP:", error);
    },
  });

  return{
    sendOtp,
    data,
    isSendingOtp
  }
}
