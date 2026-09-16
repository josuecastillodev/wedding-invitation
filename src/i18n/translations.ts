// Diccionario de textos traducibles del sitio. EVENT_CONFIG
// (src/config/event.ts) guarda lo que no cambia por idioma (nombres,
// fechas, URLs, imágenes); este archivo guarda todo el copy que sí
// cambia entre español e inglés.

export type Lang = "es" | "en";

/** Fragmento de texto enriquecido: texto plano, un span con clases de
 * Tailwind (acento/cursiva/negritas), o un salto de línea explícito.
 * Se renderiza con el componente RichText (src/components/RichText.astro). */
export interface RichSegment {
  text?: string;
  class?: string;
  br?: boolean;
}

export interface HotelCopy {
  description: string;
  highlight: string;
}

export interface ItineraryItemCopy {
  title: string;
  location: string;
}

export interface Translations {
  meta: {
    titleSuffix: string;
    /** Usa los placeholders {bride} y {groom}. */
    description: string;
  };
  envelope: {
    intro: string;
    script: string;
    prompt: string;
    openAriaLabel: string;
  };
  hero: {
    eyebrow: string;
    countdownLabel: string;
    countdownUnit: string;
  };
  story: {
    segments: RichSegment[];
  };
  venue: {
    eyebrow: string;
    mapButton: string;
  };
  rsvp: {
    headline: string;
    question: string;
    ctaLabel: string;
  };
  gift: {
    heading: string;
    segments: RichSegment[];
    ctaLabel: string;
  };
  dressCode: {
    segments: RichSegment[];
  };
  concierge: {
    subtitle: string;
    paragraph1: RichSegment[];
    paragraph2: RichSegment[];
    ctaLabel: string;
  };
  hospedaje: {
    heading: string;
    bookNow: string;
    hotels: Record<string, HotelCopy>;
  };
  nav: {
    home: string;
    rsvp: string;
    gift: string;
    hospedaje: string;
  };
  itinerary: {
    heading: string;
    mapButton: string;
    items: ItineraryItemCopy[];
  };
  footer: {
    greeting: string;
    introName: string;
    paragraph1: string;
    paragraph2: string;
    contactName: string;
    instagram: string;
    credits: string;
  };
  gallery: {
    alts: string[];
  };
  whatsapp: {
    message: string;
    ariaLabel: string;
  };
}

