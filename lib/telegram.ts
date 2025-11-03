/**
 * Безопасная обёртка для работы с Telegram Bot API
 */

type TelegramMessage = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
};

type TelegramResponse = {
  ok: boolean;
  result?: any;
  description?: string;
};

/**
 * Валидация переменных окружения
 */
function validateEnv(): { botToken: string; chatIds: string[] } | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatIdsRaw) {
    console.warn('[Telegram] Environment variables not configured');
    return null;
  }

  // Валидация формата токена
  if (!/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) {
    console.error('[Telegram] Invalid bot token format');
    return null;
  }

  const chatIds = chatIdsRaw.split(',').map(id => id.trim()).filter(Boolean);
  
  // Валидация chat IDs
  if (chatIds.length === 0 || chatIds.some(id => !/^-?\d+$/.test(id))) {
    console.error('[Telegram] Invalid chat ID format');
    return null;
  }

  return { botToken, chatIds };
}

/**
 * Форматирование сообщения заявки
 */
function formatMessage(data: TelegramMessage): string {
  const lines = [
    '🎯 Новая заявка с сайта «Золотой Дуб»',
    '',
    `👤 Имя: ${data.name}`,
  ];

  if (data.phone) lines.push(`📞 Телефон: ${data.phone}`);
  if (data.email) lines.push(`✉️ E-mail: ${data.email}`);
  if (data.message) lines.push(`💬 Сообщение: ${data.message}`);

  lines.push('');
  lines.push(`⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`);

  return lines.join('\n');
}

/**
 * Отправка сообщения в Telegram
 */
async function sendMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML'
        }),
        cache: 'no-store'
      }
    );

    const data: TelegramResponse = await response.json();

    if (!data.ok) {
      console.error('[Telegram] API Error:', data.description || 'Unknown error');
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error) {
    console.error('[Telegram] Network Error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Отправка заявки с сайта в Telegram
 */
export async function sendContactFormToTelegram(
  data: TelegramMessage
): Promise<{ success: boolean; error?: string }> {
  // Валидация входных данных
  if (!data.name || data.name.trim().length === 0) {
    return { success: false, error: 'Имя обязательно' };
  }

  // Проверка переменных окружения
  const env = validateEnv();
  if (!env) {
    // Dev mode fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV MODE] Заявка (TELEGRAM_* не настроены):');
      console.log(formatMessage(data));
      return { success: true };
    }
    return { success: false, error: 'Сервис временно недоступен' };
  }

  const { botToken, chatIds } = env;
  const text = formatMessage(data);

  // Отправка всем получателям
  const results = await Promise.allSettled(
    chatIds.map(chatId => sendMessage(botToken, chatId, text))
  );

  // Проверка результатов
  const failures = results.filter(r => r.status === 'rejected' || !r.value.success);
  
  if (failures.length === results.length) {
    // Все отправки провалились
    return { success: false, error: 'Не удалось отправить сообщение' };
  }

  if (failures.length > 0) {
    // Часть отправок провалилась
    console.warn(`[Telegram] ${failures.length}/${results.length} deliveries failed`);
  }

  return { success: true };
}

