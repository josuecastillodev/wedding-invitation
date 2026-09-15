import type { Lang } from "./translations";

const LOCALE_BY_LANG: Record<Lang, string> = {
  es: "es-MX",
  en: "en-US",
};

/** Formatea la fecha ISO del evento (EVENT_CONFIG.eventDate) como texto
 * legible en el idioma dado. Ej: "2027-05-15" + "es" -> "15 de mayo de 2027". */
export function formatEventDate(isoDate: string, lang: Lang): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(LOCALE_BY_LANG[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
