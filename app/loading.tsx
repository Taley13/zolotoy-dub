/**
 * ⏳ Loading State для страниц
 * 
 * Показывается во время загрузки страницы или компонента
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-ultra flex items-center justify-center">
      <div className="text-center">
        {/* Анимированный желудь */}
        <div className="mb-8 animate-bounce">
          <div className="relative inline-block">
            {/* Золотое свечение */}
            <div className="absolute -inset-4 bg-amber-500/30 blur-2xl rounded-full animate-pulse"></div>
            
            {/* Желудь */}
            <div className="relative text-7xl filter drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
              🌰
            </div>
          </div>
        </div>

        {/* Текст */}
        <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          Золотой Дуб
        </h2>
        
        <p className="text-amber-300 text-sm animate-pulse">
          Загрузка...
        </p>

        {/* Индикатор прогресса - используем Tailwind animate */}
        <div className="mt-6 w-48 mx-auto h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
}

