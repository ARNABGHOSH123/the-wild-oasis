import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Column from "../ui/Column";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";
import CabinTableOperations from "../features/cabins/CabinTableOperations";

function Cabins() {
  return (
    <>
      <Row>
        <Heading as="h1">All cabins</Heading>
        <CabinTableOperations />
      </Row>
      <Column>
        <CabinTable />
        <AddCabin />
      </Column>
    </>
  );
}

export default Cabins;
