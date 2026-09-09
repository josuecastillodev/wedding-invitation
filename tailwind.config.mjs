/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Tenor Sans"', 'Georgia', '"Times New Roman"', 'serif'],
        script: ['"High Spirited"', 'cursive'],
        signature: ['"Velista"', 'cursive'],
      },
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
    },
  },
  plugins: [],
};
