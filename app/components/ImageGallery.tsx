"use client";

import Image from 'next/image';
import { useState } from 'react';
import type { KitchenWork } from '@/lib/galleryData';

export type GalleryImage = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  title?: string;
  description?: string;
  style?: string;
  price?: string;
};

type ImageGalleryProps = {
  images: GalleryImage[];
  works?: KitchenWork[];
  className?: string;
};

export default function ImageGallery({ images, works, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Если переданы works, обогащаем данные (для обратной совместимости)
  // Иначе используем данные напрямую из images (предпочтительный способ)
  const enrichedImages = works && works.length > 0 
    ? images.map((img) => {
        const work = works.find(w => img.src.includes(w.filename));
        return {
          ...img,
          title: work?.title || img.title,
          description: work?.description || img.description,
          style: work?.style || img.style,
          price: work?.price || img.price
        };
      })
    : images; // Используем images как есть, если works не передан

  return (
    <div className={className}>
      {/* Адаптивная сетка: 1 колонка на мобильных, 2 на планшетах, 3 на десктопах */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {enrichedImages.map((img, idx) => (
          <article
            key={img.src + idx}
            className="group relative overflow-hidden rounded-2xl border border-[#12484C] bg-[#12484C]/25 transition-all hover:-translate-y-1 hover:border-[#2B7574] hover:shadow-[0_25px_70px_rgba(2,6,8,0.55)]"
          >
            {/* Контейнер изображения */}
            <button
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="relative block w-full overflow-hidden"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.src}
                  alt={img.title || img.alt || "Кухня Золотой Дуб"}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                {/* Градиент для читаемости текста */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Бадж стиля */}
                {img.style && (
                  <div className="absolute right-3 top-3 rounded-full bg-[#2B7574] px-3 py-1 text-xs font-medium text-[#0E2931] backdrop-blur-sm">
                    {img.style}
                  </div>
                )}
              </div>
            </button>

            {/* Информационная панель */}
            <div className="p-4 text-[#E2E2E0]">
              <h3 className="font-elegant text-lg font-semibold text-[#E2E2E0] transition group-hover:text-[#2B7574]">
                {img.title || 'Кухня на заказ'}
              </h3>
              {img.description && (
                <p className="mt-2 line-clamp-2 text-sm text-[#E2E2E0]/70">
                  {img.description}
                </p>
              )}
              {img.price && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#2B7574]">
                    {img.price}
                  </span>
                  <span className="text-xs text-[#E2E2E0]/50">за проект</span>
                </div>
              )}
              
              {/* Кнопка просмотра */}
              <button
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="mt-4 w-full rounded-full border border-[#12484C]/70 bg-[#0E2931] py-2 text-sm text-[#E2E2E0] transition hover:border-[#2B7574] hover:bg-[#2B7574]/20"
              >
                Посмотреть подробнее →
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Модальное окно для полноэкранного просмотра */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal
          aria-label="Полноэкранный просмотр изображения"
        >
          <div className="relative max-h-[90vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {/* Изображение */}
            <div className="relative">
              <Image
                src={enrichedImages[activeIndex].src}
                alt={enrichedImages[activeIndex].title || ""}
                width={1600}
                height={1200}
                className="h-auto w-full rounded-lg object-contain"
                priority
              />
            </div>

            {/* Информация под изображением */}
            <div className="mt-4 rounded-2xl border border-[#12484C]/60 bg-[#0E2931]/95 p-4 text-[#E2E2E0] backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-elegant text-xl font-semibold text-[#E2E2E0]">
                    {enrichedImages[activeIndex].title}
                  </h3>
                  {enrichedImages[activeIndex].description && (
                    <p className="mt-2 text-[#E2E2E0]/75">
                      {enrichedImages[activeIndex].description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {enrichedImages[activeIndex].style && (
                      <span className="rounded-full bg-[#2B7574]/20 px-3 py-1 text-sm text-[#2B7574]">
                        {enrichedImages[activeIndex].style}
                      </span>
                    )}
                    {enrichedImages[activeIndex].price && (
                      <span className="text-lg font-semibold text-[#2B7574]">
                        {enrichedImages[activeIndex].price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Элементы управления */}
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute -right-4 -top-4 rounded-full bg-[#12484C]/90 p-3 text-[#E2E2E0] shadow-xl transition hover:bg-[#2B7574]"
              aria-label="Закрыть"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Навигация */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 transform rounded-full bg-[#0E2931]/80 px-4 py-2 text-sm text-[#E2E2E0]/85 backdrop-blur">
              {activeIndex + 1} / {enrichedImages.length}
            </div>

            {/* Стрелки навигации */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(activeIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-[#12484C]/80 p-3 text-[#E2E2E0] backdrop-blur transition hover:bg-[#2B7574]"
                aria-label="Предыдущее изображение"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {activeIndex < enrichedImages.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(activeIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-[#12484C]/80 p-3 text-[#E2E2E0] backdrop-blur transition hover:bg-[#2B7574]"
                aria-label="Следующее изображение"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


