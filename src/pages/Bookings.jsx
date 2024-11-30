import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import Column from "../ui/Column";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Bookings() {
  return (
    <>
      <Row>
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>
      <Column>
        <BookingTable />
      </Column>
    </>
  );
}

export default Bookings;
