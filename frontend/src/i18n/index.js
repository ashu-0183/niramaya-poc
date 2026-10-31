import { createContext, useContext, useEffect, useState } from "react";
import { useSite } from "@/content/SiteProvider";

export const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हिं" },
  { code: "mr", label: "मराठी", short: "मरा" },
];

const CODES = LANGS.map((l) => l.code);
const STORAGE_KEY = "niramaya-lang";
const LangContext = createContext(null);

const initialLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return CODES.includes(saved) ? saved : "en";
  } catch {
    return "en";
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(initialLang);
  const { text } = useSite();

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: text[lang] ?? text.en }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
