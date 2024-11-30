import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBooking, isPending: isDeletingBooking } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} has been deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return { deleteBooking, isDeletingBooking };
}
