# Adaptación al diseño Canva "Boda Liliana & Daniel" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adaptar la invitación Astro existente a la dirección de diseño y estructura de secciones del diseño de Canva "Boda Liliana & Daniel", dejando todo el contenido configurable desde un solo archivo.

**Architecture:** Se conserva la arquitectura actual (Astro estático, una sola página, secciones apiladas, animaciones on-scroll con `IntersectionObserver`). El trabajo es de tres tipos: (1) tokenizar color/tipografía para poder re-tematizar sin tocar cada componente, (2) mover el contenido hardcodeado a `src/config/event.ts`, (3) agregar/ajustar las secciones que el Canva tiene y la base no. El sobre animado (`EnvelopeOpening.tsx`) **NO se toca** — queda exactamente como está.

**Tech Stack:** Astro 5, React 19 (solo islas), Tailwind CSS 3, TypeScript, pnpm.

**Spec:** No hay documento de spec. La referencia de diseño es el Canva `https://www.canva.com/design/DAHS27sK7Qg/KAcytyKVq6H-V-yR6xccpw/edit` y el análisis de secciones que está más abajo en "Referencia de diseño". Los assets los provee el usuario.

---

## Global Constraints

- **Gestor de paquetes: `pnpm`.** Nunca `npm` ni `yarn`.
- **Comentarios, copy y mensajes de commit en español.** Formato de commit: `tipo: mensaje corto` (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`). Una sola línea. Sin créditos ni co-autores.
- **`src/components/EnvelopeOpening.tsx` es intocable.** Ninguna tarea lo modifica. Si un cambio de tokens o de config lo rompería, la tarea debe evitarlo.
- **`baseUrl` sigue siendo `/yareli-y-luis`.** Este plan NO renombra la boda ni cambia los novios; el Canva se usa como dirección de diseño y de estructura, no como contenido literal. Cambiar de boda es una edición posterior de `src/config/event.ts` (y de `astro.config.mjs`), no parte de este plan.
- **No hay test runner en el proyecto.** El ciclo de verificación de cada tarea es: `pnpm build` debe terminar sin errores + revisión visual en `pnpm dev` a 390px (móvil) y 1440px (escritorio). No se agrega infraestructura de tests: es un sitio estático de una página sin lógica de negocio. Donde sí hay lógica (construcción de la URL de Tally) se verifica manualmente con parámetros en la URL.
- **Los assets los coloca el usuario en `public/images/`** con los nombres exactos que indica cada tarea. Si un asset no está cuando toca la tarea, se implementa igual con la ruta correcta y se anota que falta el archivo (la imagen saldrá rota hasta que el usuario la copie); nunca se inventa un placeholder ni se cambia el nombre.
- **Paleta objetivo (del Canva):** borgoña `#842A29` como acento y color de botones sólidos; crema/papel `#F5F1EA` de fondo; texto oscuro `#191919`; texto secundario en borgoña. Los actuales `#4a4c35` (verde olivo) y `#847d63` (café) se eliminan del código.
- **Tipografías: se conservan las del proyecto** (Tenor Sans serif, High Spirited script, Velista firma). Las fuentes del Canva no son descargables; el equivalente aceptado es el set actual.
- **Todas las secciones nuevas usan el mismo patrón de animación:** atributo `data-animate` (y opcionalmente `data-delay="100|200|300|400|500"`) en los elementos que deben aparecer al hacer scroll. El observer ya existe en `src/layouts/Layout.astro`.

---

## Referencia de diseño (secciones del Canva, en orden)

| # | Sección Canva | Acción en este plan |
|---|---|---|
| 1 | Portada con sobre rojo + sello | Sin cambios (`EnvelopeOpening.tsx`) |
| 2 | "Nuestra boda" / nombres / fecha / countdown | Tarea 3 |
| 3 | Historia breve + "Nos casamos en" venue + botón Ver Mapa | Tareas 4 y 5 |
| 4 | Foto + "¿Nos acompañas?" + Confirma asistencia | Tarea 6 |
| 5 | "Su presencia es nuestro mejor regalo" + regalo en efectivo | Tarea 7 |
| 6 | Dress Code Formal | Tarea 8 |
| 7 | Concierge Service + "Hoteles recomendados" | Tarea 9 |
| 8 | Hoteles con foto, descripción y botón Reservar | Tarea 10 |
| 9 | Cierre repetido con CTA de confirmación | Tarea 6 (reutilizada) |

Secciones que la base tiene y el Canva no (`PhotoGallery`, `Itinerary`): **se conservan**, colocadas en el orden nuevo en la Tarea 11.

---

## Estructura de archivos

**Se crean:**
- `src/components/RsvpCta.astro` — bloque de cierre "¿Nos acompañas?" + botón de confirmación. Reutilizable, aparece 2 veces.
- `src/components/RsvpButton.tsx` — isla React mínima: construye la URL de Tally leyendo `Nombre` y `Pases` de la query string. Único componente con lógica.
- `src/components/StorySection.astro` — párrafo de historia breve previo al venue.
- `src/components/Concierge.astro` — sección Concierge Service.

**Se modifican:**
- `src/config/event.ts` — pasa de 6 campos a la estructura completa de contenido.
- `tailwind.config.mjs` — tokens semánticos de color.
- `src/styles/global.css` — variables CSS, fondo de papel.
- `src/layouts/Layout.astro` — variables CSS del `<style is:inline>`.
- `src/components/HeroSection.astro`, `VenueSection.astro`, `GiftRegistry.astro`, `BankDetails.astro`, `DressCode.astro`, `Hospedaje.astro`, `Footer.astro`, `Itinerary.astro`, `PhotoGallery.tsx`, `CountdownTimer.tsx` — leen del config y usan tokens.
- `src/pages/index.astro` — orden de secciones.

**Se elimina:**
- `src/components/AdultsOnlySection.tsx` — ya está fuera del render y su única parte viva (la lógica de Tally) se extrae a `RsvpButton.tsx` en la Tarea 6.

---

## Task 1: Tokens de color

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css:44-52`
- Modify: `src/layouts/Layout.astro:36-52`

**Interfaces:**
- Consumes: nada.
- Produces: clases Tailwind `text-accent`, `bg-accent`, `bg-accent-soft`, `text-accent-soft`, `bg-paper`, `text-ink`, y variables CSS `--color-accent`, `--color-accent-soft`, `--color-paper`, `--color-ink`. Todas las tareas siguientes las usan en vez de hex sueltos.

- [ ] **Step 1: Agregar los tokens semánticos a Tailwind**

En `tailwind.config.mjs`, dentro de `theme.extend.colors`, agregar estas cuatro claves **conservando** las existentes:

```js
      colors: {
        // Tokens semánticos — usar estos en los componentes
        'accent': '#842A29',        // borgoña: acentos, script, botones sólidos
        'accent-soft': '#A85A52',   // borgoña claro: hover y textos secundarios
        'paper': '#F5F1EA',         // crema papel: fondo
        'ink': '#191919',           // texto principal
        // Paleta cruda (no usar directo en componentes nuevos)
        'bg-light': '#F5F5F5',
        'text-dark': '#191919',
        'burgundy': '#842A29',
        'mauve': '#D9C3C3',
        'plum': '#641846',
        'olive': '#93AC5A',
        'gold': '#C78852',
        'navy': '#21374A',
        'brown': '#453C2D',
      },
```

- [ ] **Step 2: Declarar las variables CSS en el bloque crítico del layout**

En `src/layouts/Layout.astro`, dentro de `<style is:inline>`, reemplazar el bloque `:root` completo por:

```css
      :root {
        --font-serif: "Tenor Sans", Georgia, "Times New Roman", serif;
        --font-script: "High Spirited", cursive;
        --color-accent: #842A29;
        --color-accent-soft: #A85A52;
        --color-paper: #F5F1EA;
        --color-ink: #191919;
      }
      body {
        font-family: var(--font-serif);
        color: var(--color-ink);
        background-color: var(--color-paper);
        margin: 0;
      }
```

- [ ] **Step 3: Alinear el fondo del body en global.css**

En `src/styles/global.css`, en la regla `body`, cambiar únicamente la línea del color de fondo:

```css
body {
  @apply text-ink font-serif;
  background-color: #f5f1ea;
  background-image: url("/yareli-y-luis/images/bg-fijo.jpg");
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

- [ ] **Step 4: Verificar que compila**

Ejecutar: `pnpm build`
Esperado: build exitoso, sin errores de Tailwind por clases desconocidas.

- [ ] **Step 5: Verificar visualmente que nada se rompió**

Ejecutar: `pnpm dev` y abrir `http://localhost:4321/yareli-y-luis/`.
Esperado: el sobre abre igual que antes; el fondo del sitio es crema. Los colores olivo/café siguen presentes (se quitan en las tareas siguientes) — eso es correcto en este punto.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: agregar tokens semánticos de color de la paleta borgoña"
```

---

## Task 2: Config de contenido completo

**Files:**
- Modify: `src/config/event.ts` (reemplazo completo)

**Interfaces:**
- Consumes: nada.
- Produces: `EVENT_CONFIG` con la forma exacta de abajo, más los tipos exportados `Hotel` y `EventConfig`. Todas las tareas siguientes leen de aquí. Nombres de campo exactos: `displayDate`, `story`, `venue`, `gift`, `bank`, `dressCode`, `concierge`, `hotels`, `rsvp`.

- [ ] **Step 1: Reescribir el archivo de configuración**

Reemplazar el contenido completo de `src/config/event.ts` por:

```ts
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
    ctaUrl: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/51590751",
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
```

- [ ] **Step 2: Verificar que compila**

Ejecutar: `pnpm build`
Esperado: build exitoso. Ningún componente rompe porque solo se agregaron campos; los seis originales conservan nombre y valor.

- [ ] **Step 3: Commit**

```bash
git add src/config/event.ts
git commit -m "feat: mover el contenido de la invitación a la configuración del evento"
```

---

## Task 3: Hero con la paleta y la fecha del config

**Files:**
- Modify: `src/components/HeroSection.astro` (reemplazo completo)
- Modify: `src/components/CountdownTimer.tsx:47-58`

**Interfaces:**
- Consumes: `EVENT_CONFIG.brideName`, `EVENT_CONFIG.groomName`, `EVENT_CONFIG.displayDate` (Tarea 2); tokens `text-accent`, `text-ink` (Tarea 1).
- Produces: nada que otras tareas consuman.

- [ ] **Step 1: Reescribir el Hero**

Reemplazar el contenido completo de `src/components/HeroSection.astro` por:

```astro
---
import CountdownTimer from './CountdownTimer.tsx';
import { EVENT_CONFIG } from '../config/event';
---

<section class="hero-background relative min-h-screen flex flex-col items-center px-6 pt-20 pb-0 bg-paper bg-[position:calc(50%+28vw)] bg-auto md:bg-center bg-no-repeat">
  <!-- Velo sobre el fondo para que el texto respire -->
  <div class="absolute inset-0 bg-paper/30"></div>

  <!-- Contenido principal -->
  <div class="relative z-10 text-center flex-1 flex flex-col justify-center">
    <p
      data-animate
      class="font-script text-accent text-5xl md:text-6xl mb-4"
    >
      Nuestra boda
    </p>

    <h1 class="font-serif text-ink">
      <span
        data-animate
        data-delay="100"
        class="block text-4xl md:text-5xl tracking-[0.3em] uppercase"
      >
        {EVENT_CONFIG.brideName}
      </span>
      <span
        data-animate="scale"
        data-delay="200"
        class="block font-script text-accent text-5xl md:text-7xl my-2"
      >
        &
      </span>
      <span
        data-animate
        data-delay="300"
        class="block text-4xl md:text-5xl tracking-[0.3em] uppercase"
      >
        {EVENT_CONFIG.groomName}
      </span>
    </h1>

    <p
      data-animate
      data-delay="400"
      class="font-script text-accent text-3xl md:text-4xl mt-6"
    >
      {EVENT_CONFIG.displayDate}
    </p>
  </div>

  <!-- Contador -->
  <div data-animate data-delay="500" class="relative z-10 mb-12">
    <CountdownTimer client:load />
  </div>
</section>
```

- [ ] **Step 2: Alinear el contador con los tokens**

En `src/components/CountdownTimer.tsx`, dentro del `return`, reemplazar las dos clases de color del bloque de cada unidad:

```tsx
            <span className="text-3xl md:text-4xl font-serif text-ink">
              {String(unit.value).padStart(2, "0")}
            </span>
            <p className="text-[10px] uppercase tracking-[0.15em] text-ink/70 mt-1">
              {unit.label}
            </p>
```

- [ ] **Step 3: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso.

- [ ] **Step 4: Verificar visualmente**

Ejecutar: `pnpm dev`, abrir el sitio, abrir el sobre.
Esperado: "Nuestra boda" y la fecha en script borgoña; nombres en serif espaciado; contador visible y avanzando. Revisar a 390px que los nombres no desborden.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSection.astro src/components/CountdownTimer.tsx
git commit -m "feat: aplicar paleta borgoña y fecha configurable al hero"
```

---

## Task 4: Sección de historia

**Files:**
- Create: `src/components/StorySection.astro`

**Interfaces:**
- Consumes: `EVENT_CONFIG.story.lead`, `.highlight`, `.tail` (Tarea 2); token `text-accent`.
- Produces: componente `StorySection` sin props, importable como `import StorySection from '../components/StorySection.astro'`. La Tarea 11 lo monta en `index.astro`.

- [ ] **Step 1: Crear el componente**

Crear `src/components/StorySection.astro` con:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const { story } = EVENT_CONFIG;
---

<section class="px-6 py-16 text-center">
  <p
    data-animate
    class="font-serif text-xl md:text-2xl leading-relaxed max-w-xl mx-auto text-ink"
  >
    {story.lead}
    <span class="text-accent italic">{story.highlight}</span>
    <br />
    {story.tail}
  </p>
</section>
```

- [ ] **Step 2: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso. El componente todavía no se renderiza (se monta en la Tarea 11); esto solo confirma que la sintaxis es válida.

- [ ] **Step 3: Commit**

```bash
git add src/components/StorySection.astro
git commit -m "feat: agregar sección de historia previa al venue"
```

---

## Task 5: Venue con datos del config

**Files:**
- Modify: `src/components/VenueSection.astro` (reemplazo completo)

**Interfaces:**
- Consumes: `EVENT_CONFIG.venue.*`, `EVENT_CONFIG.displayDate`, `EVENT_CONFIG.baseUrl` (Tarea 2); tokens.
- Produces: nada que otras tareas consuman.

- [ ] **Step 1: Reescribir el componente**

Reemplazar el contenido completo de `src/components/VenueSection.astro` por:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const baseUrl = EVENT_CONFIG.baseUrl;
const { venue } = EVENT_CONFIG;
---

<section>
  <div class="flex flex-col md:flex-row md:items-center md:justify-center md:gap-12 md:px-12 lg:px-24 md:py-16">
    <!-- Texto -->
    <div
      data-animate
      class="text-center flex-1 md:max-w-xl px-6 py-16 md:p-0"
    >
      <p class="font-script text-accent text-5xl mb-3">
        Nos casamos en
      </p>
      <h2 class="font-serif text-2xl uppercase tracking-widest md:tracking-[0.2em] text-ink">
        {venue.name}
      </h2>
      <p class="font-script text-accent text-3xl mt-2">
        {EVENT_CONFIG.displayDate}
      </p>
      <p class="text-ink/80 mt-1 text-lg italic">
        {venue.city}
      </p>

      <img
        src={`${baseUrl}/images/venue-asset.png`}
        alt=""
        loading="lazy"
        class="mx-auto my-6 h-16 w-auto"
      />

      <p class="text-accent mt-4 text-md uppercase tracking-[0.15em]">
        {venue.ceremonyLabel}
      </p>
      <p class="text-md">{venue.ceremonyTime}</p>

      <a
        href={venue.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-6 border border-accent text-accent hover:bg-accent hover:text-white w-full max-w-64 mx-auto text-xl inline-block px-8 py-3 font-serif italic transition-colors duration-300 text-center"
      >
        Ver Mapa
      </a>
    </div>

    <!-- Foto del lugar -->
    <div
      data-animate
      data-delay="200"
      class="flex-1 md:max-w-lg"
    >
      <img
        src={`${baseUrl}${venue.image}`}
        alt={venue.name}
        loading="lazy"
        class="w-full h-auto rounded-lg md:shadow-lg"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso.

- [ ] **Step 3: Verificar visualmente**

Ejecutar: `pnpm dev`.
Esperado: el botón "Ver Mapa" ahora es de contorno borgoña y se rellena al pasar el cursor; la foto del venue tiene esquinas redondeadas; el enlace del mapa sigue abriendo Google Maps en pestaña nueva.

- [ ] **Step 4: Commit**

```bash
git add src/components/VenueSection.astro
git commit -m "feat: aplicar diseño borgoña y datos configurables al venue"
```

---

## Task 6: Bloque reutilizable de confirmación de asistencia

**Files:**
- Create: `src/components/RsvpButton.tsx`
- Create: `src/components/RsvpCta.astro`
- Delete: `src/components/AdultsOnlySection.tsx`
- Modify: `src/pages/index.astro:8` (quitar el import comentado de `AdultsOnlySection`)

**Interfaces:**
- Consumes: `EVENT_CONFIG.tallyFormId`, `EVENT_CONFIG.rsvp.*`, `EVENT_CONFIG.brideName`, `EVENT_CONFIG.groomName` (Tarea 2).
- Produces:
  - `RsvpButton` — componente React por defecto y con nombre. Props: `{ label: string; variant?: "solid" | "outline" }`. Renderiza un `<a>` a `https://tally.so/r/<tallyFormId>` con los parámetros `Nombre` y `Pases` propagados desde la query string de la página.
  - `RsvpCta.astro` — componente Astro sin props. Monta `RsvpButton` con `client:load`. La Tarea 11 lo usa dos veces.

- [ ] **Step 1: Crear el botón de Tally**

Crear `src/components/RsvpButton.tsx` con:

```tsx
import { useEffect, useState } from "react";
import { EVENT_CONFIG } from "../config/event";

const BASE_TALLY_URL = `https://tally.so/r/${EVENT_CONFIG.tallyFormId}`;

interface RsvpButtonProps {
  label: string;
  variant?: "solid" | "outline";
}

/** Propaga Nombre y Pases desde la URL de la invitación al formulario de Tally */
function buildTallyUrl(search: string): string {
  const params = new URLSearchParams(search);
  const tallyParams = new URLSearchParams();

  const nombre = params.get("Nombre");
  const pases = params.get("Pases");
  if (nombre) tallyParams.set("Nombre", nombre);
  if (pases) tallyParams.set("Pases", pases);

  const queryString = tallyParams.toString();
  return queryString ? `${BASE_TALLY_URL}?${queryString}` : BASE_TALLY_URL;
}

export function RsvpButton({ label, variant = "solid" }: RsvpButtonProps) {
  // Arranca sin parámetros para evitar desajuste de hidratación
  const [tallyUrl, setTallyUrl] = useState(BASE_TALLY_URL);

  useEffect(() => {
    setTallyUrl(buildTallyUrl(window.location.search));
  }, []);

  const styles =
    variant === "solid"
      ? "bg-accent text-white hover:bg-accent-soft"
      : "border border-accent text-accent hover:bg-accent hover:text-white";

  return (
    <a
      href={tallyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-10 py-4 font-serif text-lg md:text-xl text-center transition-colors duration-300 rounded-sm ${styles}`}
    >
      {label}
    </a>
  );
}

export default RsvpButton;
```

- [ ] **Step 2: Crear el bloque de cierre**

Crear `src/components/RsvpCta.astro` con:

```astro
---
import RsvpButton from './RsvpButton.tsx';
import { EVENT_CONFIG } from '../config/event';
const { rsvp, brideName, groomName } = EVENT_CONFIG;
---

<section class="px-6 py-20 text-center">
  <p
    data-animate
    class="font-serif text-xl md:text-2xl leading-relaxed text-ink"
  >
    {rsvp.headline}
    <br />
    {rsvp.question}
  </p>

  <p
    data-animate
    data-delay="100"
    class="font-signature text-accent text-4xl md:text-5xl mt-6"
  >
    {brideName} & {groomName}
  </p>

  <div data-animate data-delay="200" class="mt-8">
    <RsvpButton label={rsvp.ctaLabel} client:load />
  </div>
</section>
```

- [ ] **Step 3: Borrar el componente muerto**

```bash
git rm src/components/AdultsOnlySection.tsx
```

Y en `src/pages/index.astro`, borrar la línea del import comentado:

```
// import { AdultsOnlySection } from '../components/AdultsOnlySection';
```

y la línea del uso comentado dentro del `<main>`:

```
      <!-- <AdultsOnlySection client:load /> -->
```

- [ ] **Step 4: Montar el bloque temporalmente para poder probarlo**

En `src/pages/index.astro`, agregar el import y una instancia justo antes de `<Footer />`. (La Tarea 11 reordena todo; esto es solo para verificar ahora.)

```astro
import RsvpCta from '../components/RsvpCta.astro';
```

```astro
      <RsvpCta />
```

- [ ] **Step 5: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso, sin errores de import de `AdultsOnlySection`.

- [ ] **Step 6: Verificar la propagación de parámetros de Tally**

Ejecutar: `pnpm dev`, abrir `http://localhost:4321/yareli-y-luis/?Nombre=Ana%20Perez&Pases=2`, abrir el sobre y llegar al bloque de confirmación.
Esperado: el atributo `href` del botón es `https://tally.so/r/A7vQ80?Nombre=Ana+Perez&Pases=2`. Verificarlo con clic derecho → copiar dirección del enlace, o inspeccionando el elemento. Luego abrir la página **sin** parámetros: el `href` debe ser `https://tally.so/r/A7vQ80` sin query string.

- [ ] **Step 7: Commit**

```bash
git add src/components/RsvpButton.tsx src/components/RsvpCta.astro src/pages/index.astro
git commit -m "feat: extraer bloque reutilizable de confirmación de asistencia con Tally"
```

---

## Task 7: Regalo en efectivo y datos bancarios

**Files:**
- Modify: `src/components/GiftRegistry.astro` (reemplazo completo)
- Modify: `src/components/BankDetails.astro` (reemplazo completo)

**Interfaces:**
- Consumes: `EVENT_CONFIG.gift.*`, `EVENT_CONFIG.bank.*`, `EVENT_CONFIG.baseUrl` (Tarea 2); tokens.
- Produces: nada que otras tareas consuman.

- [ ] **Step 1: Reescribir la sección de regalo**

Reemplazar el contenido completo de `src/components/GiftRegistry.astro` por:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const { gift } = EVENT_CONFIG;
---

<section class="px-6 py-16 text-center">
  <div class="max-w-xl mx-auto">
    <p
      data-animate
      class="font-serif text-xl md:text-2xl leading-relaxed text-ink"
    >
      {gift.intro}
    </p>

    <p
      data-animate
      data-delay="100"
      class="font-serif text-base md:text-lg leading-relaxed text-ink mt-4"
    >
      {gift.body}
    </p>

    <a
      href={gift.ctaUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-animate
      data-delay="200"
      class="mt-8 border border-accent text-accent hover:bg-accent hover:text-white inline-block px-10 py-4 font-serif italic text-lg md:text-xl transition-colors duration-300"
    >
      {gift.ctaLabel}
    </a>
  </div>
</section>
```

- [ ] **Step 2: Reescribir los datos bancarios**

Reemplazar el contenido completo de `src/components/BankDetails.astro` por:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const baseUrl = EVENT_CONFIG.baseUrl;
const { bank } = EVENT_CONFIG;
---

<section class="flex items-center justify-center py-16">
  <div class="relative w-11/12 max-w-[550px] mx-auto">
    <!-- Adorno floral superior -->
    <div class="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
      <img
        src={`${baseUrl}/images/assistant-asset.svg`}
        alt=""
        loading="lazy"
        class="w-14 h-14 md:w-16 md:h-16"
      />
    </div>

    <!-- Tarjeta con borde partido arriba -->
    <div class="relative px-8 py-16 md:py-12 border border-t-0 border-accent/30">
      <div class="absolute top-0 left-0 w-[calc(50%-50px)] h-px bg-accent/30"></div>
      <div class="absolute top-0 right-0 w-[calc(50%-50px)] h-px bg-accent/30"></div>

      <div class="text-center">
        <p data-animate class="font-serif text-xl md:text-2xl text-ink mb-2 leading-relaxed">
          Si deseas apoyarnos con un<br />detalle en efectivo,
        </p>

        <p data-animate data-delay="100" class="font-script text-accent text-5xl mb-4">¡Gracias!</p>

        <p data-animate data-delay="200" class="font-serif text-base md:text-lg text-ink/80 mb-10 md:mb-8 leading-relaxed">
          Aquí están nuestros datos bancarios.<br />¡Mil gracias por celebrar con nosotros!
        </p>

        <div data-animate data-delay="300" class="space-y-1 text-ink">
          <p class="font-serif text-sm md:text-base">
            Banco: <span class="font-medium">{bank.bank}</span>
          </p>
          <p class="font-serif text-sm md:text-base">
            Beneficiario: <span class="font-medium">{bank.beneficiary}</span>
          </p>
          <p class="font-serif text-sm md:text-base">
            Número de cuenta: <span class="font-semibold text-base md:text-lg">{bank.account}</span>
          </p>
          <p class="font-serif text-sm md:text-base">
            Cuenta CLABE: <span class="font-semibold text-base md:text-lg">{bank.clabe}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso.

- [ ] **Step 4: Verificar visualmente**

Ejecutar: `pnpm dev`.
Esperado: desapareció el bloque "Mesa de Regalos / Liverpool / No. 51590751"; en su lugar está el texto de regalo en efectivo con el botón de contorno borgoña. El `baseUrl` hardcodeado de `BankDetails` ya no existe: el adorno floral sigue cargando.

- [ ] **Step 5: Commit**

```bash
git add src/components/GiftRegistry.astro src/components/BankDetails.astro
git commit -m "feat: reemplazar mesa de regalos por regalo en efectivo configurable"
```

---

## Task 8: Dress code

**Files:**
- Modify: `src/components/DressCode.astro` (reemplazo completo)

**Interfaces:**
- Consumes: `EVENT_CONFIG.dressCode.code`, `.note`, `EVENT_CONFIG.baseUrl` (Tarea 2); tokens.
- Produces: nada que otras tareas consuman.

**Nota de diseño:** el Canva no muestra paleta de colores de invitados, solo el código y una nota. Se conserva la ilustración de referencia y **se eliminan los círculos de colores**, que pertenecen al diseño anterior.

- [ ] **Step 1: Reescribir el componente**

Reemplazar el contenido completo de `src/components/DressCode.astro` por:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const baseUrl = EVENT_CONFIG.baseUrl;
const { dressCode } = EVENT_CONFIG;
---

<section class="text-center mt-24 px-6">
  <!-- Título -->
  <div data-animate>
    <h2 class="font-serif text-2xl md:text-3xl uppercase tracking-[0.2em] text-ink">
      Dress Code
    </h2>
    <p
      data-animate
      data-delay="100"
      class="font-script text-accent text-4xl md:text-5xl mt-2"
    >
      {dressCode.code}
    </p>
  </div>

  <!-- Ilustración de referencia -->
  <div
    data-animate
    data-delay="200"
    class="mt-10 mx-auto max-w-xs md:max-w-sm relative"
  >
    <img
      src={`${baseUrl}/images/dresscode-example.png`}
      alt="Ejemplo de vestimenta formal"
      loading="lazy"
      class="w-full h-auto relative z-10"
    />
    <!-- Sombra en el piso -->
    <div
      class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-8 md:h-10 z-0"
      style="background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 65%);"
    />
  </div>

  <!-- Nota -->
  <p
    data-animate
    data-delay="300"
    class="font-serif text-lg md:text-xl leading-relaxed max-w-xl mx-auto mt-10 text-ink"
  >
    {dressCode.note}
  </p>
</section>
```

- [ ] **Step 2: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso.

- [ ] **Step 3: Verificar visualmente**

Ejecutar: `pnpm dev`.
Esperado: ya no hay filas de círculos de colores; el bloque es título + "Formal" en script borgoña + ilustración centrada + nota.

- [ ] **Step 4: Commit**

```bash
git add src/components/DressCode.astro
git commit -m "feat: simplificar dress code al formato del diseño de referencia"
```

---

## Task 9: Sección Concierge

**Files:**
- Create: `src/components/Concierge.astro`

**Interfaces:**
- Consumes: `EVENT_CONFIG.concierge.body`, `.detail`, `.ctaLabel`, `.ctaUrl` (Tarea 2); tokens.
- Produces: componente `Concierge` sin props. La Tarea 11 lo monta antes de `Hospedaje`. Su CTA apunta a `#hospedaje`, ancla que la Tarea 10 agrega a la sección de hoteles.

- [ ] **Step 1: Crear el componente**

Crear `src/components/Concierge.astro` con:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const { concierge } = EVENT_CONFIG;
---

<section class="px-6 py-20 text-center">
  <h2
    data-animate
    class="font-serif text-2xl md:text-3xl uppercase tracking-[0.2em] text-ink"
  >
    Concierge
  </h2>
  <p
    data-animate
    data-delay="100"
    class="font-script text-accent text-4xl md:text-5xl mt-1"
  >
    Service
  </p>

  <div class="max-w-xl mx-auto mt-10 space-y-6">
    <p
      data-animate
      data-delay="200"
      class="font-serif text-lg md:text-xl leading-relaxed text-ink"
    >
      {concierge.body}
    </p>
    <p
      data-animate
      data-delay="300"
      class="font-serif text-base md:text-lg leading-relaxed text-ink/85"
    >
      {concierge.detail}
    </p>
  </div>

  <a
    href={concierge.ctaUrl}
    data-animate
    data-delay="400"
    class="mt-10 bg-accent text-white hover:bg-accent-soft inline-block px-10 py-4 font-serif text-lg md:text-xl transition-colors duration-300 rounded-sm"
  >
    {concierge.ctaLabel}
  </a>
</section>
```

- [ ] **Step 2: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso. Todavía no se renderiza (se monta en la Tarea 11).

- [ ] **Step 3: Commit**

```bash
git add src/components/Concierge.astro
git commit -m "feat: agregar sección de servicio de concierge"
```

---

## Task 10: Hospedaje con lista de hoteles

**Files:**
- Modify: `src/components/Hospedaje.astro` (reemplazo completo)

**Interfaces:**
- Consumes: `EVENT_CONFIG.hotels` (array de `Hotel`), `EVENT_CONFIG.baseUrl` (Tarea 2); tokens.
- Produces: el `id="hospedaje"` al que apunta el CTA de la Tarea 9.

**Nota:** hoy el componente duplica el mismo bloque de markup para cada hotel. Esta tarea lo convierte en un `map` sobre `EVENT_CONFIG.hotels`, de modo que agregar o quitar hoteles sea editar el config.

- [ ] **Step 1: Reescribir el componente**

Reemplazar el contenido completo de `src/components/Hospedaje.astro` por:

```astro
---
import { EVENT_CONFIG } from '../config/event';
const baseUrl = EVENT_CONFIG.baseUrl;
const { hotels } = EVENT_CONFIG;
---

<section id="hospedaje" class="px-6 py-16 text-center scroll-mt-8">
  <h2
    data-animate
    class="font-serif text-2xl md:text-3xl uppercase tracking-[0.15em] text-ink"
  >
    Hospedaje
  </h2>

  {hotels.map((hotel, index) => (
    <div class="mt-16 first:mt-10">
      <p
        data-animate
        class="font-serif text-xl md:text-2xl uppercase tracking-[0.15em] text-ink"
      >
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
        class="mt-8 mx-auto max-w-2xl"
      >
        <img
          src={`${baseUrl}${hotel.image}`}
          alt={hotel.name}
          loading="lazy"
          class="w-full h-auto object-cover rounded-lg"
        />
      </div>

      <p
        data-animate
        data-delay="300"
        class="font-serif text-base md:text-lg leading-relaxed max-w-xl mx-auto mt-8 text-ink"
      >
        {hotel.description}
      </p>

      <a
        href={hotel.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-animate
        data-delay="400"
        class={`mt-8 inline-block px-10 py-4 font-serif text-lg md:text-xl transition-colors duration-300 ${
          index % 2 === 0
            ? 'bg-accent text-white hover:bg-accent-soft rounded-sm'
            : 'border border-accent text-accent hover:bg-accent hover:text-white italic'
        }`}
      >
        Reservar
      </a>
    </div>
  ))}
</section>
```

- [ ] **Step 2: Verificar build**

Ejecutar: `pnpm build`
Esperado: build exitoso.

- [ ] **Step 3: Verificar visualmente**

Ejecutar: `pnpm dev`.
Esperado: dos bloques de hotel, cada uno con nombre, subtítulo en script, foto, descripción y botón "Reservar" (el primero sólido, el segundo de contorno, alternando como en el Canva). Ambos enlaces abren en pestaña nueva. A 390px la imagen ocupa el ancho completo sin desbordar.

- [ ] **Step 4: Verificar el ancla desde Concierge**

Todavía no se puede probar hasta la Tarea 11 (Concierge aún no está montado). Anotarlo y verificarlo en la Tarea 11, Step 4.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hospedaje.astro
git commit -m "feat: convertir hospedaje en lista de hoteles configurable"
```

---

## Task 11: Orden de secciones y limpieza de colores restantes

**Files:**
- Modify: `src/pages/index.astro` (reemplazo completo)
- Modify: `src/components/Itinerary.astro` (solo clases de color)
- Modify: `src/components/Footer.astro` (solo clases de color)
- Modify: `src/components/PhotoGallery.tsx` (solo clases de color, si las hay)

**Interfaces:**
- Consumes: `StorySection` (Tarea 4), `RsvpCta` (Tarea 6), `Concierge` (Tarea 9), más los componentes ya existentes.
- Produces: la página final.

- [ ] **Step 1: Reescribir la página**

Reemplazar el contenido completo de `src/pages/index.astro` por:

```astro
---
import Layout from '../layouts/Layout.astro';
import { EnvelopeOpening } from '../components/EnvelopeOpening';
import HeroSection from '../components/HeroSection.astro';
import StorySection from '../components/StorySection.astro';
import VenueSection from '../components/VenueSection.astro';
import { PhotoGallery } from '../components/PhotoGallery';
import RsvpCta from '../components/RsvpCta.astro';
import GiftRegistry from '../components/GiftRegistry.astro';
import BankDetails from '../components/BankDetails.astro';
import DressCode from '../components/DressCode.astro';
import Itinerary from '../components/Itinerary.astro';
import Concierge from '../components/Concierge.astro';
import Hospedaje from '../components/Hospedaje.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <EnvelopeOpening client:load>
    <main>
      <HeroSection />
      <StorySection />
      <VenueSection />
      <PhotoGallery client:visible />
      <RsvpCta />
      <GiftRegistry />
      <BankDetails />
      <DressCode />
      <Itinerary />
      <Concierge />
      <Hospedaje />
      <RsvpCta />
      <Footer />
    </main>
  </EnvelopeOpening>
</Layout>
```

- [ ] **Step 2: Reemplazar los colores viejos que queden**

Buscar los hex del diseño anterior:

```bash
grep -rn "4a4c35\|847d63\|text-text-dark\|bg-bg-light" src/
```

En cada resultado (esperados: `Itinerary.astro`, `Footer.astro`, y posiblemente `PhotoGallery.tsx`), aplicar estas sustituciones:

- `text-[#4a4c35]` → `text-accent`
- `bg-[#847d63]` → `bg-accent`
- `hover:bg-[#847d63]/80` y `hover:bg-[#847d63]/90` → `hover:bg-accent-soft`
- `text-text-dark` → `text-ink`
- `bg-bg-light` → `bg-paper`

**No tocar `src/components/EnvelopeOpening.tsx`** aunque aparezca en los resultados.

- [ ] **Step 3: Verificar que no queda ningún hex viejo**

Ejecutar: `grep -rn "4a4c35\|847d63" src/ --exclude=EnvelopeOpening.tsx`
Esperado: sin resultados.

- [ ] **Step 4: Verificar build y recorrido completo**

Ejecutar: `pnpm build`, luego `pnpm dev`.
Esperado:
- El sobre abre igual que antes (no se tocó).
- El orden de secciones es: hero → historia → venue → galería → confirmar → regalo → banco → dress code → itinerario → concierge → hospedaje → confirmar → footer.
- El botón "Hoteles recomendados" de Concierge hace scroll suave hasta la sección Hospedaje.
- Los dos bloques de confirmación se ven idénticos y ambos enlazan a Tally.
- No queda ningún verde olivo ni café en la página.

- [ ] **Step 5: Verificar responsive**

Con las herramientas de desarrollo, revisar a 390px y a 1440px cada sección nueva o modificada.
Esperado: sin scroll horizontal, sin texto que desborde, botones legibles y del ancho adecuado en móvil.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/components/Itinerary.astro src/components/Footer.astro src/components/PhotoGallery.tsx
git commit -m "feat: reordenar secciones al diseño de referencia y unificar la paleta"
```

---

## Task 12: Assets y verificación final

**Files:**
- Modify: `src/styles/global.css` (fondo de papel, si el usuario entrega textura nueva)

**Interfaces:**
- Consumes: los assets exportados de Canva por el usuario.
- Produces: la entrega final.

**Assets esperados en `public/images/`** (nombres exactos; los provee el usuario):
- `bg-fijo.jpg` — textura de papel de fondo (reemplaza la actual)
- `venue.jpg` — foto del lugar
- `hospedaje.jpg`, `hospedaje02.jpg` — fotos de hoteles
- `dresscode-example.png` — ilustración de vestimenta
- `assistant-asset.svg`, `venue-asset.png` — adornos florales

Todos ya existen con esos nombres; si el usuario entrega versiones nuevas, se sobrescriben sin cambiar rutas ni código.

- [ ] **Step 1: Confirmar que los assets están en su lugar**

Ejecutar: `ls -la public/images/`
Esperado: los archivos de la lista de arriba presentes y con fecha de modificación reciente si el usuario los reemplazó.

- [ ] **Step 2: Ajustar el fondo si la textura nueva lo pide**

Si la textura de papel nueva se ve demasiado marcada al estar fija, en `src/styles/global.css` cambiar en la regla `body`:

```css
  background-attachment: scroll;
  background-size: 600px;
  background-repeat: repeat;
```

Si se ve bien con la configuración actual (`fixed` + `cover`), no cambiar nada.

- [ ] **Step 3: Build de producción**

Ejecutar: `pnpm build && pnpm preview`
Esperado: build sin errores ni advertencias de assets faltantes; el preview sirve el sitio en `/yareli-y-luis/` y todas las imágenes cargan (revisar la pestaña Network sin 404).

- [ ] **Step 4: Recorrido final con parámetros reales**

Abrir el preview en `?Nombre=Ana%20Perez&Pases=2`, abrir el sobre y recorrer la página completa hasta el footer.
Esperado: todo carga, ambos botones de confirmación llevan a Tally con `Nombre` y `Pases`, ningún enlace roto, sin errores en la consola.

- [ ] **Step 5: Commit**

```bash
git add public/images src/styles/global.css
git commit -m "feat: incorporar assets del diseño de referencia y ajustar fondo de papel"
```

---

## Fuera de alcance (explícito)

- `src/components/EnvelopeOpening.tsx` y sus assets (`envelope-flap.png`, `envelope-bottom.png`, `sello-nuestra-boda.png`): quedan como están, por instrucción del usuario.
- Cambiar los novios, la fecha o el `baseUrl` a los del Canva (Liliana & Daniel, 15 de mayo de 2027, Hacienda La Magdalena): es una edición de `src/config/event.ts` (y `astro.config.mjs` para el `base`) posterior a este plan.
- Sustituir las tipografías por las del Canva: no son descargables; se conserva el set actual.
- Agregar un test runner al proyecto.
