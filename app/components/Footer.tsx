export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-brand-outline)] bg-[var(--color-brand-accent)] text-[var(--color-brand-neutral)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-brand-neutral/80">© {year} Золотой Дуб. Производство мебели под заказ.</p>
        <div className="flex items-center gap-4 text-brand-neutral/80">
          <a href="https://t.me/ZOLODUB_bot" target="_blank" rel="noopener noreferrer" className="hover:text-brand-teal transition-colors">
            Telegram
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-teal transition-colors">
            Instagram
          </a>
          <a href="mailto:info@zolotoy-dub.ru" className="hover:text-brand-teal transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}




