import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { checkEmailAvailabilityAPi } from "../services/authService";
import { useNavigate } from "react-router-dom";
import useSendOtp from "./useSendOtp";

export default function useCheckEmailAvailability() {
  const { setUser, setEmailAvailable, setEmailToVerify } = useAuth();
  const {sendOtp} = useSendOtp();
  const navigate = useNavigate();

  const {mutate: checkEmailAvailability, isPending, data} = useMutation({
    mutationFn: (email: string) => checkEmailAvailabilityAPi(email),
    onSuccess: (data) => {
      if (data.isAvailable) {
        setEmailAvailable(true);
        setEmailToVerify(data.email);
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            email: data.email,
          };
        });
        sendOtp(data.email);
        navigate("/verify-email");
      } else {
        navigate("/login");
        console.log("Email is already taken");
        setEmailAvailable(false);
      }
    },
    onError: (error) => {
      console.error("Error checking email availability:", error);
      setEmailAvailable(false);
    },
  });

  return{
    checkEmailAvailability,
    isPending,
    data
  };
}
