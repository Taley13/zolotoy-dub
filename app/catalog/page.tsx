import InteractiveShowcase from '@/app/components/InteractiveShowcase';
import ScrollReveal from '@/app/components/ScrollReveal';

export const metadata = {
  title: 'Каталог — Популярные решения | Золотой Дуб',
  description: 'Каталог кухонь на заказ с 3D-эффектом. Популярные решения для вашего дома от фабрики Золотой Дуб.'
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        
        {/* Заголовок каталога */}
        <ScrollReveal>
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                Популярные решения
              </span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg px-4">
              Интерактивный каталог наших работ
            </p>
            <p className="mt-2 text-neutral-500 text-xs sm:text-sm px-4">
              <span className="hidden sm:inline">Наведите курсор на карточку для 3D-эффекта</span>
              <span className="sm:hidden">Нажмите на карточку для просмотра</span>
            </p>
          </div>
        </ScrollReveal>

        {/* Интерактивная витрина с 3D-эффектом */}
        <ScrollReveal>
          <section className="transition-all duration-500">
            <InteractiveShowcase />
          </section>
        </ScrollReveal>

        {/* Дополнительная информация */}
        <ScrollReveal>
          <div className="mt-12 sm:mt-16 glass-panel p-6 sm:p-8 md:p-10 text-center">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-neutral-100 mb-3">
              Не нашли подходящий вариант?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mb-6">
              Мы создадим индивидуальный дизайн-проект специально для вас
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacts" 
                className="btn-neon px-8 py-3 text-base sm:text-lg transition-all hover:scale-105"
              >
                Бесплатный замер
              </a>
              <a 
                href="/#calculator" 
                className="btn-outline px-8 py-3 text-base sm:text-lg transition-all hover:scale-105"
              >
                Рассчитать стоимость
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Преимущества */}
        <ScrollReveal>
          <div className="mt-12 sm:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '📐', title: '3D-визуализация', desc: 'Видите результат до начала работ' },
              { icon: '⚡', title: 'Быстрое производство', desc: 'Изготовление за 14-21 день' },
              { icon: '💎', title: 'Премиум качество', desc: 'Фурнитура Blum, столешницы из камня' },
              { icon: '🎯', title: 'Любые размеры', desc: 'Индивидуальный подход к каждому заказу' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="glass-panel p-5 sm:p-6 text-center transition-all duration-300 hover:scale-105 hover:border-yellow-500/50"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.icon}</div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-neutral-100 mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}




