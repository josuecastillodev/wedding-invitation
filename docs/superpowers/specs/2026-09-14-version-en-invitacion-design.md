# Versión en inglés de la invitación con switch de idioma

**Fecha:** 2026-09-14
**Estado:** Propuesto

## Contexto

El sitio (`wedding-invitation/`) es una invitación de boda Astro 100% estática
(`output: 'static'`, `base: '/liliana-y-daniel'`). Todo el texto vive
hardcodeado en español dentro de los componentes `.astro`/`.tsx` o en
`src/config/event.ts`. Se pidió una versión en inglés que use el mismo
diseño, con los textos tomados del mockup de Canva "Copia de Boda Liliana &
Daniel Inglés - Sitio web", más un switch visible para cambiar de idioma.

El Canva no cubre todas las secciones del sitio real (no incluye Itinerario
ni Footer, por ejemplo); esos textos se tradujeron a mano manteniendo el
mismo tono que el resto del inglés ya extraído del diseño, y quedan
señalados abajo como "(traducción propia, no está en el Canva)".

## Decisiones ya validadas con el usuario

1. **Ruteo por URL**, no switch client-side: español se queda en
   `/liliana-y-daniel/` (no rompe el link ya compartido), inglés vive en
   `/liliana-y-daniel/en/`.
2. El título "Mesa de regalos" (que en el Canva quedó sin traducir por
   descuido) se traduce a **"Gift Registry"** para consistencia.
3. El switch de idioma es una **pastilla fija en una esquina superior**
   (`ES · EN`), visible incluso sobre la pantalla del sobre sin abrir.

## Arquitectura

### Ruteo (Astro i18n)

`astro.config.mjs` agrega:

```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  routing: { prefixDefaultLocale: false },
}
```

Con `base: '/liliana-y-daniel'` esto da:
- Español (default, sin prefijo): `/liliana-y-daniel/`
- Inglés: `/liliana-y-daniel/en/`

Para no duplicar el árbol de componentes entre dos páginas, el cuerpo actual
de `src/pages/index.astro` se extrae a un componente compartido
`src/components/InvitationPage.astro` que recibe una prop `lang: 'es' | 'en'`
y arma `Layout > EnvelopeOpening > secciones`. Las páginas quedan así:

- `src/pages/index.astro` → `<InvitationPage lang="es" />`
- `src/pages/en/index.astro` (nuevo) → `<InvitationPage lang="en" />`

### Diccionario de traducciones

Nuevo archivo `src/i18n/translations.ts` con un objeto tipado
`{ es: {...}, en: {...} }`, organizado por sección (una clave por
componente). Cada componente con texto fijo recibe una prop `lang` (default
`"es"`) y lee `translations[lang]`.

`EVENT_CONFIG` (`src/config/event.ts`) se queda solo con lo que **no**
cambia por idioma: nombres de los novios, fecha ISO del evento, URLs
(mapa, WhatsApp, Tally), rutas de imágenes, y los datos propios de cada
hotel (nombre, subtítulo, imagen, link de reserva). El copy en español que
hoy vive ahí (`gift.intro/body/ctaLabel`, `dressCode.note`,
`rsvp.headline/question/ctaLabel`, `concierge.ctaLabel`, y la
`description`/`highlight` de cada hotel) se mueve al diccionario de
traducciones.

**Fecha mostrada en pantalla:** hoy `EVENT_CONFIG.displayDate` es un string
fijo en español (`"15 de mayo de 2027"`). Se elimina ese campo y se agrega
un helper `formatEventDate(lang)` que formatea `EVENT_CONFIG.eventDate` con
`Intl.DateTimeFormat('es-MX' | 'en-US', { day: 'numeric', month: 'long',
year: 'numeric' })`. Esto evita mantener dos strings de fecha sincronizados
a mano y ya produce exactamente `"15 de mayo de 2027"` / `"May 15, 2027"`,
que coincide con lo que muestra el Canva.

`BankDetails.astro` no se usa actualmente (no está importado en
`index.astro`, y `EVENT_CONFIG.bank` está comentado) — queda fuera de
alcance, sin tocar.

### Switch de idioma

Nuevo `src/components/LanguageSwitch.astro`, renderizado una vez dentro de
`Layout.astro`. Es una pastilla fija (`ES · EN`) con z-index alto para verse
sobre la pantalla del sobre. El idioma activo se muestra resaltado; el otro
es un link. El href se calcula con `getRelativeLocaleUrl` de `astro:i18n`
(respeta `base` y locale automáticamente) y conserva el query string actual
para no perder los parámetros `?Nombre=&Pases=` que usa el RSVP.

