import { createContext, useContext, useEffect, useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { useOutsideClickOrEscRef } from "../hooks/useOutsideClickOrEscRef";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext({
  openId: "",
  currentMenuListPosition: {},
  handleCloseMenu: () => ({}),
  handleOpenMenu: () => ({}),
});

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [currentMenuListPosition, setCurrentMenuListPosition] = useState({});

  function handleCloseMenu() {
    setOpenId("");
  }

  function handleOpenMenu(id) {
    setOpenId(id);
  }

  return (
    <MenusContext.Provider
      value={{
        openId,
        handleCloseMenu,
        handleOpenMenu,
        currentMenuListPosition,
        setCurrentMenuListPosition,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const {
    openId,
    handleOpenMenu,
    handleCloseMenu,
    setCurrentMenuListPosition,
  } = useContext(MenusContext);

  useEffect(
    function () {
      function handleScroll() {
        if (openId) {
          handleCloseMenu();
          document.removeEventListener("wheel", handleScroll);
        }
      }
      document.addEventListener("wheel", handleScroll);

      return function () {
        document.removeEventListener("wheel", handleScroll);
      };
    },
    [handleCloseMenu, openId]
  );
  function handleToggle(e) {
    e.stopPropagation();
    openId === "" || +openId !== +id ? handleOpenMenu(id) : handleCloseMenu();
    const listRect = e.target.closest("button").getBoundingClientRect();
    setCurrentMenuListPosition({
      x: window.innerWidth - listRect.x - listRect.width,
      y: listRect.y + listRect.height + 8,
    });
  }
  return (
    <StyledToggle onClick={handleToggle}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, currentMenuListPosition, handleCloseMenu } =
    useContext(MenusContext);
  const listRef = useOutsideClickOrEscRef({
    onClickOutside: handleCloseMenu,
    capture: false,
  });

  if (id !== openId) return null;

  return createPortal(
    <StyledList ref={listRef} $position={currentMenuListPosition}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick, shouldCloseMenuOnClick = true }) {
  const { handleCloseMenu } = useContext(MenusContext);

  function handleButtonClick() {
    onClick?.();
    shouldCloseMenuOnClick && handleCloseMenu();
  }

  return (
    <li>
      <StyledButton onClick={handleButtonClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
