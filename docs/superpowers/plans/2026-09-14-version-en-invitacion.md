# Versión en inglés de la invitación — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una versión en inglés de la invitación (`/liliana-y-daniel/en/`) con un switch de idioma visible, sin cambiar el diseño ni la versión en español.

**Architecture:** Ruteo i18n nativo de Astro (`/` en español sin prefijo, `/en/` en inglés) generado en build time (`output: 'static'`). Todo el copy traducible se centraliza en un diccionario tipado (`src/i18n/translations.ts`); `EVENT_CONFIG` se queda solo con datos que no cambian por idioma. Cada componente recibe una prop `lang` (default `"es"`, para no romper nada mientras se migra) y lee del diccionario. Un componente nuevo (`RichText.astro`) resuelve los párrafos con partes acentuadas/cursivas sin repetir lógica. Un switch fijo (`LanguageSwitch.astro`) navega entre `/` y `/en/` conservando el query string.

**Tech Stack:** Astro 5.7 (`output: 'static'`), React 19 (islands `client:load`), Tailwind 3, TypeScript (`astro/tsconfigs/strict`), pnpm.

## Global Constraints

- Usar siempre `pnpm` para instalar/ejecutar (no se necesitan dependencias nuevas para este trabajo).
- Comentarios de código, commits y copy del sitio en español (excepto el contenido propio del idioma inglés, obviamente).
- Commits cortos, con prefijo convencional (`feat:`, `refactor:`, `docs:`), un commit por tarea.
- No agregar créditos de IA dentro del copy del sitio ni en el título/cuerpo visible al usuario final (los commits de este repo sí llevan el pie de atribución de sesión indicado más abajo, por instrucción vigente del harness).
- El diseño visual (layout, colores, tipografías, animaciones) no cambia — solo el texto y el ruteo/switch nuevos.
- El link ya compartido `https://invitacion.dizaru.com/liliana-y-daniel/` debe seguir funcionando exactamente igual (español, sin prefijo).
- Este proyecto no tiene suite de tests automatizados. La verificación de cada tarea es `pnpm build` + comprobar el HTML generado (con `grep`/`diff`), no `vitest`/`jest`.

Todos los comandos de este plan se ejecutan desde `wedding-invitation/` (la raíz del proyecto Astro), no desde la raíz del monorepo.

---

## Mapa de archivos

**Nuevos:**
- `src/i18n/translations.ts` — diccionario de copy ES/EN, tipado.
- `src/i18n/date.ts` — formatea la fecha del evento según el idioma.
- `src/components/RichText.astro` — renderiza párrafos con fragmentos acentuados/cursivas/saltos de línea.
- `src/components/LanguageSwitch.astro` — pastilla fija de cambio de idioma.
- `src/components/InvitationPage.astro` — cuerpo compartido de la página (Layout + secciones), parametrizado por `lang`.
- `src/pages/en/index.astro` — ruta en inglés.

**Modificados:**
- `astro.config.mjs` — config `i18n`.
- `src/layouts/Layout.astro` — prop `lang`, título/descripción traducidos, monta `LanguageSwitch`.
- `src/components/EnvelopeOpening.tsx`, `HeroSection.astro`, `StorySection.astro`, `VenueSection.astro`, `RsvpCta.astro`, `GiftRegistry.astro`, `DressCode.astro`, `Concierge.astro`, `Hospedaje.astro`, `Itinerary.astro`, `Footer.astro`, `PhotoGallery.tsx` — prop `lang`, leen del diccionario en vez de texto fijo.
- `src/config/event.ts` — agrega `id` a cada hotel; al final del plan se eliminan los campos de copy que quedan duplicados en `translations.ts`.
- `src/pages/index.astro` — se reduce a usar `InvitationPage`.

**Fuera de alcance:** `src/components/BankDetails.astro` (no está en uso).

---

### Task 1: Ruteo i18n de Astro

**Files:**
- Modify: `astro.config.mjs`

**Interfaces:**
- Produces: rutas `/liliana-y-daniel/` (es, default) y `/liliana-y-daniel/en/` (en) — usadas por las tareas 9 y 10.

- [ ] **Step 1: Tomar snapshot del build actual (línea base para comparar más adelante)**

```bash
cd wedding-invitation
pnpm build
cp dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: build sin errores, `dist/index.html` existe (es el único HTML generado hasta ahora).

- [ ] **Step 2: Agregar configuración `i18n` a Astro**

Editar `astro.config.mjs` para que quede así:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://invitacion.dizaru.com',
  base: '/liliana-y-daniel',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
});
```

- [ ] **Step 3: Verificar que el build sigue siendo idéntico**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: sin salida de `diff` (archivos idénticos) — agregar la config `i18n` sin páginas nuevas en `src/pages/en/` no debe cambiar nada todavía.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: agrega ruteo i18n (es/en) a la configuración de Astro

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 2: Diccionario de traducciones y formateador de fecha

**Files:**
- Create: `src/i18n/translations.ts`
- Create: `src/i18n/date.ts`

**Interfaces:**
- Produces: `export type Lang = "es" | "en"`, `export interface RichSegment { text?: string; class?: string; br?: boolean }`, `export const translations: Record<Lang, Translations>`, `export function formatEventDate(isoDate: string, lang: Lang): string`.
- Consumido por: todas las tareas siguientes (3–10).

- [ ] **Step 1: Crear el diccionario de traducciones**

Crear `src/i18n/translations.ts`:

```ts
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
  itinerary: {
    heading: string;
    mapButton: string;
    items: ItineraryItemCopy[];
  };
  footer: {
    instagram: string;
    credits: string;
  };
  gallery: {
    alts: string[];
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
      instagram: "Sigue nuestras bodas en Instagram",
      credits: "© Diseñado por Dizaru. 2025.",
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
      instagram: "Follow our weddings on Instagram",
      credits: "© Designed by Dizaru. 2025.",
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
  },
};
```

- [ ] **Step 2: Crear el formateador de fecha**

Crear `src/i18n/date.ts`:

```ts
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
```

- [ ] **Step 3: Verificar que compila y que el sitio en español no cambió**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
node -e "
const { formatEventDate } = require('./src/i18n/date.ts');
" 2>/dev/null || true
```

El segundo comando es solo informativo (no hay runtime de TS suelto); la comprobación real es:

```bash
pnpm exec astro build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: build sin errores, `diff` sin salida (estos archivos son nuevos y todavía no los usa nadie).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/translations.ts src/i18n/date.ts
git commit -m "feat: agrega diccionario de traducciones ES/EN y formateador de fecha

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 3: Layout con prop `lang` + switch de idioma

**Files:**
- Create: `src/components/LanguageSwitch.astro`
- Modify: `src/layouts/Layout.astro`

**Interfaces:**
- Consumes: `translations` y `Lang` de `../i18n/translations` (Task 2).
- Produces: `Layout` acepta `lang?: Lang` (default `"es"`); `LanguageSwitch` acepta `lang: Lang`. Consumido por `InvitationPage.astro` (Task 9).

