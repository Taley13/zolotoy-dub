import InteractiveShowcase from '@/app/components/InteractiveShowcase';
import ScrollReveal from '@/app/components/ScrollReveal';

export const metadata = {
  title: 'Каталог — Популярные решения | Золотой Дуб',
  description: 'Каталог кухонь на заказ с 3D-эффектом. Популярные решения для вашего дома от фабрики Золотой Дуб.'
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#0E2931] text-[#E2E2E0]">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-12 md:px-6 md:py-16 lg:px-8">
        {/* Заголовок каталога */}
        <ScrollReveal>
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 font-display text-4xl font-bold sm:mb-4 sm:text-5xl">
              <span className="bg-gradient-to-r from-[#12484C] via-[#2B7574] to-[#861211] bg-clip-text text-transparent">
                Популярные решения
              </span>
            </h1>
            <p className="px-4 text-sm text-[#E2E2E0]/75 sm:text-base md:text-lg">
              Интерактивный каталог наших работ
            </p>
            <p className="mt-2 px-4 text-xs text-[#E2E2E0]/60 sm:text-sm">
              <span className="hidden sm:inline">Наведите курсор на карточку для 3D-эффекта</span>
              <span className="sm:hidden">Нажмите на карточку для просмотра</span>
            </p>
          </div>
        </ScrollReveal>

        {/* Интерактивная витрина с 3D-эффектом */}
        <ScrollReveal>
          <section className="rounded-3xl border border-[#12484C]/40 bg-[#12484C]/10 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500">
            <InteractiveShowcase />
          </section>
        </ScrollReveal>

        {/* Дополнительная информация */}
        <ScrollReveal>
          <div className="mt-12 rounded-3xl border border-[#12484C] bg-[#12484C]/15 p-6 text-center shadow-[0_25px_70px_rgba(2,6,8,0.55)] backdrop-blur-lg sm:mt-16 sm:p-8 md:p-10">
            <h2 className="mb-3 font-display text-xl font-semibold text-[#E2E2E0] sm:text-2xl">
              Не нашли подходящий вариант?
            </h2>
            <p className="mb-6 text-sm text-[#E2E2E0]/75 sm:text-base">
              Мы создадим индивидуальный дизайн-проект специально для вас
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contacts"
                className="inline-flex items-center justify-center rounded-full bg-[#2B7574] px-8 py-3 text-base font-semibold text-[#0E2931] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#37918f] sm:text-lg"
              >
                Бесплатный замер
              </a>
              <a
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-[#861211] px-8 py-3 text-base font-semibold text-[#E2E2E0] shadow-[0_15px_40px_rgba(134,18,17,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a41b1a] sm:text-lg"
              >
                Рассчитать стоимость
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Преимущества */}
        <ScrollReveal>
          <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '📐', title: '3D-визуализация', desc: 'Видите результат до начала работ' },
              { icon: '⚡', title: 'Быстрое производство', desc: 'Изготовление за 14-21 день' },
              { icon: '💎', title: 'Премиум качество', desc: 'Фурнитура Blum, столешницы из камня' },
              { icon: '🎯', title: 'Любые размеры', desc: 'Индивидуальный подход к каждому заказу' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#12484C]/60 bg-[#12484C]/25 p-5 text-center text-[#E2E2E0] shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2B7574] hover:bg-[#2B7574]/25 sm:p-6"
              >
                <div className="mb-2 text-3xl sm:mb-3 sm:text-4xl">{item.icon}</div>
                <h3 className="font-display text-base font-semibold text-[#E2E2E0] sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-xs text-[#E2E2E0]/75 sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}




