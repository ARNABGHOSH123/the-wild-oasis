import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiArrowUpOnSquare, HiTrash } from "react-icons/hi2";

import BookingDataBox from "./BookingDataBox";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import Column from "../../ui/Column";
import { useBooking } from "./hooks/useBooking";
import Spinner from "../../ui/Spinner";
import { useCheckout } from "../check-in-out/hooks/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./hooks/useDeleteBooking";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { isFetching, booking } = useBooking();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();
  const moveBack = useMoveBack();

  if (isFetching) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingId } = booking;
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  function handleNavigateToCheckin() {
    navigate(`/checkin/${bookingId}`);
  }

  function handleCheckout() {
    checkout(bookingId);
  }

  function handleDeleteBooking() {
    deleteBooking(bookingId, {
      onSuccess: () => {
        navigate("/bookings");
      },
    });
  }

  return (
    <>
      <Column>
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>
            {status?.replace?.("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Column>

      <BookingDataBox booking={booking} />
      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button onClick={handleNavigateToCheckin}>Check in</Button>
        )}

        {status === "checked-in" && (
          <Button onClick={handleCheckout} disabled={isCheckingOut}>
            <HiArrowUpOnSquare />
            <span>Check out</span>
          </Button>
        )}

        <Modal>
          <Modal.Open
            opens="delete-booking"
            render={(openConfirmModal) => (
              <Button onClick={openConfirmModal} $variation="danger">
                <HiTrash />
                <span>Delete booking</span>
              </Button>
            )}
          />
          <Modal.Window
            name="delete-booking"
            render={(onClose) => (
              <ConfirmDelete
                resourceName={`booking ${bookingId}`}
                disabled={isDeletingBooking}
                onClose={onClose}
                onConfirm={handleDeleteBooking}
              />
            )}
          />
        </Modal>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
