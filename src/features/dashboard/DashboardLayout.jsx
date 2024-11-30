import styled from "styled-components";
import { useRecentBookings } from "./hooks/useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./hooks/useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../cabins/hooks/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isFetchingBookings } = useRecentBookings();
  const { confirmedStays, isFetchingStays, numDays } = useRecentStays();
  const { cabins, isFetching: isFetchingCabins } = useCabins();

  if (isFetchingBookings || isFetchingStays || isFetchingCabins)
    return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;