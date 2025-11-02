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
    default: 'Золотой Дуб — Премиальные кухни из массива дуба на заказ',
    template: '%s | Золотой Дуб'
  },
  description: 'Фабрика премиум-кухонь «Золотой Дуб». Индивидуальный дизайн, производство и установка кухонь из натурального дуба. Эксклюзивные решения для вашего дома. Москва.',
  keywords: ['кухни на заказ', 'кухни из массива дуба', 'премиальные кухни', 'кухни премиум класса', 'изготовление кухонь', 'дизайн кухни', 'золотой дуб'],
  authors: [{ name: 'Золотой Дуб' }],
  creator: 'Золотой Дуб',
  publisher: 'Золотой Дуб',
  metadataBase: new URL('https://zol-dub.online'),
  alternates: {
    canonical: 'https://zol-dub.online'
  },
  openGraph: {
    title: 'Золотой Дуб — Премиальные кухни из массива дуба',
    description: 'Индивидуальный дизайн, производство и установка кухонь премиум-класса из натурального дуба',
    url: 'https://zol-dub.online',
    siteName: 'Золотой Дуб',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/images/1759474759.png',
        width: 1200,
        height: 630,
        alt: 'Кухни Золотой Дуб'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Золотой Дуб — Премиальные кухни из массива дуба',
    description: 'Индивидуальный дизайн и производство кухонь премиум-класса',
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
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cormorant.className}>
      <body className="min-h-screen bg-velvet text-neutral-100 antialiased">
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




