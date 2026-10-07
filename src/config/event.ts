// Configuración del evento - cambiar estos valores para reciclar la invitación

export interface Hotel {
  /** Identificador usado para buscar su copy traducido en src/i18n/translations.ts */
  id: string;
  /** Nombre del hotel, en serif mayúsculas */
  name: string;
  /** Segunda línea en script (zona, sucursal) */
  subtitle: string;
  /** Ruta de la imagen relativa a public/, sin baseUrl */
  image: string;
  /** URL de reserva (puede ser un enlace de WhatsApp) */
  bookingUrl: string;
}

export const EVENT_CONFIG = {
  // ID del formulario de Tally para confirmación de asistencia
  tallyFormId: "zxa1Kk",

  // Nombres de los novios
  groomName: "Alfredo",
  brideName: "Estefania",

  // Padres de los novios (una línea por nombre; si alguna empieza con "&"
  // se muestra escalonada, como en el diseño)
  parents: {
    bride: ["Berenice Landázuri", "& J Jesús Monroy"],
    groom: ["Esmeralda Vega García", "Alfredo Nuñez Bermejo"],
  },

  // Fecha del evento (ISO). Se usa para el contador y para formatear la
  // fecha mostrada en pantalla según el idioma (ver src/i18n/date.ts)
  eventDate: "2027-01-16",

  // Base URL del sitio
  baseUrl: "/estefannia-y-alfredo",


  // Lugar de la celebración
  venue: {
    name: "Rancho Santa María",
    city: "Hidalgo, Jalisco, México.",
    // TODO: reemplazar por el link real de Google Maps de Rancho Santa María
    mapUrl: "https://share.google/SIvi823y7KdDOu6Ue",
    image: "/images/venue.jpg",
  },

  // Regalo en efectivo / mesa de regalos (el copy vive en src/i18n/translations.ts)
  gift: {
    ctaUrl: "https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiREFOSUVMIiwiYWN0aW9uIjoicGF5bWVudCIsInRva2VuIjoiNDE1NDI0MzU0NCJ9",
  },

  // Datos bancarios
  bank: {
    bank: "BBVA",
    beneficiary: "Alfredo Nuñez Vega",
    account: "047 949 6076",
    clabe: "012 383 0047 9496 0769",
  },

  // Código de vestimenta
  dressCode: {
    code: "Formal",
  },

  // Hoteles recomendados (nombre/imagen/link no cambian por idioma; su
  // descripción vive en src/i18n/translations.ts, buscada por `id`)
  hotels: [
    {
      id: "hotel-ng",
      name: "Hotel NG",
      subtitle: "Ameca",
      image: "/images/hotel-ng.jpg", // TODO: agregar ilustración
      bookingUrl: "https://wa.me/523310631395",
    },
    {
      id: "hard-rock",
      name: "Hard Rock",
      subtitle: "Guadalajara",
      image: "/images/hard-rock.jpg",
      bookingUrl: "https://wa.me/523310631395",
    },
    {
      id: "hyatt-andares",
      name: "Hyatt Regency Andares",
      subtitle: "Guadalajara",
      image: "/images/hyatt-andares.jpg", // TODO: agregar ilustración
      bookingUrl: "https://wa.me/523310631395",
    },
  ] as Hotel[],
};

export type EventConfig = typeof EVENT_CONFIG;
