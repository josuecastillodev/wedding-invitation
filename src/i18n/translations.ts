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
  /** Fragmentos de `description` que se resaltan (en orden de aparición). */
  highlights: string[];
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
    segments: RichSegment[];
    prompt: string;
    openAriaLabel: string;
  };
  hero: {
    eyebrow: string;
  };
  story: {
    daysLabel: string;
    weeksLabel: string;
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
  blessing: {
    eyebrow: string;
    subtitle: string;
    brideParents: string;
    groomParents: string;
  };
  gift: {
    heading: string;
    segments: RichSegment[];
    nameLabel: string;
    accountLabel: string;
    clabeLabel: string;
    copied: string;
    copyAria: string;
  };
  dressCode: {
    segments: RichSegment[];
    womenLabel: string;
    menLabel: string;
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
      segments: [
        { text: "Nuestro amor siempre" },
        { br: true },
        { text: "encontró el camino de regreso." },
        { br: true },
        { text: "Hoy, " },
        { text: "anunciamos nuestra boda", class: "text-accent italic font-bold" },
        { text: ".", class: "text-[#d98a74]" },
      ],
      prompt: "Toca el sobre para abrir",
      openAriaLabel: "Abrir invitación",
    },
    hero: {
      eyebrow: "Nuestra boda",
    },
    story: {
      daysLabel: "Días",
      weeksLabel: "Semanas",
    },
    venue: {
      eyebrow: "Nos casamos en",
      mapButton: "Ver Mapa",
    },
    rsvp: {
      headline: "Será una celebración increíble",
      question: "¿Nos acompañas?",
      ctaLabel: "¡Confirmar asistencia!",
    },
    blessing: {
      eyebrow: "Con la bendición de",
      subtitle: "nuestros padres",
      brideParents: "Padres de Estefannia",
      groomParents: "Padres de Alfredo",
    },
    gift: {
      heading: "Mesa de regalos",
      segments: [
        { text: "Su presencia es nuestro mejor regalo." },
        { br: true },
        { text: "Si desean obsequiarnos un detalle, pueden contribuir a nuestro futuro juntos con un " },
        { text: "regalo en efectivo", class: "text-accent italic font-bold" },
        { text: " a través de la " },
        { text: "siguiente cuenta bancaria.", class: "text-accent italic font-bold" },
      ],
      nameLabel: "Nombre",
      accountLabel: "Cuenta",
      clabeLabel: "Clabe",
      copied: "¡Copiado!",
      copyAria: "Copiar",
    },
    dressCode: {
      segments: [
        { text: "Acompáñanos con un " },
        { text: "look formal y elegante", class: "text-accent" },
        { text: " para celebrar juntos nuestra boda." },
      ],
      womenLabel: "Mujeres",
      menLabel: "Hombres",
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
        "hotel-ng": {
          description:
            "Una opción práctica y cómoda, ideal para quienes priorizan el descanso y estar a pocos minutos de la locación de la boda, evitando largos traslados.",
          highlights: ["opción práctica", "pocos minutos de la locación de la boda"],
        },
        "hard-rock": {
          description:
            "Una experiencia vibrante y contemporánea, ideal para quienes buscan hospedarse, relajarse y disfrutar del ambiente musical de Guadalajara. El hotel cuenta con restaurantes, entretenimiento, spa y piscina.",
          highlights: [
            "El hotel cuenta con restaurantes, entretenimiento, spa y piscina.",
          ],
        },
        "hyatt-andares": {
          description:
            "Lujo y sofisticación en la zona más exclusiva de la ciudad. Perfecto para quienes buscan comodidad de primer nivel y rodeados de los mejores restaurantes.",
          highlights: ["Lujo y sofisticación", "rodeados de los mejores restaurantes."],
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
        "Estefannia y Alfredo",
        "Estefannia y Alfredo",
        "Estefannia y Alfredo",
        "Estefannia y Alfredo",
        "Estefannia y Alfredo",
        "Estefannia y Alfredo",
      ],
    },
    whatsapp: {
      message: "¡Hola! 😊 Buen día.\n\nSoy invitado a la boda de Estefannia & Alfredo. ¿Podrían ayudarme, por favor?",
      ariaLabel: "Escríbenos por WhatsApp",
    },
  },
  en: {
    meta: {
      titleSuffix: "Our Wedding",
      description: "Wedding invitation for {bride} and {groom}",
    },
    envelope: {
      segments: [
        { text: "Our love always" },
        { br: true },
        { text: "found its way back." },
        { br: true },
        { text: "Today, " },
        { text: "we announce our wedding", class: "text-accent italic font-bold" },
        { text: ".", class: "text-[#d98a74]" },
      ],
      prompt: "Tap the envelope to open",
      openAriaLabel: "Open invitation",
    },
    hero: {
      eyebrow: "Our Wedding",
    },
    story: {
      daysLabel: "Days",
      weeksLabel: "Weeks",
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
    blessing: {
      eyebrow: "With the blessing of",
      subtitle: "our parents",
      brideParents: "Estefannia's parents",
      groomParents: "Alfredo's parents",
    },
    gift: {
      heading: "Gift Registry",
      segments: [
        { text: "Your presence is our greatest gift." },
        { br: true },
        { text: "If you wish to give us a gift, you may contribute to our future together with a " },
        { text: "cash gift", class: "text-accent italic font-bold" },
        { text: " through the " },
        { text: "following bank account.", class: "text-accent italic font-bold" },
      ],
      nameLabel: "Name",
      accountLabel: "Account",
      clabeLabel: "CLABE",
      copied: "Copied!",
      copyAria: "Copy",
    },
    dressCode: {
      segments: [
        { text: "Join us", class: "text-accent" },
        { text: " in your " },
        { text: "most elegant formal", class: "text-accent" },
        { text: " attire to celebrate our special day." },
      ],
      womenLabel: "Women",
      menLabel: "Men",
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
        "hotel-ng": {
          description:
            "A practical and comfortable option, ideal for those who prioritize rest and being just minutes from the wedding venue, avoiding long commutes.",
          highlights: ["practical and comfortable option", "just minutes from the wedding venue"],
        },
        "hard-rock": {
          description:
            "A vibrant and contemporary experience, ideal for those looking to stay, relax, and enjoy the musical atmosphere of Guadalajara. The hotel features restaurants, entertainment, a spa, and a pool.",
          highlights: [
            "The hotel features restaurants, entertainment, a spa, and a pool.",
          ],
        },
        "hyatt-andares": {
          description:
            "Luxury and sophistication in the most exclusive area of the city. Perfect for those seeking top-tier comfort surrounded by the best restaurants.",
          highlights: ["Luxury and sophistication", "surrounded by the best restaurants."],
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
        "Estefannia and Alfredo",
        "Estefannia and Alfredo",
        "Estefannia and Alfredo",
        "Estefannia and Alfredo",
        "Estefannia and Alfredo",
        "Estefannia and Alfredo",
      ],
    },
    whatsapp: {
      message: "Hi! 😊 Good day.\n\nI'm a guest at Estefannia & Alfredo's wedding. Could you please help me?",
      ariaLabel: "Message us on WhatsApp",
    },
  },
};
