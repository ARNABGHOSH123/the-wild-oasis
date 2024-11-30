import { useSearchParams } from "react-router-dom";
import Select from "./Select";

export default function SortBy({ options, resetPageWhenFiltered = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortByValue = searchParams.get("sortBy") || "";

  function handleChange(e) {
    const newSearchParams = new URLSearchParams(searchParams);
    const val = e.target.value;
    if (val) {
      newSearchParams.set("sortBy", e.target.value);
    } else {
      newSearchParams.delete("sortBy");
    }
    if (resetPageWhenFiltered && newSearchParams.get("page")) {
      newSearchParams.set("page", 1);
    }
    setSearchParams(newSearchParams);
  }
  return (
    <Select
      title="Filter the results"
      options={options}
      onChange={handleChange}
      type="white"
      value={sortByValue}
    />
  );
}
