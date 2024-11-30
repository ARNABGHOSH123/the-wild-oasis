import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClickOrEscRef } from "../hooks/useOutsideClickOrEscRef";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext({
  openWindowName: "",
  openWindowFn: () => ({}),
  closeWindowFn: () => ({}),
});

function Open({ opens, render }) {
  const { openWindowFn } = useContext(ModalContext);

  function setWindowName() {
    openWindowFn(opens);
  }

  return render(setWindowName);
}

function Window({ name, render }) {
  const { openWindowName, closeWindowFn } = useContext(ModalContext);
  const modalRef = useOutsideClickOrEscRef({ onClickOutside: closeWindowFn });

  if (name !== openWindowName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={modalRef}>
        <Button onClick={closeWindowFn}>
          <HiXMark />
        </Button>
        <div>{render(closeWindowFn)}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

function Modal({ children }) {
  const [openWindowName, setOpenWindowName] = useState("");

  function openWindowFn(windowName) {
    setOpenWindowName(windowName);
  }

  function closeWindowFn() {
    setOpenWindowName("");
  }

  return (
    <ModalContext.Provider
      value={{ openWindowName, openWindowFn, closeWindowFn }}
    >
      {children}
    </ModalContext.Provider>
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
