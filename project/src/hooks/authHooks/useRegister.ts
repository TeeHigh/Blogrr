import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../../services/authService";
import { RegisterFormData, RegisterResponse } from "../../types/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useRegister = () => {

  const {
  mutateAsync: registerUser,
  isPending,
  isSuccess,
  isError,
  error,
  data,
} = useMutation<RegisterResponse, AxiosError, RegisterFormData>({
  mutationFn: async (formData) => await toast.promise(registerApi(formData),{
    loading: 'Signing up...',
    success: "Sign up successful!",
    error: "Sign up failed!"
  }),
  onSuccess: (data) => {
    console.log(data);
    // setUser(data.user);
    // setIsAuthenticated(true);
    // setOnboardingComplete(!!data.user.fullname && emailVerified);
    window.location.href = "/dashboard";
  },
  onError: (err) =>{
    console.error(err.message);
    // window.location.href = "/register";
  }
});

  return { registerUser, isPending, isSuccess, isError, error, data };
};

export default useRegister;
