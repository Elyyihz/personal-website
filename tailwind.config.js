/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#020617', // Slate 950 backdrop
          surface: '#0f172a', // Slate 900 primary cards/sections
          surfaceHover: '#1e293b', // Slate 800 interactive cards
          surfaceLight: '#334155', // Slate 700 subtle borders/badges
          border: 'rgba(34, 211, 238, 0.2)', // Cyan-400 translucent border
          borderSolid: '#22d3ee', // Cyan-400 accent border
          text: '#cbd5e1', // Slate 300 body text
          textMuted: '#94a3b8', // Slate 400 secondary text
          heading: '#f8fafc', // Slate 50 headings
          primary: '#3b82f6', // Blue 500 primary actions
          primaryHover: '#2563eb', // Blue 600 hover actions
          accent: '#22d3ee', // Cyan 400 highlights
          accentHover: '#06b6d4', // Cyan 500
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.35)',
        'card-hover': '0 10px 35px -10px rgba(34, 211, 238, 0.2)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
