import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./hooks/useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

function CabinTable() {
  const { isFetching, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount");
  const sortByValue = searchParams.get("sortBy");
  const filteredCabins = useMemo(
    function () {
      if (isFetching) return [];

      let filteredCabins = cabins;

      if (filterValue === "with-discount") {
        filteredCabins = filteredCabins.filter((cabin) => cabin.discount);
      }
      if (filterValue === "no-discount") {
        filteredCabins = filteredCabins.filter((cabin) => !cabin.discount);
      }

      if (sortByValue && filteredCabins.length > 0) {
        const [sortByValueField, sortByValueType] = sortByValue.split("-");
        typeof filteredCabins[0][sortByValueField] === "number"
          ? filteredCabins.sort((a, b) =>
              sortByValueType === "asc"
                ? a[sortByValueField] - b[sortByValueField]
                : b[sortByValueField] - a[sortByValueField]
            )
          : filteredCabins.sort((a, b) =>
              sortByValueType === "asc"
                ? a[sortByValueField].toLowerCase() -
                  b[sortByValueField].toLowerCase()
                : b[sortByValueField].toLowerCase() -
                  a[sortByValueField].toLowerCase()
            );
      }
      return filteredCabins;
    },
    [cabins, filterValue, isFetching, sortByValue]
  );

  if (isFetching) return <Spinner />;

  if (!cabins.length) return <Empty resourceName="cabins" />;

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 0.2fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={filteredCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
