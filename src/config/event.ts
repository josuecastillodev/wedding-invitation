// Configuración del evento - cambiar estos valores para reciclar la invitación

export interface Hotel {
  /** Nombre del hotel, en serif mayúsculas */
  name: string;
  /** Segunda línea en script (zona, sucursal) */
  subtitle: string;
  /** Ruta de la imagen relativa a public/, sin baseUrl */
  image: string;
  /** Descripción breve, 1-2 líneas */
  description: string;
  /** Substring exacto de `description` a resaltar en color de acento */
  highlight?: string;
  /** URL de reserva (puede ser un enlace de WhatsApp) */
  bookingUrl: string;
}

export const EVENT_CONFIG = {
  // ID del formulario de Tally para confirmación de asistencia
  tallyFormId: "A7vQ80",

  // Nombres de los novios
  groomName: "Daniel",
  brideName: "Liliana",

  // Fecha del evento (ISO, para el contador)
  eventDate: "2027-05-15",

  // Fecha en texto, como se muestra en pantalla
  displayDate: "15 de mayo de 2027",

  // Base URL del sitio
  baseUrl: "/yareli-y-luis",


  // Lugar de la celebración
  venue: {
    name: "Hacienda La Magdalena",
    city: "Guadalajara, Jalisco, México.",
    ceremonyLabel: "Ceremonia en capilla",
    ceremonyTime: "5:00 PM",
    // TODO: reemplazar por el link real de Google Maps de Hacienda La Magdalena
    mapUrl: "https://maps.app.goo.gl/BYRBWi9MgLoKGs6j7?g_st=ic",
    image: "/images/venue.jpg",
  },

  // Regalo en efectivo / mesa de regalos
  gift: {
    intro: "Su presencia es nuestro mejor regalo.",
    body: "Si desean obsequiarnos, pueden contribuir a nuestro futuro juntos con un regalo en efectivo a través del siguiente enlace.",
    ctaLabel: "Hacer un regalo",
    ctaUrl: "#datos-bancarios",
  },

  // Datos bancarios
  bank: {
    bank: "BBVA",
    beneficiary: "Yareli Nathalie Cárdenas Ayon",
    account: "157 995 9228",
    clabe: "012 180 01579959228 5",
  },

  // Código de vestimenta
  dressCode: {
    code: "Formal",
    note: "Acompáñanos con un look formal y elegante para celebrar juntos nuestra boda.",
  },

  // Servicio de concierge de los wedding planners
  concierge: {
    ctaLabel: "Hoteles recomendados",
    ctaUrl: "#hospedaje",
  },

  // Hoteles recomendados
  hotels: [
    {
      name: "One Guadalajara",
      subtitle: "Periférico Norte",
      image: "/images/one-guadalajara.jpg",
      description:
        "Una opción práctica y cómoda para disfrutar Guadalajara, con desayuno incluido y una ubicación conveniente al norte de la ciudad.",
      highlight: "una ubicación conveniente al norte de la ciudad.",
      bookingUrl: "https://wa.me/523310631395",
    },
  ] as Hotel[],

  // Bloque de cierre con la confirmación de asistencia
  rsvp: {
    headline: "Será una celebración increíble",
    question: "¿Nos acompañas?",
    ctaLabel: "¡Confirma asistencia!",
  },
};

export type EventConfig = typeof EVENT_CONFIG;
