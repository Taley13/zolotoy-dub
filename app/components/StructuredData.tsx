export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Золотой Дуб",
    "description": "Фабрика премиум-кухонь из массива дуба",
    "url": "https://zol-dub.online",
    "telephone": "+7-930-193-34-20",
    "email": "info@zolotoy-dub.ru",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressCountry": "RU"
    },
    "priceRange": "₽₽₽",
    "image": "https://zol-dub.online/images/1759474759.png",
    "sameAs": [
      "https://t.me/ZOLODUB_bot"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

