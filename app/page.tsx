import Image from 'next/image';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero секция */}
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-brand-400 sm:text-6xl md:text-7xl font-elegant">
          Золотой Дуб
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300">
          Изготовление кухонь и шкафов на заказ. ДСП, МДФ, Эмаль. Индивидуальный дизайн и установка под ключ.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a href="#portfolio" className="rounded-md bg-brand-500 px-6 py-3 text-lg text-white hover:bg-brand-600 transition">
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
              <Image
                src={`/images/${filename}`}
                alt="Кухня Золотой Дуб"
                width={1600}
                height={1200}
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
            <h3 className="font-elegant text-xl text-neutral-100">Кухни на заказ</h3>
            <p className="mt-2 text-neutral-400">Изготовление кухонь из ДСП, МДФ, Эмаль. Любые размеры и конфигурации</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Шкафы-купе</h3>
            <p className="mt-2 text-neutral-400">Встроенные и корпусные шкафы-купе по индивидуальным размерам</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Гардеробные</h3>
            <p className="mt-2 text-neutral-400">Проектирование и изготовление гардеробных систем</p>
          </div>
        </div>
      </section>

      {/* Прайс */}
      <section id="pricing" className="mt-20">
        <h2 className="text-3xl font-semibold text-neutral-100 font-elegant">Прайс</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Кухни ДСП</h3>
            <p className="mt-2 text-neutral-400">Стандартные решения из ЛДСП</p>
            <p className="mt-4 text-brand-400 text-lg">от 80 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Кухни МДФ</h3>
            <p className="mt-2 text-neutral-400">МДФ плёнка/крашенный</p>
            <p className="mt-4 text-brand-400 text-lg">от 150 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Кухни Эмаль</h3>
            <p className="mt-2 text-neutral-400">Премиум МДФ + эмаль</p>
            <p className="mt-4 text-brand-400 text-lg">от 250 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Шкафы-купе</h3>
            <p className="mt-2 text-neutral-400">Встроенные и корпусные</p>
            <p className="mt-4 text-brand-400 text-lg">от 40 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Гардеробные</h3>
            <p className="mt-2 text-neutral-400">Системы хранения на заказ</p>
            <p className="mt-4 text-brand-400 text-lg">от 60 000 ₽</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-elegant text-xl text-neutral-100">Замер + дизайн</h3>
            <p className="mt-2 text-neutral-400">Бесплатный выезд дизайнера</p>
            <p className="mt-4 text-brand-400 text-lg">бесплатно</p>
          </div>
        </div>
      </section>

      {/* О нас */}
      <section id="about" className="mt-20">
        <h2 className="text-3xl font-semibold text-neutral-100 font-elegant">О нас</h2>
        <div className="panel mt-8 p-6">
          <p className="text-neutral-300">
            Мебельная фабрика «Золотой Дуб» — это команда профессионалов с многолетним опытом изготовления корпусной мебели. 
            Мы специализируемся на производстве кухонь, шкафов-купе и гардеробных из ДСП, МДФ и Эмали. 
            Предлагаем индивидуальный дизайн, собственное производство и установку под ключ. 
            Работаем с клиентами в Москве и Московской области.
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
