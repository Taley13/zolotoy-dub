export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero секция без клиентских компонентов */}
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-brand-400 sm:text-6xl md:text-7xl font-elegant">
          Золотой Дуб
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300">
          Премиальные кухни из массива дуба. Индивидуальный дизайн. Безупречное качество.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a href="#services" className="rounded-md bg-brand-500 px-6 py-3 text-lg text-white hover:bg-brand-600 transition">
            Наши работы
          </a>
          <a href="/contacts" className="rounded-md border border-brand-500/50 px-6 py-3 text-lg text-brand-300 hover:bg-brand-500/10 transition">
            Оставить заявку
          </a>
        </div>
      </div>

      {/* Галерея */}
      <section id="portfolio" className="mt-20">
        <h2 className="text-center text-3xl font-semibold text-neutral-100 font-elegant">Портфолио</h2>
        <p className="mt-2 text-center text-neutral-400">
          Избранные работы
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            '1759474759.png',
            '1759474837.png',
            '1759474944.png',
            'Create_a_hyper-realistic,.png',
            'Create_hyper-realistic,_u (2).png',
            'Create_hyper-realistic,_u (3).png',
            'Create_hyper-realistic,_u (4).png',
            'Create_hyper-realistic,_u (5).png',
          ].map((filename) => (
            <div key={filename} className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50">
              <img
                src={`/images/${filename}`}
                alt="Кухня Золотой Дуб"
                className="h-48 w-full object-cover transition hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/gallery" className="text-brand-400 hover:text-brand-300 transition">
            Смотреть все работы →
          </a>
        </div>
      </section>

      {/* Услуги */}
      <section id="services" className="mt-20">
        <h2 className="text-3xl font-semibold text-neutral-100 font-elegant">Услуги</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Дизайн кухни</h3>
            <p className="mt-2 text-neutral-400">Индивидуальный проект под ваше пространство</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Производство</h3>
            <p className="mt-2 text-neutral-400">Изготовление из массива дуба</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Установка</h3>
            <p className="mt-2 text-neutral-400">Профессиональный монтаж</p>
          </div>
        </div>
      </section>

      {/* Прайс */}
      <section id="pricing" className="mt-20">
        <h2 className="text-3xl font-semibold text-neutral-100 font-elegant">Прайс</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Эконом</h3>
            <p className="mt-2 text-neutral-400">Стандартные решения</p>
            <p className="mt-4 text-brand-400 text-lg">от 150 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Комфорт</h3>
            <p className="mt-2 text-neutral-400">Индивидуальный дизайн</p>
            <p className="mt-4 text-brand-400 text-lg">от 300 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Премиум</h3>
            <p className="mt-2 text-neutral-400">Эксклюзивные материалы</p>
            <p className="mt-4 text-brand-400 text-lg">от 600 000 ₽</p>
          </div>
        </div>
      </section>

      {/* О нас */}
      <section id="about" className="mt-20">
        <h2 className="text-3xl font-semibold text-neutral-100 font-elegant">О нас</h2>
        <div className="panel mt-8 p-6">
          <p className="text-neutral-300">
            Фабрика «Золотой Дуб» — это команда мастеров, которые создают кухни премиум-класса из натурального дуба. 
            Мы проектируем, производим и устанавливаем мебель, которая служит десятилетиями и становится центром вашего дома.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-20 text-center">
        <a
          href="/contacts"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-8 py-4 text-lg font-medium text-white shadow-lg transition hover:bg-brand-600"
        >
          Оставить заявку
        </a>
      </div>
    </div>
  );
}
