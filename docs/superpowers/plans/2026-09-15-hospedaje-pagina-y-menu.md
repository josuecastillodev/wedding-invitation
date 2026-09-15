# Hospedaje como página aparte + menú de hamburguesa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mover la sección de Hospedaje a su propia página (ES/EN) enlazada desde el botón "Hoteles recomendados", y agregar un menú de hamburguesa (Home, RSVP, Regalos, Hospedaje) visible en todo el sitio.

**Architecture:** Astro (output estático) con i18n de rutas nativo (`astro:i18n`, `base: /liliana-y-daniel`). Se añade un componente de página `HospedajePage.astro` (análogo a `InvitationPage.astro`) montado por dos rutas nuevas (`/hospedaje`, `/en/hospedaje`). La navegación (hamburguesa) es un componente React montado una sola vez en `Layout.astro` con `client:load`, recibiendo los hrefs ya resueltos (build time) como props — sin lógica de i18n en el cliente.

**Tech Stack:** Astro 5, React 19 (islas `client:load`), Tailwind 3, TypeScript. Sin framework de testing en este repo — la verificación es `pnpm typecheck` (`astro check`), `pnpm build`, y QA manual en el navegador.

## Global Constraints

- Mismo look & feel que el resto del sitio: fondo/texturas de `Layout.astro`, tipografías (`font-serif`/`font-script`), y animaciones `data-animate` existentes (spec §Alcance).
- No se cambia copy/contenido de Hospedaje, solo su ubicación (spec §Alcance).
- Navegación en la misma pestaña, sin `target="_blank"` (spec §3).
- Todos los hrefs del menú y de "Hoteles recomendados" respetan el idioma activo vía `getRelativeLocaleUrl` (spec §3, §4).
- El menú tiene exactamente 4 entradas: Home, RSVP, Regalos, Hospedaje (spec §4).
- Colores/clases del sistema existente: `bg-paper`, `text-ink`, `text-accent`, `border-accent/30` (ver `tailwind.config.mjs`).

---

### Task 1: Traducciones del menú (`nav`)

**Files:**
- Modify: `src/i18n/translations.ts:27-87` (interfaz `Translations`)
- Modify: `src/i18n/translations.ts:90-214` (bloque `es`)
- Modify: `src/i18n/translations.ts:215-346` (bloque `en`)

**Interfaces:**
- Produces: `Translations.nav: { home: string; rsvp: string; gift: string; hospedaje: string; back: string }`, consumido por `Layout.astro` (Task 4) y `HospedajePage.astro` (Task 5).

- [ ] **Step 1: Agregar el campo `nav` a la interfaz `Translations`**

En `src/i18n/translations.ts`, dentro de `export interface Translations { ... }`, agrega este bloque justo después de `hospedaje: { ... };` (línea 74) y antes de `itinerary: { ... };`:

```ts
  nav: {
    home: string;
    rsvp: string;
    gift: string;
    hospedaje: string;
    back: string;
  };
```

- [ ] **Step 2: Agregar el copy en español**

Dentro de `es: { ... }`, agrega este bloque justo después de la sección `hospedaje: { ... },` (después de la línea 191, antes de `itinerary: {`):

```ts
    nav: {
      home: "Home",
      rsvp: "RSVP",
      gift: "Regalos",
      hospedaje: "Hospedaje",
      back: "Volver",
    },
```

- [ ] **Step 3: Agregar el copy en inglés**

Dentro de `en: { ... }`, agrega este bloque justo después de la sección `hospedaje: { ... },` (después de la línea 323, antes de `itinerary: {`):

```ts
    nav: {
      home: "Home",
      rsvp: "RSVP",
      gift: "Registry",
      hospedaje: "Stay",
      back: "Back",
    },
```

- [ ] **Step 4: Verificar tipos**

Run: `pnpm typecheck`
Expected: sin errores (0 errors, 0 warnings relacionados a `translations.ts`).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/translations.ts
git commit -m "feat: agrega traducciones del menu de navegacion"
```

---

### Task 2: Ids de ancla en Home, RSVP y Regalos

**Files:**
- Modify: `src/components/HeroSection.astro:18-20`
- Modify: `src/components/RsvpCta.astro:12,18`
- Modify: `src/components/GiftRegistry.astro:16`

**Interfaces:**
- Produces: anclas `#home`, `#rsvp` (solo en la instancia con `showImage`), `#regalos` en la página principal — consumidas por los hrefs del menú (Task 4).

