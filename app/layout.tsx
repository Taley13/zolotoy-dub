import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Cormorant } from 'next/font/google';

const cormorant = Cormorant({
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Золотой Дуб — Премиальные кухни из массива дуба',
  description: 'Фабрика премиум-кухонь «Золотой Дуб». Индивидуальный дизайн, производство и установка кухонь из натурального дуба. Эксклюзивные решения для вашего дома.',
  metadataBase: new URL('https://zol-dub.online'),
  openGraph: {
    title: 'Золотой Дуб — Премиальные кухни',
    description: 'Кухни премиум-класса из массива дуба',
    url: 'https://zol-dub.online',
    siteName: 'Золотой Дуб',
    locale: 'ru_RU',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cormorant.className}>
      <body className="min-h-screen bg-velvet text-neutral-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}




