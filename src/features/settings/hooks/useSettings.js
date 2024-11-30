import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../../services/apiSettings";

export function useSettings() {
  const { isFetching, data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return { isFetching, settings };
}