- [ ] **Step 1: Agregar `id="home"` a HeroSection**

En `src/components/HeroSection.astro`, cambia:

```astro
<section
  class="relative min-h-screen flex flex-col items-center px-6 pt-20 pb-0 overflow-hidden"
>
```

por:

```astro
<section
  id="home"
  class="relative min-h-screen flex flex-col items-center px-6 pt-20 pb-0 overflow-hidden scroll-mt-8"
>
```

- [ ] **Step 2: Agregar `id="rsvp"` condicional a RsvpCta**

En `src/components/RsvpCta.astro`, cambia:

```astro
<section class="relative px-6 py-4 pt-20 pb-8 text-center overflow-hidden">
```

por:

```astro
<section
  id={showImage ? "rsvp" : undefined}
  class="relative px-6 py-4 pt-20 pb-8 text-center overflow-hidden scroll-mt-8"
>
```

- [ ] **Step 3: Agregar `id="regalos"` a GiftRegistry**

En `src/components/GiftRegistry.astro`, cambia:

```astro
<section class="px-6 text-center">
```

por:

```astro
<section id="regalos" class="px-6 text-center scroll-mt-8">
```

- [ ] **Step 4: Verificar tipos**

Run: `pnpm typecheck`
Expected: sin errores.

- [ ] **Step 5: Verificación manual de las anclas**

Run: `pnpm dev` (deja corriendo), abre `http://localhost:4321/liliana-y-daniel/#rsvp` y `http://localhost:4321/liliana-y-daniel/#regalos` en el navegador.
Expected: la página carga con scroll ya posicionado en la sección de RSVP (con la imagen) y en Regalos respectivamente, sin quedar pegada al borde superior. Detén el server (`Ctrl+C`) al terminar.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroSection.astro src/components/RsvpCta.astro src/components/GiftRegistry.astro
git commit -m "feat: agrega anclas home, rsvp y regalos para el menu"
```

---

### Task 3: Componente `NavMenu` (menú de hamburguesa)

**Files:**
- Create: `src/components/NavMenu.tsx`

**Interfaces:**
- Consumes: nada de tasks anteriores (componente autocontenido; recibe todo por props).
- Produces: `export function NavMenu(props: NavMenuProps): JSX.Element` y `export default NavMenu`, con:
  ```ts
  interface NavMenuLabels {
    home: string;
    rsvp: string;
    gift: string;
    hospedaje: string;
  }
  interface NavMenuProps {
    lang: Lang; // "es" | "en", de "../i18n/translations"
    homeHref: string;
    rsvpHref: string;
    giftHref: string;
    hospedajeHref: string;
    labels: NavMenuLabels;
  }
  ```
  Consumido por `Layout.astro` en Task 4.

- [ ] **Step 1: Crear el componente**

Create `src/components/NavMenu.tsx`:

```tsx
import { useEffect, useState } from "react";
import type { Lang } from "../i18n/translations";

interface NavMenuLabels {
  home: string;
  rsvp: string;
  gift: string;
  hospedaje: string;
}

interface NavMenuProps {
  lang: Lang;
  homeHref: string;
  rsvpHref: string;
  giftHref: string;
  hospedajeHref: string;
  labels: NavMenuLabels;
}

