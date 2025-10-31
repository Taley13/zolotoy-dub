export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-400 sm:text-5xl md:text-6xl font-elegant">
          Золотой Дуб
        </h1>
        <p className="mt-4 text-xl text-neutral-300 max-w-2xl mx-auto">
          Кухни из массива дуба на заказ
        </p>
        <p className="mt-6 text-lg text-neutral-400">
          Индивидуальный подход. Качественные материалы. Современные технологии.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow-lg">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-500 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-100 font-elegant">Гарантия качества</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Используем только проверенные материалы от надежных поставщиков
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow-lg">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-500 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-100 font-elegant">Соблюдение сроков</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Четкое планирование и контроль производства на каждом этапе
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center shadow-lg">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-500 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-100 font-elegant">Индивидуальный дизайн</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Учитываем все ваши пожелания и особенности помещения
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <a
          href="/contacts"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-lg font-medium text-white shadow-lg hover:bg-brand-600 transition"
        >
          Оставить заявку
        </a>
      </div>
    </div>
  )
}




