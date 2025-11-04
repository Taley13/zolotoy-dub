"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  calculateKitchenPrice, 
  formatPrice, 
  KITCHEN_PRESETS,
  type KitchenParams 
} from '@/lib/priceCalculator';

type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  kitchenParams?: KitchenParams; // Параметры для расчёта цены
  customPrice?: string; // Для нестандартных позиций (шкафы, гардеробные)
};

const showcaseItems: ShowcaseItem[] = [
  {
    id: '1',
    title: 'Кухня премиум угловая',
    category: 'Эмаль + Камень',
    image: 'kitchen-01.jpg',
    description: 'Глянцевые фасады из эмали, встроенная техника, искусственный камень',
    kitchenParams: {
      configuration: 'Угловая',
      facade: 'Эмаль',
      hardware: 'Премиум Blum',
      countertop: 'Искусственный камень',
      length: 6
    }
  },
  {
    id: '2',
    title: 'Кухня классика МДФ',
    category: 'МДФ + HPL',
    image: 'kitchen-02.jpg',
    description: 'Классический стиль с фрезеровкой, тёплые оттенки, HPL столешница',
    kitchenParams: {
      configuration: 'Угловая',
      facade: 'МДФ',
      hardware: 'Стандарт',
      countertop: 'HPL',
      length: 4.5
    }
  },
  {
    id: '3',
    title: 'Кухня эконом прямая',
    category: 'ДСП + HPL',
    image: 'kitchen-03.jpg',
    description: 'Минималистичный дизайн, надёжная стандартная фурнитура',
    kitchenParams: {
      configuration: 'Прямая',
      facade: 'ДСП',
      hardware: 'Стандарт',
      countertop: 'HPL',
      length: 3
    }
  },
  {
    id: '4',
    title: 'Кухня студия премиум',
    category: 'МДФ + Камень',
    image: 'kitchen-04.jpg',
    description: 'МДФ с интегрированными ручками, искусственный камень, премиум фурнитура',
    kitchenParams: {
      configuration: 'Прямая',
      facade: 'МДФ',
      hardware: 'Премиум Blum',
      countertop: 'Искусственный камень',
      length: 5
    }
  },
  {
    id: '5',
    title: 'Кухня угловая большая',
    category: 'МДФ + Кварц',
    image: 'kitchen-05.jpg',
    description: 'Просторная угловая кухня с кварцевой столешницей и премиум фурнитурой',
    kitchenParams: {
      configuration: 'Угловая',
      facade: 'МДФ',
      hardware: 'Премиум Blum',
      countertop: 'Кварцевый агломерат',
      length: 7
    }
  },
  {
    id: '6',
    title: 'Кухня островная люкс',
    category: 'Эмаль + Кварц',
    image: 'kitchen-06.jpg',
    description: 'Островная планировка, эмаль, кварцевый агломерат, полная интеграция техники',
    kitchenParams: {
      configuration: 'Индивидуальная',
      facade: 'Эмаль',
      hardware: 'Премиум Blum',
      countertop: 'Кварцевый агломерат',
      length: 8
    }
  },
  {
    id: '7',
    title: 'Кухня неоклассика',
    category: 'Эмаль + Камень',
    image: 'kitchen-07.jpg',
    description: 'Элегантная кухня с эмалевыми фасадами и искусственным камнем',
    kitchenParams: {
      configuration: 'Прямая',
      facade: 'Эмаль',
      hardware: 'Премиум Blum',
      countertop: 'Искусственный камень',
      length: 4
    }
  },
  {
    id: '8',
    title: 'Кухня минимализм',
    category: 'ДСП + Камень',
    image: 'kitchen-08.jpg',
    description: 'Современный минимализм, ДСП с push-to-open, искусственный камень',
    kitchenParams: {
      configuration: 'Угловая',
      facade: 'ДСП',
      hardware: 'Премиум Blum',
      countertop: 'Искусственный камень',
      length: 5.5
    }
  },
  {
    id: '9',
    title: 'Кухня индивидуальная',
    category: 'МДФ + Кварц',
    image: 'kitchen-09.jpg',
    description: 'Индивидуальный проект с нестандартной планировкой и барной стойкой',
    kitchenParams: {
      configuration: 'Индивидуальная',
      facade: 'МДФ',
      hardware: 'Премиум Blum',
      countertop: 'Кварцевый агломерат',
      length: 6.5
    }
  },
  {
    id: '10',
    title: 'Кухня скандинавия',
    category: 'МДФ + HPL',
    image: 'kitchen-10.jpg',
    description: 'Светлая скандинавская кухня, МДФ белый матовый, стандартная фурнитура',
    kitchenParams: {
      configuration: 'Прямая',
      facade: 'МДФ',
      hardware: 'Стандарт',
      countertop: 'HPL',
      length: 3.5
    }
  },
  {
    id: '11',
    title: 'Кухня лофт индустриальная',
    category: 'МДФ + Камень',
    image: 'kitchen-11.jpg',
    description: 'Стиль лофт с тёмными фасадами МДФ и искусственным камнем',
    kitchenParams: {
      configuration: 'Угловая',
      facade: 'МДФ',
      hardware: 'Премиум Blum',
      countertop: 'Искусственный камень',
      length: 5
    }
  },
  {
    id: '12',
    title: 'Кухня премиум большая',
    category: 'Эмаль + Кварц',
    image: 'kitchen-12.jpg',
    description: 'Большая премиум кухня с индивидуальной планировкой, эмаль + кварц',
    kitchenParams: {
      configuration: 'Индивидуальная',
      facade: 'Эмаль',
      hardware: 'Премиум Blum',
      countertop: 'Кварцевый агломерат',
      length: 9
    }
  },
];

