/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        script: ['"Allura"', 'cursive'],
        signature: ['"Allura"', '"Velista"', 'cursive'],
      },
      colors: {
        // Tokens semánticos — usar estos en los componentes
        'accent': '#6b7548',        // verde oliva: acentos, script, botones sólidos
        'accent-soft': '#848e60',   // verde oliva claro: hover y textos secundarios
        'paper': '#F9F6F1',         // crema papel: fondo
        'ink': '#403a35',           // texto principal
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
    },
  },
  plugins: [],
};
