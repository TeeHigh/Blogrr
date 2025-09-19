import { useMutation } from "@tanstack/react-query"
import { updateAccountApi } from "../../services/accountService";
import toast from "react-hot-toast";
import { ProfileSettingsFormData, User } from "../../types/types";

const useUpdateAccount = () => {
  const { mutate: updateProfile, isError, isPending, isSuccess } = useMutation({
    mutationFn: (formData: Partial<ProfileSettingsFormData>) => updateAccountApi(formData),
    onSuccess: () => {
      toast.success("Account updated successfully");
    },
    onError: (error) => {
      console.error("Error updating account:", error);
      throw new Error("Error updating account");
    },
  })

  return {
    updateProfile,
    isError,
    isPending,
    isSuccess
  }
}

export default useUpdateAccount;