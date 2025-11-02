export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Золотой Дуб",
    "description": "Мебельная фабрика по изготовлению кухонь и шкафов на заказ. Кухни, шкафы-купе, гардеробные из ДСП, МДФ, Эмаль",
    "url": "https://zol-dub.online",
    "telephone": "+7-930-193-34-20",
    "email": "info@zolotoy-dub.ru",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressRegion": "Московская область",
      "addressCountry": "RU"
    },
    "priceRange": "₽₽-₽₽₽",
    "image": "https://zol-dub.online/images/1759474759.png",
    "sameAs": [
      "https://t.me/ZOLODUB_bot"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Кухни на заказ",
          "description": "Изготовление кухонь из ДСП, МДФ, Эмаль"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Шкафы-купе",
          "description": "Встроенные шкафы-купе и гардеробные"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

