import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./hooks/useDeleteCabin";
import { useCreateCabin } from "./hooks/useCreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const {
    id: cabinId,
    image,
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
  } = cabin;
  const { isDeleting, deleteCabin } = useDeleteCabin();

  const { createCabin, isCreatingCabin } = useCreateCabin();

  function handleDeleteCabin() {
    deleteCabin(cabin);
  }

  function handleDuplicateCabin() {
    createCabin({
      name: `Copy of ${name}`,
      image,
      maxCapacity,
      regularPrice,
      discount,
      description,
    });
  }

  return (
    <Table.Row>
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId} />
            <Menus.List id={cabinId}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                disabled={isCreatingCabin}
                onClick={handleDuplicateCabin}
              >
                Duplicate
              </Menus.Button>

              <Modal.Open
                opens="edit-cabin"
                render={(onClick) => (
                  <Menus.Button icon={<HiPencil />} onClick={onClick}>
                    Edit
                  </Menus.Button>
                )}
              />

              <Modal.Open
                opens="delete-cabin"
                render={(onClick) => (
                  <Menus.Button
                    icon={<HiTrash />}
                    disabled={isDeleting}
                    onClick={onClick}
                  >
                    Delete
                  </Menus.Button>
                )}
              />
            </Menus.List>
          </Menus.Menu>

          <Modal.Window
            name="edit-cabin"
            render={(onClose) => (
              <CreateCabinForm cabinToEdit={cabin} onCloseModal={onClose} />
            )}
          />
          <Modal.Window
            name="delete-cabin"
            render={(onClose) => (
              <ConfirmDelete
                onConfirm={handleDeleteCabin}
                disabled={isDeleting}
                resourceName={`Cabin ${name}`}
                onClose={onClose}
              />
            )}
          />
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
