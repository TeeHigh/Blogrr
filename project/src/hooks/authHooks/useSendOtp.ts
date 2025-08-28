import { useMutation } from "@tanstack/react-query";
import { sendOtpToEmailApi } from "../../services/authService";
import toast from "react-hot-toast";

export default function useSendOtp() {
  const {
    mutate: sendOtp,
    data,
    isPending: isSendingOtp,
  } = useMutation({
    mutationFn: (email: string) => {
      const toastId = toast.loading("Sending OTP...");
      return sendOtpToEmailApi(email).finally(() => {
        toast.dismiss(toastId);
      });
    },
    onSuccess: () => {
      toast.success("OTP sent!");
      console.log("OTP sent successfully");
    },
    onError: (error) => {
      toast.error("Failed to send OTP");
      console.error("Error sending OTP:", error);
    },
  });

  return {
    sendOtp,
    data,
    isSendingOtp,
  };
}