- [ ] **Step 1: Crear el switch de idioma**

Crear `src/components/LanguageSwitch.astro`:

```astro
---
import { getRelativeLocaleUrl } from "astro:i18n";
import type { Lang } from "../i18n/translations";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const targetLang: Lang = lang === "es" ? "en" : "es";
const targetLabel = targetLang.toUpperCase();
const targetAriaLabel =
  targetLang === "en" ? "Switch to English" : "Cambiar a español";
const targetHref = getRelativeLocaleUrl(targetLang, "");
---

<div
  class="fixed top-4 right-4 z-[60] flex items-center gap-1 rounded-full bg-paper/90 border border-accent/30 px-3 py-1 font-serif text-xs uppercase tracking-wider text-ink shadow-md backdrop-blur-sm"
>
  <span class="text-accent font-semibold">{lang.toUpperCase()}</span>
  <span class="text-ink/30">·</span>
  <a
    id="language-switch-link"
    href={targetHref}
    aria-label={targetAriaLabel}
    class="hover:text-accent transition-colors duration-200"
  >
    {targetLabel}
  </a>
</div>

<script>
  // Conserva los parámetros de la URL actual (ej. ?Nombre=&Pases= del RSVP)
  // al cambiar de idioma. No se puede resolver en build time porque el
  // sitio es estático (no hay request real durante `astro build`).
  const link = document.getElementById("language-switch-link");
  if (link instanceof HTMLAnchorElement && window.location.search) {
    link.href += window.location.search;
  }
</script>
```

- [ ] **Step 2: Agregar `lang` a Layout y montar el switch**

Reemplazar todo el contenido de `src/layouts/Layout.astro`:

```astro
---
import '../styles/global.css';
import { EVENT_CONFIG } from '../config/event';
import { translations, type Lang } from '../i18n/translations';
import LanguageSwitch from '../components/LanguageSwitch.astro';

interface Props {
  lang?: Lang;
  title?: string;
  description?: string;
}

const { lang = 'es', title, description } = Astro.props;
const t = translations[lang];

const pageTitle =
  title ??
  `${EVENT_CONFIG.brideName} & ${EVENT_CONFIG.groomName} · ${t.meta.titleSuffix}`;
const pageDescription =
  description ??
  t.meta.description
    .replace('{bride}', EVENT_CONFIG.brideName)
    .replace('{groom}', EVENT_CONFIG.groomName);

const baseUrl = EVENT_CONFIG.baseUrl;
---

<!doctype html>
<html lang={lang} class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={pageDescription} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />

    <title>{pageTitle}</title>

    <!-- Fuentes: Cormorant Garamond (serif) + Allura (script) desde Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap"
    />
    <link rel="preload" href={`${baseUrl}/fonts/velista/VELISTARegular.woff2`} as="font" type="font/woff2" crossorigin />

    <!-- CSS crítico inline -->
    <style is:inline>
      :root {
        --font-serif: "Cormorant Garamond", Georgia, "Times New Roman", serif;
        --font-script: "Allura", cursive;
        --color-accent: #9c3829;
        --color-accent-soft: #b8514a;
        --color-paper: #F5F1EA;
        --color-ink: #403a35;
      }
      body {
        font-family: var(--font-serif);
        font-optical-sizing: auto;
        color: var(--color-ink);
        background-color: var(--color-paper);
        margin: 0;
      }
    </style>
  </head>
  <body>
    <LanguageSwitch lang={lang} />
    <slot />

    <!-- Script para animaciones on-scroll (vanilla JS, muy ligero) -->
    <script>
      // IntersectionObserver para animaciones on-scroll
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              intersectionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px' }
      );

      // Función para observar elementos con data-animate
      function observeAnimatedElements(root = document) {
        root.querySelectorAll('[data-animate]:not(.in-view)').forEach((el) => {
          intersectionObserver.observe(el);
        });
      }

      // Observar elementos iniciales
      observeAnimatedElements();

      // MutationObserver para detectar nuevos elementos (ej. cuando el sobre se abre)
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (el.hasAttribute('data-animate')) {
                intersectionObserver.observe(el);
              }
              // También buscar dentro del elemento agregado
              observeAnimatedElements(el);
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    </script>
  </body>
</html>
```

`src/pages/index.astro` sigue usando `<Layout>` sin prop `lang` por ahora (Task 9 lo actualiza), así que sigue renderizando en español por el valor default `"es"`.

- [ ] **Step 3: Verificar en el HTML generado**

```bash
pnpm build
grep -o '<html lang="es"' dist/index.html
grep -o 'id="language-switch-link"' dist/index.html
grep -o 'Switch to English' dist/index.html
```

Expected: las tres búsquedas encuentran una coincidencia cada una.

- [ ] **Step 4: Actualizar el snapshot base (a partir de aquí el switch ya es parte del diseño esperado)**

```bash
cp dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

- [ ] **Step 5: Commit**

```bash
git add src/components/LanguageSwitch.astro src/layouts/Layout.astro
git commit -m "feat: agrega switch de idioma y prop lang al Layout

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 4: Sobre (EnvelopeOpening) y Hero

**Files:**
- Modify: `src/components/EnvelopeOpening.tsx`
- Modify: `src/components/HeroSection.astro`

**Interfaces:**
- Consumes: `translations`, `Lang` (Task 2); `formatEventDate` (Task 2).
- Produces: `EnvelopeOpening` acepta `lang?: Lang` (default `"es"`); `HeroSection` acepta `lang?: Lang` (default `"es"`).

- [ ] **Step 1: Agregar `lang` a `EnvelopeOpening.tsx`**

Reemplazar todo el contenido de `src/components/EnvelopeOpening.tsx`:

