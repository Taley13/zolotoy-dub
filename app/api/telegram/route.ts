/**
 * 🤖 TELEGRAM WEBHOOK HANDLER (Serverless)
 * 
 * API Route для обработки вебхуков от Telegram
 * Работает в serverless режиме на Vercel
 */

import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { kv } from '@vercel/kv';

// ════════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_IDS = process.env.TELEGRAM_CHAT_ID!.split(',').map(id => parseInt(id.trim()));

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден');
}

// Создаем бота БЕЗ polling (для вебхуков)
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// ════════════════════════════════════════════════════════════
// ТИПЫ
// ════════════════════════════════════════════════════════════

interface UserSession {
  type: 'measurement' | 'consultation';
  step: 'name' | 'phone';
  name?: string;
  phone?: string;
}

interface Application {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  source: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  actions: any[];
  notes: any[];
}

// ════════════════════════════════════════════════════════════
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ════════════════════════════════════════════════════════════

function isAdmin(chatId: number): boolean {
  return ADMIN_IDS.includes(chatId);
}

// ════════════════════════════════════════════════════════════
// УПРАВЛЕНИЕ СЕССИЯМИ (Vercel KV)
// ════════════════════════════════════════════════════════════

async function getUserSession(chatId: number): Promise<UserSession | null> {
  try {
    const session = await kv.get<UserSession>(`session:${chatId}`);
    return session;
  } catch (error) {
    console.error('Ошибка получения сессии:', error);
    return null;
  }
}

async function setUserSession(chatId: number, session: UserSession): Promise<void> {
  try {
    // Сессия живет 30 минут
    await kv.set(`session:${chatId}`, session, { ex: 1800 });
  } catch (error) {
    console.error('Ошибка сохранения сессии:', error);
  }
}

async function deleteUserSession(chatId: number): Promise<void> {
  try {
    await kv.del(`session:${chatId}`);
  } catch (error) {
    console.error('Ошибка удаления сессии:', error);
  }
}

// ════════════════════════════════════════════════════════════
// УПРАВЛЕНИЕ ЗАЯВКАМИ (Simple API)
// ════════════════════════════════════════════════════════════

