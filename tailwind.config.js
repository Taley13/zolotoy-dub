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
          primary: 'var(--color-brand-primary)',
          accent: 'var(--color-brand-accent)',
          teal: 'var(--color-brand-teal)',
          cta: 'var(--color-brand-cta)',
          neutral: 'var(--color-brand-neutral)',
          surface: 'var(--color-brand-surface)',
          outline: 'var(--color-brand-outline)'
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



