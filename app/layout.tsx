import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import StructuredData from './components/StructuredData';
import { Cormorant } from 'next/font/google';

const cormorant = Cormorant({
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
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
    <html lang="ru" className={cormorant.className}>
      <body className="min-h-screen bg-ultra text-neutral-100 antialiased font-[family-name:var(--font-modern)]">
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




