/**
 * 🪝 WEBHOOK ОБРАБОТЧИК ДЛЯ TELEGRAM БОТА
 * 
 * Этот файл обрабатывает callback_query (нажатия на кнопки)
 * Можно использовать вместо polling для production
 */

require('dotenv').config({ path: '../.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_IDS = process.env.TELEGRAM_CHAT_ID.split(',').map(id => parseInt(id.trim()));

// Хранилище заявок (в памяти, можно заменить на БД)
const applications = new Map();

/**
 * Обработка callback_query от Telegram
 */
async function handleCallbackQuery(callbackQuery) {
  const { id, data, message, from } = callbackQuery;
  const chatId = from.id;
  
  console.log(`[Webhook] Получен callback_query: ${data}`);

  // Проверка прав доступа
  if (!ADMIN_IDS.includes(chatId)) {
    await answerCallbackQuery(id, '❌ Нет доступа', true);
    return { statusCode: 403, body: 'Forbidden' };
  }

  // ════════════════════════════════════════════════════════════
  // ОБРАБОТКА ДЕЙСТВИЙ
  // ════════════════════════════════════════════════════════════

  // Действия с заявкой
  if (data.startsWith('app_')) {
    const [action, type, ...idParts] = data.split('_');
    const applicationId = idParts.join('_');
    
    const app = applications.get(applicationId);
    
    if (!app) {
      await answerCallbackQuery(id, '❌ Заявка не найдена', true);
      return { statusCode: 404, body: 'Not found' };
    }

    // ОБРАБОТАНО
    if (type === 'done') {
      app.status = 'done';
      app.actions = app.actions || [];
      app.actions.push({ type: 'done', timestamp: new Date() });
      
      await answerCallbackQuery(id, '✅ Заявка отмечена как обработанная');
      await editMessageText(
        chatId,
        message.message_id,
        message.text + '\n\n✅ *СТАТУС: ОБРАБОТАНО*'
      );
      
      return { statusCode: 200, body: 'OK' };
    }

    // В РАБОТЕ
    if (type === 'work') {
      app.status = 'work';
      app.actions = app.actions || [];
      app.actions.push({ type: 'work', timestamp: new Date() });
      
      await answerCallbackQuery(id, '🔄 Заявка взята в работу');
      await editMessageText(
        chatId,
        message.message_id,
        message.text + '\n\n🔄 *СТАТУС: В РАБОТЕ*',
        getApplicationButtons(applicationId)
      );
      
      return { statusCode: 200, body: 'OK' };
    }

    // ПОЗВОНИЛ
    if (type === 'called') {
      app.actions = app.actions || [];
      app.actions.push({ type: 'called', timestamp: new Date() });
      
      await answerCallbackQuery(id, '📞 Отмечено: позвонили клиенту');
      await editMessageText(
        chatId,
        message.message_id,
        message.text + '\n\n📞 Звонок выполнен: ' + new Date().toLocaleString('ru-RU'),
        getApplicationButtons(applicationId)
      );
      
      return { statusCode: 200, body: 'OK' };
    }

    // НАПИСАЛ
    if (type === 'messaged') {
      app.actions = app.actions || [];
      app.actions.push({ type: 'messaged', timestamp: new Date() });
      
      await answerCallbackQuery(id, '💬 Отмечено: написали клиенту');
      await editMessageText(
        chatId,
        message.message_id,
        message.text + '\n\n💬 Сообщение отправлено: ' + new Date().toLocaleString('ru-RU'),
        getApplicationButtons(applicationId)
      );
      
      return { statusCode: 200, body: 'OK' };
    }

    // УДАЛИТЬ
    if (type === 'delete') {
      applications.delete(applicationId);
      
      await answerCallbackQuery(id, '🗑 Заявка удалена');
      await editMessageText(
        chatId,
        message.message_id,
        '🗑 *ЗАЯВКА УДАЛЕНА*\n\n' + message.text
      );
      
      return { statusCode: 200, body: 'OK' };
    }
  }

  // Неизвестное действие
  await answerCallbackQuery(id, '⚠️ Неизвестное действие');
  return { statusCode: 400, body: 'Unknown action' };
}

/**
 * Кнопки для работы с заявкой
 */
function getApplicationButtons(applicationId) {
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

/**
 * Ответ на callback_query
 */
async function answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
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
async function editMessageText(chatId, messageId, text, replyMarkup) {
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
 * Добавление новой заявки (вызывается из lib/telegram.ts)
 */
function addApplication(applicationId, applicationData) {
  applications.set(applicationId, {
    ...applicationData,
    status: 'new',
    receivedAt: new Date()
  });
  console.log(`[Webhook] ✅ Заявка ${applicationId} добавлена в хранилище`);
}

// ════════════════════════════════════════════════════════════
// NEXT.JS API ROUTE (для использования как /api/telegram-webhook)
// ════════════════════════════════════════════════════════════

/**
 * Экспорт для Next.js API route
 */
module.exports = {
  handleCallbackQuery,
  addApplication,
  applications
};

// ════════════════════════════════════════════════════════════
// STANDALONE СЕРВЕР (для запуска отдельно от Next.js)
// ════════════════════════════════════════════════════════════

if (require.main === module) {
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  
  // Webhook endpoint
  app.post('/webhook', async (req, res) => {
    const update = req.body;
    
    console.log('[Webhook] Получен update:', update.update_id);
    
    // Обработка callback_query
    if (update.callback_query) {
      const result = await handleCallbackQuery(update.callback_query);
      return res.status(result.statusCode).send(result.body);
    }
    
    res.status(200).send('OK');
  });
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      applications: applications.size,
      timestamp: new Date().toISOString()
    });
  });
  
  const PORT = process.env.WEBHOOK_PORT || 3001;
  
  app.listen(PORT, () => {
    console.log('');
    console.log('════════════════════════════════════════════════');
    console.log('🪝 TELEGRAM WEBHOOK СЕРВЕР ЗАПУЩЕН');
    console.log('════════════════════════════════════════════════');
    console.log(`🌐 Порт: ${PORT}`);
    console.log(`📡 Endpoint: http://localhost:${PORT}/webhook`);
    console.log(`💾 Хранилище: в памяти (RAM)`);
    console.log('════════════════════════════════════════════════');
    console.log('');
    console.log('✅ Webhook готов к приёму обновлений!');
    console.log('');
    console.log('💡 Настройте webhook в Telegram:');
    console.log(`   https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=https://ваш-домен.com/webhook`);
    console.log('');
  });
}


