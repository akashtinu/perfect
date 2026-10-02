import React, { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("jbn_dark") === "true";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("jbn_dark", dark);
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used inside DarkModeProvider");
  return ctx;
}
