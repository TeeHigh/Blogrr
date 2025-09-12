import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authService";
import { LoginInput, LoginResponse } from "../../types/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/dashboard";
  
  const {setIsAuthenticated, isAuthenticated, setUser} = useAuth();

  const {
    mutateAsync: login,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useMutation<LoginResponse, AxiosError, LoginInput>({
    mutationFn: async ({ email, password }) => {
      return await toast.promise(loginApi(email, password), {
        loading: "Signing in...",
        success: "Signed in successfully!",
        error: "Sign in failed!",
      });
    },
    onSuccess: (data) => {
      setIsAuthenticated(true)
      setUser(data.user);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return { login, isPending, isSuccess, isError, error, data };
};

export default useLogin;