export default function InteractiveShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Обработка клавиатуры для lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : showcaseItems.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev! < showcaseItems.length - 1 ? prev! + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  useEffect(() => {
    setIsClient(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // IntersectionObserver для появления карточек
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id');
            if (cardId) {
              setVisibleCards(prev => new Set([...prev, cardId]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Наблюдаем за всеми карточками
    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {showcaseItems.map((item, index) => (
        <div
          key={item.id}
          data-card-id={item.id}
          onMouseEnter={() => !isTouchDevice && setHoveredId(item.id)}
          onMouseLeave={() => !isTouchDevice && setHoveredId(null)}
          onClick={() => isTouchDevice && setHoveredId(hoveredId === item.id ? null : item.id)}
          className={`
            group cursor-pointer 
            ${isTouchDevice ? '' : 'perspective-1000'}
            transition-all duration-700
            ${visibleCards.has(item.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
          style={{
            transitionDelay: visibleCards.has(item.id) ? `${index * 150}ms` : '0ms',
          }}
        >
          <div
            className={`
              relative h-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl
              transition-all ease-out optimize-animations
              ${isTouchDevice ? 'duration-300' : 'duration-500'}
              ${hoveredId === item.id 
                ? `${isTouchDevice ? 'scale-[1.02]' : 'scale-105'} shadow-2xl shadow-yellow-500/30 border-yellow-500/50` 
                : 'shadow-xl active:scale-[0.98]'
              }
            `}
            style={{
              transformStyle: isTouchDevice ? 'flat' : 'preserve-3d',
              transform: isClient && !isTouchDevice && hoveredId === item.id 
                ? 'rotateY(2deg) rotateX(-2deg) translateZ(20px)' 
                : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
              willChange: hoveredId === item.id ? 'transform' : 'auto',
            }}
          >
            {/* Изображение - адаптивная высота */}
            <div 
              className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-neutral-900 cursor-pointer"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={`/images/${item.image}`}
                alt={item.title}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`
                  h-full w-full object-cover
                  ${isTouchDevice ? 'transition-transform duration-300' : 'transition-all duration-700'}
                  ${hoveredId === item.id ? `${isTouchDevice ? 'scale-105' : 'scale-110'} brightness-110` : 'scale-100'}
                `}
                style={{
                  willChange: hoveredId === item.id ? 'transform' : 'auto',
                }}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzI2MjYyNiIvPjwvc3ZnPg=="
                priority={index < 3}
              />
              
              {/* Градиент overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent
                transition-opacity duration-500
                ${hoveredId === item.id ? 'opacity-100' : 'opacity-70'}
              `} />

              {/* Категория badge */}
              <div className="absolute top-4 right-4">
                <span className={`
                  inline-block rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md
                  transition-all duration-300
                  ${hoveredId === item.id 
                    ? 'border-yellow-400 bg-yellow-500/30 text-yellow-200' 
                    : 'border-white/20 bg-black/30 text-neutral-300'
                  }
                `}>
                  {item.category}
                </span>
              </div>

              {/* Hover иконка */}
              <div className={`
                absolute inset-0 flex items-center justify-center
                transition-all duration-300
                ${hoveredId === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
              `}>
                <div className="rounded-full bg-yellow-500/90 p-4 shadow-2xl shadow-yellow-500/50">
                  <svg className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Контент - адаптивный padding */}
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className={`
                font-display text-lg sm:text-xl font-bold transition-colors duration-300
                ${hoveredId === item.id ? 'text-yellow-400' : 'text-neutral-100'}
              `}>
                {item.title}
              </h3>
              
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {item.description}
              </p>

              {/* Блок с параметрами и ценой - адаптивный */}
              {item.kitchenParams ? (
                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  {/* Параметры кухни - адаптивный */}
                  <div className="p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-[10px] sm:text-xs text-neutral-500 font-semibold mb-1.5 sm:mb-2 uppercase tracking-wider">
                      Комплектация данной кухни:
                    </p>
                    <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-neutral-300">
                      <div className="flex justify-between gap-2">
                        <span className="text-neutral-400 flex-shrink-0">Тип:</span>
                        <span className="font-medium text-right">{item.kitchenParams.configuration}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-neutral-400 flex-shrink-0">Фасады:</span>
                        <span className="font-medium text-right">{item.kitchenParams.facade}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-neutral-400 flex-shrink-0">Фурнитура:</span>
                        <span className="font-medium text-right">{item.kitchenParams.hardware}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-neutral-400 flex-shrink-0">Столешница:</span>
                        <span className="font-medium text-right">{item.kitchenParams.countertop}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-neutral-400 flex-shrink-0">Длина:</span>
                        <span className="font-medium text-right">{item.kitchenParams.length} м</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Цена - адаптивный */}
                  <div className={`
                    flex items-center justify-between p-2.5 sm:p-3 rounded-lg
                    transition-all duration-300
                    ${hoveredId === item.id 
                      ? 'bg-yellow-500/20 border border-yellow-500/50' 
                      : 'bg-white/5 border border-white/10'
                    }
                  `}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-neutral-400">Расчётная стоимость:</p>
                      <p className={`
                        text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300
                        ${hoveredId === item.id ? 'text-yellow-400' : 'text-yellow-500'}
                        truncate
                      `}>
                        ≈ {formatPrice(calculateKitchenPrice(item.kitchenParams))} ₽
                      </p>
                    </div>
                    <button 
                      onClick={() => setLightboxIndex(index)}
                      className={`
                        group/btn relative overflow-hidden rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium
                        transition-all duration-300 flex-shrink-0
                        ${hoveredId === item.id
                          ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50 scale-105'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400 active:scale-95'
                        }
                      `}>
                      <span className="relative z-10">Фото</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Для нестандартных позиций (шкафы, гардеробные) */
                <div className={`
                  mt-4 flex items-center justify-between
                  transition-all duration-300
                  ${hoveredId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}
                `}>
                  <span className="text-lg font-semibold text-yellow-400">
                    {item.customPrice}
                  </span>
                  <button 
                    onClick={() => setLightboxIndex(index)}
                    className={`
                      group/btn relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium
                      transition-all duration-300
                      ${hoveredId === item.id
                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50 scale-105'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400 active:scale-95'
                      }
                    `}>
                    <span className="relative z-10">Подробнее</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              )}
            </div>

            {/* 3D depth effect - дополнительные слои */}
            <div className={`
              absolute -bottom-2 -right-2 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-yellow-500/5 to-amber-600/5 blur-sm
              transition-all duration-500
              ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}
            `} />
          </div>
        </div>
      ))}

      {/* Lightbox модальное окно */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Закрыть"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Навигация влево */}
            {showcaseItems.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : showcaseItems.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Предыдущее изображение"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Навигация вправо */}
            {showcaseItems.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev! < showcaseItems.length - 1 ? prev! + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Следующее изображение"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Контент */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Изображение */}
              <div className="relative w-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={`/images/${showcaseItems[lightboxIndex].image}`}
                  alt={showcaseItems[lightboxIndex].title}
                  width={1600}
                  height={1200}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {/* Информация - Glass morphism */}
              <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                      {showcaseItems[lightboxIndex].title}
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300">
                      {showcaseItems[lightboxIndex].category}
                    </span>
                  </div>
                  {showcaseItems[lightboxIndex].kitchenParams && (
                    <div className="text-right">
                      <div className="text-xs text-neutral-400 mb-1">Расчётная стоимость:</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        ≈ {formatPrice(calculateKitchenPrice(showcaseItems[lightboxIndex].kitchenParams!))} ₽
                      </div>
                    </div>
                  )}
                  {showcaseItems[lightboxIndex].customPrice && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {showcaseItems[lightboxIndex].customPrice}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-neutral-300 leading-relaxed mb-4">
                  {showcaseItems[lightboxIndex].description}
                </p>
                
                {/* Детальная комплектация в lightbox */}
                {showcaseItems[lightboxIndex].kitchenParams && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-neutral-400 font-semibold mb-3 uppercase tracking-wider">
                      Комплектация данной кухни:
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs">Тип конфигурации:</span>
                        <span className="text-neutral-200 font-medium">{showcaseItems[lightboxIndex].kitchenParams!.configuration}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs">Длина кухни:</span>
                        <span className="text-neutral-200 font-medium">{showcaseItems[lightboxIndex].kitchenParams!.length} метров</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs">Материал фасадов:</span>
                        <span className="text-neutral-200 font-medium">{showcaseItems[lightboxIndex].kitchenParams!.facade}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-500 text-xs">Фурнитура:</span>
                        <span className="text-neutral-200 font-medium">{showcaseItems[lightboxIndex].kitchenParams!.hardware}</span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-neutral-500 text-xs">Столешница:</span>
                        <span className="text-neutral-200 font-medium">{showcaseItems[lightboxIndex].kitchenParams!.countertop}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Индикатор позиции */}
              <div className="text-neutral-400 text-sm">
                {lightboxIndex + 1} / {showcaseItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

