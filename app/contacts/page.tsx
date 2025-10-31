import ContactForm from './ContactForm';

export const metadata = {
  title: 'Контакты — Золотой Дуб'
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-neutral-100 font-elegant">Контакты</h1>
      <p className="mt-4 text-neutral-300">
        Оставьте заявку — мы свяжемся с вами, уточним детали и подберём решение.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ContactForm />

        <div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg">
            <h2 className="text-lg font-medium text-neutral-100 font-elegant">Как с нами связаться</h2>
            <ul className="mt-4 space-y-3 text-neutral-300">
              <li>
                <span className="font-medium">Телефон:</span>{' '}
                <a href="tel:+79301933420" className="text-brand-400 hover:text-brand-300">
                  8-930-193-34-20
                </a>
              </li>
              <li>
                <span className="font-medium">E-mail:</span>{' '}
                <a href="mailto:info@zolotoy-dub.ru" className="text-brand-400 hover:text-brand-300">
                  info@zolotoy-dub.ru
                </a>
              </li>
              <li>
                <span className="font-medium">Адрес:</span> г. Москва, ул. Примерная, 1
              </li>
              <li className="pt-2 border-t border-neutral-800">
                <a
                  href="https://t.me/ZOLODUB_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.561-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  Написать в Telegram
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-6 h-64 w-full rounded-xl bg-neutral-900" />
        </div>
      </div>
    </div>
  );
}


