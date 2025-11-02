import fs from 'fs';
import path from 'path';
import ImageGallery, { type GalleryImage } from '@/app/components/ImageGallery';

export const metadata = {
  title: 'Галерея — Золотой Дуб'
};

function getGalleryImages(): GalleryImage[] {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(imagesDir)) return [];
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  return files.map((file) => ({
    src: `/images/${file}`,
    alt: 'Работа Золотой Дуб',
    width: 1600,
    height: 1200,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
  }));
}

export default function GalleryPage() {
  const images = getGalleryImages();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold text-neutral-100 font-elegant">Галерея работ</h1>
        <a href="/contacts" className="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 transition">
          Оставить заявку
        </a>
      </div>

      {images.length > 0 ? (
        <ImageGallery images={images} className="mt-8" />
      ) : (
        <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-neutral-300">
          <p>Пока нет фотографий. Загрузите файлы в папку <code className="text-neutral-200">public/images</code> (форматы: JPG, PNG, WEBP, AVIF) и перезапустите сборку.</p>
        </div>
      )}
    </div>
  );
}


