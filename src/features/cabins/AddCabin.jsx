import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";

export default function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Open
          opens="cabin-form"
          render={(onClick) => <Button onClick={onClick}>Add new cabin</Button>}
        />
        <Modal.Window
          name="cabin-form"
          render={(onClose) => <CreateCabinForm onCloseModal={onClose} />}
        />
      </Modal>
    </div>
  );
}
