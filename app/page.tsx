import ModernHero from '@/app/components/ModernHero';
import ScrollReveal from '@/app/components/ScrollReveal';
import KitchenCalculator from '@/app/components/KitchenCalculator';

export default function Home() {
  return (
    <>
      <ModernHero />

      <div className="relative z-10 -mt-12 sm:-mt-16 md:-mt-20">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
          
          {/* Калькулятор стоимости - адаптивный */}
          <ScrollReveal>
            <section id="calculator" className="py-10 sm:py-12 md:py-16 scroll-mt-20 transition-all duration-500">
              <KitchenCalculator />
            </section>
          </ScrollReveal>

          {/* Услуги - плотная компоновка */}
          <ScrollReveal>
            <section id="services" className="py-16 scroll-mt-20 transition-all duration-500">
              <h2 className="text-center font-display text-4xl font-bold">
                <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                  Услуги
                </span>
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: '🍳', title: 'Кухни на заказ', desc: 'ДСП, МДФ, Эмаль. Любые размеры и стили' },
                  { icon: '🚪', title: 'Шкафы-купе', desc: 'Встроенные и корпусные по вашим размерам' },
                  { icon: '👔', title: 'Гардеробные', desc: 'Системы хранения премиум-класса' },
                  { icon: '📐', title: 'Дизайн-проект', desc: '3D визуализация до начала работ' },
                  { icon: '🔧', title: 'Установка', desc: 'Монтаж и подключение под ключ' },
                  { icon: '⚡', title: 'Срочное производство', desc: 'Экспресс-изготовление за 14 дней' },
                ].map((service, i) => (
                  <div key={i} className="glass-panel p-6 card-hover">
                    <div className="mb-3 text-4xl">{service.icon}</div>
                    <h3 className="font-display text-lg font-semibold text-neutral-100">{service.title}</h3>
                    <p className="mt-2 text-sm text-neutral-400">{service.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Прайс с акцентами */}
          <ScrollReveal>
            <section id="pricing" className="py-16 scroll-mt-20 transition-all duration-500">
              <h2 className="text-center font-display text-4xl font-bold">
                <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                  Прайс-лист
                </span>
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: 'Кухни ДСП', desc: 'Стандартные решения из ЛДСП', price: 'от 80 000 ₽', highlight: false },
                  { title: 'Кухни МДФ', desc: 'МДФ плёнка/крашенный', price: 'от 150 000 ₽', highlight: true },
                  { title: 'Кухни Эмаль', desc: 'Премиум МДФ + эмаль', price: 'от 250 000 ₽', highlight: false },
                  { title: 'Шкафы-купе', desc: 'Встроенные и корпусные', price: 'от 40 000 ₽', highlight: false },
                  { title: 'Гардеробные', desc: 'Системы хранения', price: 'от 60 000 ₽', highlight: false },
                  { title: 'Замер + дизайн', desc: 'Выезд дизайнера на объект', price: 'бесплатно', highlight: true },
                ].map((item, i) => (
                  <div key={i} className={`${item.highlight ? 'glass-neon' : 'glass-panel'} p-6 card-hover`}>
                    {item.highlight && (
                      <div className="mb-3 inline-block rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
                        ⭐ Популярно
                      </div>
                    )}
                    <h3 className="font-display text-xl font-semibold text-neutral-100">{item.title}</h3>
                    <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                    <p className="mt-4 font-display text-2xl font-bold text-yellow-400">{item.price}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* О фабрике */}
          <ScrollReveal>
            <section id="about" className="py-16 scroll-mt-20 transition-all duration-500">
              <div className="glass-panel p-10">
                <h2 className="font-display text-3xl font-bold">
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                    О фабрике «Золотой Дуб»
                  </span>
                </h2>
                <div className="mt-6 grid gap-8 lg:grid-cols-2">
                  <div>
                    <p className="text-neutral-300 leading-relaxed">
                      Мы — команда профессионалов с многолетним опытом изготовления корпусной мебели премиум-класса. 
                      Специализируемся на производстве кухонь, шкафов-купе и гардеробных из ДСП, МДФ и Эмали.
                    </p>
                    <p className="mt-4 text-neutral-300 leading-relaxed">
                      Собственное производство позволяет контролировать качество на каждом этапе и предлагать 
                      конкурентные цены. Работаем по всей Москве и Московской области.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Бесплатный замер', value: 'в день обращения' },
                      { label: 'Производство', value: '14-21 день' },
                      { label: 'Гарантия', value: '3 года' },
                      { label: 'Оплата', value: 'поэтапная' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between border-b border-white/10 pb-3">
                        <span className="text-neutral-400">{item.label}</span>
                        <span className="font-semibold text-yellow-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Финальный CTA */}
          <ScrollReveal>
            <section className="py-16 transition-all duration-500">
              <div className="glass-neon p-12 text-center">
                <h3 className="font-display text-3xl font-bold text-white">Начнём ваш проект?</h3>
                <p className="mt-3 text-neutral-300">Оставьте заявку — мы свяжемся в течение 15 минут</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a href="/contacts" className="btn-neon px-10 py-4 text-lg">
                    Бесплатный замер
                  </a>
                  <a href="tel:+79301933420" className="btn-outline px-10 py-4 text-lg">
                    8-930-193-34-20
                  </a>
                </div>
              </div>
            </section>
          </ScrollReveal>

        </div>
      </div>
    </>
  );
}
