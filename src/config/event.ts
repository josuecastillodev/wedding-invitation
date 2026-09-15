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
  tallyFormId: "A7vQ80",

  // Nombres de los novios
  groomName: "Daniel",
  brideName: "Liliana",

  // Fecha del evento (ISO). Se usa para el contador y para formatear la
  // fecha mostrada en pantalla según el idioma (ver src/i18n/date.ts)
  eventDate: "2027-05-15",

  // Base URL del sitio
  baseUrl: "/liliana-y-daniel",


  // Lugar de la celebración
  venue: {
    name: "Hacienda La Magdalena",
    city: "Guadalajara, Jalisco, México.",
    // TODO: reemplazar por el link real de Google Maps de Hacienda La Magdalena
    mapUrl: "https://maps.app.goo.gl/BYRBWi9MgLoKGs6j7?g_st=ic",
    image: "/images/venue.jpg",
  },

  // Regalo en efectivo / mesa de regalos (el copy vive en src/i18n/translations.ts)
  gift: {
    ctaUrl: "#datos-bancarios",
  },

  // Datos bancarios
  // bank: {
  //   bank: "BBVA",
  //   beneficiary: "Yareli Nathalie Cárdenas Ayon",
  //   account: "157 995 9228",
  //   clabe: "012 180 01579959228 5",
  // },

  // Código de vestimenta
  dressCode: {
    code: "Formal",
  },

  // Servicio de concierge de los wedding planners (el copy vive en src/i18n/translations.ts)
  concierge: {
    ctaUrl: "#hospedaje",
  },

  // Hoteles recomendados (nombre/imagen/link no cambian por idioma; su
  // descripción vive en src/i18n/translations.ts, buscada por `id`)
  hotels: [
    {
      id: "one-guadalajara",
      name: "One Guadalajara",
      subtitle: "Periférico Norte",
      image: "/images/one-guadalajara.jpg",
      bookingUrl: "https://wa.me/523310631395",
    },
    {
      id: "hard-rock",
      name: "Hard Rock",
      subtitle: "Guadalajara",
      image: "/images/hard-rock.jpg",
      bookingUrl: "https://wa.me/523310631395",
    },
  ] as Hotel[],
};

export type EventConfig = typeof EVENT_CONFIG;
