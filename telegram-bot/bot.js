/**
 * 🤖 TELEGRAM БОТ «ЗОЛОТОЙ ДУБ»
 * 
 * Интерактивный бот для обработки заявок с сайта
 * С кнопками, автоответами и управлением статусами
 */

require('dotenv').config({ path: '../.env.local' });
const TelegramBot = require('node-telegram-bot-api');
const applicationManager = require('./applicationManager');

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

// Инициализация менеджера заявок
applicationManager.initialize().catch(error => {
  console.error('❌ Ошибка инициализации менеджера заявок:', error);
});

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
function getApplicationButtons(applicationId, includeContacts = true) {
  const buttons = [
    [
      { text: '✅ Обработано', callback_data: `app_done_${applicationId}` },
      { text: '⏳ В работе', callback_data: `app_work_${applicationId}` }
    ]
  ];

  if (includeContacts) {
    buttons.push([
      { text: '📞 Позвонить', callback_data: `app_call_${applicationId}` },
      { text: '💬 Написать', callback_data: `app_message_${applicationId}` }
    ]);
  }

  buttons.push([
    { text: '📝 Заметка', callback_data: `app_note_${applicationId}` },
    { text: '🗑 Удалить', callback_data: `app_delete_${applicationId}` }
  ]);

  return { inline_keyboard: buttons };
}

/**
 * Кнопки подтверждения действия
 */
