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
  title: 'Золотой Дуб — Кухни на заказ',
  description: 'Фабрика кухонь «Золотой Дуб». Индивидуальные проекты, качественные материалы, честные сроки.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cormorant.className}>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}




