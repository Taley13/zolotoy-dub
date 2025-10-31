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
      }
    }
  },
  plugins: []
}



