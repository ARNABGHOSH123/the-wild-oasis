import { useEffect, useRef } from "react";

export function useOutsideClickOrEscRef({ onClickOutside, capture = true }) {
  const ref = useRef();
  useEffect(
    function () {
      const outsideClickorEsc = (e) => {
        if (
          ref.current &&
          !ref.current.contains(e.target) &&
          ((e.code && e.code.toLowerCase() === "escape") || !e.code)
        ) {
          onClickOutside?.();
        }
      };
      document.addEventListener("click", outsideClickorEsc, { capture });
      document.addEventListener("keydown", outsideClickorEsc, {
        capture,
      });
      return function () {
        document.removeEventListener("click", outsideClickorEsc, {
          capture,
        });
        document.removeEventListener("keydown", outsideClickorEsc, {
          capture,
        });
      };
    },
    [onClickOutside, capture]
  );

  return ref;
}