export const translations: Record<Lang, Translations> = {
  es: {
    meta: {
      titleSuffix: "Nuestra Boda",
      description: "Invitación de boda de {bride} y {groom}",
    },
    envelope: {
      intro: "Querido invitado, se dice que…",
      script: "Nos casamos",
      prompt: "Toca el sobre para abrir",
      openAriaLabel: "Abrir invitación",
    },
    hero: {
      eyebrow: "Nuestra boda",
      countdownLabel: "Faltan",
      countdownUnit: "Días",
    },
    story: {
      segments: [
        { text: "Una historia de amor" },
        { br: true },
        { text: "que comenzó en " },
        { text: "México.", class: "text-accent italic" },
        { br: true },
        { text: "Hoy, regresamos " },
        { text: "para ", class: "text-accent italic" },
        { br: true },
        { text: "celebrarla", class: "text-accent italic" },
      ],
    },
    venue: {
      eyebrow: "Nos casamos en",
      mapButton: "Ver Mapa",
    },
    rsvp: {
      headline: "Será una celebración increíble",
      question: "¿Nos acompañas?",
      ctaLabel: "¡Confirma asistencia!",
    },
    gift: {
      heading: "Mesa de regalos",
      segments: [
        { text: "Su " },
        { text: "presencia", class: "text-accent italic font-bold" },
        { text: " es nuestro mejor " },
        { text: "regalo", class: "text-accent italic font-bold" },
        {
          text: ". Si desean obsequiarnos, pueden contribuir a nuestro futuro juntos con un ",
        },
        { text: "regalo en efectivo", class: "text-accent italic font-bold" },
        { text: " a través del " },
        { text: "siguiente enlace.", class: "text-accent italic font-bold" },
      ],
      ctaLabel: "Hacer un regalo",
    },
    dressCode: {
      segments: [
        { text: "Acompáñanos con un " },
        { text: "look formal y elegante", class: "text-accent" },
        { text: " para celebrar juntos nuestra boda." },
      ],
    },
    concierge: {
      subtitle: "Service",
      paragraph1: [
        { text: "Para que solo se preocupen por disfrutar, nuestros " },
        { text: "wedding planners", class: "text-accent font-bold" },
        { text: " ponen a su disposición un servicio de " },
        { text: "Concierge.", class: "text-accent italic" },
      ],
      paragraph2: [
        { text: "Te ayudará a " },
        {
          text: "organizar todo tu viaje",
          class: "text-accent italic font-bold",
        },
        {
          text: " con recomendaciones y gestión de reservas. Estará al tanto de ti ",
        },
        {
          text: "durante la planeación, a tu llegada y hasta tu regreso a casa.",
          class: "text-accent italic font-bold",
        },
      ],
      ctaLabel: "Hoteles recomendados",
    },
    hospedaje: {
      heading: "Hospedaje",
      bookNow: "Reservar",
      hotels: {
        "one-guadalajara": {
          description:
            "Una opción práctica y cómoda para disfrutar Guadalajara, con desayuno incluido y una ubicación conveniente al norte de la ciudad.",
          highlight: "una ubicación conveniente al norte de la ciudad.",
        },
        "hard-rock": {
          description:
            "Una experiencia vibrante y contemporánea, ideal para quienes buscan hospedarse, relajarse y disfrutar del ambiente musical de Guadalajara. El hotel cuenta con restaurantes, entretenimiento, spa y piscina.",
          highlight:
            "El hotel cuenta con restaurantes, entretenimiento, spa y piscina.",
        },
      },
    },
    nav: {
      home: "Home",
      rsvp: "RSVP",
      gift: "Regalos",
      hospedaje: "Hospedaje",
    },
    itinerary: {
      heading: "Itinerario",
      mapButton: "Ver Mapa",
      items: [
        { title: "Ceremonia Religiosa", location: "Parroquia de Santa Sofía" },
        { title: "Cóctel de bienvenida", location: "Ingreso a la recepción" },
        { title: "Banquete nupcial", location: "Recepción" },
      ],
    },
    footer: {
      greeting: "—Hola,",
      introName: "Soy Miguel Angel Ramírez",
      paragraph1:
        "Estoy aquí para acompañarte en cada paso hacia ese día tan especial. Si tienes dudas sobre el evento, paquetes o reservaciones, no dudes en escribirme. Será un placer ayudarte a que vivas esta experiencia de forma sencilla, clara y sin complicaciones.",
      paragraph2:
        "En Conceptos Finos, cada proyecto es una historia que merece ser contada de forma inolvidable. Me especializo en transformar tus ideas en una experiencia que trasciende el tiempo, asegurando que cada detalle refleje la singularidad de tu celebración.",
      contactName: "Miguel Angel Ramírez",
      instagram: "Sigue nuestras bodas en Instagram",
      credits: "© Diseñado por Dizaru. 2026.",
    },
    gallery: {
      alts: [
        "Liliana y Daniel",
        "Liliana y Daniel en el auto",
        "Auto en la carretera",
        "Liliana y Daniel con el auto",
        "Liliana y Daniel",
      ],
    },
    whatsapp: {
      message: "¡Hola! 😊 Buen día.\n\nSoy invitado a la boda de Liliana & Daniel. ¿Podrían ayudarme, por favor?",
      ariaLabel: "Escríbenos por WhatsApp",
    },
  },
  en: {
    meta: {
      titleSuffix: "Our Wedding",
      description: "Wedding invitation for {bride} and {groom}",
    },
    envelope: {
      intro: "Dear guest, they say that…",
      script: "We are getting married",
      prompt: "Tap the envelope to open",
      openAriaLabel: "Open invitation",
    },
    hero: {
      eyebrow: "Our Wedding",
      countdownLabel: "Only",
      countdownUnit: "Days",
    },
    story: {
      segments: [
        { text: "A love story" },
        { br: true },
        { text: "that began in " },
        { text: "Mexico.", class: "text-accent italic" },
        { br: true },
        { text: "Today, we return " },
        { text: "to ", class: "text-accent italic" },
        { br: true },
        { text: "celebrate it", class: "text-accent italic" },
      ],
    },
    venue: {
      eyebrow: "We are getting married at",
      mapButton: "View Map",
    },
    rsvp: {
      headline: "It will be an incredible celebration",
      question: "Will you join us?",
      ctaLabel: "RSVP Here",
    },
    gift: {
      heading: "Gift Registry",
      segments: [
        { text: "Your presence", class: "text-accent italic font-bold" },
        { text: " is our greatest gift. However, if you wish to " },
        {
          text: "honor us with a present",
          class: "text-accent italic font-bold",
        },
        {
          text: ", a contribution to our Honeymoon Fund to start our future together ",
        },
        {
          text: "would be deeply appreciated.",
          class: "text-accent italic font-bold",
        },
      ],
      ctaLabel: "Contribute",
    },
    dressCode: {
      segments: [
        { text: "Join us", class: "text-accent" },
        { text: " in your " },
        { text: "most elegant formal", class: "text-accent" },
        { text: " attire to celebrate our special day." },
      ],
    },
    concierge: {
      subtitle: "Service",
      paragraph1: [
        {
          text: "To ensure you can just focus on enjoying the celebration, our ",
        },
        { text: "wedding planners", class: "text-accent font-bold" },
        { text: " offer a dedicated " },
        { text: "Concierge", class: "text-accent italic" },
        { text: " service." },
      ],
      paragraph2: [
        { text: "They will help you " },
        {
          text: "organize your entire trip",
          class: "text-accent italic font-bold",
        },
        {
          text: " with local recommendations and booking management. They will take care of you ",
        },
        {
          text: "during the planning process, upon your arrival, and until you safely return home.",
          class: "text-accent italic font-bold",
        },
      ],
      ctaLabel: "Recommended Hotels",
    },
    hospedaje: {
      heading: "Recommended Hotels",
      bookNow: "Book Now",
      hotels: {
        "one-guadalajara": {
          description:
            "A practical and comfortable option to enjoy Guadalajara, featuring complimentary breakfast and a convenient location in the north of the city.",
          highlight: "a convenient location in the north of the city.",
        },
        "hard-rock": {
          description:
            "A vibrant and contemporary experience, ideal for those looking to stay, relax, and enjoy the musical atmosphere of Guadalajara. The hotel features restaurants, entertainment, a spa, and a pool.",
          highlight:
            "The hotel features restaurants, entertainment, a spa, and a pool.",
        },
      },
    },
    nav: {
      home: "Home",
      rsvp: "RSVP",
      gift: "Registry",
      hospedaje: "Stay",
    },
    itinerary: {
      heading: "Itinerary",
      mapButton: "View Map",
      items: [
        { title: "Wedding Ceremony", location: "Parroquia de Santa Sofía" },
        { title: "Welcome Cocktail", location: "Reception entrance" },
        { title: "Wedding Banquet", location: "Reception" },
      ],
    },
    footer: {
      greeting: "—Hi,",
      introName: "I'm Miguel Angel Ramírez",
      paragraph1:
        "I'm here to walk with you through every step toward that special day. If you have questions about the event, packages, or reservations, feel free to reach out. It will be my pleasure to help you enjoy this experience in a simple, clear, and hassle-free way.",
      paragraph2:
        "At Conceptos Finos, every project is a story worth telling in an unforgettable way. I specialize in turning your ideas into an experience that transcends time, making sure every detail reflects the uniqueness of your celebration.",
      contactName: "Miguel Angel Ramírez",
      instagram: "Follow our weddings on Instagram",
      credits: "© Designed by Dizaru. 2026.",
    },
    gallery: {
      alts: [
        "Liliana and Daniel",
        "Liliana and Daniel in the car",
        "Car on the road",
        "Liliana and Daniel with the car",
        "Liliana and Daniel",
      ],
    },
    whatsapp: {
      message: "Hi! 😊 Good day.\n\nI'm a guest at Liliana & Daniel's wedding. Could you please help me?",
      ariaLabel: "Message us on WhatsApp",
    },
  },
};
