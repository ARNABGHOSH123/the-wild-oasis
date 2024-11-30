import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getStaysAfterDate } from "../../../services/apiBookings";

export function useRecentStays() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get("last")
    ? Number(searchParams.get("last"))
    : 7;
  const queryDate = subDays(new Date(), numDays).toISOString();
  const {
    isFetching: isFetchingStays,
    error,
    data: stays,
  } = useQuery({
    queryKey: ["recentStays", `last-${numDays}-days`],
    queryFn: () => getStaysAfterDate(queryDate),
  });

  const confirmedStays = stays?.filter((stay) =>
    ["checked-in", "checked-out"].includes(stay.status)
  );

  return { isFetchingStays, error, stays, confirmedStays, numDays };
}
