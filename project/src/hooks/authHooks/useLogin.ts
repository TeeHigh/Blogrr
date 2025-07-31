import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authService";
import { LoginInput, LoginResponse } from "../../types/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const useLogin = () => {
  const navigate = useNavigate();
  const {setIsAuthenticated} = useAuth();

  const {
    mutateAsync: login,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useMutation<LoginResponse, AxiosError, LoginInput>({
    mutationFn: async ({ email, password }) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      return await toast.promise(loginApi(email, password), {
        loading: "Signing in...",
        success: "Signed in successfully!",
        error: "Sign in failed!",
      });
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setIsAuthenticated(true);
      
      console.log(data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return { login, isPending, isSuccess, isError, error, data };
};

export default useLogin;
