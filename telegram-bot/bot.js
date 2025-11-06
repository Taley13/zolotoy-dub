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
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ════════════════════════════════════════════════════════════

/**
 * Проверка, является ли пользователь администратором
 */
function isAdmin(chatId) {
  return ADMIN_IDS.includes(chatId);
}

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
        { text: '📊 Статистика', callback_data: 'admin_stats' },
        { text: '📋 Все заявки', callback_data: 'admin_list_all' }
      ],
      [
        { text: '⏳ Новые заявки', callback_data: 'admin_list_new' },
        { text: '✅ Обработанные', callback_data: 'admin_list_done' }
      ],
      [
        { text: '❓ Помощь', callback_data: 'admin_help' }
      ]
    ]
  };
}

/**
 * Публичное меню для обычных пользователей
 */
function getPublicMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🎯 Замер + Дизайн (Бесплатно)', callback_data: 'public_measurement' }
      ],
      [
        { text: '💬 Консультация', callback_data: 'public_consultation' }
      ],
      [
        { text: 'ℹ️ О компании', callback_data: 'public_about' },
        { text: '🌐 Наш сайт', callback_data: 'public_website' }
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
  const firstName = msg.from.first_name || 'друг';
  
  if (isAdmin(chatId)) {
    // АДМИНСКОЕ МЕНЮ
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
  } else {
    // ПУБЛИЧНОЕ МЕНЮ
    bot.sendMessage(
      chatId,
      `👋 Здравствуйте, ${firstName}!\n\n` +
      '🌰 *Добро пожаловать в «Золотой Дуб»*\n\n' +
      'Мы производим кухни на заказ из массива дуба 🪵\n\n' +
      '✨ *Наши преимущества:*\n' +
      '• Бесплатный выезд замерщика\n' +
      '• Индивидуальный дизайн-проект\n' +
      '• Натуральные материалы\n' +
      '• Гарантия качества\n\n' +
      'Выберите интересующую услугу:',
      {
        parse_mode: 'Markdown',
        reply_markup: getPublicMenu()
      }
    );
  }
});

/**
 * /menu - главное меню
 */
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;

  if (isAdmin(chatId)) {
    bot.sendMessage(chatId, '🌰 *ПАНЕЛЬ АДМИНИСТРАТОРА*', {
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
  } else {
    bot.sendMessage(chatId, '🌰 *ГЛАВНОЕ МЕНЮ*', {
      parse_mode: 'Markdown',
      reply_markup: getPublicMenu()
    });
  }
});

/**
 * /stats - статистика (только для админов)
 */
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAdmin(chatId)) {
    bot.sendMessage(chatId, '❌ Эта команда доступна только администраторам');
    return;
  }

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
// ПУБЛИЧНЫЕ ФОРМЫ И ОБРАБОТЧИКИ
// ════════════════════════════════════════════════════════════

// Хранилище временных данных пользователей (для форм)
const userSessions = new Map();

/**
 * Обработчик публичных callback запросов
 */
