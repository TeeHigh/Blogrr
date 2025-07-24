import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { LoginInput, LoginResponse } from "../types/types";
import { AxiosError } from "axios";

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
    mutationFn: ({ email, password }) => loginApi(email, password),
    onSuccess: (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    },
  });

  return { login, isPending, isSuccess, isError, error, data };
};

export default useLogin;
