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
  /** URL de reserva */
  bookingUrl: string;
}

export const EVENT_CONFIG = {
  // ID del formulario de Tally para confirmación de asistencia
  tallyFormId: "A7vQ80",

  // Nombres de los novios
  groomName: "Luis",
  brideName: "Yareli",

  // Fecha del evento (ISO, para el contador)
  eventDate: "2026-04-10",

  // Fecha en texto, como se muestra en pantalla
  displayDate: "10 de abril de 2026",

  // Base URL del sitio
  baseUrl: "/yareli-y-luis",

  // Párrafo de historia previo al venue
  story: {
    lead: "Una historia de amor",
    highlight: "que comenzó en México.",
    tail: "Hoy, regresamos para celebrarla.",
  },

  // Lugar de la celebración
  venue: {
    name: "Hacienda Santa Sofía",
    city: "Ameca, Jalisco, México.",
    ceremonyLabel: "Ceremonia en capilla",
    ceremonyTime: "5:00 PM",
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
    body: "Para que solo se preocupen por disfrutar, nuestros wedding planners ponen a su disposición un servicio de Concierge.",
    detail: "Te ayudará a organizar todo tu viaje con recomendaciones y gestión de reservas. Estará al tanto de ti durante la planeación, a tu llegada y hasta tu regreso a casa.",
    ctaLabel: "Hoteles recomendados",
    ctaUrl: "#hospedaje",
  },

  // Hoteles recomendados
  hotels: [
    {
      name: "Holiday Inn Express",
      subtitle: "Guadalajara Vallarta Poniente",
      image: "/images/hospedaje.jpg",
      description:
        "Una opción práctica y cómoda para disfrutar Guadalajara, con desayuno incluido y una ubicación conveniente al poniente de la ciudad.",
      bookingUrl:
        "https://www.ihg.com/holidayinnexpress/hotels/us/en/guadalajara/gdlqp/hoteldetail?cm_mmc=GoogleMaps-_-EX-_-MX-_-GDLQP",
    },
    {
      name: "Hotel NG",
      subtitle: "Ameca",
      image: "/images/hospedaje02.jpg",
      description:
        "La opción más cercana al lugar de la celebración, ideal si prefieres quedarte en Ameca la noche del evento.",
      bookingUrl: "https://hotelngameca.com/",
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
