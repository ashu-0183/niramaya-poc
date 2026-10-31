import { createContext, useContext, useEffect, useState } from "react";
import en from "./en";
import hi from "./hi";
import mr from "./mr";

export const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हिं" },
  { code: "mr", label: "मराठी", short: "मरा" },
];

const DICTS = { en, hi, mr };
const STORAGE_KEY = "niramaya-lang";
const LangContext = createContext({ lang: "en", setLang: () => {}, t: en });

const initialLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return DICTS[saved] ? saved : "en";
  } catch {
    return "en";
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
export { en };
