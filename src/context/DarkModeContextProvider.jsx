import { DarkModeContext } from "./DarkModeContext";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

function DarkModeContextProvider({ children }) {
  const [isDarkMode, setDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "darkMode"
  );
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export default DarkModeContextProvider;
