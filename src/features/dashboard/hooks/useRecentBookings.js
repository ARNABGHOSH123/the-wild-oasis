import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { subDays } from "date-fns";
import { getBookingsAfterDate } from "../../../services/apiBookings";

export function useRecentBookings() {
  const [searchParams] = useSearchParams();
  const lastValue = searchParams.get("last")
    ? Number(searchParams.get("last"))
    : 7;
  const queryDate = subDays(new Date(), lastValue).toISOString();
  const {
    isFetching: isFetchingBookings,
    error,
    data: bookings,
  } = useQuery({
    queryKey: ["recentBookings", `last-${lastValue}-days`],
    queryFn: () => getBookingsAfterDate(queryDate),
  });

  return { isFetchingBookings, error, bookings };
}
