import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();
  const { mutate: deleteCabin, isPending: isDeleting } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: function () {
      toast.success("Cabin deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteCabin, isDeleting };
}
