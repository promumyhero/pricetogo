"use client";

import * as React from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  // Apply theme to DOM
  const applyTheme = React.useCallback((newTheme: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }
  }, []);

  // Initialize on client mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        if (storedTheme === "light" || storedTheme === "dark") {
          setThemeState(storedTheme);
          applyTheme(storedTheme);
        } else {
          // Fallback to initial DOM state or defaultTheme
          const isDark = document.documentElement.classList.contains("dark");
          const initialTheme: Theme = isDark ? "dark" : defaultTheme;
          setThemeState(initialTheme);
          applyTheme(initialTheme);
        }
      } catch {
        applyTheme(defaultTheme);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [applyTheme, defaultTheme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyTheme(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {
        console.warn("Failed to persist theme in localStorage:", e);
      }
    },
    [applyTheme]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Return a graceful fallback if outside provider
    return {
      theme: "dark" as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
