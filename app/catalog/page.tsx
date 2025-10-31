export const metadata = {
  title: 'Каталог — Золотой Дуб'
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-neutral-100 font-elegant">Каталог</h1>
      <p className="mt-4 text-neutral-300">Подборка популярных решений и примеров работ.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 rounded-lg bg-neutral-900 border border-neutral-800" />
        <div className="h-40 rounded-lg bg-neutral-900 border border-neutral-800" />
        <div className="h-40 rounded-lg bg-neutral-900 border border-neutral-800" />
      </div>
    </div>
  );
}




