import { useMutation } from "@tanstack/react-query";
import { deleteAccountApi } from "../../services/accountService";
import toast from "react-hot-toast";

const useDeleteAccount = () => {
  const {mutate: deleteAccount} = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      toast.success("Account deleted successfully");
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Failed to delete account:", error);
    }
  })
  return { deleteAccount };
}

export default useDeleteAccount;