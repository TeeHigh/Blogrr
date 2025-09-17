import { useQuery } from "@tanstack/react-query";
import { verifyAuthApi } from "../../services/authService";

export default function useVerifyAuth(){
  const { data, isPending: isVerifyingAuth, isError } = useQuery({
  queryKey: ["verify-auth"],
  queryFn: verifyAuthApi,
  retry: 1,
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnReconnect: true,
  refetchOnWindowFocus: false,
  networkMode: "always", // still works offline
});

  const isAuthenticated = data ? data.isAuthenticated : false;

  return {
    data,
    isAuthenticated,
    isVerifyingAuth 
  };
}