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

  // Объединяем данные изображений с описаниями работ
  const enrichedImages = images.map((img, idx) => {
    const work = works?.find(w => img.src.includes(w.filename));
    return {
      ...img,
      title: work?.title || img.title,
      description: work?.description || img.description,
      style: work?.style || img.style,
      price: work?.price || img.price
    };
  });

  return (
    <div className={className}>
      {/* Адаптивная сетка: 1 колонка на мобильных, 2 на планшетах, 3 на десктопах */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {enrichedImages.map((img, idx) => (
          <article
            key={img.src + idx}
            className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10"
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
                  <div className="absolute right-3 top-3 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {img.style}
                  </div>
                )}
              </div>
            </button>

            {/* Информационная панель */}
            <div className="p-4">
              <h3 className="font-elegant text-lg font-semibold text-neutral-100 group-hover:text-brand-400 transition">
                {img.title || 'Кухня на заказ'}
              </h3>
              {img.description && (
                <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                  {img.description}
                </p>
              )}
              {img.price && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-brand-400">
                    {img.price}
                  </span>
                  <span className="text-xs text-neutral-500">за проект</span>
                </div>
              )}
              
              {/* Кнопка просмотра */}
              <button
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="mt-4 w-full rounded-lg bg-neutral-800/50 py-2 text-sm text-neutral-300 transition hover:bg-brand-500/20 hover:text-brand-400"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
            <div className="mt-4 rounded-lg bg-neutral-900/90 p-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-elegant text-xl font-semibold text-neutral-100">
                    {enrichedImages[activeIndex].title}
                  </h3>
                  {enrichedImages[activeIndex].description && (
                    <p className="mt-2 text-neutral-300">
                      {enrichedImages[activeIndex].description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {enrichedImages[activeIndex].style && (
                      <span className="rounded-full bg-brand-500/20 px-3 py-1 text-sm text-brand-400">
                        {enrichedImages[activeIndex].style}
                      </span>
                    )}
                    {enrichedImages[activeIndex].price && (
                      <span className="text-lg font-semibold text-brand-400">
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
              className="absolute -right-4 -top-4 rounded-full bg-neutral-900 p-3 text-neutral-200 shadow-xl hover:bg-neutral-800 hover:text-white transition"
              aria-label="Закрыть"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Навигация */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2 transform rounded-full bg-neutral-900/70 px-4 py-2 text-sm text-neutral-300 backdrop-blur">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-neutral-900/70 p-3 text-neutral-200 backdrop-blur hover:bg-neutral-800 hover:text-white transition"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-neutral-900/70 p-3 text-neutral-200 backdrop-blur hover:bg-neutral-800 hover:text-white transition"
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


