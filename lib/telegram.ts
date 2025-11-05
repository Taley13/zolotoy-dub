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
 * Отправка сообщения в Telegram с интерактивными кнопками
 */
async function sendMessage(
  botToken: string,
  chatId: string,
  text: string,
  applicationId?: string
): Promise<{ success: boolean; error?: string }> {
  const startTime = Date.now();
  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log(`║  SENDING TO CHAT: ${chatId.padEnd(33)} ║`);
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    console.log(`[Telegram] 🔄 Step 1/5: Preparing message payload`);
    console.log(`[Telegram]    - Chat ID: ${chatId}`);
    console.log(`[Telegram]    - Application ID: ${applicationId || 'N/A'}`);
    console.log(`[Telegram]    - Message length: ${text.length} chars`);
    
    // Формируем кнопки для заявки
    const reply_markup = applicationId ? {
      inline_keyboard: [
        [
          { text: '✅ Обработано', callback_data: `app_done_${applicationId}` },
          { text: '⏳ В работе', callback_data: `app_work_${applicationId}` }
        ],
        [
          { text: '📞 Позвонил', callback_data: `app_called_${applicationId}` },
          { text: '💬 Написал', callback_data: `app_messaged_${applicationId}` }
        ],
        [
          { text: '🗑 Удалить', callback_data: `app_delete_${applicationId}` }
        ]
      ]
    } : undefined;

    console.log(`[Telegram]    - Interactive buttons: ${reply_markup ? 'YES (5 buttons)' : 'NO'}`);
    
    // Подготовка payload
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup
    };
    
    console.log(`[Telegram] ✅ Step 1/5: Payload prepared`);
    
    // Проверка URL и токена
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const maskedToken = botToken.substring(0, 10) + '...' + botToken.substring(botToken.length - 5);
    console.log(`[Telegram] 🔄 Step 2/5: Preparing HTTP request`);
    console.log(`[Telegram]    - URL: https://api.telegram.org/bot${maskedToken}/sendMessage`);
    console.log(`[Telegram]    - Method: POST`);
    console.log(`[Telegram]    - Headers: Content-Type: application/json`);
    console.log(`[Telegram]    - Body size: ${JSON.stringify(payload).length} bytes`);

    console.log(`[Telegram] 📡 Step 3/5: Sending HTTP request to Telegram API...`);
    console.log(`[Telegram]    - Timestamp: ${new Date().toISOString()}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Zolotoy-Dub-Bot/1.0'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const responseTime = Date.now() - startTime;
    console.log(`[Telegram] ✅ Step 3/5: HTTP response received (${responseTime}ms)`);
    console.log(`[Telegram]    - Status: ${response.status} ${response.statusText}`);
    console.log(`[Telegram]    - Headers:`, Object.fromEntries(response.headers.entries()));

    console.log(`[Telegram] 🔄 Step 4/5: Parsing response JSON...`);
    const data: TelegramResponse = await response.json();
    console.log(`[Telegram] ✅ Step 4/5: JSON parsed successfully`);
    console.log(`[Telegram]    - Response OK: ${data.ok}`);

    if (!data.ok) {
      console.log(`[Telegram] 🔄 Step 5/5: Processing API error...`);
      console.error(`[Telegram] ❌ API Error for chat ${chatId}:`);
      console.error(`[Telegram]    - Error code: ${(data as any).error_code || 'N/A'}`);
      console.error(`[Telegram]    - Description: ${data.description || 'Unknown error'}`);
      console.error(`[Telegram]    - Full response:`, JSON.stringify(data, null, 2));
      console.error(`[Telegram]    - Total time: ${responseTime}ms`);
      console.log('╚════════════════════════════════════════════════════╝');
      return { success: false, error: data.description };
    }

    console.log(`[Telegram] 🔄 Step 5/5: Processing successful response...`);
    console.log(`[Telegram] ✅ SUCCESS! Message delivered to chat ${chatId}`);
    console.log(`[Telegram]    - Message ID: ${data.result?.message_id || 'N/A'}`);
    console.log(`[Telegram]    - Chat ID confirmed: ${data.result?.chat?.id || 'N/A'}`);
    console.log(`[Telegram]    - Date: ${data.result?.date ? new Date(data.result.date * 1000).toISOString() : 'N/A'}`);
    console.log(`[Telegram]    - Total processing time: ${responseTime}ms`);
    console.log('╚════════════════════════════════════════════════════╝');
    
    return { success: true };
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error('');
    console.error('╔════════════════════════════════════════════════════╗');
    console.error('║              ❌ NETWORK/FETCH ERROR                ║');
    console.error('╚════════════════════════════════════════════════════╝');
    console.error(`[Telegram] ❌ Network/Fetch Error for chat ${chatId}:`);
    console.error(`[Telegram]    - Error type: ${error?.constructor?.name || 'Unknown'}`);
    console.error(`[Telegram]    - Time elapsed: ${errorTime}ms`);
    
    if (error instanceof Error) {
      console.error(`[Telegram]    - Error name: ${error.name}`);
      console.error(`[Telegram]    - Error message: ${error.message}`);
      console.error(`[Telegram]    - Stack trace:`);
      console.error(error.stack);
    } else {
      console.error(`[Telegram]    - Raw error:`, error);
    }
    
    // Проверка на CORS
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Telegram] ⚠️ POSSIBLE CAUSES:`);
      console.error(`[Telegram]    - Network connectivity issue`);
      console.error(`[Telegram]    - DNS resolution failure`);
      console.error(`[Telegram]    - Firewall/proxy blocking`);
      console.error(`[Telegram]    - Telegram API temporarily unavailable`);
      console.error(`[Telegram]    - Note: CORS is NOT relevant for server-side requests`);
    }
    
    console.error('╚════════════════════════════════════════════════════╝');
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
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 [Telegram] START: Отправка новой заявки');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Генерация уникального ID заявки
  const applicationId = generateApplicationId();
  console.log(`[Telegram] 🆔 Generated application ID: ${applicationId}`);
  
  // Логирование полученных данных
  console.log('[Telegram] 📋 Form data received:');
  console.log(`  - Name: "${data.name}"`);
  console.log(`  - Phone: ${data.phone ? `"${data.phone}"` : 'NOT PROVIDED'}`);
  console.log(`  - Email: ${data.email ? `"${data.email}"` : 'NOT PROVIDED'}`);
  console.log(`  - Message: ${data.message ? `"${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}"` : 'NOT PROVIDED'}`);
  console.log(`  - Source: ${data.source || 'contact_form'}`);
  
  // Валидация входных данных
  if (!data.name || data.name.trim().length === 0) {
    console.error('[Telegram] ❌ VALIDATION FAILED: Name is required');
    return { success: false, error: 'Имя обязательно' };
  }
  console.log('[Telegram] ✅ Validation passed');

  // Проверка переменных окружения
  console.log('[Telegram] 🔑 Checking environment variables...');
  const env = validateEnv();
  if (!env) {
    // Dev mode fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('[Telegram] ⚠️ DEV MODE: TELEGRAM_* variables not configured');
      console.log('[Telegram] 📄 Заявка будет только залогирована:');
      const messageText = formatMessage(data, applicationId);
      console.log('─────────────────────────────────────────────────');
      console.log(messageText);
      console.log('─────────────────────────────────────────────────');
      
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
    console.error('[Telegram] ❌ CONFIG ERROR: Telegram credentials not configured');
    return { success: false, error: 'Сервис временно недоступен' };
  }

  const { botToken, chatIds } = env;
  console.log(`[Telegram] ✅ Environment OK: Bot token found, ${chatIds.length} chat ID(s) configured`);
  console.log(`[Telegram] 📍 Target chat IDs: ${chatIds.join(', ')}`);
  
  // Подготовка текста сообщения
  console.log('[Telegram] 📝 Preparing message text...');
  const text = formatMessage(data, applicationId);
  console.log(`[Telegram] ✅ Message prepared (${text.length} characters)`);
  console.log('[Telegram] 📄 Message preview (first 200 chars):');
  console.log('─────────────────────────────────────────────────');
  console.log(text.substring(0, 200) + (text.length > 200 ? '...' : ''));
  console.log('─────────────────────────────────────────────────');

  // Логируем начало отправки
  console.log(`[Telegram] 📤 Starting delivery to ${chatIds.length} recipient(s)`);
  console.log('[Telegram] ⏱️ Timestamp:', new Date().toISOString());

  // Отправка всем получателям С КНОПКАМИ
  const results = await Promise.allSettled(
    chatIds.map((chatId, index) => {
      console.log(`[Telegram] 🔄 Queue: Preparing send to chat_id #${index + 1}: ${chatId}`);
      return sendMessage(botToken, chatId, text, applicationId);
    })
  );

  // Проверка результатов
  const failures = results.filter(r => r.status === 'rejected' || !r.value.success);
  const successes = results.filter(r => r.status === 'fulfilled' && r.value.success);
  
  // Детальное логирование результатов отправки
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[Telegram] 📊 DELIVERY RESULTS for ${applicationId}:`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  results.forEach((result, index) => {
    const chatId = chatIds[index];
    if (result.status === 'fulfilled') {
      if (result.value.success) {
        console.log(`  ✅ Chat ${chatId}: Message delivered successfully`);
      } else {
        console.log(`  ❌ Chat ${chatId}: Failed - ${result.value.error || 'Unknown error'}`);
      }
    } else {
      console.log(`  ❌ Chat ${chatId}: Promise rejected - ${result.reason}`);
    }
  });

  console.log('─────────────────────────────────────────────────');
  console.log(`[Telegram] 📈 Summary: ${successes.length} successful, ${failures.length} failed out of ${results.length} total`);
  
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
    console.error(`[Telegram] ❌ All ${results.length} deliveries failed for application ${applicationId}`);
    return { 
      success: false, 
      error: 'Не удалось отправить сообщение',
      applicationId 
    };
  }

  if (failures.length > 0) {
    // Часть отправок провалилась
    console.warn(`[Telegram] ⚠️ Partial delivery: ${failures.length}/${results.length} deliveries failed for application ${applicationId}`);
  } else {
    console.log(`[Telegram] ✅ Complete success: Message delivered to all ${successes.length} recipients for application ${applicationId}`);
  }

  // TODO: В будущем можно отправить авто-ответ клиенту
  // if (clientChatId) {
  //   await sendAutoReply(botToken, clientChatId, data.name);
  // }

  return { success: true, applicationId };
}

