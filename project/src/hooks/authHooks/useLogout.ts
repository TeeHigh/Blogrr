import toast from "react-hot-toast";
import { logoutApi } from "../../services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";

export default function useLogout() {
  const {setIsAuthenticated} = useAuth();

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
      setIsAuthenticated(false);
      queryClient.clear();
      window.location.href = "/";
    },
  });

  return { logout, data };
};