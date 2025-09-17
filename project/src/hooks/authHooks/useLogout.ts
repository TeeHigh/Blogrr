import toast from "react-hot-toast";
import { logoutApi } from "../../services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLogout() {

  const queryClient = useQueryClient();
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
      queryClient.clear();
      window.location.href = "/";
    },
  });

  return { logout, data };
};