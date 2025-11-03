import Link from 'next/link';
import PremiumLogo from './PremiumLogo';
import DiscountAcorn from './DiscountAcorn';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 gap-4">
        <PremiumLogo />
        
        <div className="flex items-center gap-4">
          {/* Желудь-сюрприз */}
          <DiscountAcorn />
          
          {/* Навигация */}
          <nav className="flex items-center gap-6 text-sm font-medium text-neutral-300">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Главная</Link>
            <Link href="/catalog" className="hover:text-yellow-400 transition-colors hidden sm:inline">Каталог</Link>
            <Link href="/gallery" className="hover:text-yellow-400 transition-colors hidden md:inline">Галерея</Link>
            <Link href="/contacts" className="hover:text-yellow-400 transition-colors">Контакты</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}