### Componentes que reciben la prop `lang`

`Layout`, `EnvelopeOpening`, `HeroSection`, `StorySection`, `VenueSection`,
`RsvpCta`, `GiftRegistry`, `DressCode`, `Concierge`, `Hospedaje`,
`Itinerary`, `Footer`, `PhotoGallery` (solo para los `alt`).

## Tabla de textos ES → EN

### Layout
| Clave | ES | EN |
|---|---|---|
| `html lang` | `es` | `en` |
| `title` | `{brideName} & {groomName} · Nuestra Boda` | `{brideName} & {groomName} · Our Wedding` |
| `description` | `Invitación de boda de {brideName} y {groomName}` | `Wedding invitation for {brideName} and {groomName}` |

### LanguageSwitch (nuevo, no está en el Canva)
| Clave | ES | EN |
|---|---|---|
| aria-label link a EN | — | `Switch to English` |
| aria-label link a ES | `Cambiar a español` | — |

### EnvelopeOpening
| Clave | ES | EN |
|---|---|---|
| intro | Querido invitado, se dice que… | Dear guest, they say that… |
| script | Nos casamos | We are getting married |
| prompt (no está en el Canva) | Toca el sobre para abrir | Tap the envelope to open |
| aria-label botón | Abrir invitación | Open invitation |

### HeroSection
| Clave | ES | EN |
|---|---|---|
| eyebrow | Nuestra boda | Our Wedding |
| countdown label | Faltan | Only *(ajuste editorial, ver nota abajo)* |
| countdown unit | Días | Days |

> **Nota de ajuste:** el Canva en inglés muestra el contador como "275 /
> Days to go" en una sola pieza, sin una palabra suelta arriba del número
> (a diferencia del español, que tiene "Faltan" arriba y "Días" junto al
> número). Para no alterar el layout actual (2 líneas: label arriba +
> número+unidad abajo) se usa "Only" arriba y "Days" junto al número
> ("Only" / "275 Days"), que se lee natural y mantiene la estructura. Si
> prefieres otra palabra o replicar exactamente "Days to go" (lo que
> implicaría mover el texto de línea), dilo antes de implementar.

### StorySection
| ES (con saltos de línea y acentos actuales) | EN |
|---|---|
| Una historia de amor<br/>que comenzó en **México.**<br/>Hoy, regresamos **para<br/>celebrarla** | A love story<br/>that began in **Mexico.**<br/>Today, we return to<br/>**celebrate it** |

### VenueSection
| Clave | ES | EN |
|---|---|---|
| eyebrow | Nos casamos en | We are getting married at |
| venue.name | Hacienda La Magdalena | *(sin cambio, nombre propio)* |
| venue.city | Guadalajara, Jalisco, México. | *(sin cambio — el propio Canva en inglés lo deja igual)* |
| botón mapa | Ver Mapa | View Map |

### RsvpCta
| Clave | ES | EN |
|---|---|---|
| rsvp.headline | Será una celebración increíble | It will be an incredible celebration |
| rsvp.question | ¿Nos acompañas? | Will you join us? |
| rsvp.ctaLabel | ¡Confirma asistencia! | RSVP Here |

### GiftRegistry
| Clave | ES | EN |
|---|---|---|
| heading | Mesa de regalos | Gift Registry *(traducido por consistencia, ver decisión arriba)* |
| body | Su **presencia** es nuestro mejor **regalo**. Si desean obsequiarnos, pueden contribuir a nuestro futuro juntos con un **regalo en efectivo** a través del **siguiente enlace.** | **Your presence** is our greatest gift. However, if you wish to **honor us with a present**, a contribution to our Honeymoon Fund to start our future together **would be deeply appreciated.** |
| ctaLabel | Hacer un regalo | Contribute |

### DressCode
| Clave | ES | EN |
|---|---|---|
| heading | Dress Code | *(sin cambio, ya está en inglés)* |
| dressCode.code | Formal | *(sin cambio)* |
| nota | Acompáñanos con un **look formal y elegante** para celebrar juntos nuestra boda. | **Join us** in your **most elegant formal** attire to celebrate our special day. |

