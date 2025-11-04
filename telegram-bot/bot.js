/**
 * 🤖 TELEGRAM БОТ «ЗОЛОТОЙ ДУБ»
 * 
 * Интерактивный бот для обработки заявок с сайта
 * С кнопками, автоответами и управлением статусами
 */

require('dotenv').config({ path: '../.env.local' });
const TelegramBot = require('node-telegram-bot-api');

// ════════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_IDS = process.env.TELEGRAM_CHAT_ID.split(',').map(id => parseInt(id.trim()));

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env.local');
  process.exit(1);
}

// Создаём бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ════════════════════════════════════════════════════════════
// ХРАНИЛИЩЕ ЗАЯВОК (в памяти, можно заменить на БД)
// ════════════════════════════════════════════════════════════

const applications = new Map();

// ════════════════════════════════════════════════════════════
// КЛАВИАТУРЫ
// ════════════════════════════════════════════════════════════

/**
 * Главное меню администратора
 */
function getAdminMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📊 Статистика', callback_data: 'stats' },
        { text: '📋 Все заявки', callback_data: 'list_all' }
      ],
      [
        { text: '⏳ Новые заявки', callback_data: 'list_new' },
        { text: '✅ Обработанные', callback_data: 'list_done' }
      ],
      [
        { text: '❓ Помощь', callback_data: 'help' }
      ]
    ]
  };
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
 * Кнопка "Назад в меню"
 */
function getBackButton() {
  return {
    inline_keyboard: [
      [{ text: '« Назад в меню', callback_data: 'menu' }]
    ]
  };
}

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ КОМАНД
// ════════════════════════════════════════════════════════════

/**
 * /start - приветствие и главное меню
 */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!ADMIN_IDS.includes(chatId)) {
    bot.sendMessage(chatId, 
      '👋 Здравствуйте!\n\n' +
      'Это служебный бот мебельной фабрики «Золотой Дуб» 🌰\n\n' +
      '📞 Для заказа кухни звоните: 8-930-193-34-20\n' +
      '🌐 Сайт: https://zol-dub.online'
    );
    return;
  }

  bot.sendMessage(
    chatId,
    '🌰 *ПАНЕЛЬ УПРАВЛЕНИЯ «ЗОЛОТОЙ ДУБ»*\n\n' +
    'Добро пожаловать в систему обработки заявок!\n\n' +
    '📨 Новые заявки будут приходить автоматически\n' +
    '🔘 Используйте кнопки для управления\n' +
    '💾 Статус сохраняется автоматически',
    {
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    }
  );
});

/**
 * /menu - главное меню
 */
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!ADMIN_IDS.includes(chatId)) return;

  bot.sendMessage(chatId, '🌰 *ГЛАВНОЕ МЕНЮ*', {
    parse_mode: 'Markdown',
    reply_markup: getAdminMenu()
  });
});

/**
 * /stats - статистика
 */
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!ADMIN_IDS.includes(chatId)) return;

  const total = applications.size;
  const newApps = Array.from(applications.values()).filter(app => app.status === 'new').length;
  const inWork = Array.from(applications.values()).filter(app => app.status === 'work').length;
  const done = Array.from(applications.values()).filter(app => app.status === 'done').length;

  bot.sendMessage(
    chatId,
    '📊 *СТАТИСТИКА ЗАЯВОК*\n\n' +
    `📝 Всего заявок: ${total}\n` +
    `⏳ Новые: ${newApps}\n` +
    `🔄 В работе: ${inWork}\n` +
    `✅ Обработано: ${done}`,
    {
      parse_mode: 'Markdown',
      reply_markup: getBackButton()
    }
  );
});

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ CALLBACK QUERY (КНОПОК)
// ════════════════════════════════════════════════════════════

bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const data = callbackQuery.data;

  // Проверка прав доступа
  if (!ADMIN_IDS.includes(chatId)) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '❌ Нет доступа',
      show_alert: true
    });
    return;
  }

  // ════════════════════════════════════════════════════════════
  // ГЛАВНОЕ МЕНЮ
  // ════════════════════════════════════════════════════════════

  if (data === 'menu') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText('🌰 *ГЛАВНОЕ МЕНЮ*', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
    return;
  }

  // ════════════════════════════════════════════════════════════
  // СТАТИСТИКА
  // ════════════════════════════════════════════════════════════

  if (data === 'stats') {
    const total = applications.size;
    const newApps = Array.from(applications.values()).filter(app => app.status === 'new').length;
    const inWork = Array.from(applications.values()).filter(app => app.status === 'work').length;
    const done = Array.from(applications.values()).filter(app => app.status === 'done').length;

    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText(
      '📊 *СТАТИСТИКА ЗАЯВОК*\n\n' +
      `📝 Всего заявок: ${total}\n` +
      `⏳ Новые: ${newApps}\n` +
      `🔄 В работе: ${inWork}\n` +
      `✅ Обработано: ${done}`,
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getBackButton()
      }
    );
    return;
  }

  // ════════════════════════════════════════════════════════════
  // СПИСКИ ЗАЯВОК
  // ════════════════════════════════════════════════════════════

  if (data === 'list_all') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    if (applications.size === 0) {
      await bot.editMessageText(
        '📋 *ВСЕ ЗАЯВКИ*\n\n' +
        '🤷‍♂️ Заявок пока нет',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBackButton()
        }
      );
      return;
    }

    const list = Array.from(applications.entries())
      .map(([id, app]) => {
        const statusEmoji = app.status === 'new' ? '⏳' : app.status === 'work' ? '🔄' : '✅';
        return `${statusEmoji} ${app.name} - ${app.phone || 'нет тел.'}`;
      })
      .join('\n');

    await bot.editMessageText(
      `📋 *ВСЕ ЗАЯВКИ* (${applications.size})\n\n${list}`,
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getBackButton()
      }
    );
    return;
  }

  if (data === 'list_new') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    const newApps = Array.from(applications.entries())
      .filter(([_, app]) => app.status === 'new');

    if (newApps.length === 0) {
      await bot.editMessageText(
        '⏳ *НОВЫЕ ЗАЯВКИ*\n\n' +
        '✅ Все заявки обработаны!',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBackButton()
        }
      );
      return;
    }

    const list = newApps
      .map(([id, app]) => `⏳ ${app.name} - ${app.phone || 'нет тел.'}`)
      .join('\n');

    await bot.editMessageText(
      `⏳ *НОВЫЕ ЗАЯВКИ* (${newApps.length})\n\n${list}`,
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getBackButton()
      }
    );
    return;
  }

  if (data === 'list_done') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    const doneApps = Array.from(applications.entries())
      .filter(([_, app]) => app.status === 'done');

    if (doneApps.length === 0) {
      await bot.editMessageText(
        '✅ *ОБРАБОТАННЫЕ ЗАЯВКИ*\n\n' +
        '🤷‍♂️ Обработанных заявок пока нет',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBackButton()
        }
      );
      return;
    }

    const list = doneApps
      .map(([id, app]) => `✅ ${app.name} - ${app.phone || 'нет тел.'}`)
      .join('\n');

    await bot.editMessageText(
      `✅ *ОБРАБОТАННЫЕ ЗАЯВКИ* (${doneApps.length})\n\n${list}`,
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getBackButton()
      }
    );
    return;
  }

  // ════════════════════════════════════════════════════════════
  // ПОМОЩЬ
  // ════════════════════════════════════════════════════════════

  if (data === 'help') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText(
      '❓ *СПРАВКА*\n\n' +
      '*Команды:*\n' +
      '/start - запуск бота\n' +
      '/menu - главное меню\n' +
      '/stats - статистика\n\n' +
      '*Кнопки заявки:*\n' +
      '✅ Обработано - заявка завершена\n' +
      '⏳ В работе - заявка в процессе\n' +
      '📞 Позвонил - отметка о звонке\n' +
      '💬 Написал - отметка о сообщении\n' +
      '🗑 Удалить - удалить заявку\n\n' +
      '💡 *Совет:* используйте кнопки сразу после получения заявки',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getBackButton()
      }
    );
    return;
  }

  // ════════════════════════════════════════════════════════════
  // ДЕЙСТВИЯ С ЗАЯВКОЙ
  // ════════════════════════════════════════════════════════════

  if (data.startsWith('app_')) {
    const [action, type, ...idParts] = data.split('_');
    const applicationId = idParts.join('_');
    
    const app = applications.get(applicationId);
    
    if (!app) {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '❌ Заявка не найдена',
        show_alert: true
      });
      return;
    }

    // ОБРАБОТАНО
    if (type === 'done') {
      app.status = 'done';
      app.actions = app.actions || [];
      app.actions.push({ type: 'done', timestamp: new Date() });
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '✅ Заявка отмечена как обработанная'
      });
      
      // Обновляем сообщение
      const updatedText = msg.text + '\n\n✅ *СТАТУС: ОБРАБОТАНО*';
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });
      return;
    }

    // В РАБОТЕ
    if (type === 'work') {
      app.status = 'work';
      app.actions = app.actions || [];
      app.actions.push({ type: 'work', timestamp: new Date() });
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '🔄 Заявка взята в работу'
      });
      
      const updatedText = msg.text + '\n\n🔄 *СТАТУС: В РАБОТЕ*';
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getApplicationButtons(applicationId)
      });
      return;
    }

    // ПОЗВОНИЛ
    if (type === 'called') {
      app.actions = app.actions || [];
      app.actions.push({ type: 'called', timestamp: new Date() });
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '📞 Отмечено: позвонили клиенту'
      });
      
      const updatedText = msg.text + '\n\n📞 Звонок выполнен: ' + new Date().toLocaleString('ru-RU');
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getApplicationButtons(applicationId)
      });
      return;
    }

    // НАПИСАЛ
    if (type === 'messaged') {
      app.actions = app.actions || [];
      app.actions.push({ type: 'messaged', timestamp: new Date() });
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '💬 Отмечено: написали клиенту'
      });
      
      const updatedText = msg.text + '\n\n💬 Сообщение отправлено: ' + new Date().toLocaleString('ru-RU');
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getApplicationButtons(applicationId)
      });
      return;
    }

    // УДАЛИТЬ
    if (type === 'delete') {
      applications.delete(applicationId);
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '🗑 Заявка удалена'
      });
      
      await bot.editMessageText(
        '🗑 *ЗАЯВКА УДАЛЕНА*\n\n' +
        msg.text,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown'
        }
      );
      return;
    }
  }

  // Если не обработано - уведомляем
  await bot.answerCallbackQuery(callbackQuery.id, {
    text: '⚠️ Неизвестное действие'
  });
});

