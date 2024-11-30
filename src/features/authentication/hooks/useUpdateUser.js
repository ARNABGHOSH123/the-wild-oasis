import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "../../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: (data) => {
      toast.success(
        `User details for ${data.user.user_metadata.fullName} has been updated successfully`
      );
      queryClient.setQueryData(["user"], data?.user);
      queryClient.invalidateQueries([{ queryKey: ["user"] }]);
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdatingUser, updateUser };
}
