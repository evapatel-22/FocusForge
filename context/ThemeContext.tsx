import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { darkTheme, lightTheme } from "../constants/theme";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: typeof lightTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  const toggleTheme = useCallback(
    () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    []
  );

  return (
    <ThemeContext.Provider
      value={{ theme, mode, toggleTheme, setThemeMode: setMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within ThemeProvider"
    );
  }
  return context;
}