export function NavMenu({
  lang,
  homeHref,
  rsvpHref,
  giftHref,
  hospedajeHref,
  labels,
}: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openAriaLabel = lang === "en" ? "Open menu" : "Abrir menú";
  const closeAriaLabel = lang === "en" ? "Close menu" : "Cerrar menú";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const links = [
    { href: homeHref, label: labels.home },
    { href: rsvpHref, label: labels.rsvp },
    { href: giftHref, label: labels.gift },
    { href: hospedajeHref, label: labels.hospedaje },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={openAriaLabel}
        aria-expanded={isOpen}
        className="fixed top-4 left-4 z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 border border-accent/30 shadow-md backdrop-blur-sm"
      >
        <span className="flex flex-col gap-[3px]" aria-hidden="true">
          <span className="block h-[2px] w-4 bg-ink" />
          <span className="block h-[2px] w-4 bg-ink" />
          <span className="block h-[2px] w-4 bg-ink" />
        </span>
      </button>

      <div
        className="fixed inset-0 z-[70]"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <button
          type="button"
          aria-label={closeAriaLabel}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-ink/40"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 300ms ease-out",
          }}
        />

        <nav
          aria-hidden={!isOpen}
          className="absolute left-0 top-0 h-full w-[280px] max-w-[80%] bg-paper shadow-xl px-8 py-16 flex flex-col gap-8"
          style={{
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 300ms ease-out",
          }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label={closeAriaLabel}
            className="self-end font-serif text-2xl leading-none text-ink"
          >
            ×
          </button>

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-serif text-xl text-ink hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

export default NavMenu;
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm typecheck`
Expected: sin errores. (El componente aún no se usa en ninguna página, así que no hay verificación visual en este paso.)

- [ ] **Step 3: Commit**

```bash
git add src/components/NavMenu.tsx
git commit -m "feat: agrega componente NavMenu (menu de hamburguesa)"
```

---

### Task 4: Montar `NavMenu` en `Layout.astro`

**Files:**
- Modify: `src/layouts/Layout.astro:1-26` (frontmatter)
- Modify: `src/layouts/Layout.astro:67-69` (body)

**Interfaces:**
- Consumes: `NavMenu` de Task 3 (props `lang`, `homeHref`, `rsvpHref`, `giftHref`, `hospedajeHref`, `labels`); `Translations.nav` de Task 1.
- Produces: el menú de hamburguesa visible en toda página que use `Layout.astro` (invitación principal y, tras Task 5, Hospedaje).

- [ ] **Step 1: Importar `NavMenu` y `getRelativeLocaleUrl`, y calcular los hrefs**

En `src/layouts/Layout.astro`, cambia el frontmatter de:

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
```

a:

```astro
---
import '../styles/global.css';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { EVENT_CONFIG } from '../config/event';
import { translations, type Lang } from '../i18n/translations';
import LanguageSwitch from '../components/LanguageSwitch.astro';
import NavMenu from '../components/NavMenu';

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

const homeUrl = getRelativeLocaleUrl(lang, '');
const navHomeHref = `${homeUrl}#home`;
const navRsvpHref = `${homeUrl}#rsvp`;
const navGiftHref = `${homeUrl}#regalos`;
const navHospedajeHref = getRelativeLocaleUrl(lang, 'hospedaje');
---
```

- [ ] **Step 2: Renderizar `NavMenu` junto al `LanguageSwitch`**

Cambia:

```astro
  <body>
    <LanguageSwitch lang={lang} />
    <slot />
```

por:

```astro
  <body>
    <LanguageSwitch lang={lang} />
    <NavMenu
      client:load
      lang={lang}
      homeHref={navHomeHref}
      rsvpHref={navRsvpHref}
      giftHref={navGiftHref}
      hospedajeHref={navHospedajeHref}
      labels={t.nav}
    />
    <slot />
```

- [ ] **Step 3: Verificar tipos**

Run: `pnpm typecheck`
Expected: sin errores.

- [ ] **Step 4: Verificación manual del menú**

Run: `pnpm dev`, abre `http://localhost:4321/liliana-y-daniel/` en el navegador.
Expected: aparece un botón de hamburguesa fijo arriba a la izquierda (junto al selector ES/EN en la derecha). Al hacer click se abre un panel lateral con 4 links: Home, RSVP, Regalos, Hospedaje. Click en "Home" hace scroll a la sección Hero y cierra el menú; click fuera del panel (overlay) o `Escape` también lo cierra. El link "Hospedaje" en este punto dará 404 (la página aún no existe — se crea en Task 5). Detén el server al terminar.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: monta el menu de hamburguesa en el layout"
```

---

### Task 5: Página de Hospedaje (ES/EN)

**Files:**
- Create: `src/components/HospedajePage.astro`
- Create: `src/pages/hospedaje.astro`
- Create: `src/pages/en/hospedaje.astro`
- Modify: `src/components/InvitationPage.astro:8,15,36` (quitar `Hospedaje` del flujo principal)

**Interfaces:**
- Consumes: `Hospedaje.astro` (sin cambios), `Footer.astro` (sin cambios), `Translations.nav.back` de Task 1, `Layout.astro` de Task 4 (que ya trae el `NavMenu` y el `LanguageSwitch` incluidos).
- Produces: rutas `/liliana-y-daniel/hospedaje` y `/liliana-y-daniel/en/hospedaje`.

- [ ] **Step 1: Crear `HospedajePage.astro`**

Create `src/components/HospedajePage.astro`:

```astro
---
// Página independiente de Hospedaje: arma Layout + link de "Volver" +
// la sección Hospedaje + Footer, parametrizado por idioma. Análogo a
// InvitationPage.astro, usado por src/pages/hospedaje.astro (es) y
// src/pages/en/hospedaje.astro (en).
import Layout from "../layouts/Layout.astro";
import Hospedaje from "./Hospedaje.astro";
import Footer from "./Footer.astro";
import { getRelativeLocaleUrl } from "astro:i18n";
import { translations, type Lang } from "../i18n/translations";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].nav;
const homeHref = getRelativeLocaleUrl(lang, "");
---

