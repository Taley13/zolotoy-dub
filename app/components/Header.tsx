import Link from 'next/link';
import PremiumLogo from './PremiumLogo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#12484C]/40 bg-[#0E2931]/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(3,10,12,0.75)] transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3.5 lg:px-10">
        <PremiumLogo />

        <nav className="flex items-center gap-3 text-xs font-medium text-[#E2E2E0] sm:gap-4 md:gap-6 sm:text-sm">
          {[
            { href: '/', label: 'Главная' },
            { href: '/catalog', label: 'Каталог' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative transition-all duration-300 hover:text-[#12484C]"
            >
              <span className="pb-1">{item.label}</span>
              <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-center scale-x-0 bg-[#12484C] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/#calculator"
            className="hidden sm:inline transition-all duration-300 hover:text-[#12484C]"
          >
            Калькулятор
          </Link>
          <Link href="/contacts" className="transition-all duration-300 hover:text-[#12484C]">
            Контакты
          </Link>
        </nav>

        <div className="hidden items-center sm:flex">
          <Link
            href="/#calculator"
            className="inline-flex items-center rounded-full bg-[#861211] px-5 py-2.5 text-sm font-semibold text-[#E2E2E0] shadow-[0_12px_30px_rgba(134,18,17,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a41b1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#861211]"
          >
            Рассчитать проект
          </Link>
        </div>
      </div>
    </header>
  );
}




