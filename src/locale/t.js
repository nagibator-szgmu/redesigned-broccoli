import ru from "./ru";
import en from "./en";

const translations = { ru, en };

/**
 * Get a nested translation value by dot-separated key path.
 * Supports {param} interpolation.
 * @param {string} locale
 * @param {string} key - dot-separated path e.g. "grades.excellent"
 * @param {Object} [params] - interpolation params
 * @returns {string}
 */
export function t(locale, key, params) {
  const dict = translations[locale] || translations.ru;
  const parts = key.split(".");
  let val = dict;
  for (const p of parts) {
    if (val == null) return key;
    val = val[p];
  }
  if (val === undefined || val === null) return key;
  if (typeof val === "object") return val;
  if (typeof val !== "string") return String(val);
  if (!params) return val;
  return val.replace(/\{(\w+)\}/g, (_, k) => (k in params ? params[k] : `{${k}}`));
}

export const AVAILABLE_LOCALES = Object.keys(translations);
