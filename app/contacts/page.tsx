import ContactForm from './ContactForm';

export const metadata = {
  title: 'Контакты — Золотой Дуб'
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-[#0E2931] text-[#E2E2E0]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-[#E2E2E0]">Контакты</h1>
        <p className="mt-4 max-w-2xl text-[#E2E2E0]/80">
          Оставьте заявку — мы свяжемся с вами, уточним детали и подберём решение.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#12484C] bg-[#12484C]/20 p-6 shadow-[0_20px_60px_rgba(4,8,10,0.55)] backdrop-blur">
              <h2 className="font-display text-lg font-semibold text-[#E2E2E0]">Как с нами связаться</h2>
              <ul className="mt-4 space-y-4 text-sm text-[#E2E2E0]/80">
                <li>
                  <span className="block text-xs uppercase tracking-[0.3em] text-[#E2E2E0]/60">Телефон</span>
                  <a href="tel:+79301933420" className="mt-1 inline-flex items-center gap-2 text-[#2B7574] transition hover:text-[#37918f]">
                    8-930-193-34-20
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-[0.3em] text-[#E2E2E0]/60">E-mail</span>
                  <a href="mailto:info@zolotoy-dub.ru" className="mt-1 inline-flex items-center gap-2 text-[#2B7574] transition hover:text-[#37918f]">
                    info@zolotoy-dub.ru
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-[0.3em] text-[#E2E2E0]/60">Адрес</span>
                  <span className="mt-1 inline-block">г. Москва, ул. Примерная, 1</span>
                </li>
                <li className="border-t border-[#12484C]/60 pt-4">
                  <a
                    href="https://t.me/ZOLODUB_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2B7574] px-5 py-2.5 text-sm font-semibold text-[#0E2931] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#37918f]"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.561-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                    </svg>
                    Написать в Telegram
                  </a>
                </li>
              </ul>
            </div>
            <div className="h-64 w-full rounded-2xl border border-[#12484C]/40 bg-[radial-gradient(circle_at_top,_rgba(43,117,116,0.35),_transparent_60%) ,_linear-gradient(135deg,rgba(18,72,76,0.2),rgba(14,41,49,0.6))]" />
          </div>
        </div>
      </div>
    </div>
  );
}


