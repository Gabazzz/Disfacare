/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1B4F72',   // azul petróleo
          hover: '#2E86AB',  // azul médio
        },
        health: '#5DCAA5',     // teal
        surface: {
          soft: '#E8F4FD',    // azul quase branco
        },
        appBg: '#F4F6F8',      // cinza clarinho
        text: {
          primary: '#1F2937',  // grafite
          secondary: '#6B7280',// cinza médio
        },
        alert: {
          high: '#E24B4A',     // vermelho
          medium: '#EF9F27',   // âmbar
          stable: '#639922',   // verde
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 2px 12px rgba(0, 0, 0, 0.07)',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'badge': '8px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
