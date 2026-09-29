/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy aliases (unchanged values) — kept until each component's
        // motion/visual pass in Phases 2-6 migrates away from them.
        primary: 'rgb(var(--legacy-accent) / <alpha-value>)',
        secondary: 'rgb(var(--legacy-muted) / <alpha-value>)',
        dark: 'rgb(var(--legacy-bg) / <alpha-value>)',
        light: 'rgb(var(--legacy-fg) / <alpha-value>)',
        slate: 'rgb(var(--legacy-muted) / <alpha-value>)',
        // "Signal & Noise" semantic tokens (locked palette).
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accent2: 'rgb(var(--accent-2) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-satoshi)', 'ui-sans-serif', 'sans-serif'],
        display: ['var(--font-bricolage)', 'ui-sans-serif', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} 