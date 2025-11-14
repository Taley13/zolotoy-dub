/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠️ ВАЖНО: Этот конфиг для STATIC EXPORT (ispmanager без Node.js)
  // Для Vercel/Node.js хостинга используйте next.config.js
  
  output: 'export',
  
  // Отключаем оптимизацию изображений для статического экспорта
  images: {
    unoptimized: true,
  },
  
  // Добавляем trailing slash для совместимости с Apache
  trailingSlash: true,
  
  // Strict mode
  reactStrictMode: true,
  
  // Отключаем SWC minify если есть проблемы
  // swcMinify: false,
};

module.exports = nextConfig;

