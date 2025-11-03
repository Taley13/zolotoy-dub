"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

type ShowcaseItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  price?: string;
};

const showcaseItems: ShowcaseItem[] = [
  {
    id: '1',
    title: 'Кухня премиум',
    category: 'МДФ Эмаль',
    image: '1759474759.png',
    description: 'Современный дизайн с глянцевыми фасадами',
    price: 'от 250 000 ₽'
  },
  {
    id: '2',
    title: 'Кухня классика',
    category: 'МДФ',
    image: '1759474837.png',
    description: 'Классический стиль с фрезеровкой',
    price: 'от 180 000 ₽'
  },
  {
    id: '3',
    title: 'Кухня модерн',
    category: 'ДСП',
    image: '1759474944.png',
    description: 'Минималистичный дизайн для небольших пространств',
    price: 'от 95 000 ₽'
  },
  {
    id: '4',
    title: 'Шкаф-купе',
    category: 'Встроенный',
    image: 'Create_a_hyper-realistic,.png',
    description: 'Индивидуальная система хранения',
    price: 'от 45 000 ₽'
  },
  {
    id: '5',
    title: 'Гардеробная',
    category: 'Комплект',
    image: 'Create_hyper-realistic,_u (2).png',
    description: 'Полноценная гардеробная система',
    price: 'от 75 000 ₽'
  },
  {
    id: '6',
    title: 'Кухня островная',
    category: 'МДФ+Камень',
    image: 'Create_hyper-realistic,_u (3).png',
    description: 'Островная планировка с каменной столешницей',
    price: 'от 320 000 ₽'
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl
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
            {/* Изображение */}
            <div 
              className="relative h-64 overflow-hidden bg-neutral-900 cursor-pointer"
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

            {/* Контент */}
            <div className="p-6">
              <h3 className={`
                font-display text-xl font-bold transition-colors duration-300
                ${hoveredId === item.id ? 'text-yellow-400' : 'text-neutral-100'}
              `}>
                {item.title}
              </h3>
              
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {item.description}
              </p>

              {/* Цена и кнопка */}
              <div className={`
                mt-4 flex items-center justify-between
                transition-all duration-300
                ${hoveredId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}
              `}>
                <span className="text-lg font-semibold text-yellow-400">
                  {item.price}
                </span>
                <button className={`
                  group/btn relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium
                  transition-all duration-300
                  ${hoveredId === item.id
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50 scale-105'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400 active:scale-95'
                  }
                `}>
                  <span className="relative z-10">Подробнее</span>
                  {/* Shimmer эффект */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
              </div>
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
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">
                      {showcaseItems[lightboxIndex].price}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {showcaseItems[lightboxIndex].description}
                </p>
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

