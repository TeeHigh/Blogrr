import toast from "react-hot-toast";
import { logoutApi } from "../../services/authService";
import { useMutation } from "@tanstack/react-query";

export default function useLogout() {
  const { 
    mutateAsync: logout,
    data
  } = useMutation({
    mutationFn: async () => {
      return await toast.promise(logoutApi, {
        loading: "Logging out...",
        success: "Logged out successfully!",
        error: "Logout failed!",
      });
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  return { logout, data };
};