<Layout lang={lang}>
  <main>
    <div class="pt-24 px-6 text-center">
      <a
        href={homeHref}
        class="inline-block font-serif text-lg text-ink hover:text-accent transition-colors duration-200"
      >
        ← {t.back}
      </a>
    </div>
    <Hospedaje lang={lang} />
    <Footer lang={lang} />
  </main>
</Layout>
```

- [ ] **Step 2: Crear las rutas ES y EN**

Create `src/pages/hospedaje.astro`:

```astro
---
import HospedajePage from "../components/HospedajePage.astro";
---

<HospedajePage lang="es" />
```

Create `src/pages/en/hospedaje.astro`:

```astro
---
import HospedajePage from "../../components/HospedajePage.astro";
---

<HospedajePage lang="en" />
```

- [ ] **Step 3: Quitar `Hospedaje` del flujo de la invitación principal**

En `src/components/InvitationPage.astro`, quita la línea de import:

```astro
import Hospedaje from "./Hospedaje.astro";
```

y quita la línea de uso:

```astro
      <Hospedaje lang={lang} />
```

(El archivo debe quedar con `RsvpCta lang={lang} showImage`, luego `GiftRegistry`, `DressCode`, `Concierge`, y directo a `RsvpCta lang={lang} showSilhouette`, `Footer`.)

- [ ] **Step 4: Verificar tipos**

Run: `pnpm typecheck`
Expected: sin errores.

- [ ] **Step 5: Verificación manual de las 4 rutas**

Run: `pnpm dev`, visita en el navegador:
- `http://localhost:4321/liliana-y-daniel/hospedaje`
- `http://localhost:4321/liliana-y-daniel/en/hospedaje`
- `http://localhost:4321/liliana-y-daniel/` (confirmar que ya NO aparece la sección Hospedaje al hacer scroll completo)
- `http://localhost:4321/liliana-y-daniel/en/`

Expected: las páginas de Hospedaje cargan con el mismo fondo/tipografía del sitio, el link "Volver"/"Back" arriba, y debajo la lista de hoteles con sus animaciones al hacer scroll. El link "Volver" regresa a la home del idioma correspondiente. La invitación principal ya no incluye la sección Hospedaje. Detén el server al terminar.

- [ ] **Step 6: Commit**

```bash
git add src/components/HospedajePage.astro src/pages/hospedaje.astro src/pages/en/hospedaje.astro src/components/InvitationPage.astro
git commit -m "feat: mueve hospedaje a una pagina independiente"
```

---

### Task 6: Botón "Hoteles recomendados" apunta a la página de Hospedaje

**Files:**
- Modify: `src/components/Concierge.astro:1-14,54-61`
- Modify: `src/config/event.ts:59-62`

**Interfaces:**
- Consumes: ninguna interfaz nueva (usa `getRelativeLocaleUrl`, ya usado en `LanguageSwitch.astro` y `Layout.astro`).
- Produces: el CTA de Concierge navega a `/hospedaje` (o `/en/hospedaje`) en vez de anclar a `#hospedaje`.

- [ ] **Step 1: Quitar `concierge.ctaUrl` de la config**

En `src/config/event.ts`, cambia:

```ts
  // Servicio de concierge de los wedding planners (el copy vive en src/i18n/translations.ts)
  concierge: {
    ctaUrl: "#hospedaje",
  },

```

por (se quita el bloque completo, ya no queda nada que configurar ahí):

