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
    <div className="min-h-screen bg-[#0E2931] text-[#E2E2E0]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Заголовок страницы */}
        <div className="mb-8 text-center">
          <h1 className="font-elegant text-4xl font-bold text-[#E2E2E0] sm:text-5xl">
            Наши{' '}
            <span className="bg-gradient-to-r from-[#12484C] via-[#2B7574] to-[#861211] bg-clip-text text-transparent">
              работы
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#E2E2E0]/75">
            Более {images.length} реализованных проектов в различных стилях
          </p>
        </div>

        {/* Фильтры стилей */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {Array.from(new Set(kitchenWorks.map(w => w.style))).map((style) => (
            <button
              key={style}
              className="rounded-full border border-[#12484C] bg-[#12484C]/30 px-4 py-2 text-sm text-[#E2E2E0] transition hover:-translate-y-0.5 hover:border-[#2B7574] hover:bg-[#2B7574]/40 hover:text-[#E2E2E0]"
            >
              {style}
            </button>
          ))}
        </div>

        {/* Галерея */}
        {images.length > 0 ? (
          <ImageGallery images={images} className="mt-8" />
        ) : (
          <div className="mt-12 rounded-2xl border border-[#12484C] bg-[#12484C]/20 p-8 text-center text-[#E2E2E0]/80">
            <p>
              Пока нет фотографий. Загрузите файлы в папку{' '}
              <code className="rounded bg-[#0E2931] px-2 py-1 text-[#E2E2E0]">public/images</code> (форматы: JPG, PNG, WEBP,
              AVIF).
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 rounded-3xl border border-[#12484C] bg-gradient-to-br from-[#12484C]/25 via-[#0E2931]/90 to-[#0E2931] p-8 text-center shadow-[0_30px_80px_rgba(3,7,9,0.65)] backdrop-blur">
          <h2 className="font-elegant text-2xl font-semibold text-[#E2E2E0]">
            Хотите кухню своей мечты?
          </h2>
          <p className="mt-3 text-[#E2E2E0]/75">
            Оставьте заявку, и мы разработаем индивидуальный проект специально для вас
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contacts"
              className="inline-flex items-center justify-center rounded-full bg-[#861211] px-6 py-3 font-semibold text-[#E2E2E0] shadow-[0_18px_50px_rgba(134,18,17,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a41b1a]"
            >
              Оставить заявку
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#2B7574] bg-transparent px-6 py-3 font-semibold text-[#2B7574] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2B7574]/15 hover:text-[#E2E2E0]"
            >
              Рассчитать стоимость
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


