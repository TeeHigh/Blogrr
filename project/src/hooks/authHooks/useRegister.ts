import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { RegisterFormData, RegisterResponse } from "../../types/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useRegister = () => {
  const {
    emailVerified,
    setUser,
    setIsAuthenticated,
    setOnboardingComplete,
  } = useAuth();
  const navigate = useNavigate();

  const {
  mutateAsync: registerUser,
  isPending,
  isSuccess,
  isError,
  error,
  data,
} = useMutation<RegisterResponse, AxiosError, RegisterFormData>({
  mutationFn: async (formData) => await toast.promise(registerApi(formData),{
    loading: 'Siging up...',
    success: "Sign up successful!",
    error: "Sign up failed!"
  }),
  onSuccess: (data) => {
    console.log(data);
    setUser(data.user);
    setIsAuthenticated(true);
    setOnboardingComplete(!!data.user.fullname && emailVerified);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/dashboard");
  },
  onError: (err) =>{
    console.error(err.message);
    // navigate("/register")
  }
});

  return { registerUser, isPending, isSuccess, isError, error, data };
};

export default useRegister;