// ════════════════════════════════════════════════════════════
// WEBHOOK ДЛЯ НОВЫХ ЗАЯВОК
// ════════════════════════════════════════════════════════════

/**
 * Функция для отправки новой заявки
 * Вызывается из lib/telegram.ts
 */
async function sendNewApplicationNotification(applicationData) {
  const applicationId = applicationData.id;
  
  // Сохраняем заявку
  applications.set(applicationId, {
    ...applicationData,
    status: 'new',
    receivedAt: new Date()
  });

  // Формируем текст
  const text = applicationData.formattedMessage;

  // Отправляем всем администраторам
  for (const adminId of ADMIN_IDS) {
    try {
      await bot.sendMessage(adminId, text, {
        parse_mode: 'Markdown',
        reply_markup: getApplicationButtons(applicationId)
      });
    } catch (error) {
      console.error(`[Bot] Ошибка отправки админу ${adminId}:`, error.message);
    }
  }

  console.log(`[Bot] ✅ Заявка ${applicationId} отправлена ${ADMIN_IDS.length} администраторам`);
}

// ════════════════════════════════════════════════════════════
// ЗАПУСК БОТА
// ════════════════════════════════════════════════════════════

bot.on('polling_error', (error) => {
  console.error('[Bot] Ошибка polling:', error.message);
});

console.log('');
console.log('════════════════════════════════════════════════');
console.log('🤖 TELEGRAM БОТ «ЗОЛОТОЙ ДУБ» ЗАПУЩЕН');
console.log('════════════════════════════════════════════════');
console.log(`📡 Polling: активен`);
console.log(`👥 Администраторы: ${ADMIN_IDS.join(', ')}`);
console.log(`💾 Хранилище: в памяти (RAM)`);
console.log('════════════════════════════════════════════════');
console.log('');
console.log('✅ Бот готов к работе!');
console.log('💡 Отправьте /start боту для проверки');
console.log('');

// Экспорт для использования в других модулях
module.exports = {
  bot,
  sendNewApplicationNotification
};


