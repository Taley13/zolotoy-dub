import Link from 'next/link';
import PremiumLogo from './PremiumLogo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-brand-outline)] bg-[var(--color-brand-primary)]/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(3,10,12,0.55)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3.5 lg:px-10">
        <PremiumLogo />
        
        {/* Навигация - адаптивная */}
        <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm font-medium text-[var(--color-brand-neutral)]">
          <Link href="/" className="transition-colors hover:text-brand-teal">Главная</Link>
          <Link href="/catalog" className="transition-colors hover:text-brand-teal">Каталог</Link>
          <Link href="/#calculator" className="hidden sm:inline transition-colors hover:text-brand-teal">Калькулятор</Link>
          <Link href="/contacts" className="transition-colors hover:text-brand-teal">Контакты</Link>
        </nav>

        <div className="hidden sm:flex items-center">
          <Link
            href="/#calculator"
            className="btn-neon text-sm px-5 py-2.5 rounded-full"
          >
            Рассчитать проект
          </Link>
        </div>
      </div>
    </header>
  );
}




