import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/StructuredData';
import { Playfair_Display, Inter } from 'next/font/google';

// Элегантный serif для заголовков с золотым градиентом
// Оптимизировано: только нужные начертания для лучшей производительности
const playfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '700'], // Только используемые: medium и bold
  display: 'swap', // Показывать fallback шрифт пока загружается
  variable: '--font-playfair',
  preload: true, // Предзагрузка для быстрого отображения
  fallback: ['Georgia', 'serif']
});

// Современный sans-serif для основного текста и кнопок
// Оптимизировано: убраны редко используемые начертания
const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '600', '700'], // Только используемые: regular, semibold, bold
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif']
});

export const metadata: Metadata = {
  title: {
    default: 'Золотой Дуб — Кухни и шкафы на заказ | ДСП, МДФ, Эмаль',
    template: '%s | Золотой Дуб'
  },
  description: 'Мебельная фабрика «Золотой Дуб» — изготовление кухонь и шкафов на заказ. Кухни, шкафы-купе, гардеробные из ДСП, МДФ, Эмаль. Индивидуальный дизайн, собственное производство, установка под ключ. Москва.',
  keywords: ['кухни на заказ', 'шкафы купе на заказ', 'гардеробные на заказ', 'кухни из ДСП', 'кухни из МДФ', 'кухни эмаль', 'встроенные шкафы', 'мебель на заказ', 'изготовление кухонь', 'золотой дуб'],
  authors: [{ name: 'Золотой Дуб' }],
  creator: 'Золотой Дуб',
  publisher: 'Золотой Дуб',
  metadataBase: new URL('https://zol-dub.online'),
  alternates: {
    canonical: 'https://zol-dub.online'
  },
  openGraph: {
    title: 'Золотой Дуб — Кухни и шкафы на заказ',
    description: 'Изготовление кухонь, шкафов-купе, гардеробных из ДСП, МДФ, Эмаль. Индивидуальный дизайн и установка под ключ',
    url: 'https://zol-dub.online',
    siteName: 'Золотой Дуб',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/images/1759474759.png',
        width: 1200,
        height: 630,
        alt: 'Кухни и шкафы Золотой Дуб'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Золотой Дуб — Кухни и шкафы на заказ',
    description: 'Изготовление кухонь, шкафов-купе, гардеробных из ДСП, МДФ, Эмаль',
    images: ['/images/1759474759.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: { 
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ultra text-neutral-100 antialiased font-sans">
        {/* Сообщение для пользователей без JavaScript */}
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0a0a0f',
            color: '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              maxWidth: '500px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌰</div>
              <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#FFD700' }}>
                Золотой Дуб
              </h1>
              <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#FDB931' }}>
                ⚠️ JavaScript отключен
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px', color: '#DDD' }}>
                Для корректной работы сайта необходимо включить JavaScript в настройках вашего браузера.
              </p>
              <div style={{ marginBottom: '20px' }}>
                <a href="tel:+79301933420" style={{
                  display: 'inline-block',
                  backgroundColor: '#FFD700',
                  color: '#000',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  📞 Позвонить: 8-930-193-34-20
                </a>
              </div>
              <p style={{ fontSize: '14px', color: '#999' }}>
                📍 Воронеж<br />
                🌐 zol-dub.online
              </p>
            </div>
          </div>
        </noscript>

        <StructuredData />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}




