import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginUser as loginUserApi } from "../../../services/apiAuth";

export function useLogin() {
  const queryClient = useQueryClient();
  const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }) => loginUserApi(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data?.user);
      toast.success("Signed in successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  return { loginUser, isLoggingIn };
}
