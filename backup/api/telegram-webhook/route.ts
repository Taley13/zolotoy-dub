/**
 * 🪝 TELEGRAM WEBHOOK API ROUTE
 * 
 * Обрабатывает callback_query (нажатия на кнопки) от Telegram
 * URL: https://zol-dub.online/api/telegram-webhook
 */

import { NextRequest, NextResponse } from 'next/server';

// Типы
type CallbackQuery = {
  id: string;
  data: string;
  message: {
    message_id: number;
    text: string;
    chat: {
      id: number;
    };
  };
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
};

type TelegramUpdate = {
  update_id: number;
  callback_query?: CallbackQuery;
};

type ApplicationStatus = 'new' | 'work' | 'done';

type Application = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: ApplicationStatus;
  receivedAt: Date;
  actions?: Array<{
    type: string;
    timestamp: Date;
  }>;
};

// ════════════════════════════════════════════════════════════
// ХРАНИЛИЩЕ ЗАЯВОК (In-Memory, можно заменить на БД)
// ════════════════════════════════════════════════════════════

const applications = new Map<string, Application>();

// ════════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_IDS_RAW = process.env.TELEGRAM_CHAT_ID || '';
const ADMIN_IDS = ADMIN_IDS_RAW.split(',').map(id => parseInt(id.trim())).filter(Boolean);

// ════════════════════════════════════════════════════════════
// TELEGRAM API HELPERS
// ════════════════════════════════════════════════════════════

/**
 * Ответ на callback_query (обязательно!)
 */
async function answerCallbackQuery(
  callbackQueryId: string, 
  text = '', 
  showAlert = false
): Promise<void> {
  if (!BOT_TOKEN) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert
      })
    });
  } catch (error) {
    console.error('[Webhook] Ошибка answerCallbackQuery:', error);
  }
}

/**
 * Редактирование сообщения
 */
async function editMessageText(
  chatId: number, 
  messageId: number, 
  text: string, 
  replyMarkup?: any
): Promise<void> {
  if (!BOT_TOKEN) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup
      })
    });
  } catch (error) {
    console.error('[Webhook] Ошибка editMessageText:', error);
  }
}

/**
 * Кнопки для работы с заявкой
 */
function getApplicationButtons(applicationId: string) {
  return {
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
  };
}

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИК CALLBACK_QUERY
// ════════════════════════════════════════════════════════════