```tsx
import { useState, useEffect, type ReactNode } from "react";
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";

interface EnvelopeOpeningProps {
  children: ReactNode;
  lang?: Lang;
}

const baseUrl = EVENT_CONFIG.baseUrl;

// Textura tipo acuarela generada con ruido SVG (feTurbulence), usada como
// overlay con mix-blend-mode "overlay" sobre el rojo del sobre.
const watercolorTexture = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
    <filter id='w' x='0%' y='0%' width='100%' height='100%'>
      <feTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='3' seed='7' stitchTiles='stitch' x='0' y='0' width='320' height='320' result='n' />
      <feColorMatrix in='n' type='matrix' values='
        0.25 0.25 0.25 0 0.2
        0.25 0.25 0.25 0 0.2
        0.25 0.25 0.25 0 0.2
        0.35 0.35 0.35 0 0.05' />
    </filter>
    <rect width='100%' height='100%' filter='url(#w)' />
  </svg>`
)}`;

export function EnvelopeOpening({ children, lang = "es" }: EnvelopeOpeningProps) {
  const t = translations[lang].envelope;
  const [isOpening, setIsOpening] = useState(false);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  const handleOpen = () => {
    if (isOpening || isFullyOpen) return;
    setIsOpening(true);

    setTimeout(() => setShowWhiteFlash(true), 1000);
    setTimeout(() => setShowContent(true), 1400);
    setTimeout(() => setIsFullyOpen(true), 2400);
  };

  useEffect(() => {
    if (!isFullyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullyOpen]);

  if (isFullyOpen) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 px-6 bg-paper"
      style={{
        backgroundImage: `url("${baseUrl}/images/bg-fijo.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Texto */}
      <div
        className="text-center transition-opacity duration-500"
        style={{ opacity: isOpening ? 0 : 1 }}
      >
        <p className="font-serif text-ink text-xl md:text-2xl leading-snug">
          {t.intro}
        </p>
        <p className="font-script text-accent text-5xl md:text-6xl mt-3">
          {t.script}
        </p>
      </div>

      {/* Sobre */}
      <div className="relative w-64 md:w-80">
        <button
          onClick={handleOpen}
          aria-label={t.openAriaLabel}
          className="relative block w-full cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full aspect-[3/2] rounded-lg shadow-xl overflow-hidden"
            style={{
              transform: isOpening ? "scale(0.92)" : "scale(1)",
              opacity: isOpening ? 0 : 1,
              transition: "transform 0.6s ease-in, opacity 0.6s ease-in 0.5s",
            }}
          >
            {/* Cuerpo del sobre */}
            <div className="absolute inset-0 rounded-lg bg-[#a8362f]" />

            {/* Pliegues laterales e inferior */}
            <div
              className="absolute inset-0 bg-[#8f2c26]"
              style={{ clipPath: "polygon(0 0, 50% 58%, 0 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#8f2c26]"
              style={{ clipPath: "polygon(100% 0, 50% 58%, 100% 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#98322b]"
              style={{ clipPath: "polygon(0 100%, 50% 38%, 100% 100%)" }}
            />

            {/* Solapa superior (animada) */}
            <div
              className="absolute top-0 left-0 right-0 origin-top transition-transform duration-[900ms] ease-in-out"
              style={{
                height: "60%",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(160deg, #c2453d 0%, #a8362f 100%)",
                filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.55))",
                transform: isOpening ? "rotateX(-160deg)" : "rotateX(0deg)",
                transformStyle: "preserve-3d",
                zIndex: 10,
              }}
            >
              {/* Sombreado del pliegue */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)",
                }}
              />
            </div>

            {/* Sombra de los pliegues diagonales de la solapa superior */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              style={{
                zIndex: 11,
                opacity: isOpening ? 0 : 1,
                transition: "opacity 0.3s ease-out",
              }}
            >
              <defs>
                <filter id="creaseBlur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>
              <line
                x1="0"
                y1="0"
                x2="150"
                y2="120"
                stroke="black"
                strokeOpacity="0.45"
                strokeWidth="18"
                filter="url(#creaseBlur)"
              />
              <line
                x1="300"
                y1="0"
                x2="150"
                y2="120"
                stroke="black"
                strokeOpacity="0.45"
                strokeWidth="18"
                filter="url(#creaseBlur)"
              />
            </svg>

            {/* Textura acuarela */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                backgroundImage: `url("${watercolorTexture}")`,
                backgroundSize: "260px 260px",
                mixBlendMode: "overlay",
                opacity: 0.85,
                zIndex: 12,
              }}
            />

            {/* Sombreado general: luz superior, esquinas inferiores oscuras */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: `
                  radial-gradient(70% 55% at 50% 60%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 65%),
                  radial-gradient(65% 60% at 8% 105%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%),
                  radial-gradient(65% 60% at 92% 105%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%),
                  radial-gradient(90% 60% at 50% -10%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 55%)
                `,
                zIndex: 13,
              }}
            />

            {/* Sello */}
            <img
              src={`${baseUrl}/images/sello-nuestra-boda.png`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2"
              style={{
                top: "55%",
                transform: isOpening
                  ? "translate(-50%, -50%) scale(0.7)"
                  : "translate(-50%, -50%) scale(1)",
                width: "38%",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
                opacity: isOpening ? 0 : 1,
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                zIndex: 20,
              }}
            />

          </div>
        </button>

        {/* Ramo de flores (fuera del contexto 3D para que el blend funcione) */}
        <img
          src={`${baseUrl}/images/flower.png`}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute w-[100%] h-auto"
          style={{
            right: "-50%",
            bottom: "-80%",
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
            opacity: isOpening ? 0 : 1,
            transition: "opacity 0.4s ease-out",
            zIndex: 15,
          }}
        />
      </div>

      <p
        className="text-ink/40 font-serif text-xs md:text-sm tracking-[0.25em] uppercase transition-opacity duration-500"
        style={{ opacity: isOpening ? 0 : 1 }}
      >
        {t.prompt}
      </p>

      {/* Flash blanco */}
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          opacity: showWhiteFlash ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          zIndex: 50,
        }}
      />

      {/* Contenido con revelado en blur */}
      {showContent && (
        <div
          className="absolute inset-0 z-40"
          style={{
            filter: isFullyOpen ? "blur(0px)" : "blur(20px)",
            transform: isFullyOpen ? "scale(1)" : "scale(1.1)",
            transition: "filter 1s ease-out, transform 1s ease-out",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default EnvelopeOpening;
```

- [ ] **Step 2: Agregar `lang` a `HeroSection.astro`**

Reemplazar todo el contenido de `src/components/HeroSection.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";
import { formatEventDate } from "../i18n/date";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].hero;
const baseUrl = EVENT_CONFIG.baseUrl;
const eventTime = new Date(`${EVENT_CONFIG.eventDate}T17:30:00`).getTime();
const daysLeft = Math.max(0, Math.ceil((eventTime - Date.now()) / 86_400_000));
const displayDate = formatEventDate(EVENT_CONFIG.eventDate, lang);
---

<section
  class="relative min-h-screen flex flex-col items-center px-6 pt-20 pb-0 overflow-hidden"
>
  <!-- Velo sobre el fondo para que el texto respire -->
  <div class="absolute inset-0"></div>

  <!-- Siluetas decorativas de fondo -->
  <img
    src={`${baseUrl}/images/silueta-lampara.png`}
    alt=""
    aria-hidden="true"
    class="pointer-events-none select-none absolute z-0 top-0 left-[55%] -translate-x-1/2 h-[55%] md:h-[60%] w-auto object-contain opacity-100"
  />
  <img
    src={`${baseUrl}/images/silueta-pareja.png`}
    alt=""
    aria-hidden="true"
    class="pointer-events-none select-none absolute z-0 bottom-0 left-[55%] -translate-x-1/2 h-[50%] md:h-[55%] w-auto object-contain opacity-100"
  />

  <!-- Contenido principal -->
  <div class="relative z-10 text-center flex-1 flex flex-col justify-center">
    <p data-animate class="font-script text-accent text-4xl md:text-5xl mb-4">
      {t.eyebrow}
    </p>

    <h1 class="font-serif text-ink inline-block text-left mx-auto my-8">
      <span
        data-animate
        data-delay="100"
        class="block text-5xl md:text-7xl tracking-[0.12em] uppercase"
      >
        {EVENT_CONFIG.brideName}
      </span>
      <span
        data-animate
        data-delay="200"
        class="block text-5xl md:text-7xl tracking-[0.12em] uppercase"
      >
        <span
          class="font-script normal-case tracking-normal text-6xl md:text-8xl align-baseline"
          >&amp;</span
        >{EVENT_CONFIG.groomName}
      </span>
    </h1>

    <p
      data-animate
      data-delay="400"
      class="font-script text-accent text-4xl md:text-5xl mt-6"
    >
      {displayDate}
    </p>
  </div>

  <!-- Días faltantes -->
  <div data-animate data-delay="500" class="relative z-10 mb-16 text-center">
    <p class="font-script text-accent text-3xl md:text-4xl">{t.countdownLabel}</p>
    <p class="mt-1">
      <span id="hero-days-left" class="font-serif text-ink text-4xl md:text-5xl"
        >{daysLeft}</span
      >
      <span class="font-script text-ink text-3xl md:text-4xl ml-1">{t.countdownUnit}</span>
    </p>
  </div>
</section>

<script define:vars={{ eventDate: EVENT_CONFIG.eventDate }}>
  const target = new Date(`${eventDate}T17:30:00`).getTime();
  const days = Math.max(0, Math.ceil((target - Date.now()) / 86_400_000));
  const el = document.getElementById("hero-days-left");
  if (el) el.textContent = String(days);
</script>
```

- [ ] **Step 3: Verificar que el sitio en español no cambió**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: sin salida de `diff`. Si hay diferencias, revisar el texto exacto (espacios, mayúsculas) contra la sección "HeroSection"/"EnvelopeOpening" del spec (`docs/superpowers/specs/2026-09-14-version-en-invitacion-design.md`) y corregir `translations.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/components/EnvelopeOpening.tsx src/components/HeroSection.astro
git commit -m "refactor: usa el diccionario de traducciones en el sobre y el hero

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 5: RichText + Historia + Venue

**Files:**
- Create: `src/components/RichText.astro`
- Modify: `src/components/StorySection.astro`
- Modify: `src/components/VenueSection.astro`

**Interfaces:**
- Consumes: `RichSegment`, `translations`, `Lang` (Task 2); `formatEventDate` (Task 2).
- Produces: `RichText` acepta `segments: RichSegment[]`. Reutilizado por GiftRegistry, DressCode y Concierge (Tasks 6-7).

- [ ] **Step 1: Crear `RichText.astro`**

Crear `src/components/RichText.astro`:

```astro
---
// Renderiza un párrafo compuesto por fragmentos de texto plano, spans con
// clases de Tailwind (acento/cursiva/negritas) y saltos de línea, sin
// repetir esa lógica en cada sección. El contenido viene de
// src/i18n/translations.ts (tipo RichSegment).
import type { RichSegment } from "../i18n/translations";

interface Props {
  segments: RichSegment[];
}

const { segments } = Astro.props;
---

{segments.map((segment) =>
  segment.br ? (
    <br />
  ) : segment.class ? (
    <span class={segment.class}>{segment.text}</span>
  ) : (
    segment.text
  )
)}
```

- [ ] **Step 2: Migrar `StorySection.astro`**

Reemplazar todo el contenido de `src/components/StorySection.astro`:

```astro
---
import { translations, type Lang } from "../i18n/translations";
import RichText from "./RichText.astro";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const { segments } = translations[lang].story;
---

<section class="px-6 py-6 text-center">
  <p
    data-animate
    class="font-serif text-2xl md:text-3xl leading-relaxed max-w-xl mx-auto text-ink"
  >
    <RichText segments={segments} />
  </p>
</section>
```

- [ ] **Step 3: Migrar `VenueSection.astro`**

Reemplazar todo el contenido de `src/components/VenueSection.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";
import { formatEventDate } from "../i18n/date";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].venue;
const baseUrl = EVENT_CONFIG.baseUrl;
const { venue } = EVENT_CONFIG;
const displayDate = formatEventDate(EVENT_CONFIG.eventDate, lang);

const cityParts = venue.city.split(", ");
const cityCountry = cityParts.pop();
const cityRest = cityParts.join(", ");
---

<section>
  <div data-animate class="text-center max-w-xl mx-auto px-6 py-6">
    <img
      src={`${baseUrl}/images/venue-asset.png`}
      alt=""
      loading="lazy"
      class="mx-auto h-16 w-auto"
    />

    <p class="font-script text-accent text-5xl my-12">{t.eyebrow}</p>
    <h2 class="font-serif text-4xl tracking-[1px] text-ink">
      {venue.name}
    </h2>
    <p class="text-accent text-3xl mt-2 italic tracking-[1px] font-bold">
      {displayDate}
    </p>
    <p class="text-ink/80 mt-8 text-3xl italic">
      {cityRest}, <span class="text-accent font-bold">{cityCountry}</span>
    </p>

    <a
      href={venue.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="mt-12 border-[2px] border-accent text-accent hover:bg-accent hover:text-white rounded-md w-full max-w-48 mx-auto text-3xl inline-block py-3 font-serif italic font-bold transition-colors duration-300 text-center"
    >
      {t.mapButton}
    </a>
  </div>
</section>
```

- [ ] **Step 4: Verificar que el sitio en español no cambió**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: sin salida de `diff`.

- [ ] **Step 5: Commit**

```bash
git add src/components/RichText.astro src/components/StorySection.astro src/components/VenueSection.astro
git commit -m "refactor: agrega RichText y migra historia/venue al diccionario

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 6: RSVP, Mesa de regalos y Dress Code

**Files:**
- Modify: `src/components/RsvpCta.astro`
- Modify: `src/components/GiftRegistry.astro`
- Modify: `src/components/DressCode.astro`

**Interfaces:**
- Consumes: `translations`, `Lang` (Task 2), `RichText` (Task 5).
- Produces: `RsvpCta`, `GiftRegistry`, `DressCode` aceptan `lang?: Lang` (default `"es"`).

- [ ] **Step 1: Migrar `RsvpCta.astro`**

Reemplazar todo el contenido de `src/components/RsvpCta.astro`:

```astro
---
import RsvpButton from "./RsvpButton.tsx";
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";

interface Props {
  lang?: Lang;
  showImage?: boolean;
  showSilhouette?: boolean;
}

const { lang = "es", showImage = false, showSilhouette = false } = Astro.props;
const baseUrl = EVENT_CONFIG.baseUrl;
const { brideName, groomName } = EVENT_CONFIG;
const t = translations[lang].rsvp;
---

<section class="relative px-6 py-20 text-center overflow-hidden">
  {
    showSilhouette && (
      <img
        src={`${baseUrl}/images/silueta-pareja-2.png`}
        alt=""
        aria-hidden="true"
        class="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[35%] h-auto z-0"
      />
    )
  }

  {
    showImage && (
      <img
        data-animate
        src={`${baseUrl}/images/rsvp-venue.jpg`}
        alt=""
        loading="lazy"
        class="mx-auto mb-12 w-full max-w-lg rounded-lg shadow-[0_25px_50px_-8px_rgba(0,0,0,0.55)]"
      />
    )
  }

  <p
    data-animate
    class="relative z-10 font-serif text-xl md:text-2xl leading-relaxed text-ink"
  >
    {t.headline}
    <br />
    {t.question}
  </p>

  <p
    data-animate
    data-delay="100"
    class="relative z-10 font-signature text-accent text-4xl md:text-5xl mt-6"
  >
    {brideName} & {groomName}
  </p>

  <div data-animate data-delay="200" class="relative z-10 mt-8">
    <RsvpButton label={t.ctaLabel} client:load />
  </div>
</section>
```

- [ ] **Step 2: Migrar `GiftRegistry.astro`**

Reemplazar todo el contenido de `src/components/GiftRegistry.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";
import RichText from "./RichText.astro";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].gift;
const baseUrl = EVENT_CONFIG.baseUrl;
const { gift } = EVENT_CONFIG;
---

<section class="px-6 py-16 text-center">
  <div class="max-w-xl mx-auto">
    <h2 data-animate class="font-serif text-3xl text-ink">{t.heading}</h2>

    <p
      data-animate
      data-delay="100"
      class="font-serif text-xl md:text-2xl leading-relaxed text-ink mt-10 mx-auto max-w-96"
    >
      <RichText segments={t.segments} />
    </p>

    <div class="relative inline-block mt-10">
      <a
        href={gift.ctaUrl}
        data-animate
        data-delay="200"
        class="relative z-10 border-2 border-accent text-accent hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-lg rounded-md inline-block w-56 py-2 px-12 font-serif italic font-bold text-3xl leading-none"
        style="transition: opacity 0.6s ease-out, transform 0.5s ease-out, background-color 0.5s ease-out, color 0.5s ease-out, box-shadow 0.5s ease-out;"
      >
        {t.ctaLabel}
      </a>

      <img
        src={`${baseUrl}/images/flower.png`}
        alt=""
        aria-hidden="true"
        class="pointer-events-none select-none absolute w-full h-auto z-10"
        style={{ right: "-50%", top: "-130%" }}
      />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Migrar `DressCode.astro`**

Reemplazar todo el contenido de `src/components/DressCode.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";
import RichText from "./RichText.astro";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].dressCode;
const baseUrl = EVENT_CONFIG.baseUrl;
const { dressCode } = EVENT_CONFIG;
---

<section
  class="relative text-center min-h-[480px] md:min-h-[560px] flex flex-col items-center justify-center overflow-hidden"
>
  <!-- Silueta decorativa de fondo -->
  <img
    src={`${baseUrl}/images/silueta-pareja-2.png`}
    alt=""
    aria-hidden="true"
    class="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[35%] h-auto z-0"
  />

  <!-- Título -->
  <div data-animate class="relative z-10">
    <h2 class="font-serif text-2xl md:text-3xl text-ink">Dress Code</h2>
    <p
      data-animate
      data-delay="100"
      class="font-script text-accent text-4xl md:text-5xl -mt-2 ml-28"
    >
      {dressCode.code}
    </p>
  </div>

  <!-- Nota -->
  <p
    data-animate
    data-delay="300"
    class="relative z-10 font-serif text-xl md:text-2xl leading-relaxed max-w-72 mx-auto mt-16 text-ink"
  >
    <RichText segments={t.segments} />
  </p>
</section>
```

Nota: el título "Dress Code" y el valor `dressCode.code` ("Formal") quedan tal cual, sin pasar por el diccionario, porque son la misma palabra en ambos idiomas (ya están en inglés en la versión en español actual).

- [ ] **Step 4: Verificar que el sitio en español no cambió**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: sin salida de `diff`.

- [ ] **Step 5: Commit**

```bash
git add src/components/RsvpCta.astro src/components/GiftRegistry.astro src/components/DressCode.astro
git commit -m "refactor: migra RSVP, mesa de regalos y dress code al diccionario

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 7: Concierge y Hospedaje

**Files:**
- Modify: `src/config/event.ts` (agrega `id` a cada hotel)
- Modify: `src/components/Concierge.astro`
- Modify: `src/components/Hospedaje.astro`

**Interfaces:**
- Consumes: `translations`, `Lang` (Task 2), `RichText` (Task 5).
- Produces: `Hotel.id: string` en `EVENT_CONFIG.hotels` (usado por `Hospedaje.astro` para buscar su copy en `translations[lang].hospedaje.hotels[hotel.id]`). `Concierge`, `Hospedaje` aceptan `lang?: Lang` (default `"es"`).

- [ ] **Step 1: Agregar `id` a cada hotel en `event.ts`**

En `src/config/event.ts`, agregar `id: string;` a la interfaz `Hotel` y un `id` a cada entrada del arreglo `hotels` (sin quitar nada todavía — `description`/`highlight` se eliminan en la Task 10, una vez que ya no los use nadie):

```ts
export interface Hotel {
  /** Identificador usado para buscar su copy traducido en src/i18n/translations.ts */
  id: string;
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
```

Y en el arreglo `hotels`:

```ts
  hotels: [
    {
      id: "one-guadalajara",
      name: "One Guadalajara",
      subtitle: "Periférico Norte",
      image: "/images/one-guadalajara.jpg",
      description:
        "Una opción práctica y cómoda para disfrutar Guadalajara, con desayuno incluido y una ubicación conveniente al norte de la ciudad.",
      highlight: "una ubicación conveniente al norte de la ciudad.",
      bookingUrl: "https://wa.me/523310631395",
    },
    {
      id: "hard-rock",
      name: "Hard Rock",
      subtitle: "Guadalajara",
      image: "/images/hard-rock.jpg",
      description:
        "Una experiencia vibrante y contemporánea, ideal para quienes buscan hospedarse, relajarse y disfrutar del ambiente musical de Guadalajara. El hotel cuenta con restaurantes, entretenimiento, spa y piscina.",
      highlight:
        "El hotel cuenta con restaurantes, entretenimiento, spa y piscina.",
      bookingUrl: "https://wa.me/523310631395",
    },
  ] as Hotel[],
```

(El resto del archivo no cambia en este paso.)

- [ ] **Step 2: Migrar `Concierge.astro`**

Reemplazar todo el contenido de `src/components/Concierge.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";
import RichText from "./RichText.astro";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].concierge;
const baseUrl = EVENT_CONFIG.baseUrl;
const { concierge } = EVENT_CONFIG;
---

<section class="px-6 py-20 text-center">
  <div data-animate class="flex justify-center mb-6">
    <img
      src={`${baseUrl}/images/concierge.png`}
      alt=""
      loading="lazy"
      class="w-14 h-14 md:w-16 md:h-16 object-contain"
    />
  </div>

  <h2 data-animate class="font-serif text-2xl md:text-3xl text-ink">
    Concierge
  </h2>
  <p
    data-animate
    data-delay="100"
    class="font-script text-accent text-3xl md:text-4xl -mt-2 ml-20"
  >
    {t.subtitle}
  </p>

  <div class="max-w-96 mx-auto mt-10 space-y-6">
    <p
      data-animate
      data-delay="200"
      class="font-serif text-lg md:text-xl leading-relaxed text-ink"
    >
      <RichText segments={t.paragraph1} />
    </p>
    <p
      data-animate
      data-delay="300"
      class="font-serif text-lg md:text-xl leading-relaxed text-ink/85"
    >
      <RichText segments={t.paragraph2} />
    </p>
  </div>

  <a
    href={concierge.ctaUrl}
    data-animate
    data-delay="400"
    class="mt-10 bg-accent text-white hover:bg-accent-soft inline-block py-2 font-serif text-2xl md:text-3xl transition-colors duration-300 rounded-md w-64"
  >
    {t.ctaLabel}
  </a>
</section>
```

Nota: el título "Concierge" queda tal cual (mismo nombre en ambos idiomas).

- [ ] **Step 3: Migrar `Hospedaje.astro`**

Reemplazar todo el contenido de `src/components/Hospedaje.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].hospedaje;
const baseUrl = EVENT_CONFIG.baseUrl;
const { hotels } = EVENT_CONFIG;
---

<section id="hospedaje" class="px-6 py-16 text-center scroll-mt-8">
  <h2
    data-animate
    class="font-serif text-2xl md:text-3xl uppercase tracking-[0.15em] text-ink"
  >
    {t.heading}
  </h2>

  {
    hotels.map((hotel, index) => {
      const copy = t.hotels[hotel.id];
      const [before, after] = copy.highlight
        ? copy.description.split(copy.highlight)
        : [copy.description, undefined];

      return (
        <div class="mt-16 first:mt-10">
          <p data-animate class="font-serif text-2xl md:text-3xl text-ink">
            {hotel.name}
          </p>
          <p
            data-animate
            data-delay="100"
            class="font-script text-accent text-3xl md:text-4xl mt-1"
          >
            {hotel.subtitle}
          </p>

          <div
            data-animate
            data-delay="200"
            class="mt-8 mx-auto max-w-sm rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`${baseUrl}${hotel.image}`}
              alt={hotel.name}
              loading="lazy"
              class="w-full h-auto object-cover"
            />
          </div>

          <p
            data-animate
            data-delay="300"
            class="font-serif text-lg md:text-xl leading-relaxed max-w-sm mx-auto mt-8 text-ink"
          >
            {before}
            {after !== undefined && (
              <>
                <span class="text-accent">{copy.highlight}</span>
                {after}
              </>
            )}
          </p>

          <div class="relative inline-block mt-8">
            <a
              href={hotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-animate
              data-delay="400"
              class={`relative z-10 inline-block px-12 py-2 font-serif text-xl md:text-2xl rounded-md transition-colors duration-300 ${
                index % 2 === 0
                  ? "bg-accent text-white hover:bg-accent-soft"
                  : "border-2 border-accent text-accent italic font-bold hover:bg-accent hover:text-white"
              }`}
            >
              {t.bookNow}
            </a>

            {index % 2 !== 0 && (
              <img
                src={`${baseUrl}/images/flower.png`}
                alt=""
                aria-hidden="true"
                class="pointer-events-none select-none absolute w-32 h-auto z-10"
                style={{ right: "-4rem", top: "-3.5rem" }}
              />
            )}
          </div>
        </div>
      );
    })
  }
</section>
```

- [ ] **Step 4: Verificar que el sitio en español no cambió**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: sin salida de `diff` (los hoteles ahora se leen de `translations.es.hospedaje`, con el mismo texto que antes).

- [ ] **Step 5: Commit**

```bash
git add src/config/event.ts src/components/Concierge.astro src/components/Hospedaje.astro
git commit -m "refactor: migra concierge y hospedaje al diccionario, agrega id a hoteles

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 8: Itinerario, Footer y galería de fotos

**Files:**
- Modify: `src/components/Itinerary.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/PhotoGallery.tsx`

**Interfaces:**
- Consumes: `translations`, `Lang` (Task 2).
- Produces: `Itinerary`, `Footer` aceptan `lang?: Lang` (default `"es"`); `PhotoGallery` acepta `lang?: Lang` (default `"es"`).

- [ ] **Step 1: Migrar `Itinerary.astro`**

Reemplazar todo el contenido de `src/components/Itinerary.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].itinerary;
const baseUrl = EVENT_CONFIG.baseUrl;

interface ItineraryItemData {
  icon: string;
  time: string;
  mapUrl?: string;
}

const itineraryData: ItineraryItemData[] = [
  {
    icon: `${baseUrl}/images/itinerary-01.svg`,
    time: "5:00 PM",
    mapUrl: "https://maps.app.goo.gl/zqXC8E8VmT7TNr8eA",
  },
  {
    icon: `${baseUrl}/images/itinerary-02.svg`,
    time: "6:15 PM",
  },
  {
    icon: `${baseUrl}/images/itinerary-03.svg`,
    time: "7:30 PM",
  },
];

const itineraryItems = itineraryData.map((item, index) => ({
  ...item,
  ...t.items[index],
}));
---

<section class="px-6 py-16 text-center">
  <!-- Decorative Flower -->
  <div
    data-animate
    class="flex justify-center mb-6"
  >
    <img
      src={`${baseUrl}/images/itinerary.svg`}
      alt=""
      loading="lazy"
      class="w-12 h-14 md:w-14 md:h-16 object-contain"
    />
  </div>

  <!-- Title -->
  <h2
    data-animate
    data-delay="100"
    class="font-serif text-2xl md:text-3xl uppercase tracking-[0.3em] text-ink mb-12 md:mb-16"
  >
    {t.heading}
  </h2>

  <!-- Grid Layout -->
  <div class="max-w-4xl mx-auto md:px-4 px-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12 text-left">
      {itineraryItems.map((item, index) => (
        <div
          data-animate
          data-delay={`${(index + 1) * 100}`}
          class="flex flex-col"
        >
          <!-- Icon + Line -->
          <div class="flex items-center gap-4 mb-4">
            <img
              src={item.icon}
              alt=""
              loading="lazy"
              class="w-10 h-10 object-contain"
            />
            <div class="flex-1 h-px bg-ink/30" />
          </div>

          <!-- Content -->
          <div class="pl-16">
            <p class="text-sm md:text-base text-ink/80 mb-1">{item.time}</p>
            <h3 class="font-serif text-base md:text-lg uppercase text-ink mb-1">
              {item.title}
            </h3>
            <p class="text-sm text-ink/70 mb-3">{item.location}</p>
            {item.mapUrl && (
              <a
                href={item.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block px-4 py-1.5 border border-burgundy text-burgundy text-xs uppercase tracking-wider hover:bg-burgundy hover:text-white transition-colors duration-300"
              >
                {t.mapButton}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Migrar `Footer.astro`**

Reemplazar todo el contenido de `src/components/Footer.astro`:

```astro
---
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].footer;
const baseUrl = EVENT_CONFIG.baseUrl;
---

<footer data-animate class="relative mt-16">
  <!-- Main Section - Burgundy Background -->
  <div class="bg-accent text-white text-center relative">
    <!-- Contact Info -->
    <a
      href="tel:+523310631395"
      data-animate
      data-delay="500"
      class="block text-sm md:text-base mt-1 hover:underline"
    >
      33 1063 1395
    </a>

    <!-- Instagram -->
    <div
      data-animate
      data-delay="500"
      class="flex items-center justify-center gap-2 mt-6"
    >
      <span class="text-sm">{t.instagram}</span>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:opacity-80 hover:scale-110 transition-all duration-300"
        aria-label="Instagram"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          class="w-5 h-5"
        >
          <rect x="2" y="2" width="20" height="20" rx="5"></rect>
          <circle cx="12" cy="12" r="5"></circle>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"
          ></circle>
        </svg>
      </a>
    </div>

    <!-- Credits -->
    <p
      data-animate
      data-delay="500"
      class="text-xs md:text-sm mt-1 opacity-80 pb-4"
    >
      {t.credits}
    </p>
  </div>
</footer>
```

- [ ] **Step 3: Migrar `PhotoGallery.tsx`**

Reemplazar todo el contenido de `src/components/PhotoGallery.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";

const baseUrl = EVENT_CONFIG.baseUrl;

// Rutas de las imágenes (el alt text sale del diccionario según el idioma)
const imagePaths = [
  `${baseUrl}/images/novios01.webp`,
  `${baseUrl}/images/novios02.webp`,
  `${baseUrl}/images/novios03.webp`,
  `${baseUrl}/images/novios04.webp`,
  `${baseUrl}/images/novios05.webp`,
];

interface PhotoGalleryProps {
  lang?: Lang;
}

export function PhotoGallery({ lang = "es" }: PhotoGalleryProps) {
  const alts = translations[lang].gallery.alts;
  const images = imagePaths.map((src, index) => ({ src, alt: alts[index] }));
  // Duplicar imágenes para efecto infinito
  const duplicatedImages = [...images, ...images];

  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mobilePositionRef = useRef(0);
  const desktopPositionRef = useRef(0);

  // IntersectionObserver para detectar cuando está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animación de carrusel
  useEffect(() => {
    if (!isInView) return;

    const speed = 1.5;

    const animate = () => {
      // Mobile
      if (mobileContainerRef.current) {
        const totalWidth = mobileContainerRef.current.scrollWidth;
        const resetPoint = totalWidth / 2;

        if (resetPoint > 0) {
          mobilePositionRef.current += speed;
          if (mobilePositionRef.current >= resetPoint) {
            mobilePositionRef.current -= resetPoint;
          }
          mobileContainerRef.current.style.transform = `translateX(-${mobilePositionRef.current}px)`;
        }
      }

      // Desktop
      if (desktopContainerRef.current) {
        const totalWidth = desktopContainerRef.current.scrollWidth;
        const resetPoint = totalWidth / 2;

        if (resetPoint > 0) {
          desktopPositionRef.current += speed;
          if (desktopPositionRef.current >= resetPoint) {
            desktopPositionRef.current -= resetPoint;
          }
          desktopContainerRef.current.style.transform = `translateX(-${desktopPositionRef.current}px)`;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView]);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden relative">
      {/* Mobile: Carrusel con imágenes de altura fija */}
      <div className="md:hidden relative h-[100vw] overflow-hidden">
        <div
          ref={mobileContainerRef}
          className={`flex h-full transition-opacity duration-700 ${isInView ? "opacity-100" : "opacity-0"
            }`}
        >
          {duplicatedImages.map((img, index) => (
            <img
              key={`mobile-${img.src}-${index}`}
              src={img.src}
              alt={img.alt}
              loading={index < images.length ? "eager" : "lazy"}
              className={`h-full w-auto object-cover shrink-0 transition-all duration-700 ${isInView ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Carrusel con imágenes de altura fija */}
      <div className="hidden md:block h-[25vw] overflow-hidden">
        <div
          ref={desktopContainerRef}
          className={`flex h-full transition-opacity duration-700 ${isInView ? "opacity-100" : "opacity-0"
            }`}
        >
          {duplicatedImages.map((img, index) => (
            <img
              key={`desktop-${img.src}-${index}`}
              src={img.src}
              alt={img.alt}
              loading={index < images.length ? "eager" : "lazy"}
              className={`h-full w-auto object-cover shrink-0 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{
                transitionDelay: isInView ? `${(index % 4) * 100}ms` : "0ms",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PhotoGallery;
```

- [ ] **Step 4: Verificar que el sitio en español no cambió**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
```

Expected: sin salida de `diff`. (`PhotoGallery` no se renderiza en `index.astro` actualmente — ver nota en Task 9 — así que este cambio no debería afectar el HTML generado en absoluto.)

- [ ] **Step 5: Commit**

```bash
git add src/components/Itinerary.astro src/components/Footer.astro src/components/PhotoGallery.tsx
git commit -m "refactor: migra itinerario, footer y galería al diccionario

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 9: Página compartida y ruta en inglés

**Files:**
- Create: `src/components/InvitationPage.astro`
- Create: `src/pages/en/index.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Layout` (Task 3), todos los componentes de secciones (Tasks 4-8), `Lang` (Task 2).
- Produces: `InvitationPage` acepta `lang?: Lang` (default `"es"`). Rutas finales: `/liliana-y-daniel/` y `/liliana-y-daniel/en/`.

- [ ] **Step 1: Crear `InvitationPage.astro`**

Crear `src/components/InvitationPage.astro`:

```astro
---
// Cuerpo compartido de la invitación: arma Layout + EnvelopeOpening +
// todas las secciones, parametrizado por idioma. Usado por
// src/pages/index.astro (es) y src/pages/en/index.astro (en) para no
// duplicar este árbol de componentes entre las dos rutas.
import Layout from "../layouts/Layout.astro";
import { EnvelopeOpening } from "./EnvelopeOpening";
import HeroSection from "./HeroSection.astro";
import StorySection from "./StorySection.astro";
import VenueSection from "./VenueSection.astro";
import RsvpCta from "./RsvpCta.astro";
import GiftRegistry from "./GiftRegistry.astro";
import DressCode from "./DressCode.astro";
import Itinerary from "./Itinerary.astro";
import Concierge from "./Concierge.astro";
import Hospedaje from "./Hospedaje.astro";
import Footer from "./Footer.astro";
import type { Lang } from "../i18n/translations";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
---

<Layout lang={lang}>
  <EnvelopeOpening client:load lang={lang}>
    <main>
      <HeroSection lang={lang} />
      <StorySection lang={lang} />
      <VenueSection lang={lang} />
      <RsvpCta lang={lang} showImage />
      <GiftRegistry lang={lang} />
      <DressCode lang={lang} />
      <Concierge lang={lang} />
      <Hospedaje lang={lang} />
      <RsvpCta lang={lang} showSilhouette />
      <Footer lang={lang} />
    </main>
  </EnvelopeOpening>
</Layout>
```

Nota: el `Itinerary` no estaba montado en `src/pages/index.astro` original (solo se importaba `PhotoGallery` sin usarlo, y `Itinerary` ni siquiera se importaba). Este plan mantiene exactamente la misma composición de secciones que existe hoy en producción — no se agrega `Itinerary` ni `PhotoGallery` al árbol, solo se traducen por si se usan más adelante. Si quieres que `Itinerary` se muestre en el sitio, dilo para agregarlo como una tarea aparte (cambiaría el diseño visual, fuera del alcance de "solo traducir textos").

- [ ] **Step 2: Actualizar `src/pages/index.astro`**

Reemplazar todo el contenido de `src/pages/index.astro`:

```astro
---
import InvitationPage from "../components/InvitationPage.astro";
---

<InvitationPage lang="es" />
```

- [ ] **Step 3: Crear la ruta en inglés**

Crear `src/pages/en/index.astro`:

```astro
---
import InvitationPage from "../../components/InvitationPage.astro";
---

<InvitationPage lang="en" />
```

- [ ] **Step 4: Verificar ambas rutas**

```bash
pnpm build
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html
test -f dist/en/index.html && echo "dist/en/index.html existe"
grep -o '<html lang="en"' dist/en/index.html
grep -o 'We are getting married' dist/en/index.html
grep -o 'Gift Registry' dist/en/index.html
grep -o 'RSVP Here' dist/en/index.html
grep -o 'Recommended Hotels' dist/en/index.html
```

Expected:
- `diff` de `dist/index.html` sin salida (el español sigue igual).
- `dist/en/index.html existe`.
- Cada `grep` encuentra al menos una coincidencia.

- [ ] **Step 5: Probar en el navegador con el dev server**

```bash
pnpm dev
```

Abrir `http://localhost:4321/liliana-y-daniel/` (español, debe verse idéntico a como está hoy) y `http://localhost:4321/liliana-y-daniel/en/` (inglés nuevo). Confirmar:
- El switch `ES · EN` aparece fijo arriba a la derecha en ambas rutas, incluso antes de abrir el sobre.
- Al hacer clic en el switch se navega correctamente entre ambas rutas.
- Con `?Nombre=Test&Pases=2` en la URL, el switch conserva esos parámetros al cambiar de idioma.
- Detener el servidor con Ctrl+C al terminar.

- [ ] **Step 6: Commit**

```bash
git add src/components/InvitationPage.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: agrega la ruta en inglés /en usando la página compartida

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

### Task 10: Limpieza final de `EVENT_CONFIG` y verificación completa

**Files:**
- Modify: `src/config/event.ts`

**Interfaces:**
- Ninguna nueva — esta tarea solo elimina campos de `EVENT_CONFIG` que quedaron duplicados en `translations.ts` y que ya no usa ningún componente (verificado en el Step 1).

- [ ] **Step 1: Confirmar que nada referencia los campos a eliminar**

```bash
grep -rn "EVENT_CONFIG.displayDate\|EVENT_CONFIG.gift.intro\|EVENT_CONFIG.gift.body\|EVENT_CONFIG.gift.ctaLabel\|EVENT_CONFIG.dressCode.note\|EVENT_CONFIG.rsvp\|EVENT_CONFIG.concierge.ctaLabel\|hotel.description\|hotel.highlight" src
```

Expected: sin resultados (todas las tareas anteriores ya migraron estos usos a `translations.ts`).

- [ ] **Step 2: Eliminar los campos duplicados de `event.ts`**

Reemplazar todo el contenido de `src/config/event.ts`:

```ts
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
    ceremonyLabel: "Ceremonia en capilla",
    ceremonyTime: "5:00 PM",
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
```

- [ ] **Step 3: Verificación completa final**

```bash
pnpm build

# El español no debe haber cambiado ni un byte en todo el plan
diff -q dist/index.html /tmp/dizaru-en-i18n-es-snapshot.html

# Checklist de textos clave en español
for phrase in "Querido invitado" "Nuestra boda" "Mesa de regalos" "¡Confirma asistencia!" "Hoteles recomendados" "Reservar"; do
  grep -q "$phrase" dist/index.html && echo "OK es: $phrase" || echo "FALTA es: $phrase"
done

# Checklist de textos clave en inglés
for phrase in "Dear guest" "Our Wedding" "Gift Registry" "RSVP Here" "Recommended Hotels" "Book Now"; do
  grep -q "$phrase" dist/en/index.html && echo "OK en: $phrase" || echo "FALTA en: $phrase"
done
```

Expected: el `diff` no imprime nada, y todas las líneas del checklist dicen `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/config/event.ts
git commit -m "refactor: limpia EVENT_CONFIG de copy que ya vive en translations.ts

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FHVUDNehbwbAi65mD6HUth"
```

---

## Self-Review

**1. Cobertura del spec:** cada sección de la tabla ES→EN del spec tiene tarea: Layout/meta (Task 3), LanguageSwitch (Task 3), EnvelopeOpening (Task 4), HeroSection (Task 4), StorySection (Task 5), VenueSection (Task 5), RsvpCta (Task 6), GiftRegistry (Task 6), DressCode (Task 6), Concierge (Task 7), Hospedaje (Task 7), Itinerary (Task 8), Footer (Task 8), PhotoGallery (Task 8). El ruteo `/en` y el switch están en Tasks 1, 3 y 9. La limpieza de `EVENT_CONFIG` está en Task 10.

**2. Placeholders:** no hay "TBD"/"TODO" nuevos en el código del plan (el único `TODO` es uno preexistente en `event.ts` sobre el link de Google Maps, que no se toca).

**3. Consistencia de tipos:** `Lang` se define una sola vez en `translations.ts` (Task 2) y se importa igual (`type Lang`) en todos los componentes. `RichSegment` se define en `translations.ts` y se consume en `RichText.astro` sin redefinirse. `Hotel.id: string` (Task 7) coincide con las claves `"one-guadalajara"`/`"hard-rock"` usadas en `translations.ts` (Task 2) y en `Hospedaje.astro` (Task 7).

**Nota abierta para quien ejecute el plan:** Task 9 señala que `Itinerary` y `PhotoGallery` no están montados en la página actual (comportamiento preexistente, no se modifica). Si el usuario esperaba verlos, es una conversación aparte — no cambiar la composición de secciones sin confirmarlo primero, porque sí alteraría el diseño visual actual.

---

Plan completo y guardado en `docs/superpowers/plans/2026-09-14-version-en-invitacion.md`. Dos opciones de ejecución:

1. **Subagent-Driven (recomendado)** — despacho un subagente fresco por tarea, con revisión entre tareas.
2. **Ejecución en esta sesión** — ejecuto las tareas en este chat usando executing-plans, con checkpoints de revisión por bloques.

¿Cuál prefieres?
