export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#12484C] bg-[#0E2931] text-[#E2E2E0]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-[#E2E2E0]/80">© {year} Золотой Дуб. Производство мебели под заказ.</p>
        <div className="flex items-center gap-4 text-[#E2E2E0]/70">
          <a href="https://t.me/ZOLODUB_bot" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#12484C] px-3 py-1.5 text-[#2B7574] transition hover:-translate-y-0.5 hover:border-[#2B7574] hover:text-[#E2E2E0]">
            Telegram
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#12484C] px-3 py-1.5 text-[#2B7574] transition hover:-translate-y-0.5 hover:border-[#2B7574] hover:text-[#E2E2E0]">
            Instagram
          </a>
          <a href="mailto:info@zolotoy-dub.ru" className="rounded-full border border-[#12484C] px-3 py-1.5 text-[#2B7574] transition hover:-translate-y-0.5 hover:border-[#2B7574] hover:text-[#E2E2E0]">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}




