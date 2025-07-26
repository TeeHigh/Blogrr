import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { LoginInput, LoginResponse } from "../../types/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useLogin = () => {
  const {
    setUser,
    setIsAuthenticated,
    setEmailVerified,
    setOnboardingComplete,
  } = useAuth();
  const navigate = useNavigate();

  const {
    mutateAsync: login,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useMutation<LoginResponse, AxiosError, LoginInput>({
    mutationFn: async ({ email, password }) => {
      // Wrap the login API call in toast.promise
      return await toast.promise(
        loginApi(email, password),
        {
          loading: "Signing in...",
          success: "Signed in successfully!",
          error: "Sign in failed!",
        }
      );
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return { login, isPending, isSuccess, isError, error, data };
};

export default useLogin;