async function handlePublicCallbacks(callbackQuery, data, chatId, messageId, firstName) {
  
  // ЗАМЕР + ДИЗАЙН
  if (data === 'public_measurement') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    // Сохраняем тип заявки в сессию
    userSessions.set(chatId, { type: 'measurement', step: 'name' });
    
    await bot.editMessageText(
      '🎯 *БЕСПЛАТНЫЙ ЗАМЕР + ДИЗАЙН-ПРОЕКТ*\n\n' +
      'Наш специалист приедет к вам:\n' +
      '• Сделает точные замеры\n' +
      '• Обсудит ваши пожелания\n' +
      '• Создаст 3D-дизайн проект\n' +
      '• Рассчитает стоимость\n\n' +
      '✨ Всё это совершенно *бесплатно*!\n\n' +
      'Для записи на замер, пожалуйста, укажите ваше *имя*:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // КОНСУЛЬТАЦИЯ
  if (data === 'public_consultation') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    userSessions.set(chatId, { type: 'consultation', step: 'name' });
    
    await bot.editMessageText(
      '💬 *БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ*\n\n' +
      'Наш менеджер свяжется с вами и ответит на все вопросы:\n' +
      '• Материалы и фурнитура\n' +
      '• Сроки изготовления\n' +
      '• Стоимость и варианты оплаты\n' +
      '• Гарантии и обслуживание\n\n' +
      'Для консультации укажите ваше *имя*:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // О КОМПАНИИ
  if (data === 'public_about') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    await bot.editMessageText(
      'ℹ️ *О КОМПАНИИ «ЗОЛОТОЙ ДУБ»*\n\n' +
      '🌰 Мы - производитель кухонь премиум-класса из массива дуба\n\n' +
      '*Почему выбирают нас:*\n\n' +
      '✅ *Натуральные материалы*\n' +
      'Используем только массив дуба - экологичный и долговечный материал\n\n' +
      '✅ *Индивидуальный подход*\n' +
      'Каждая кухня создается по вашим размерам и пожеланиям\n\n' +
      '✅ *Собственное производство*\n' +
      'Контролируем качество на всех этапах\n\n' +
      '✅ *Гарантия 5 лет*\n' +
      'Уверены в качестве нашей продукции\n\n' +
      '📍 *Адрес:* Воронеж\n' +
      '📞 *Телефон:* 8-930-193-34-20\n' +
      '🌐 *Сайт:* zol-dub.online',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🎯 Заказать замер', callback_data: 'public_measurement' }
          ], [
            { text: '« Назад в меню', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // НАCАЙТ
  if (data === 'public_website') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '🌐 Открывайте наш сайт!'
    });
    
    await bot.sendMessage(
      chatId,
      '🌐 *НАШ САЙТ*\n\n' +
      'Посетите наш сайт для просмотра:\n' +
      '• Галереи выполненных работ\n' +
      '• Каталога кухонь\n' +
      '• Калькулятора стоимости\n' +
      '• Контактной информации\n\n' +
      '🔗 https://zol-dub.online',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🌐 Открыть сайт', url: 'https://zol-dub.online' }
          ], [
            { text: '« Назад в меню', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // НАЗАД В МЕНЮ
  if (data === 'public_back_menu') {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    // Очищаем сессию
    userSessions.delete(chatId);
    
    await bot.editMessageText(
      `👋 Здравствуйте, ${firstName}!\n\n` +
      '🌰 *Добро пожаловать в «Золотой Дуб»*\n\n' +
      'Мы производим кухни на заказ из массива дуба 🪵\n\n' +
      '✨ *Наши преимущества:*\n' +
      '• Бесплатный выезд замерщика\n' +
      '• Индивидуальный дизайн-проект\n' +
      '• Натуральные материалы\n' +
      '• Гарантия качества\n\n' +
      'Выберите интересующую услугу:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getPublicMenu()
      }
    );
    return;
  }
}

/**
 * Обработчик текстовых сообщений (для форм заявок)
 */
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Игнорируем команды
  if (text && text.startsWith('/')) return;
  
  // Проверяем, есть ли активная сессия
  const session = userSessions.get(chatId);
  if (!session) return;
  
  // СБОР ИМЕНИ
  if (session.step === 'name') {
    session.name = text;
    session.step = 'phone';
    
    await bot.sendMessage(
      chatId,
      `Отлично, ${text}! 👍\n\n` +
      'Теперь укажите ваш *телефон* для связи:\n' +
      '_(например: +79001234567 или 8-900-123-45-67)_',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '❌ Отменить', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }
  
  // СБОР ТЕЛЕФОНА
  if (session.step === 'phone') {
    session.phone = text;
    
    // Создаем заявку
    const serviceType = session.type === 'measurement' 
      ? '🎯 Бесплатный замер + дизайн-проект'
      : '💬 Консультация';
    
    try {
      const application = await applicationManager.createApplication({
        name: session.name,
        phone: session.phone,
        message: `Заявка из Telegram бота: ${serviceType}`,
        source: 'telegram_bot',
        priority: 'normal'
      });
      
      // Отправляем уведомление администраторам
      const adminText = 
        '🌰 *НОВАЯ ЗАЯВКА ИЗ TELEGRAM БОТА*\n\n' +
        `📋 Услуга: ${serviceType}\n` +
        `👤 Имя: ${session.name}\n` +
        `📞 Телефон: ${session.phone}\n` +
        `📅 Дата: ${new Date().toLocaleString('ru-RU')}\n` +
        `🆔 ID заявки: \`${application.id}\``;
      
      for (const adminId of ADMIN_IDS) {
        try {
          await bot.sendMessage(adminId, adminText, {
            parse_mode: 'Markdown',
            reply_markup: getApplicationButtons(application.id)
          });
        } catch (error) {
          console.error(`Ошибка отправки админу ${adminId}:`, error.message);
        }
      }
      
      // Подтверждение клиенту
      await bot.sendMessage(
        chatId,
        '✅ *Заявка успешно отправлена!*\n\n' +
        `Спасибо, ${session.name}!\n\n` +
        'Наш менеджер свяжется с вами в ближайшее время по телефону:\n' +
        `📞 ${session.phone}\n\n` +
        '💡 Обычно мы перезваниваем в течение 15 минут!',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '« Вернуться в меню', callback_data: 'public_back_menu' }
            ]]
          }
        }
      );
      
      console.log(`[Bot] ✅ Создана публичная заявка ${application.id} от ${session.name}`);
      
    } catch (error) {
      console.error('[Bot] Ошибка создания заявки:', error);
      
      await bot.sendMessage(
        chatId,
        '❌ Произошла ошибка при отправке заявки.\n\n' +
        'Пожалуйста, свяжитесь с нами по телефону:\n' +
        '📞 8-930-193-34-20',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '« Назад в меню', callback_data: 'public_back_menu' }
            ]]
          }
        }
      );
    }
    
    // Очищаем сессию
    userSessions.delete(chatId);
    return;
  }
});

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ CALLBACK QUERY (КНОПОК)
// ════════════════════════════════════════════════════════════

bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const data = callbackQuery.data;
  const firstName = callbackQuery.from.first_name || 'друг';

  // ════════════════════════════════════════════════════════════
  // ПУБЛИЧНЫЕ ОБРАБОТЧИКИ (доступны всем)
  // ════════════════════════════════════════════════════════════

  if (data.startsWith('public_')) {
    await handlePublicCallbacks(callbackQuery, data, chatId, messageId, firstName);
    return;
  }

  // ════════════════════════════════════════════════════════════
  // ПРОВЕРКА АДМИНСКИХ ПРАВ
  // ════════════════════════════════════════════════════════════

  if (!isAdmin(chatId)) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '🚫 Доступ запрещен. Эта функция доступна только администраторам.',
      show_alert: true
    });
    
    // Отправляем публичное меню
    await bot.sendMessage(chatId, 
      '❌ *Доступ запрещен*\n\n' +
      'Эта функция доступна только администраторам.\n' +
      'Воспользуйтесь публичным меню:',
      {
        parse_mode: 'Markdown',
        reply_markup: getPublicMenu()
      }
    );
    return;
  }

  // ════════════════════════════════════════════════════════════
  // ГЛАВНОЕ МЕНЮ
  // ════════════════════════════════════════════════════════════

  if (data === 'menu' || data === 'admin_menu') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText('🌰 *ПАНЕЛЬ АДМИНИСТРАТОРА*', {
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

  if (data === 'admin_stats') {
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

  if (data === 'admin_list_all') {
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

  if (data === 'admin_list_new') {
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

  if (data === 'admin_list_done') {
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

  if (data === 'admin_help') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText(
      '❓ *СПРАВКА ДЛЯ АДМИНИСТРАТОРОВ*\n\n' +
      '*Команды:*\n' +
      '/start - запуск бота\n' +
      '/menu - главное меню\n' +
      '/stats - статистика\n\n' +
      '*Кнопки заявки:*\n' +
      '✅ Обработано - заявка завершена\n' +
      '⏳ В работе - заявка в процессе\n' +
      '📞 Позвонить - показать телефон клиента\n' +
      '💬 Написать - показать контакты\n' +
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


