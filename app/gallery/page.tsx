import fs from 'fs';
import path from 'path';
import ImageGallery, { type GalleryImage } from '@/app/components/ImageGallery';
import { kitchenWorks } from '@/lib/galleryData';

export const metadata = {
  title: 'Галерея работ — Золотой Дуб | Портфолио кухонь на заказ',
  description: 'Наши лучшие работы: кухни на заказ в различных стилях - классика, модерн, лофт, неоклассика. Более 12 реализованных проектов.',
  openGraph: {
    title: 'Галерея работ — Золотой Дуб',
    description: 'Наши лучшие работы: кухни на заказ в различных стилях',
    images: ['/images/kitchen-01.jpg']
  }
};

function getGalleryImages(): GalleryImage[] {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(imagesDir)) return [];
  
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort(); // Сортируем файлы для стабильного порядка
  
  // Сопоставляем файлы с данными из galleryData
  return files.map((file) => {
    const work = kitchenWorks.find(w => w.filename === file);
    
    if (!work) {
      console.warn(`⚠️ No data found for ${file}`);
    }
    
    return {
      src: `/images/${file}`,
      alt: work?.title || `Кухня Золотой Дуб - ${file}`,
      width: 1600,
      height: 1200,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      title: work?.title || `Кухня ${file}`,
      description: work?.description || 'Индивидуальный проект кухни на заказ',
      style: work?.style || 'Авторский',
      price: work?.price || 'По запросу'
    };
  });
}

export default function GalleryPage() {
  const images = getGalleryImages();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Заголовок страницы */}
        <div className="mb-8 text-center">
          <h1 className="font-elegant text-4xl font-bold text-neutral-100 sm:text-5xl">
            Наши <span className="text-brand-400">работы</span>
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Более {images.length} реализованных проектов в различных стилях
          </p>
        </div>

        {/* Фильтры стилей */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {Array.from(new Set(kitchenWorks.map(w => w.style))).map((style) => (
            <button
              key={style}
              className="rounded-full border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm text-neutral-300 transition hover:border-brand-500 hover:bg-brand-500/10 hover:text-brand-400"
            >
              {style}
            </button>
          ))}
        </div>

        {/* Галерея */}
        {images.length > 0 ? (
          <ImageGallery images={images} className="mt-8" />
        ) : (
          <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-300">
            <p>Пока нет фотографий. Загрузите файлы в папку <code className="rounded bg-neutral-800 px-2 py-1 text-neutral-200">public/images</code> (форматы: JPG, PNG, WEBP, AVIF).</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-neutral-900/50 p-8 text-center backdrop-blur-sm">
          <h2 className="font-elegant text-2xl font-semibold text-neutral-100">
            Хотите кухню своей мечты?
          </h2>
          <p className="mt-3 text-neutral-400">
            Оставьте заявку, и мы разработаем индивидуальный проект специально для вас
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contacts"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 font-medium text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/40"
            >
              Оставить заявку
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/50 px-6 py-3 font-medium text-neutral-200 transition hover:border-brand-500/50 hover:bg-neutral-800"
            >
              Рассчитать стоимость
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


