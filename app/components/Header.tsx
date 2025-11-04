import Link from 'next/link';
import PremiumLogo from './PremiumLogo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 lg:px-8">
        <PremiumLogo />
        
        {/* Навигация - адаптивная */}
        <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm font-medium text-neutral-300">
          <Link href="/" className="hover:text-yellow-400 transition-colors">Главная</Link>
          <Link href="/catalog" className="hover:text-yellow-400 transition-colors hidden sm:inline">Каталог</Link>
          <Link href="/gallery" className="hover:text-yellow-400 transition-colors hidden md:inline">Галерея</Link>
          <Link href="/contacts" className="hover:text-yellow-400 transition-colors">Контакты</Link>
        </nav>
      </div>
    </header>
  );
}