function getConfirmButtons(action, applicationId) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Да, подтвердить', callback_data: `confirm_${action}_${applicationId}` },
        { text: '❌ Отмена', callback_data: `cancel_${action}_${applicationId}` }
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

  const stats = applicationManager.getStatistics();

  bot.sendMessage(
    chatId,
    '📊 *СТАТИСТИКА ЗАЯВОК*\n\n' +
    `📝 Всего заявок: ${stats.total}\n` +
    `⏳ Новые: ${stats.new}\n` +
    `🔄 В работе: ${stats.work}\n` +
    `✅ Обработано: ${stats.done}\n\n` +
    `📞 Звонков: ${stats.called}\n` +
    `💬 Сообщений: ${stats.messaged}\n` +
    `⚠️ Приоритетных: ${stats.highPriority}\n\n` +
    `📅 Сегодня: ${stats.today}\n` +
    `📆 За неделю: ${stats.week}`,
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
    const stats = applicationManager.getStatistics();

    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText(
      '📊 *СТАТИСТИКА ЗАЯВОК*\n\n' +
      `📝 Всего заявок: ${stats.total}\n` +
      `⏳ Новые: ${stats.new}\n` +
      `🔄 В работе: ${stats.work}\n` +
      `✅ Обработано: ${stats.done}\n\n` +
      `📞 Звонков: ${stats.called}\n` +
      `💬 Сообщений: ${stats.messaged}\n` +
      `⚠️ Приоритетных: ${stats.highPriority}\n\n` +
      `📅 Сегодня: ${stats.today}\n` +
      `📆 За неделю: ${stats.week}`,
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
    
    const apps = applicationManager.getAllApplications();
    
    if (apps.length === 0) {
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

    const list = apps
      .map(app => {
        const statusEmoji = app.status === 'new' ? '⏳' : app.status === 'work' ? '🔄' : '✅';
        return `${statusEmoji} ${app.name} - ${app.phone || 'нет тел.'}`;
      })
      .join('\n');

    await bot.editMessageText(
      `📋 *ВСЕ ЗАЯВКИ* (${apps.length})\n\n${list}`,
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
    
    const newApps = applicationManager.getAllApplications({ status: 'new' });

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
      .map(app => `⏳ ${app.name} - ${app.phone || 'нет тел.'}`)
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
    
    const doneApps = applicationManager.getAllApplications({ status: 'done' });

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
      .map(app => `✅ ${app.name} - ${app.phone || 'нет тел.'}`)
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
    
    const app = applicationManager.getApplication(applicationId);
    
    if (!app) {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '❌ Заявка не найдена',
        show_alert: true
      });
      return;
    }

    // ОБРАБОТАНО
    if (type === 'done') {
      await applicationManager.updateStatus(applicationId, 'done');
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '✅ Заявка отмечена как обработанная'
      });
      
      const updatedText = msg.text + '\n\n✅ *СТАТУС: ОБРАБОТАНО*';
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });
      
      // Уведомление в другие чаты
      for (const adminId of ADMIN_IDS) {
        if (adminId !== chatId) {
          try {
            await bot.sendMessage(adminId, `✅ Заявка обработана: ${app.name}`);
          } catch (error) {
            console.error(`Ошибка уведомления админу ${adminId}:`, error.message);
          }
        }
      }
      return;
    }

    // В РАБОТЕ
    if (type === 'work') {
      await applicationManager.updateStatus(applicationId, 'work');
      
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

    // ПОЗВОНИТЬ - показывает телефон и кнопку подтверждения
    if (type === 'call') {
      await bot.answerCallbackQuery(callbackQuery.id);
      
      const phoneText = app.phone 
        ? `📞 *Телефон клиента:*\n\`${app.phone}\`\n\n_Нажмите на номер для копирования_\n\nПозвонили клиенту?`
        : '❌ Телефон не указан в заявке';
      
      await bot.editMessageText(phoneText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: app.phone ? getConfirmButtons('called', applicationId) : getBackButton()
      });
      return;
    }

    // НАПИСАТЬ - показывает контакты и кнопку подтверждения
    if (type === 'message') {
      await bot.answerCallbackQuery(callbackQuery.id);
      
      let contactText = '💬 *Контакты клиента:*\n\n';
      
      if (app.phone) contactText += `📞 ${app.phone}\n`;
      if (app.email) contactText += `✉️ ${app.email}\n`;
      
      if (!app.phone && !app.email) {
        contactText = '❌ Контакты не указаны в заявке';
      } else {
        contactText += '\n_Нажмите для копирования_\n\nНаписали клиенту?';
      }
      
      await bot.editMessageText(contactText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: (app.phone || app.email) ? getConfirmButtons('messaged', applicationId) : getBackButton()
      });
      return;
    }

    // ЗАМЕТКА
    if (type === 'note') {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Функция добавления заметок скоро будет доступна',
        show_alert: true
      });
      return;
    }

    // УДАЛИТЬ - запрос подтверждения
    if (type === 'delete') {
      await bot.answerCallbackQuery(callbackQuery.id);
      
      await bot.editMessageText(
        '🗑 *УДАЛЕНИЕ ЗАЯВКИ*\n\n' +
        `Вы уверены, что хотите удалить заявку от *${app.name}*?\n\n` +
        '⚠️ Это действие нельзя отменить.',
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getConfirmButtons('delete', applicationId)
        }
      );
      return;
    }
  }

  // ════════════════════════════════════════════════════════════
  // ПОДТВЕРЖДЕНИЯ ДЕЙСТВИЙ
  // ════════════════════════════════════════════════════════════

  if (data.startsWith('confirm_')) {
    const [action, type, ...idParts] = data.split('_');
    const applicationId = idParts.join('_');
    
    const app = applicationManager.getApplication(applicationId);
    
    if (!app) {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '❌ Заявка не найдена',
        show_alert: true
      });
      return;
    }

    // ПОДТВЕРЖДЕНИЕ ЗВОНКА
    if (type === 'called') {
      await applicationManager.addAction(applicationId, 'called');
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '✅ Звонок отмечен'
      });
      
      await bot.editMessageText(
        msg.text.split('\n\nПозвонили')[0] + 
        `\n\n✅ *Звонок выполнен*\n⏰ ${new Date().toLocaleString('ru-RU')}`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBackButton()
        }
      );
      return;
    }

    // ПОДТВЕРЖДЕНИЕ СООБЩЕНИЯ
    if (type === 'messaged') {
      await applicationManager.addAction(applicationId, 'messaged');
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '✅ Сообщение отмечено'
      });
      
      await bot.editMessageText(
        msg.text.split('\n\nНаписали')[0] + 
        `\n\n✅ *Сообщение отправлено*\n⏰ ${new Date().toLocaleString('ru-RU')}`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBackButton()
        }
      );
      return;
    }

    // ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
    if (type === 'delete') {
      await applicationManager.deleteApplication(applicationId);
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '🗑 Заявка удалена'
      });
      
      await bot.editMessageText(
        '🗑 *ЗАЯВКА УДАЛЕНА*\n\n' +
        `Заявка от *${app.name}* была удалена`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: getBackButton()
        }
      );
      
      // Уведомление другим админам
      for (const adminId of ADMIN_IDS) {
        if (adminId !== chatId) {
          try {
            await bot.sendMessage(adminId, `🗑 Заявка удалена: ${app.name}`);
          } catch (error) {
            console.error(`Ошибка уведомления админу ${adminId}:`, error.message);
          }
        }
      }
      return;
    }
  }

  // ════════════════════════════════════════════════════════════
  // ОТМЕНА ДЕЙСТВИЙ
  // ════════════════════════════════════════════════════════════

  if (data.startsWith('cancel_')) {
    const [action, type, ...idParts] = data.split('_');
    const applicationId = idParts.join('_');
    
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '↩️ Действие отменено'
    });
    
    // Возвращаемся к меню
    await bot.editMessageText('🌰 *ГЛАВНОЕ МЕНЮ*', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
    return;
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
  try {
    // Сохраняем заявку через менеджер
    const app = await applicationManager.createApplication(applicationData);
    
    // Формируем текст
    const text = applicationData.formattedMessage;

    // Отправляем всем администраторам
    let successCount = 0;
    for (const adminId of ADMIN_IDS) {
      try {
        await bot.sendMessage(adminId, text, {
          parse_mode: 'Markdown',
          reply_markup: getApplicationButtons(app.id)
        });
        successCount++;
      } catch (error) {
        console.error(`[Bot] Ошибка отправки админу ${adminId}:`, error.message);
      }
    }

    console.log(`[Bot] ✅ Заявка ${app.id} отправлена ${successCount}/${ADMIN_IDS.length} администраторам`);
    
    return { success: true, applicationId: app.id };
  } catch (error) {
    console.error('[Bot] ❌ Ошибка обработки заявки:', error);
    return { success: false, error: error.message };
  }
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


