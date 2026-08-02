import { useCallback } from "react";
import { useLocale } from "./LocaleContext";
import { t as _t } from "./t";

/**
 * Hook that returns a bound translation function.
 * Usage: const { t } = useTranslate();
 *        <span>{t("grades.excellent")}</span>
 *        <span>{t("notifications.sessionResult", { name, score })}</span>
 */
export function useTranslate() {
  const { locale } = useLocale();
  const t = useCallback((key, params) => _t(locale, key, params), [locale]);
  return { t, locale };
}
