// import { useSearchParams } from "react-router-dom";
import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useBookings } from "./hooks/useBookings";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";

const BOOKINGS_PAGE_SIZE = 5;

function BookingTable() {
  const { isFetching, bookings, count } = useBookings({
    noOfResultsPerPage: BOOKINGS_PAGE_SIZE,
  });
  // const [searchParams] = useSearchParams();
  // const filterValue = searchParams.get("status");
  // const sortByValue = searchParams.get("sortBy");
  // const filteredBookings = useMemo(
  //   function () {
  //     if (isFetching) return [];

  //     let filteredBookings = [];

  //     if (filterValue === "all" || !filterValue) {
  //       filteredBookings = bookings;
  //     } else {
  //       filteredBookings = bookings.filter(
  //         (booking) => booking.status === filterValue
  //       );
  //     }

  //     if (sortByValue && filteredBookings.length > 0) {
  //       const [sortByValueField, sortByValueType] = sortByValue.split("-");

  //       typeof filteredBookings[0][sortByValueField] === "number"
  //         ? filteredBookings.sort((a, b) =>
  //             sortByValueType === "asc"
  //               ? a[sortByValueField] - b[sortByValueField]
  //               : b[sortByValueField] - a[sortByValueField]
  //           )
  //         : filteredBookings.sort((a, b) =>
  //             sortByValueType === "asc"
  //               ? differenceInDays(
  //                   new Date(a[sortByValueField]),
  //                   new Date(b[sortByValueField])
  //                 )
  //               : differenceInDays(
  //                   new Date(b[sortByValueField]),
  //                   new Date(a[sortByValueField])
  //                 )
  //           );
  //     }
  //     return filteredBookings;
  //   },
  //   [bookings, filterValue, isFetching, sortByValue]
  // );

  if (isFetching) return <Spinner />;

  if (!bookings.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              totalNoOfBookings={count}
              noOfResultsPerPage={BOOKINGS_PAGE_SIZE}
            />
          )}
        />

        <Table.Footer>
          <Pagination
            totalNoOfResults={count}
            noOfResultsPerPage={BOOKINGS_PAGE_SIZE}
          />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;