### Concierge
| Clave | ES | EN |
|---|---|---|
| heading | Concierge | *(sin cambio)* |
| subtítulo script | Service | *(sin cambio, ya está en inglés)* |
| párrafo 1 | Para que solo se preocupen por disfrutar, nuestros **wedding planners** ponen a su disposición un servicio de *Concierge.* | To ensure you can just focus on enjoying the celebration, our **wedding planners** offer a dedicated *Concierge* service. |
| párrafo 2 | Te ayudará a **organizar todo tu viaje** con recomendaciones y gestión de reservas. Estará al tanto de ti **durante la planeación, a tu llegada y hasta tu regreso a casa.** | They will help you **organize your entire trip** with local recommendations and booking management. They will take care of you **during the planning process, upon your arrival, and until you safely return home.** |
| concierge.ctaLabel | Hoteles recomendados | Recommended Hotels |

### Hospedaje
| Clave | ES | EN |
|---|---|---|
| heading sección | Hospedaje | Recommended Hotels *(el Canva solo muestra esta frase una vez; se reutiliza para el heading y para el botón del Concierge)* |
| One Guadalajara — descripción | Una opción práctica y cómoda para disfrutar Guadalajara, con desayuno incluido y una ubicación conveniente al norte de la ciudad. | A practical and comfortable option to enjoy Guadalajara, featuring complimentary breakfast and a convenient location in the north of the city. |
| One Guadalajara — highlight | una ubicación conveniente al norte de la ciudad. | a convenient location in the north of the city. |
| Hard Rock — descripción | Una experiencia vibrante y contemporánea, ideal para quienes buscan hospedarse, relajarse y disfrutar del ambiente musical de Guadalajara. El hotel cuenta con restaurantes, entretenimiento, spa y piscina. | A vibrant and contemporary experience, ideal for those looking to stay, relax, and enjoy the musical atmosphere of Guadalajara. The hotel features restaurants, entertainment, a spa, and a pool. |
| Hard Rock — highlight | El hotel cuenta con restaurantes, entretenimiento, spa y piscina. | The hotel features restaurants, entertainment, a spa, and a pool. |
| botón reserva | Reservar | Book Now |

### Itinerary (traducción propia, no está en el Canva)
| Clave | ES | EN |
|---|---|---|
| heading | Itinerario | Itinerary |
| ítem 1 título | Ceremonia Religiosa | Wedding Ceremony |
| ítem 1 lugar | Parroquia de Santa Sofía | *(sin cambio, nombre propio)* |
| ítem 2 título | Cóctel de bienvenida | Welcome Cocktail |
| ítem 2 lugar | Ingreso a la recepción | Reception entrance |
| ítem 3 título | Banquete nupcial | Wedding Banquet |
| ítem 3 lugar | Recepción | Reception |
| botón mapa | Ver Mapa | View Map |

### Footer (traducción propia, no está en el Canva)
| Clave | ES | EN |
|---|---|---|
| Instagram | Sigue nuestras bodas en Instagram | Follow our weddings on Instagram |
| créditos | © Diseñado por Dizaru. 2025. | © Designed by Dizaru. 2025. |

### PhotoGallery (alt text, traducción propia)
| ES | EN |
|---|---|
| Liliana y Daniel | Liliana and Daniel |
| Liliana y Daniel en el auto | Liliana and Daniel in the car |
| Auto en la carretera | Car on the road |
| Liliana y Daniel con el auto | Liliana and Daniel with the car |

## Fuera de alcance

- `BankDetails.astro` (no está en uso).
- Cambios de diseño visual: el layout, colores, tipografías y animaciones
  no cambian, solo el texto y el ruteo/switch nuevos.
- Persistencia de la preferencia de idioma entre visitas (localStorage/
  cookie): no se pidió: cada visitante llega al idioma que corresponde al
  link que se le compartió, y puede cambiar manualmente con el switch.

## Verificación

Este proyecto no tiene suite de tests automatizados (a diferencia de
`wedding-manager-system`). La verificación es:

1. `pnpm build` sin errores.
2. Revisar ambas rutas con `pnpm dev`: `/liliana-y-daniel/` (español,
   debe verse idéntico a como está hoy) y `/liliana-y-daniel/en/` (inglés
   nuevo).
3. Capturar screenshots de las secciones clave en ambos idiomas
   (hero, RSVP, mesa de regalos, hospedaje) para comparar contra el Canva.
4. Probar el switch de idioma en ambas direcciones, incluyendo que
   conserve `?Nombre=&Pases=` en la URL si están presentes.
