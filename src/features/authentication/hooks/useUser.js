import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../../services/apiAuth";

export function useUser() {
  const {
    isLoading: isFetchingUser,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return {
    isFetchingUser,
    user,
    error,
    isAuthenticated: user?.role === "authenticated",
  };
}
