import { createContext, useContext, useState, useCallback } from "react";

const LocaleCtx = createContext();

const LOCALES = { ru: "Русский", en: "English" };

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(
    () => localStorage.getItem("ms_locale") || "ru"
  );

  const toggle = useCallback((l) => {
    setLocale(l);
    localStorage.setItem("ms_locale", l);
  }, []);

  return (
    <LocaleCtx.Provider value={{ locale, setLocale: toggle, LOCALES }}>
      {children}
    </LocaleCtx.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleCtx);
}
