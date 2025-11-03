/**
 * Безопасная обёртка для работы с Telegram Bot API
 * С автоматизацией: авто-ответы, учёт заявок, логирование
 */

type TelegramMessage = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  source?: 'contact_form' | 'calculator'; // Источник заявки
};

type TelegramResponse = {
  ok: boolean;
  result?: any;
  description?: string;
};

type ApplicationRecord = {
  id: string;
  timestamp: string;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  source: string;
  status: 'sent' | 'failed';
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
 * Генерация уникального ID заявки
 */
function generateApplicationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `ZD-${timestamp}-${random}`.toUpperCase();
}

/**
 * Сохранение заявки в JSON (server-side logging)
 */
function logApplication(record: ApplicationRecord): void {
  try {
    if (typeof window === 'undefined') {
      // Server-side logging
      console.log('═══════════════════════════════════════');
      console.log('📝 НОВАЯ ЗАЯВКА СОХРАНЕНА');
      console.log('═══════════════════════════════════════');
      console.log(JSON.stringify(record, null, 2));
      console.log('═══════════════════════════════════════');
    }
  } catch (error) {
    console.error('[Logging Error]', error);
  }
}

/**
 * Улучшенное форматирование сообщения с эмодзи
 */
function formatMessage(data: TelegramMessage, applicationId: string): string {
  const sourceEmoji = data.source === 'calculator' ? '🧮' : '📝';
  const sourceName = data.source === 'calculator' ? 'Калькулятор' : 'Форма обратной связи';
  
  const lines = [
    '🎯 НОВАЯ ЗАЯВКА «Золотой Дуб»',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `${sourceEmoji} Источник: ${sourceName}`,
    `🆔 ID заявки: ${applicationId}`,
    '',
    '👤 КОНТАКТНЫЕ ДАННЫЕ:',
    `   • Имя: ${data.name}`,
  ];

  if (data.phone) lines.push(`   📞 Телефон: ${data.phone}`);
  if (data.email) lines.push(`   ✉️ Email: ${data.email}`);
  
  if (data.message) {
    lines.push('');
    lines.push('💬 СООБЩЕНИЕ:');
    lines.push(data.message);
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`⏰ ${new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`);
  lines.push('');
  lines.push('✅ Статус: Ожидает обработки');

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
 * Отправка авто-ответа клиенту (если указан chat_id клиента)
 */
async function sendAutoReply(
  botToken: string,
  clientChatId: string,
  clientName: string
): Promise<void> {
  const autoReplyMessage = `
Здравствуйте, ${clientName}! 👋

Спасибо за обращение в мебельную фабрику «Золотой Дуб»! 🌰

✅ Ваша заявка получена и передана нашим специалистам.

⏰ Мы свяжемся с вами в течение 15 минут в рабочее время (пн-пт 9:00-18:00, сб 10:00-16:00).

📞 Если вопрос срочный, звоните: 8-930-193-34-20

С уважением,  
Команда «Золотой Дуб» 🪵✨
  `.trim();

  try {
    await sendMessage(botToken, clientChatId, autoReplyMessage);
  } catch (error) {
    console.warn('[Auto-reply] Failed to send:', error);
  }
}

/**
 * Отправка заявки с сайта в Telegram (основная функция)
 */
export async function sendContactFormToTelegram(
  data: TelegramMessage
): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  // Генерация уникального ID заявки
  const applicationId = generateApplicationId();
  
  // Валидация входных данных
  if (!data.name || data.name.trim().length === 0) {
    console.error('[Validation] Name is required');
    return { success: false, error: 'Имя обязательно' };
  }

  // Проверка переменных окружения
  const env = validateEnv();
  if (!env) {
    // Dev mode fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV MODE] Заявка (TELEGRAM_* не настроены):');
      console.log(formatMessage(data, applicationId));
      
      // Логирование в dev mode
      const record: ApplicationRecord = {
        id: applicationId,
        timestamp: new Date().toISOString(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        source: data.source || 'contact_form',
        status: 'sent'
      };
      logApplication(record);
      
      return { success: true, applicationId };
    }
    console.error('[Config] Telegram credentials not configured');
    return { success: false, error: 'Сервис временно недоступен' };
  }

  const { botToken, chatIds } = env;
  const text = formatMessage(data, applicationId);

  // Отправка всем получателям
  const results = await Promise.allSettled(
    chatIds.map(chatId => sendMessage(botToken, chatId, text))
  );

  // Проверка результатов
  const failures = results.filter(r => r.status === 'rejected' || !r.value.success);
  const successes = results.filter(r => r.status === 'fulfilled' && r.value.success);
  
  // Создаём запись о заявке
  const record: ApplicationRecord = {
    id: applicationId,
    timestamp: new Date().toISOString(),
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    source: data.source || 'contact_form',
    status: successes.length > 0 ? 'sent' : 'failed'
  };

  // Логирование
  logApplication(record);

  if (failures.length === results.length) {
    // Все отправки провалились
    console.error('[Telegram] All deliveries failed');
    return { 
      success: false, 
      error: 'Не удалось отправить сообщение',
      applicationId 
    };
  }

  if (failures.length > 0) {
    // Часть отправок провалилась
    console.warn(`[Telegram] ${failures.length}/${results.length} deliveries failed`);
  } else {
    console.log(`[Telegram] Successfully sent to ${successes.length} recipients`);
  }

  // TODO: В будущем можно отправить авто-ответ клиенту
  // if (clientChatId) {
  //   await sendAutoReply(botToken, clientChatId, data.name);
  // }

  return { success: true, applicationId };
}

