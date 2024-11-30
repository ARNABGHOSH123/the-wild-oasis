import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin as createEditCabinApi } from "../../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isPending: isEditingCabin } = useMutation({
    mutationFn: ({ cabinData, id, currentImageUrl }) =>
      createEditCabinApi(cabinData, id, currentImageUrl),
    onSuccess: function () {
      toast.success("Cabin edited successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editCabin, isEditingCabin };
}
