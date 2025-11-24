/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ['bg-rulebook-paper', 'text-rulebook-ink', 'font-serif'],
  theme: {
    extend: {
      colors: {
        rulebook: {
          paper: '#F0E6D2',  // Linen/Premium Parchment
          ink: '#2B2B2B',    // Dark Ink
          crimson: '#8B0000', // Primary Accent
          royal: '#000080',   // Secondary Accent
          forest: '#228B22',  // Success/Growth
          charcoal: '#4A4A4A', // Borders
        },
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'rulebook': '4px 4px 0px 0px rgba(43, 43, 43, 0.2)',
      },
    },
  },
  plugins: [],
}
