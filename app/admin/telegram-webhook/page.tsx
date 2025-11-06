'use client';

/**
 * 🔧 НАСТРОЙКА TELEGRAM WEBHOOK
 * 
 * Админская страница для управления вебхуком Telegram бота
 */

import { useState, useEffect } from 'react';

export default function TelegramWebhookPage() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // URL вебхука по умолчанию
  const defaultWebhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/telegram`
    : 'https://zol-dub.online/api/telegram';

  useEffect(() => {
    setWebhookUrl(defaultWebhookUrl);
    loadWebhookInfo();
  }, []);

  // Загрузка текущей информации о вебхуке
  const loadWebhookInfo = async () => {
    try {
      const response = await fetch('/api/telegram/webhook-info');
      const data = await response.json();
      if (data.ok) {
        setWebhookInfo(data.result);
      }
    } catch (error) {
      console.error('Ошибка загрузки info:', error);
    }
  };

  // Установка вебхука
  const setWebhook = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
      });

      const data = await response.json();

      if (data.ok) {
        setMessage({ type: 'success', text: '✅ Webhook успешно установлен!' });
        await loadWebhookInfo();
      } else {
        setMessage({ type: 'error', text: `❌ Ошибка: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Ошибка: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  // Удаление вебхука
  const deleteWebhook = async () => {
    if (!confirm('Вы уверены, что хотите удалить webhook?')) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/telegram/delete-webhook', {
        method: 'POST'
      });

      const data = await response.json();

      if (data.ok) {
        setMessage({ type: 'success', text: '✅ Webhook удален!' });
        await loadWebhookInfo();
      } else {
        setMessage({ type: 'error', text: `❌ Ошибка: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Ошибка: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  // Тестовое сообщение
  const sendTestMessage = async () => {
    const testChatId = prompt('Введите ваш Telegram Chat ID:');
    if (!testChatId) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/telegram/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: testChatId })
      });

      const data = await response.json();

      if (data.ok) {
        setMessage({ type: 'success', text: '✅ Тестовое сообщение отправлено!' });
      } else {
        setMessage({ type: 'error', text: `❌ Ошибка: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Ошибка: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            🤖 Настройка Telegram Webhook
          </h1>
          <p className="text-amber-700">
            Управление вебхуком для Telegram бота «Золотой Дуб»
          </p>
        </div>

        {/* Сообщения */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Текущая информация о вебхуке */}
        {webhookInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">
              📊 Текущий статус
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-800">URL:</span>
                <span className="text-gray-700 font-mono text-sm">
                  {webhookInfo.url || 'Не установлен'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-800">Статус:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  webhookInfo.url 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {webhookInfo.url ? '🟢 Активен' : '⚪ Не настроен'}
                </span>
              </div>
              {webhookInfo.pending_update_count !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-amber-800">Ожидающих обновлений:</span>
                  <span className="text-gray-700">
                    {webhookInfo.pending_update_count}
                  </span>
                </div>
              )}
              {webhookInfo.last_error_date && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="font-semibold text-red-800 mb-1">Последняя ошибка:</p>
                  <p className="text-sm text-red-700">{webhookInfo.last_error_message}</p>
                  <p className="text-xs text-red-600 mt-1">
                    {new Date(webhookInfo.last_error_date * 1000).toLocaleString('ru-RU')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Установка вебхука */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            🔧 Установить Webhook
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-amber-800 mb-2">
                URL вебхука:
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="https://zol-dub.online/api/telegram"
              />
              <p className="text-xs text-gray-600 mt-1">
                💡 По умолчанию используется текущий домен
              </p>
            </div>
            
            <button
              onClick={setWebhook}
              disabled={loading || !webhookUrl}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '⏳ Установка...' : '✅ Установить Webhook'}
            </button>
          </div>
        </div>

        {/* Действия */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            🎮 Действия
          </h2>
          <div className="space-y-3">
            <button
              onClick={loadWebhookInfo}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              🔄 Обновить информацию
            </button>
            
            <button
              onClick={sendTestMessage}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              📨 Отправить тестовое сообщение
            </button>
            
            <button
              onClick={deleteWebhook}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              🗑 Удалить Webhook
            </button>
          </div>
        </div>

        {/* Инструкция */}
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <h3 className="text-lg font-bold text-amber-900 mb-3">
            📖 Инструкция по настройке
          </h3>
          <ol className="space-y-2 text-amber-800 text-sm">
            <li>
              <strong>1.</strong> Убедитесь, что сайт доступен по HTTPS (обязательно для вебхуков)
            </li>
            <li>
              <strong>2.</strong> Нажмите "Установить Webhook" для активации
            </li>
            <li>
              <strong>3.</strong> Проверьте статус - должно быть "🟢 Активен"
            </li>
            <li>
              <strong>4.</strong> Отправьте тестовое сообщение боту для проверки
            </li>
            <li>
              <strong>5.</strong> Если есть ошибки, проверьте логи Vercel
            </li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Важно:</strong> После установки вебхука старый бот (с polling) нужно остановить, 
              иначе будет конфликт.
            </p>
          </div>
        </div>

        {/* Ссылки */}
        <div className="mt-6 text-center space-x-4">
          <a href="/" className="text-amber-600 hover:text-amber-700 font-semibold">
            ← На главную
          </a>
          <a href="/api/telegram" target="_blank" className="text-amber-600 hover:text-amber-700 font-semibold">
            Проверить endpoint →
          </a>
        </div>
      </div>
    </div>
  );
}