async function createApplication(data: Partial<Application>): Promise<Application> {
  const application: Application = {
    id: `APP_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: data.name || 'Не указано',
    phone: data.phone || '',
    email: data.email || null,
    message: data.message || '',
    source: data.source || 'telegram_bot',
    priority: data.priority || 'normal',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    actions: [],
    notes: []
  };

  try {
    // Сохраняем в KV
    await kv.set(`application:${application.id}`, application);
    
    // Добавляем в список всех заявок
    await kv.lpush('applications:all', application.id);
    
    console.log(`[Telegram API] ✅ Создана заявка ${application.id}`);
    return application;
  } catch (error) {
    console.error('[Telegram API] Ошибка создания заявки:', error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════
// КЛАВИАТУРЫ
// ════════════════════════════════════════════════════════════

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

function getApplicationButtons(applicationId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Обработано', callback_data: `app_done_${applicationId}` },
        { text: '⏳ В работе', callback_data: `app_work_${applicationId}` }
      ],
      [
        { text: '📞 Позвонить', callback_data: `app_call_${applicationId}` },
        { text: '💬 Написать', callback_data: `app_message_${applicationId}` }
      ],
      [
        { text: '🗑 Удалить', callback_data: `app_delete_${applicationId}` }
      ]
    ]
  };
}

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ КОМАНД
// ════════════════════════════════════════════════════════════

async function handleStartCommand(chatId: number, firstName: string) {
  if (isAdmin(chatId)) {
    await bot.sendMessage(
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
    await bot.sendMessage(
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
}

async function handleMenuCommand(chatId: number) {
  if (isAdmin(chatId)) {
    await bot.sendMessage(chatId, '🌰 *ПАНЕЛЬ АДМИНИСТРАТОРА*', {
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
  } else {
    await bot.sendMessage(chatId, '🌰 *ГЛАВНОЕ МЕНЮ*', {
      parse_mode: 'Markdown',
      reply_markup: getPublicMenu()
    });
  }
}

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ ПУБЛИЧНЫХ CALLBACK
// ════════════════════════════════════════════════════════════

async function handlePublicCallbacks(
  callbackQuery: TelegramBot.CallbackQuery,
  data: string,
  chatId: number,
  messageId: number,
  firstName: string
) {
  
  if (data === 'public_measurement') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await setUserSession(chatId, { type: 'measurement', step: 'name' });
    
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

  if (data === 'public_consultation') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await setUserSession(chatId, { type: 'consultation', step: 'name' });
    
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

  if (data === 'public_back_menu') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await deleteUserSession(chatId);
    
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

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИК ТЕКСТОВЫХ СООБЩЕНИЙ (ФОРМЫ)
// ════════════════════════════════════════════════════════════

async function handleTextMessage(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (!text || text.startsWith('/')) return;
  
  const session = await getUserSession(chatId);
  if (!session) return;
  
  // СБОР ИМЕНИ
  if (session.step === 'name') {
    session.name = text;
    session.step = 'phone';
    await setUserSession(chatId, session);
    
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
    
    const serviceType = session.type === 'measurement' 
      ? '🎯 Бесплатный замер + дизайн-проект'
      : '💬 Консультация';
    
    try {
      const application = await createApplication({
        name: session.name!,
        phone: session.phone!,
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
          console.error(`Ошибка отправки админу ${adminId}:`, error);
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
      
      console.log(`[Telegram API] ✅ Создана публичная заявка ${application.id} от ${session.name}`);
      
    } catch (error) {
      console.error('[Telegram API] Ошибка создания заявки:', error);
      
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
    
    await deleteUserSession(chatId);
    return;
  }
}

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИК CALLBACK QUERY
// ════════════════════════════════════════════════════════════

async function handleCallbackQuery(callbackQuery: TelegramBot.CallbackQuery) {
  const msg = callbackQuery.message!;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const data = callbackQuery.data!;
  const firstName = callbackQuery.from.first_name || 'друг';

  // Публичные обработчики
  if (data.startsWith('public_')) {
    await handlePublicCallbacks(callbackQuery, data, chatId, messageId, firstName);
    return;
  }

  // Проверка админских прав
  if (!isAdmin(chatId)) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: '🚫 Доступ запрещен. Эта функция доступна только администраторам.',
      show_alert: true
    });
    
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

  // Админские функции (базовые)
  if (data === 'admin_help') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText(
      '❓ *СПРАВКА ДЛЯ АДМИНИСТРАТОРОВ*\n\n' +
      '*Команды:*\n' +
      '/start - запуск бота\n' +
      '/menu - главное меню\n\n' +
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
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад в меню', callback_data: 'admin_menu' }
          ]]
        }
      }
    );
    return;
  }

  if (data === 'admin_menu') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.editMessageText('🌰 *ПАНЕЛЬ АДМИНИСТРАТОРА*', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
    return;
  }

  // Остальные админские функции
  await bot.answerCallbackQuery(callbackQuery.id, {
    text: 'Эта функция в разработке'
  });
}

// ════════════════════════════════════════════════════════════
// ГЛАВНЫЙ ОБРАБОТЧИК ВЕБХУКА
// ════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('[Telegram API] Получен вебхук:', body);
    
    // Обработка команд
    if (body.message) {
      const msg = body.message as TelegramBot.Message;
      const chatId = msg.chat.id;
      const text = msg.text;
      const firstName = msg.from?.first_name || 'друг';
      
      if (text === '/start') {
        await handleStartCommand(chatId, firstName);
      } else if (text === '/menu') {
        await handleMenuCommand(chatId);
      } else {
        await handleTextMessage(msg);
      }
    }
    
    // Обработка callback queries
    if (body.callback_query) {
      await handleCallbackQuery(body.callback_query as TelegramBot.CallbackQuery);
    }
    
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('[Telegram API] Ошибка обработки вебхука:', error);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}

// Для проверки работоспособности
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Telegram webhook endpoint is ready',
    timestamp: new Date().toISOString()
  });
}

