import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logoutUser as logoutUserApi } from "../../../services/apiAuth";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logoutUser, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutUserApi,
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  return { logoutUser, isLoggingOut };
}
