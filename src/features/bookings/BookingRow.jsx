import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import Menus from "../../ui/Menus";
import { useCheckout } from "../check-in-out/hooks/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./hooks/useDeleteBooking";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
  totalNoOfBookings,
  noOfResultsPerPage,
}) {
  const navigate = useNavigate();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  function handleNavigateToBookingDetails() {
    navigate(`/bookings/${bookingId}`);
  }

  function handleNavigateToCheckin() {
    navigate(`/checkin/${bookingId}`);
  }

  function handleDeleteBooking() {
    deleteBooking(bookingId, {
      onSuccess: function () {
        const currTotalNoOfBookings = totalNoOfBookings - 1;
        const currentPageNumber = searchParams.get("page")
          ? Number(searchParams.get("page"))
          : undefined;
        if (
          currentPageNumber !== undefined &&
          currentPageNumber > 1 &&
          (currentPageNumber - 1) * noOfResultsPerPage >= currTotalNoOfBookings
        ) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("page", currentPageNumber - 1);
          setSearchParams(newSearchParams);
        }
      },
    });
  }

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Menus.Menu>
        <Menus.Toggle id={bookingId} />

        <Modal>
          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={handleNavigateToBookingDetails}
            >
              See details
            </Menus.Button>

            {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={handleNavigateToCheckin}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked-in" && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                disabled={isCheckingOut}
                onClick={() => checkout(bookingId)}
              >
                Check out
              </Menus.Button>
            )}

            <Modal.Open
              opens="delete-booking"
              render={(openConfirmModal) => (
                <Menus.Button icon={<HiTrash />} onClick={openConfirmModal}>
                  Delete booking
                </Menus.Button>
              )}
            />
          </Menus.List>

          <Modal.Window
            name="delete-booking"
            render={(onClose) => (
              <ConfirmDelete
                onClose={onClose}
                resourceName={`booking #${bookingId}`}
                onConfirm={handleDeleteBooking}
                disabled={isDeletingBooking}
              />
            )}
          />
        </Modal>
      </Menus.Menu>
    </Table.Row>
  );
}

export default BookingRow;
