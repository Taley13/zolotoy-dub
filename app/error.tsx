'use client';

/**
 * 🛡️ Error Boundary для обработки runtime ошибок
 * 
 * Автоматически отлавливает ошибки и показывает fallback UI
 */

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логируем ошибку для отладки
    console.error('Error caught by Error Boundary:', error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Иконка ошибки */}
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <span className="text-4xl">⚠️</span>
            </div>

            {/* Заголовок */}
            <h1 className="text-3xl font-bold text-amber-900 mb-4">
              Что-то пошло не так
            </h1>

            {/* Описание */}
            <p className="text-amber-700 mb-6 leading-relaxed">
              Произошла непредвиденная ошибка при загрузке страницы.
              Пожалуйста, попробуйте еще раз или свяжитесь с нами.
            </p>

            {/* Кнопки действий */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                🔄 Попробовать снова
              </button>

              <a
                href="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🏠 На главную
              </a>

              <a
                href="tel:+79301933420"
                className="block w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                📞 Позвонить: 8-930-193-34-20
              </a>
            </div>

            {/* Техническая информация (только в dev режиме) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-amber-600 hover:text-amber-700">
                  Техническая информация
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40 text-left">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            {/* Контактная информация */}
            <div className="mt-8 pt-6 border-t border-amber-200">
              <p className="text-sm text-amber-600">
                Если проблема повторяется, мы всегда на связи:
              </p>
              <div className="mt-3 space-y-1 text-sm text-amber-800">
                <p>📞 Телефон: 8-930-193-34-20</p>
                <p>🌐 Сайт: zol-dub.online</p>
                <p>📍 Воронеж</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

