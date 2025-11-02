export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 text-sm text-neutral-400 sm:px-6 lg:px-8">
        <p>© {year} Золотой Дуб</p>
        <div className="flex items-center gap-4">
          <a href="https://t.me/ZOLODUB_bot" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">Telegram</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">Instagram</a>
          <a href="mailto:info@zolotoy-dub.ru" className="hover:text-brand-400">Email</a>
        </div>
      </div>
    </footer>
  );
}




