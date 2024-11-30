import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings as getBookingsApi } from "../../../services/apiBookings";
import { DEFAULT_PAGE_SIZE } from "../../../utils/constants";

export function useBookings({ noOfResultsPerPage = DEFAULT_PAGE_SIZE }) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("status");
  const sortByValue = searchParams.get("sortBy");
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const [sortByValueField, sortByValueType] = sortByValue?.split?.("-") || [];

  // apply filters
  const filters =
    !filterValue || filterValue === "all"
      ? []
      : [
          {
            filterName: "status",
            filterValue,
          },
        ];

  // apply sorting
  const sortBy = {
    field: sortByValueField,
    ascending: sortByValueType === "asc",
  };

  // apply pagination
  const pageParams = {
    currentPage,
    noOfResultsPerPage,
  };

  // fetching with sorting, filtering and pagination
  const {
    isFetching,
    error,
    data: { data: bookings, count } = {},
  } = useQuery({
    queryKey: ["bookings", filters, sortBy, pageParams],
    queryFn: () =>
      getBookingsApi({
        filters,
        sortBy,
        pageParams,
      }),
  });

  const noOfPages = Math.ceil(count / noOfResultsPerPage);

  // Prefetch next page if available
  if (currentPage < noOfPages) {
    queryClient.prefetchQuery({
      queryKey: [
        "bookings",
        filters,
        sortBy,
        { ...pageParams, currentPage: currentPage + 1 },
      ],
      queryFn: getBookingsApi({
        filters,
        sortBy,
        pageParams: { ...pageParams, currentPage: currentPage + 1 },
      }),
    });
  }

  // Prefetch previous page if available
  if (currentPage > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        "bookings",
        filters,
        sortBy,
        { ...pageParams, currentPage: currentPage - 1 },
      ],
      queryFn: getBookingsApi({
        filters,
        sortBy,
        pageParams: { ...pageParams, currentPage: currentPage - 1 },
      }),
    });
  }

  return { isFetching, error, bookings, count };
}
