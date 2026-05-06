import { createContext, useContext } from "react";
import { DARK } from "./theme";

export const ThemeCtx = createContext(DARK);
export const useTheme = () => useContext(ThemeCtx);
