import { useQuery } from "@tanstack/react-query";
import { verifyAuthApi } from "../../services/authService";

export default function useVerifyAuth(){
  const {data, isPending: isVerifyingAuth} = useQuery({
    queryKey: ["verify-auth"],
    queryFn: verifyAuthApi,
    retry: 0,
  })

  const isAuthenticated = data && data.isAuthenticated;

  return {
    data,
    isAuthenticated,
    isVerifyingAuth 
  };
}