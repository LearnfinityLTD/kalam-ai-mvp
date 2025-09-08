"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Locale, defaultLocale } from "./config";
import { translations } from "./translations";

type Primitive = string | number | boolean;
type ValuesMap = Record<string, Primitive>;
type UnknownRecord = Record<string, unknown>;
type TranslationsObject = Record<Locale, UnknownRecord>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: ValuesMap) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Safely walk a nested object and return a string if the leaf is a string.
const getNestedString = (root: unknown, path: string[]): string | undefined => {
  let cur: unknown = root;
  for (const key of path) {
    if (typeof cur !== "object" || cur === null) return undefined;
    cur = (cur as UnknownRecord)[key];
  }
  return typeof cur === "string" ? cur : undefined;
};

// Runtime-safe view over your translations without using `any`
const dictionaries: TranslationsObject =
  translations as unknown as TranslationsObject;

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setCurrentLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred-language");
      return (
        saved === "en" || saved === "ar" ? saved : defaultLocale
      ) as Locale;
    }
    return defaultLocale;
  });

  const setLocale = (newLocale: Locale) => {
    setCurrentLocale(newLocale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("preferred-language", newLocale);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  const t = (key: string, values?: ValuesMap): string => {
    const keys = key.split(".");
    const primary = getNestedString(dictionaries[locale], keys);
    const fallback =
      locale === "en" ? undefined : getNestedString(dictionaries.en, keys);
    const template = primary ?? fallback ?? key;

    if (values) {
      return Object.entries(values).reduce(
        (str, [placeholder, value]) =>
          str.replace(new RegExp(`{{${placeholder}}}`, "g"), String(value)),
        template
      );
    }
    return template;
  };

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t, isRTL: locale === "ar" }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
