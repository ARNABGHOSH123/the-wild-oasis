import { useEffect, useState } from "react";
import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/hooks/useBooking";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./hooks/useCheckIn";
import { useSettings } from "../settings/hooks/useSettings";
import Empty from "../../ui/Empty";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { checkin, isCheckingIn } = useCheckin();
  const moveBack = useMoveBack();

  const { isFetching: isFetchingBooking, booking } = useBooking();
  const { settings, isFetching: isFetchingSettings } = useSettings();

  useEffect(
    function () {
      setConfirmPaid(Boolean(booking?.isPaid));
      setAddBreakfast(Boolean(booking?.hasBreakfast));
    },
    [booking]
  );

  if (isFetchingBooking || isFetchingSettings) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
    status,
  } = booking;

  const optionalBreakfastPrice =
    numGuests * numNights * settings?.breakfastPrice;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          totalPrice: totalPrice + optionalBreakfastPrice,
          extrasPrice: optionalBreakfastPrice,
        },
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }
  }

  function handleConfirmPaid() {
    setConfirmPaid((prev) => !prev);
  }

  function handleAddBreakfast() {
    setAddBreakfast((prev) => !prev);
    setConfirmPaid(false);
  }

  return (
    <>
      <Row>
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={handleAddBreakfast}
            disabled={isCheckingIn}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)} ?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={handleConfirmPaid}
          disabled={isCheckingIn}
          id="confirm"
        >
          I confirm that {guests.fullName} has paid the total amount of{" "}
          {addBreakfast
            ? `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`
            : formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            onClick={handleCheckin}
            disabled={!confirmPaid || isCheckingIn}
          >
            Check in booking #{bookingId}
          </Button>
        )}
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