```ts

```

(Es decir, borra esas 4 líneas —incluyendo el comentario— dejando el salto de línea entre `dressCode: { ... },` y `// Hoteles recomendados ...`.)

- [ ] **Step 2: Resolver el href en el componente**

En `src/components/Concierge.astro`, cambia el frontmatter de:

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
```

a:

```astro
---
import { getRelativeLocaleUrl } from "astro:i18n";
import { EVENT_CONFIG } from "../config/event";
import { translations, type Lang } from "../i18n/translations";
import RichText from "./RichText.astro";

interface Props {
  lang?: Lang;
}

const { lang = "es" } = Astro.props;
const t = translations[lang].concierge;
const baseUrl = EVENT_CONFIG.baseUrl;
const hospedajeHref = getRelativeLocaleUrl(lang, "hospedaje");
---
```

y cambia el link:

```astro
  <a
    href={concierge.ctaUrl}
    data-animate
    data-delay="400"
    class="mt-10 bg-accent text-white hover:bg-accent-soft inline-block py-2 font-serif text-2xl md:text-3xl transition-colors duration-300 rounded-md w-64"
  >
    {t.ctaLabel}
  </a>
```

por:

```astro
  <a
    href={hospedajeHref}
    data-animate
    data-delay="400"
    class="mt-10 bg-accent text-white hover:bg-accent-soft inline-block py-2 font-serif text-2xl md:text-3xl transition-colors duration-300 rounded-md w-64"
  >
    {t.ctaLabel}
  </a>
```

- [ ] **Step 3: Verificar tipos**

Run: `pnpm typecheck`
Expected: sin errores (en particular, que no queden referencias sueltas a `EVENT_CONFIG.concierge`).

- [ ] **Step 4: Verificación manual**

Run: `pnpm dev`, en `http://localhost:4321/liliana-y-daniel/` baja hasta la sección Concierge y haz click en "Hoteles recomendados". Repite en `http://localhost:4321/liliana-y-daniel/en/` con "Recommended Hotels".
Expected: en ambos casos navega (misma pestaña) a la página de Hospedaje en el idioma correspondiente (`/liliana-y-daniel/hospedaje` o `/liliana-y-daniel/en/hospedaje`). Detén el server al terminar.

- [ ] **Step 5: Commit**

```bash
git add src/components/Concierge.astro src/config/event.ts
git commit -m "fix: boton de hoteles recomendados navega a la pagina de hospedaje"
```

---

### Task 7: Verificación final de build

**Files:** ninguno (solo verificación; no se esperan más cambios de código).

**Interfaces:** ninguna nueva.

- [ ] **Step 1: Typecheck completo**

Run: `pnpm typecheck`
Expected: `0 errors, 0 warnings, 0 hints` (o equivalente, sin errores).

- [ ] **Step 2: Build de producción**

Run: `pnpm build`
Expected: build exitoso, y en el output se listan las 4 rutas generadas: `/`, `/en/`, `/hospedaje/`, `/en/hospedaje/` (o sus equivalentes `.html`, según cómo Astro las nombre en el resumen del build).

- [ ] **Step 3: QA manual de extremo a extremo**

Run: `pnpm preview` (sirve el build de producción), y en el navegador recorre:
1. Home ES → click "Hoteles recomendados" → llega a Hospedaje ES → click "Volver" → regresa a Home ES.
2. Cambia a EN con el selector de idioma → repite el mismo recorrido en inglés.
3. Desde Home, abre el menú de hamburguesa y prueba los 4 links (Home, RSVP, Regalos, Hospedaje) en ES y en EN.
4. Prueba el menú en una ventana angosta (~375px) y confirma que el botón de hamburguesa (izquierda) y el selector de idioma (derecha) no se traslapan.

Expected: todo el recorrido funciona sin 404s, sin console errors, y visualmente consistente con el resto del sitio (mismo fondo, tipografías y animaciones). Detén el server al terminar.

- [ ] **Step 4: Commit final (si hubo ajustes)**

Si el QA manual no requirió cambios, no hay nada que commitear en este paso — el plan queda completo con los commits de las Tasks 1-6. Si se detectó y corrigió algo durante el QA, commitea ese fix puntual:

```bash
git add -A
git commit -m "fix: ajustes de QA en hospedaje y menu de navegacion"
```
