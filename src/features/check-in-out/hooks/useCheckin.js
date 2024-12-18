import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../../services/apiBookings";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: function (data) {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ predicate: (query) => query.isActive });
      navigate("/"); // naviagte to the dashboard
    },
    onError: (err) => toast.error(err.message),
  });

  return { checkin, isCheckingIn };
}
