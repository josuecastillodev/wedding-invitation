# Hospedaje como página aparte + menú de hamburguesa

## Contexto

Actualmente todo el sitio vive en una sola página (`InvitationPage.astro`)
con secciones apiladas y navegación por scroll/anclas. El botón "Hoteles
recomendados" de la sección Concierge (`ctaUrl: "#hospedaje"`) hace scroll
a la sección `Hospedaje` en la misma página.

Se pide:
1. Mover la sección de Hospedaje a una página propia.
2. Que el botón "Hoteles recomendados" navegue a esa página nueva.
3. De paso, agregar un menú de hamburguesa de navegación general
   (Home, RSVP, Regalos, Hospedaje) visible en ambas páginas.

## Alcance

Dentro de esta spec:
- Nueva página de Hospedaje (ES/EN), con el mismo look & feel que el resto
  del sitio (fondo, tipografías, animaciones `data-animate`).
- Botón "Volver" desde Hospedaje hacia la invitación principal.
- Menú de hamburguesa con 4 entradas: Home, RSVP, Regalos, Hospedaje.
- Ajuste del `ctaUrl` de Concierge para apuntar a la nueva página.
- Ids de ancla nuevos en Hero, RSVP (instancia `showImage`) y GiftRegistry
  para que el menú pueda enlazarlos.

Fuera de alcance:
- Cualquier otro rediseño de navegación (breadcrumbs, footer nav, etc.).
- Cambios de contenido/copy de Hospedaje más allá de moverlo de lugar.
- Persistir estado de "sección activa" en el menú.

## Diseño

### 1. Estructura de páginas

Astro ya resuelve i18n vía `i18n.routing` (`defaultLocale: es`, sin prefijo
para `es`, prefijo `/en` para inglés) y `base: /liliana-y-daniel`. Se sigue
el mismo patrón que `index.astro` / `en/index.astro`:

- `src/pages/hospedaje.astro` → `<HospedajePage lang="es" />`
- `src/pages/en/hospedaje.astro` → `<HospedajePage lang="en" />`

Nuevo componente `src/components/HospedajePage.astro` (análogo a
`InvitationPage.astro`), que arma:

```
<Layout lang={lang}>
  <NavMenu lang={lang} />
  <LanguageSwitch lang={lang} />  <!-- ya lo pone Layout -->
  <main>
    <BackLink lang={lang} />      <!-- link "Volver" simple, no un componente aparte necesariamente -->
    <Hospedaje lang={lang} />
    <Footer lang={lang} />
  </main>
</Layout>
```

`Hospedaje.astro` no cambia internamente (mismo componente, mismo id
`#hospedaje`, misma copy). Se quita su `import`/uso de `InvitationPage.astro`.

El link "Volver" es un `<a>` simple con estilo consistente (font-serif,
color ink/accent) apuntando a la home del idioma activo
(`getRelativeLocaleUrl(lang, "")`), colocado arriba del heading de
Hospedaje.

### 2. Ids de ancla nuevos

Para que el menú pueda enlazar secciones de la página principal:

- `HeroSection.astro`: agrega `id="home"` a su `<section>`.
- `RsvpCta.astro`: cuando `showImage` es `true` (primera instancia, la
  que funciona como CTA principal de RSVP), agrega `id="rsvp"` a la
  `<section>`. La segunda instancia (`showSilhouette`) no lleva id.
- `GiftRegistry.astro`: agrega `id="regalos"` a su `<section>`.

Todas llevan `scroll-mt-8` igual que `#hospedaje` ya la tiene, para que el
scroll-to-anchor no quede pegado al borde superior.

### 3. Botón "Hoteles recomendados"

En `src/config/event.ts`, dentro de `concierge`, el `ctaUrl` deja de ser
un string fijo de ancla (`#hospedaje`) porque ahora depende del idioma. Se
resuelve en el componente en vez de en la config:

- `Concierge.astro` deja de leer `concierge.ctaUrl` directo como `href` y
  en su lugar arma el link a la página de Hospedaje con
  `getRelativeLocaleUrl(lang, "hospedaje")` (mismo helper que usa
  `LanguageSwitch.astro`).
- Se quita `ctaUrl` de `EVENT_CONFIG.concierge` en `event.ts` (ya no se
  usa; el otro CTA, el de `gift.ctaUrl` hacia `#datos-bancarios`, no se
  toca).
- Navegación en la misma pestaña (sin `target="_blank"`).

### 4. Menú de hamburguesa (`NavMenu`)

Nuevo componente React (para manejar el estado abierto/cerrado con
interactividad, igual que `EnvelopeOpening.tsx`): `src/components/NavMenu.tsx`,
montado con `client:load` en `Layout.astro` (se agrega ahí, junto a
`LanguageSwitch`, para que aparezca en toda página que use el Layout —
incluye Hospedaje sin duplicar código).

- **Botón**: ícono de hamburguesa (3 líneas), fijo `top-4 left-4 z-[60]`
  (mismo nivel que `LanguageSwitch`, que está en `top-4 right-4`), mismo
  estilo visual (fondo `paper/90`, borde `accent/30`, sombra, blur) para
  que ambos controles luzcan como un mismo sistema.
- **Panel**: drawer lateral desde la izquierda, ancho ~280px (`max-w-[80%]`
  en móvil), fondo `paper`, transición `translate-x` (~300ms). Overlay
  semitransparente detrás que cierra el menú al hacer click fuera. Cierra
  también con `Escape` y al hacer click en cualquier link.
- **Contenido** (en orden): Home, RSVP, Regalos, Hospedaje. Cada uno es un
  link de texto serif, tamaño `text-xl`, separados verticalmente,
  color `ink` con hover `accent`.
- **Resolución de hrefs** (recibe `lang` como prop):
  - Home → `getRelativeLocaleUrl(lang, "") + "#home"`
  - RSVP → `getRelativeLocaleUrl(lang, "") + "#rsvp"`
  - Regalos → `getRelativeLocaleUrl(lang, "") + "#regalos"`
  - Hospedaje → `getRelativeLocaleUrl(lang, "hospedaje")`
  - Todos calculados en build time (Astro), pasados como props simples
    (strings) al componente React `NavMenu` — no hace falta resolver nada
    en el cliente.
  - Como Home/RSVP/Regalos siempre apuntan a la página principal (con
    ancla), esto funciona igual estando parado en Hospedaje: navega de
    vuelta a la principal y el navegador hace scroll a la ancla al cargar.

### 5. Traducciones

En `src/i18n/translations.ts`, nueva sección `nav` en `Translations`:

```ts
nav: {
  home: string;
  rsvp: string;
  gift: string;
  hospedaje: string;
  back: string; // usado por el link "Volver" en Hospedaje
}
```

Con copy ES/EN correspondiente (p.ej. ES: "Home", "RSVP", "Regalos",
"Hospedaje", "Volver"; EN: "Home", "RSVP", "Registry", "Stay", "Back").

## Testing

- `pnpm build` para confirmar que Astro genera correctamente las 4 rutas
  (`/`, `/en/`, `/hospedaje`, `/en/hospedaje`) sin errores de tipos
  (`astro check`).
- Verificación manual (dev server + browser) de:
  - Click en "Hoteles recomendados" desde ES y desde EN navega a la
    página de Hospedaje correcta, misma pestaña.
  - Botón "Volver" regresa a la home del idioma correspondiente.
  - Menú de hamburguesa abre/cierra (click botón, click overlay, Escape),
    y cada link navega/hace scroll al destino correcto desde ambas
    páginas.
  - El menú y el selector de idioma no se traslapan en móvil (~375px).
