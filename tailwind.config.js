/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF9F0',
          100: '#F8F0E0',
          200: '#EEDDC2',
          300: '#E0C79D',
          400: '#D4AF7A',
          500: '#C9A141', // Основной золотой цвет с логотипа
          600: '#B08A38',
          700: '#977330',
          800: '#7E5C28',
          900: '#654520'
        }
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'], // Playfair Display для заголовков
        heading: ['var(--font-playfair)', 'Georgia', 'serif'], // Playfair Display для h1, h2
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], // Inter для основного текста
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'], // Inter для body
        button: ['var(--font-inter)', 'system-ui', 'sans-serif'] // Inter для кнопок
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }], // 56px
        'h1-lg': ['4rem', { lineHeight: '1.1', fontWeight: '700' }], // 64px для больших экранов
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 40px
        'h2-lg': ['3rem', { lineHeight: '1.2', fontWeight: '700' }] // 48px для больших экранов
      }
    }
  },
  plugins: []
}



