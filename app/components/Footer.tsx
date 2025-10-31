export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-400 sm:px-6 lg:px-8">
        <p>
          © {year} Золотой Дуб. Все права защищены.
        </p>
      </div>
    </footer>
  );
}




