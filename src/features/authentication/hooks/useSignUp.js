import { useMutation } from "@tanstack/react-query";
import { signUpUser as signUpUserApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignUp() {
  const { mutate: signUpUser, isPending: isSigningUp } = useMutation({
    mutationFn: signUpUserApi,
    onSuccess: () => {
      toast.success(
        `Account successfully created! Please verify the account from the user's email address.`
      );
    },
    onError: (err) => toast.error(err.message),
  });

  return { signUpUser, isSigningUp };
}
