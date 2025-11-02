"use client";

import Image from 'next/image';
import { useState } from 'react';

type Filter = 'all' | 'kitchens' | 'wardrobes' | 'closets';

const images = [
  { src: '1759474759.png', category: 'kitchens' as Filter },
  { src: '1759474837.png', category: 'kitchens' as Filter },
  { src: '1759474944.png', category: 'kitchens' as Filter },
  { src: 'Create_a_hyper-realistic,.png', category: 'wardrobes' as Filter },
  { src: 'Create_hyper-realistic,_u (2).png', category: 'kitchens' as Filter },
  { src: 'Create_hyper-realistic,_u (3).png', category: 'closets' as Filter },
  { src: 'Create_hyper-realistic,_u (4).png', category: 'kitchens' as Filter },
  { src: 'Create_hyper-realistic,_u (5).png', category: 'wardrobes' as Filter },
  { src: 'Create_hyper-realistic,_u (6).png', category: 'kitchens' as Filter },
];

const filters = [
  { id: 'all' as Filter, label: 'Все работы' },
  { id: 'kitchens' as Filter, label: 'Кухни' },
  { id: 'wardrobes' as Filter, label: 'Шкафы-купе' },
  { id: 'closets' as Filter, label: 'Гардеробные' },
];

export default function FilterGallery() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeFilter === 'all' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`rounded-lg px-5 py-2.5 font-medium transition-all ${
              activeFilter === f.id
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg shadow-yellow-500/50'
                : 'glass-panel text-neutral-300 hover:text-yellow-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Галерея */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img, idx) => (
          <button
            key={img.src}
            onClick={() => setLightboxIndex(idx)}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm card-hover"
          >
            <Image
              src={`/images/${img.src}`}
              alt="Работа Золотой Дуб"
              width={1600}
              height={1200}
              className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-125"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-xs font-medium text-yellow-400">
                {img.category === 'kitchens' ? 'Кухня' : img.category === 'wardrobes' ? 'Шкаф-купе' : 'Гардеробная'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-h-[90vh] max-w-6xl">
            <Image
              src={`/images/${filtered[lightboxIndex].src}`}
              alt="Работа"
              width={1600}
              height={1200}
              className="h-auto w-full rounded-2xl object-contain"
              priority
            />
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 rounded-lg bg-black/70 px-4 py-2 text-white backdrop-blur-sm hover:bg-black/90 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