async function handleCallbackQuery(callbackQuery: CallbackQuery): Promise<NextResponse> {
  const { id, data, message, from } = callbackQuery;
  const chatId = from.id;
  
  console.log(`[Webhook] Получен callback_query: ${data} от ${from.first_name} (${chatId})`);

  // ════════════════════════════════════════════════════════════
  // ПРОВЕРКА ПРАВ ДОСТУПА
  // ════════════════════════════════════════════════════════════

  if (!ADMIN_IDS.includes(chatId)) {
    await answerCallbackQuery(id, '❌ Нет доступа', true);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ════════════════════════════════════════════════════════════
  // ОБРАБОТКА ДЕЙСТВИЙ С ЗАЯВКОЙ
  // ════════════════════════════════════════════════════════════

  if (data.startsWith('app_')) {
    const parts = data.split('_');
    const action = parts[0]; // 'app'
    const type = parts[1];    // 'done', 'work', 'called', etc.
    const applicationId = parts.slice(2).join('_'); // ID заявки
    
    const app = applications.get(applicationId);
    
    if (!app) {
      await answerCallbackQuery(id, '❌ Заявка не найдена', true);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // ════════════════════════════════════════════════════════════
    // ОБРАБОТАНО
    // ════════════════════════════════════════════════════════════

    if (type === 'done') {
      app.status = 'done';
      app.actions = app.actions || [];
      app.actions.push({ type: 'done', timestamp: new Date() });
      
      await answerCallbackQuery(id, '✅ Заявка отмечена как обработанная');
      await editMessageText(
        message.chat.id,
        message.message_id,
        message.text + '\n\n✅ *СТАТУС: ОБРАБОТАНО*'
      );
      
      console.log(`[Webhook] ✅ Заявка ${applicationId} отмечена как обработанная`);
      return NextResponse.json({ status: 'done' });
    }

    // ════════════════════════════════════════════════════════════
    // В РАБОТЕ
    // ════════════════════════════════════════════════════════════

    if (type === 'work') {
      app.status = 'work';
      app.actions = app.actions || [];
      app.actions.push({ type: 'work', timestamp: new Date() });
      
      await answerCallbackQuery(id, '🔄 Заявка взята в работу');
      await editMessageText(
        message.chat.id,
        message.message_id,
        message.text + '\n\n🔄 *СТАТУС: В РАБОТЕ*',
        getApplicationButtons(applicationId)
      );
      
      console.log(`[Webhook] 🔄 Заявка ${applicationId} взята в работу`);
      return NextResponse.json({ status: 'work' });
    }

    // ════════════════════════════════════════════════════════════
    // ПОЗВОНИЛ
    // ════════════════════════════════════════════════════════════

    if (type === 'called') {
      app.actions = app.actions || [];
      app.actions.push({ type: 'called', timestamp: new Date() });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
      
      await answerCallbackQuery(id, '📞 Отмечено: позвонили клиенту');
      await editMessageText(
        message.chat.id,
        message.message_id,
        message.text + `\n\n📞 Звонок выполнен: ${timestamp}`,
        getApplicationButtons(applicationId)
      );
      
      console.log(`[Webhook] 📞 Заявка ${applicationId}: звонок выполнен`);
      return NextResponse.json({ status: 'called' });
    }

    // ════════════════════════════════════════════════════════════
    // НАПИСАЛ
    // ════════════════════════════════════════════════════════════

    if (type === 'messaged') {
      app.actions = app.actions || [];
      app.actions.push({ type: 'messaged', timestamp: new Date() });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
      
      await answerCallbackQuery(id, '💬 Отмечено: написали клиенту');
      await editMessageText(
        message.chat.id,
        message.message_id,
        message.text + `\n\n💬 Сообщение отправлено: ${timestamp}`,
        getApplicationButtons(applicationId)
      );
      
      console.log(`[Webhook] 💬 Заявка ${applicationId}: сообщение отправлено`);
      return NextResponse.json({ status: 'messaged' });
    }

    // ════════════════════════════════════════════════════════════
    // УДАЛИТЬ
    // ════════════════════════════════════════════════════════════

    if (type === 'delete') {
      applications.delete(applicationId);
      
      await answerCallbackQuery(id, '🗑 Заявка удалена');
      await editMessageText(
        message.chat.id,
        message.message_id,
        '🗑 *ЗАЯВКА УДАЛЕНА*\n\n' + message.text
      );
      
      console.log(`[Webhook] 🗑 Заявка ${applicationId} удалена`);
      return NextResponse.json({ status: 'deleted' });
    }
  }

  // ════════════════════════════════════════════════════════════
  // НЕИЗВЕСТНОЕ ДЕЙСТВИЕ
  // ════════════════════════════════════════════════════════════

  await answerCallbackQuery(id, '⚠️ Неизвестное действие');
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// ════════════════════════════════════════════════════════════
// NEXT.JS API ROUTE HANDLERS
// ════════════════════════════════════════════════════════════

/**
 * POST /api/telegram-webhook
 * Принимает обновления от Telegram
 */
export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();
    
    console.log(`[Webhook] Получен update ${update.update_id}`);

    // Обработка callback_query (нажатия на кнопки)
    if (update.callback_query) {
      return await handleCallbackQuery(update.callback_query);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook] Ошибка обработки:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * GET /api/telegram-webhook
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    applications: applications.size,
    admins: ADMIN_IDS.length,
    timestamp: new Date().toISOString()
  });
}

// ════════════════════════════════════════════════════════════
// УТИЛИТЫ ДЛЯ ДОБАВЛЕНИЯ ЗАЯВОК
// ════════════════════════════════════════════════════════════

/**
 * Добавить заявку в хранилище (вызывается из lib/telegram.ts)
 * Примечание: Эта функция доступна только на сервере
 */
function addApplicationInternal(applicationId: string, data: Partial<Application>): void {
  applications.set(applicationId, {
    id: applicationId,
    name: data.name || '',
    phone: data.phone,
    email: data.email,
    status: 'new',
    receivedAt: new Date(),
    actions: []
  });
  
  console.log(`[Webhook] ✅ Заявка ${applicationId} добавлена в хранилище`);
}

/**
 * Получить статистику
 */
function getApplicationsStatsInternal() {
  const total = applications.size;
  const statuses = Array.from(applications.values()).reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>);
  
  return {
    total,
    new: statuses.new || 0,
    work: statuses.work || 0,
    done: statuses.done || 0
  };
}

