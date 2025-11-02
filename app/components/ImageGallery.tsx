"use client";

import Image from 'next/image';
import { useState } from 'react';

export type GalleryImage = {
  src: string; // relative to public/, e.g. "/images/photo1.jpg"
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string; // custom responsive sizes
};

type ImageGalleryProps = {
  images: GalleryImage[];
  className?: string;
};

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, idx) => (
          <button
            key={img.src + idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50"
          >
            <Image
              src={img.src}
              alt={img.alt || ""}
              width={img.width || 800}
              height={img.height || 600}
              className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
              sizes={
                img.sizes ||
                "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              }
              placeholder="empty"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal
        >
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt || ""}
              width={images[activeIndex].width || 1600}
              height={images[activeIndex].height || 1200}
              className="h-auto w-full rounded-lg object-contain"
              priority
            />
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-2 top-2 rounded-md bg-neutral-900/70 px-3 py-1 text-sm text-neutral-200 shadow hover:bg-neutral-800"
            >
              Закрыть
            </button>
            <div className="absolute left-2 top-2 text-sm text-neutral-300">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


