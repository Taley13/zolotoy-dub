import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-neutral-300">
          <Link href="/" className="hover:text-brand-400">Главная</Link>
          <Link href="/catalog" className="hover:text-brand-400">Каталог</Link>
          <Link href="/contacts" className="hover:text-brand-400">Контакты</Link>
        </nav>
      </div>
    </header>
  );
}




