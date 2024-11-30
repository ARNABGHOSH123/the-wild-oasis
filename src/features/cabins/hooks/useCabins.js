import { useQuery } from "@tanstack/react-query";
import { getCabins as getCabinsApi } from "../../../services/apiCabins";

export function useCabins() {
  const { isFetching, data: cabins } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabinsApi,
  });
  return { isFetching, cabins };
}
