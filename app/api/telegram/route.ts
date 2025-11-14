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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// CHAT_IDS - получатели уведомлений (могут быть не админами)
const CHAT_IDS = process.env.TELEGRAM_CHAT_ID 
  ? process.env.TELEGRAM_CHAT_ID.split(',').map(id => parseInt(id.trim()))
  : [];

// ADMIN_IDS - только администраторы бота (доступ к админ-панели)
// По умолчанию первый ID из CHAT_IDS считается админом
const ADMIN_IDS = process.env.TELEGRAM_ADMIN_IDS
  ? process.env.TELEGRAM_ADMIN_IDS.split(',').map(id => parseInt(id.trim()))
  : (CHAT_IDS.length > 0 ? [CHAT_IDS[0]] : []); // Первый получатель = админ

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден');
}

if (CHAT_IDS.length === 0) {
  console.error('❌ TELEGRAM_CHAT_ID не найден или пуст');
}

console.log(`[Telegram] Админы: ${ADMIN_IDS.join(', ')}`);
console.log(`[Telegram] Получатели уведомлений: ${CHAT_IDS.join(', ')}`);

// Создаем бота БЕЗ polling (для вебхуков)
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// ════════════════════════════════════════════════════════════
// ТИПЫ
// ════════════════════════════════════════════════════════════

interface UserSession {
  type: 'measurement' | 'consultation' | 'kitchen_design' | 'wardrobe_design' | 'price_calculation';
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
  serviceType?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  actions: Array<{
    type: 'status' | 'call' | 'comment' | 'delete';
    by: number;
    at: string;
    details?: string;
  }>;
  notes: Array<{
    text: string;
    by: number;
    name?: string;
    createdAt: string;
  }>;
}

// ════════════════════════════════════════════════════════════
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ════════════════════════════════════════════════════════════

function isAdmin(chatId: number): boolean {
  return ADMIN_IDS.includes(chatId);
}

// ════════════════════════════════════════════════════════════
// БЕЗОПАСНЫЕ WRAPPER ФУНКЦИИ ДЛЯ TELEGRAM API
// ════════════════════════════════════════════════════════════

/**
 * Безопасная отправка сообщения с обработкой ошибок
 */
async function safeSendMessage(
  chatId: number, 
  text: string, 
  options?: TelegramBot.SendMessageOptions
): Promise<TelegramBot.Message | null> {
  try {
    return await bot.sendMessage(chatId, text, options);
  } catch (error: any) {
    console.error(`[Telegram] Ошибка отправки сообщения ${chatId}:`, error.message);
    
    // Бот заблокирован пользователем - это нормально
    if (error.message?.includes('bot was blocked')) {
      console.log(`[Telegram] Бот заблокирован пользователем ${chatId}`);
      return null;
    }
    
    // Чат не найден
    if (error.message?.includes('chat not found')) {
      console.log(`[Telegram] Чат ${chatId} не найден`);
      return null;
    }
    
    // Недостаточно прав
    if (error.message?.includes('not enough rights')) {
      console.log(`[Telegram] Недостаточно прав для отправки в ${chatId}`);
      return null;
    }
    
    // Для остальных ошибок - выбрасываем дальше
    throw error;
  }
}

/**
 * Безопасное редактирование сообщения с обработкой ошибок
 */
async function safeEditMessage(
  text: string,
  options: TelegramBot.EditMessageTextOptions
): Promise<TelegramBot.Message | boolean | null> {
  try {
    return await bot.editMessageText(text, options);
  } catch (error: any) {
    console.error('[Telegram] Ошибка редактирования сообщения:', error.message);
    
    // Сообщение не изменилось - игнорируем
    if (error.message?.includes('message is not modified')) {
      return null;
    }
    
    // Сообщение не найдено или слишком старое
    if (error.message?.includes('message to edit not found') || 
        error.message?.includes('message can\'t be edited')) {
      console.log('[Telegram] Сообщение не может быть отредактировано');
      return null;
    }
    
    // Для остальных ошибок - выбрасываем дальше
    throw error;
  }
}

/**
 * Безопасный ответ на callback query
 */
async function safeAnswerCallback(
  callbackQueryId: string,
  options?: { text?: string; show_alert?: boolean }
): Promise<boolean> {
  try {
    return await bot.answerCallbackQuery(callbackQueryId, options);
  } catch (error: any) {
    console.error('[Telegram] Ошибка ответа на callback:', error.message);
    
    // Query слишком старый - игнорируем
    if (error.message?.includes('query is too old')) {
      return false;
    }
    
    return false;
  }
}

// ════════════════════════════════════════════════════════════
// ЗАЩИТА ОТ СПАМА И ФЛУДА
// ════════════════════════════════════════════════════════════

/**
 * Проверка rate limit для предотвращения флуда
 * Ограничение: не более 10 действий в минуту
 */
async function checkRateLimit(chatId: number, action: string = 'general'): Promise<boolean> {
  try {
    const key = `ratelimit:${chatId}:${action}`;
    const count = await kv.incr(key);
    
    // Устанавливаем TTL только при первом запросе
    if (count === 1) {
      await kv.expire(key, 60); // 1 минута
    }
    
    // Максимум 10 действий в минуту
    if (count > 10) {
      console.warn(`[Security] Rate limit exceeded для ${chatId} (${action}): ${count} запросов`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Security] Ошибка проверки rate limit:', error);
    // В случае ошибки - разрешаем (fail-open)
    return true;
  }
}

/**
 * Проверка кулдауна между заявками
 * Ограничение: не более 1 заявки в 5 минут
 */
async function checkApplicationCooldown(chatId: number): Promise<{ allowed: boolean; remainingSeconds?: number }> {
  try {
    const key = `last_app:${chatId}`;
    const lastAppTime = await kv.get<number>(key);
    
    if (!lastAppTime) {
      return { allowed: true };
    }
    
    const timePassed = Date.now() - lastAppTime;
    const cooldownMs = 5 * 60 * 1000; // 5 минут
    
    if (timePassed < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timePassed) / 1000);
      console.warn(`[Security] Application cooldown для ${chatId}: осталось ${remainingSeconds}с`);
      return { allowed: false, remainingSeconds };
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('[Security] Ошибка проверки cooldown:', error);
    // В случае ошибки - разрешаем
    return { allowed: true };
  }
}

/**
 * Установка метки времени последней заявки
 */
async function setApplicationCooldown(chatId: number): Promise<void> {
  try {
    const key = `last_app:${chatId}`;
    await kv.set(key, Date.now(), { ex: 300 }); // 5 минут
  } catch (error) {
    console.error('[Security] Ошибка установки cooldown:', error);
  }
}

/**
 * Валидация номера телефона
 */
function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Телефон не может быть пустым' };
  }
  
  // Убираем все пробелы и спецсимволы для проверки
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Проверяем, что остались только цифры и +
  if (!/^[\+]?[\d]{10,15}$/.test(cleanPhone)) {
    return { valid: false, error: 'Некорректный формат телефона. Используйте цифры, например: +79001234567 или 8-900-123-45-67' };
  }
  
  // Проверяем минимальную длину (10 цифр)
  const digitsOnly = cleanPhone.replace(/\+/g, '');
  if (digitsOnly.length < 10) {
    return { valid: false, error: 'Телефон слишком короткий (минимум 10 цифр)' };
  }
  
  if (digitsOnly.length > 15) {
    return { valid: false, error: 'Телефон слишком длинный (максимум 15 цифр)' };
  }
  
  return { valid: true };
}

/**
 * Валидация имени
 */
function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Имя не может быть пустым' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { valid: false, error: 'Имя слишком короткое (минимум 2 символа)' };
  }
  
  if (trimmedName.length > 50) {
    return { valid: false, error: 'Имя слишком длинное (максимум 50 символов)' };
  }
  
  // Проверяем, что имя содержит хотя бы одну букву
  if (!/[a-zA-Zа-яА-ЯёЁ]/.test(trimmedName)) {
    return { valid: false, error: 'Имя должно содержать буквы' };
  }
  
  return { valid: true };
}

/**
 * Экранирование спецсимволов Markdown
 */
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
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

interface AdminCommentSession {
  applicationId: string;
  messageId: number;
}

async function setAdminCommentSession(chatId: number, session: AdminCommentSession): Promise<void> {
  try {
    await kv.set(`admin_comment:${chatId}`, session, { ex: 600 });
  } catch (error) {
    console.error('Ошибка сохранения админской сессии комментария:', error);
  }
}

async function getAdminCommentSession(chatId: number): Promise<AdminCommentSession | null> {
  try {
    const session = await kv.get<AdminCommentSession>(`admin_comment:${chatId}`);
    return session || null;
  } catch (error) {
    console.error('Ошибка получения админской сессии комментария:', error);
    return null;
  }
}

async function deleteAdminCommentSession(chatId: number): Promise<void> {
  try {
    await kv.del(`admin_comment:${chatId}`);
  } catch (error) {
    console.error('Ошибка удаления админской сессии комментария:', error);
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
    serviceType: data.serviceType || null,
    deletedAt: null,
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

async function getApplicationById(applicationId: string): Promise<Application | null> {
  try {
    const application = await kv.get<Application>(`application:${applicationId}`);
    return application || null;
  } catch (error) {
    console.error(`[Telegram API] Ошибка чтения заявки ${applicationId}:`, error);
    return null;
  }
}

async function saveApplication(application: Application): Promise<void> {
  try {
    application.updatedAt = new Date().toISOString();
    await kv.set(`application:${application.id}`, application);
  } catch (error) {
    console.error(`[Telegram API] Ошибка сохранения заявки ${application.id}:`, error);
  }
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    new: '🔔 Новая',
    in_progress: '⏳ В работе',
    call_completed: '📞 Звонок совершен',
    processed: '✅ Обработано',
    deleted: '🗑️ Удалена'
  };
  return map[status] || 'ℹ️ Неизвестно';
}

function formatApplicationMessage(application: Application): string {
  const createdAt = new Date(application.createdAt).toLocaleString('ru-RU');
  const updatedAt = new Date(application.updatedAt).toLocaleString('ru-RU');
  const statusLabel = getStatusLabel(application.status);
  const comments =
    application.notes && application.notes.length > 0
      ? '\n📝 *Комментарии:*\n' +
        application.notes
          .slice(-3)
          .map((note) => {
            const author = note.name ? escapeMarkdown(note.name) : 'Администратор';
            const time = new Date(note.createdAt).toLocaleString('ru-RU');
            return `• ${escapeMarkdown(note.text)} _(от ${author}, ${escapeMarkdown(time)})_`;
          })
          .join('\n')
      : '';

  return (
    '🌰 *ЗАЯВКА ИЗ TELEGRAM БОТА*\n\n' +
    `👤 Имя: ${escapeMarkdown(application.name)}\n` +
    `📞 Телефон: ${escapeMarkdown(application.phone)}\n` +
    (application.serviceType ? `📋 Услуга: ${escapeMarkdown(application.serviceType)}\n` : '') +
    `📅 Создана: ${escapeMarkdown(createdAt)}\n` +
    `📌 Статус: ${statusLabel}\n` +
    `🆔 ID: \`${application.id}\`\n` +
    `🛠 Обновлено: ${escapeMarkdown(updatedAt)}` +
    comments
  );
}

async function updateAdminApplicationMessage(chatId: number, messageId: number, application: Application) {
  const replyMarkup = application.status === 'deleted' ? undefined : getApplicationButtons(application.id);
  try {
    await safeEditMessage(formatApplicationMessage(application), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: replyMarkup
    });
  } catch (error) {
    console.error(`[Telegram API] Не удалось обновить сообщение для заявки ${application.id}:`, error);
  }
}

async function handleAdminCommentInput(
  chatId: number,
  msg: TelegramBot.Message,
  text: string,
  session: AdminCommentSession
) {
  const application = await getApplicationById(session.applicationId);
  if (!application) {
    await deleteAdminCommentSession(chatId);
    await safeSendMessage(chatId, '❌ Заявка не найдена. Возможно, она была удалена.');
    return;
  }

  const comment: Application['notes'][number] = {
    text,
    by: chatId,
    name: msg.from?.first_name || msg.from?.username || undefined,
    createdAt: new Date().toISOString()
  };

  application.notes = application.notes || [];
  application.notes.push(comment);
  application.actions = application.actions || [];
  application.actions.push({
    type: 'comment',
    by: chatId,
    at: new Date().toISOString(),
    details: 'Комментарий добавлен'
  });

  await saveApplication(application);
  await deleteAdminCommentSession(chatId);

  await safeSendMessage(chatId, '✏️ Комментарий добавлен к заявке.');
  await updateAdminApplicationMessage(chatId, session.messageId, application);
}

type AdminActionType = 'process' | 'call' | 'comment' | 'delete';

async function handleAdminActionCallback(
  action: AdminActionType,
  applicationId: string,
  chatId: number,
  messageId: number,
  callbackQueryId: string
) {
  const application = await getApplicationById(applicationId);
  if (!application) {
    await safeAnswerCallback(callbackQueryId, {
      text: 'Заявка не найдена или уже удалена',
      show_alert: true
    });

    await safeEditMessage(
      '⚠️ *Заявка недоступна или была удалена оригинальным отправителем.*',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      }
    );
    return;
  }

  const now = new Date().toISOString();
  application.actions = application.actions || [];

  switch (action) {
    case 'process': {
      application.status = 'processed';
      application.actions.push({
        type: 'status',
        by: chatId,
        at: now,
        details: 'processed'
      });
      await saveApplication(application);
      await updateAdminApplicationMessage(chatId, messageId, application);
      await safeAnswerCallback(callbackQueryId, { text: '✅ Статус заявки обновлён', show_alert: true });
      break;
    }
    case 'call': {
      if (application.status === 'new' || application.status === 'in_progress') {
        application.status = 'call_completed';
      }
      application.actions.push({
        type: 'call',
        by: chatId,
        at: now,
        details: 'call_completed'
      });
      await saveApplication(application);
      await updateAdminApplicationMessage(chatId, messageId, application);
      const phone = application.phone ? `📞 ${application.phone}` : 'Телефон не указан';
      await safeAnswerCallback(callbackQueryId, { text: `${phone}\n\nЗвонок отмечен.`, show_alert: true });
      break;
    }
    case 'comment': {
      await setAdminCommentSession(chatId, { applicationId: application.id, messageId });
      await safeAnswerCallback(callbackQueryId, {
        text: '✏️ Отправьте комментарий одним следующим сообщением',
        show_alert: true
      });
      await safeSendMessage(
        chatId,
        `✏️ Напишите комментарий для заявки \`${escapeMarkdown(application.id)}\` (или напишите "отмена" для выхода).`,
        { parse_mode: 'Markdown' }
      );
      break;
    }
    case 'delete': {
      application.status = 'deleted';
      application.deletedAt = now;
      application.actions.push({
        type: 'delete',
        by: chatId,
        at: now,
        details: 'deleted'
      });
      await saveApplication(application);
      await updateAdminApplicationMessage(chatId, messageId, application);
      await safeAnswerCallback(callbackQueryId, { text: '🗑️ Заявка помечена как удалённая', show_alert: true });
      break;
    }
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

// Главное меню для клиентов - 4 услуги в сетке 2x2
function getPublicMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🍳 Дизайн кухни', callback_data: 'kitchen_design' },
        { text: '🚪 Дизайн шкафа', callback_data: 'wardrobe_design' }
      ],
      [
        { text: '📐 Вызов замерщика', callback_data: 'call_measurer' },
        { text: '💰 Расчет стоимости', callback_data: 'price_calculation' }
      ]
    ]
  };
}

function getApplicationButtons(applicationId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Обработано', callback_data: `admin_process_${applicationId}` },
        { text: '📞 Позвонить', callback_data: `admin_call_${applicationId}` }
      ],
      [
        { text: '✏️ Комментарий', callback_data: `admin_comment_${applicationId}` }
      ],
      [
        { text: '🗑️ Удалить', callback_data: `admin_delete_${applicationId}` }
      ]
    ]
  };
}

// ════════════════════════════════════════════════════════════
// ОБРАБОТЧИКИ КОМАНД
// ════════════════════════════════════════════════════════════

async function handleStartCommand(chatId: number, firstName: string) {
  // Проверяем rate limit
  const rateLimitOk = await checkRateLimit(chatId, 'start');
  if (!rateLimitOk) {
    await safeSendMessage(
      chatId,
      '⏳ Пожалуйста, подождите немного перед следующим действием.'
    );
    return;
  }

  if (isAdmin(chatId)) {
    await safeSendMessage(
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
    // Подробное приветствие для клиентов
    await safeSendMessage(
      chatId,
      `👋 Здравствуйте, <b>${firstName}</b>! Рад вас видеть!\n\n` +
      'Я — ваш помощник в создании идеальной кухни или гардеробной от <b>ЗОЛОТОЙ ДУБ</b>.\n\n' +
      '✨ <b>Что мы делаем:</b>\n' +
      '• Кухни, которые радуют каждый день\n' +
      '• Гардеробные, где всё на своих местах\n' +
      '• Бесплатный замер и 3D-дизайн\n' +
      '• Четкие сроки и фиксированные цены\n\n' +
      '⚡ <b>Срок:</b> 14-21 день\n' +
      '🎁 <b>Акция:</b> -15% при заказе через бота!\n\n' +
      '👇 <b>Выберите услугу — и мы начнем!</b>',
      {
        parse_mode: 'HTML',
        reply_markup: getPublicMenu()
      }
    );
  }
}

async function handleMenuCommand(chatId: number) {
  // Проверяем rate limit
  const rateLimitOk = await checkRateLimit(chatId, 'menu');
  if (!rateLimitOk) {
    await safeSendMessage(
      chatId,
      '⏳ Пожалуйста, подождите немного перед следующим действием.'
    );
    return;
  }

  if (isAdmin(chatId)) {
    await safeSendMessage(chatId, '🌰 *ПАНЕЛЬ АДМИНИСТРАТОРА*', {
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
  } else {
    await safeSendMessage(chatId, '🌰 *ГЛАВНОЕ МЕНЮ*', {
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
  
  // 🍳 ДИЗАЙН КУХНИ
  if (data === 'kitchen_design') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'kitchen_design', step: 'name' });
    
    await safeEditMessage(
      '🍳 <b>ДИЗАЙН КУХНИ</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '<b>Что входит в услугу:</b>\n\n' +
      '📐 Выезд дизайнера на объект\n' +
      '🎨 3D-визуализация кухни\n' +
      '📏 Точные замеры помещения\n' +
      '💡 Подбор материалов и цветов\n' +
      '💰 Расчет полной стоимости\n\n' +
      '⚡ <b>БОНУС:</b> Скидка <b>15%</b> при заказе через бота!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Как к вам обращаться?',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад в меню', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // 🚪 ДИЗАЙН ШКАФА
  if (data === 'wardrobe_design') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'wardrobe_design', step: 'name' });
    
    await safeEditMessage(
      '🚪 <b>ДИЗАЙН ШКАФА-КУПЕ И ГАРДЕРОБНЫХ</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '<b>Создадим для вас:</b>\n\n' +
      '🚪 Встроенные шкафы-купе\n' +
      '👔 Гардеробные системы\n' +
      '📦 Системы хранения\n' +
      '🎨 3D-проект с визуализацией\n' +
      '💰 Точный расчет стоимости\n\n' +
      '⚡ <b>БОНУС:</b> Скидка <b>15%</b> при заказе через бота!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Как к вам обращаться?',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад в меню', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // 📐 ВЫЗОВ ЗАМЕРЩИКА
  if (data === 'call_measurer') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'measurement', step: 'name' });
    
    await safeEditMessage(
      '📐 <b>ВЫЗОВ ЗАМЕРЩИКА</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '✨ <b>БЕСПЛАТНЫЙ выезд специалиста!</b>\n\n' +
      '📏 Точные замеры помещения\n' +
      '💡 Консультация на месте\n' +
      '📋 Рекомендации по планировке\n' +
      '💰 Предварительный расчет\n' +
      '🎨 Образцы материалов\n\n' +
      '⚡ <b>БОНУС:</b> Скидка <b>15%</b> при заказе!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Как к вам обращаться?',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад в меню', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // 💰 РАСЧЕТ СТОИМОСТИ
  if (data === 'price_calculation') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'price_calculation', step: 'name' });
    
    await safeEditMessage(
      '💰 <b>РАСЧЕТ СТОИМОСТИ</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '<b>Получите точный расчет:</b>\n\n' +
      '📊 Стоимость по вашим размерам\n' +
      '💎 Варианты материалов и цен\n' +
      '🎨 Разные комплектации\n' +
      '📅 Сроки изготовления\n' +
      '💳 Варианты оплаты\n\n' +
      '🌐 <b>Калькулятор онлайн:</b> zol-dub.online\n\n' +
      '⚡ <b>БОНУС:</b> Скидка <b>15%</b> при заказе через бота!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Как к вам обращаться?',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад в меню', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }
  
  // Старые обработчики (для обратной совместимости)
  if (data === 'design_measure' || data === 'public_measurement') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'measurement', step: 'name' });
    
    await safeEditMessage(
      '🎯 <b>ДИЗАЙН-ПРОЕКТ + ЗАМЕР</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '✨ <b>БЕСПЛАТНО</b> для вас:\n\n' +
      '📏 Выезд замерщика на объект\n' +
      '🎨 3D-визуализация кухни\n' +
      '📐 Дизайн-проект с планировкой\n' +
      '💰 Точный расчет стоимости\n\n' +
      '⚡ <b>БОНУС:</b> Скидка <b>15%</b> при заказе!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Укажите ваше <b>имя</b>:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // Обработчик: Консультация
  if (data === 'consultation' || data === 'public_consultation') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'consultation', step: 'name' });
    
    await safeEditMessage(
      '💬 <b>КОНСУЛЬТАЦИЯ ПО КУХНЯМ</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '<b>Менеджер ответит на вопросы:</b>\n\n' +
      '🎨 Материалы и цвета\n' +
      '⏰ Сроки изготовления\n' +
      '💰 Стоимость и оплата\n' +
      '✅ Гарантии\n\n' +
      '⚡ <b>БОНУС:</b> Скидка <b>15%</b> при заказе!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Укажите ваше <b>имя</b>:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // НОВЫЙ обработчик: Быстрая заявка
  if (data === 'request') {
    await safeAnswerCallback(callbackQuery.id);
    await setUserSession(chatId, { type: 'measurement', step: 'name' });
    
    await safeEditMessage(
      '📋 <b>БЫСТРАЯ ЗАЯВКА</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '⚡ <b>Оформите заявку за 1 минуту!</b>\n\n' +
      '✅ Перезвоним в течение <b>15 минут</b>\n' +
      '✅ Ответим на все вопросы\n' +
      '✅ Назначим удобное время замера\n\n' +
      '🎁 <b>БОНУС:</b> Скидка <b>15%</b>!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👤 Укажите ваше <b>имя</b>:',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '« Назад', callback_data: 'back_menu' }
          ]]
        }
      }
    );
    return;
  }

  if (data === 'public_about') {
    await safeAnswerCallback(callbackQuery.id);
    
    await safeEditMessage(
      'ℹ️ <b>О КОМПАНИИ «ЗОЛОТОЙ ДУБ»</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '🌰 Мы — производитель кухонь <b>премиум-класса</b> из массива дуба\n\n' +
      '✨ <b>Почему выбирают нас:</b>\n\n' +
      '✅ <b>Натуральные материалы</b>\n' +
      '   Используем только массив дуба — <i>экологичный и долговечный материал</i>\n\n' +
      '✅ <b>Индивидуальный подход</b>\n' +
      '   Каждая кухня создается по <i>вашим размерам и пожеланиям</i>\n\n' +
      '✅ <b>Собственное производство</b>\n' +
      '   Контролируем качество на <i>всех этапах</i>\n\n' +
      '✅ <b>Гарантия 5 лет</b>\n' +
      '   Уверены в качестве нашей продукции\n\n' +
      '⚡ <b>СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ:</b>\n' +
      '🎁 При заказе через TELEGRAM — скидка <b>15%</b>!\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '📍 <b>Адрес:</b> Воронеж\n' +
      '📞 <b>Телефон:</b> 8-930-193-34-20\n' +
      '🌐 <b>Сайт:</b> zol-dub.online',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🎁 Активировать скидку 15%', callback_data: 'activate_discount' }
            ],
            [
              { text: '🎯 Заказать замер', callback_data: 'public_measurement' }
            ],
            [
              { text: '« Назад в меню', callback_data: 'public_back_menu' }
            ]
          ]
        }
      }
    );
    return;
  }

  if (data === 'public_website') {
    await safeAnswerCallback(callbackQuery.id, {
      text: '🌐 Открывайте наш сайт!'
    });
    
    await safeSendMessage(
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

  if (data === 'activate_discount') {
    await safeAnswerCallback(callbackQuery.id, {
      text: '🎉 Скидка 15% активирована! Продолжайте оформление заявки.',
      show_alert: true
    });
    
    await safeSendMessage(
      chatId,
      '🎊 <b>ПОЗДРАВЛЯЕМ!</b>\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '✅ Скидка <b>15%</b> успешно активирована!\n\n' +
      '⚡ <b>Ваши преимущества:</b>\n\n' +
      '🎯 Скидка <b>15%</b> на любую кухню\n' +
      '📏 Бесплатный замер и дизайн\n' +
      '🎨 3D-визуализация проекта\n' +
      '✨ Индивидуальный подход\n' +
      '🏆 Гарантия качества 5 лет\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '💡 <i>Скидка действует при заказе через этого бота</i>\n\n' +
      '👇 Продолжите оформление заявки, указав имя выше, или вернитесь в меню:',
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '🏠 Главное меню', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }

  // Обработчик: Возврат в главное меню
  if (data === 'back_menu' || data === 'public_back_menu') {
    await safeAnswerCallback(callbackQuery.id);
    await deleteUserSession(chatId);
    
    await safeEditMessage(
      `👋 <b>${firstName}</b>!\n\n` +
      '🌰 <b>ЗОЛОТОЙ ДУБ</b> — Кухни на заказ\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '⚡ <b>СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ:</b>\n' +
      '🎁 Скидка <b>15%</b> при заказе через бота!\n\n' +
      '✨ <b>Что мы предлагаем:</b>\n' +
      '📏 Бесплатный замер и 3D-дизайн\n' +
      '🎨 Кухни из массива дуба\n' +
      '🏆 Гарантия 5 лет\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👇 <b>Выберите действие:</b>',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
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
  
  if (!text) return;

  const adminCommentSession = await getAdminCommentSession(chatId);
  if (adminCommentSession && isAdmin(chatId)) {
    const trimmed = text.trim();
    if (trimmed.toLowerCase() === 'отмена' || trimmed === '/cancel') {
      await deleteAdminCommentSession(chatId);
      await safeSendMessage(chatId, '✏️ Добавление комментария отменено.');
      return;
    }

    if (trimmed.startsWith('/')) {
      await safeSendMessage(chatId, '❗ Отправьте комментарий обычным текстом или напишите "отмена" для выхода из режима.');
      return;
    }

    await handleAdminCommentInput(chatId, msg, text, adminCommentSession);
    return;
  }
  
  if (text.startsWith('/')) return;
  
  // Проверяем rate limit
  const rateLimitOk = await checkRateLimit(chatId, 'message');
  if (!rateLimitOk) {
    await safeSendMessage(
      chatId,
      '⏳ Вы отправляете сообщения слишком часто. Пожалуйста, подождите немного.'
    );
    return;
  }
  
  const session = await getUserSession(chatId);
  
  // Если нет активной сессии - подсказываем пользователю
  if (!session) {
    await safeSendMessage(
      chatId,
      '🤔 Я вас не понял.\n\n' +
      'Используйте /menu для вызова меню или /start для перезапуска бота.',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🏠 Главное меню', callback_data: 'public_back_menu' }
          ]]
        }
      }
    );
    return;
  }
  
  // СБОР ИМЕНИ
  if (session.step === 'name') {
    // Валидация имени
    const nameValidation = validateName(text);
    if (!nameValidation.valid) {
      await safeSendMessage(
        chatId,
        `❌ ${nameValidation.error}\n\n` +
        'Пожалуйста, укажите ваше имя (от 2 до 50 символов):',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '❌ Отменить', callback_data: 'public_back_menu' }
            ]]
          }
        }
      );
      return;
    }
    
    session.name = text.trim();
    session.step = 'phone';
    await setUserSession(chatId, session);
    
    await safeSendMessage(
      chatId,
      `Отлично, ${escapeMarkdown(text.trim())}! 👍\n\n` +
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
    // Валидация телефона
    const phoneValidation = validatePhone(text);
    if (!phoneValidation.valid) {
      await safeSendMessage(
        chatId,
        `❌ ${phoneValidation.error}\n\n` +
        'Пожалуйста, укажите корректный номер телефона:',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '❌ Отменить', callback_data: 'public_back_menu' }
            ]]
          }
        }
      );
      return;
    }
    
    // Проверяем cooldown перед созданием заявки
    const cooldownCheck = await checkApplicationCooldown(chatId);
    if (!cooldownCheck.allowed) {
      const minutes = Math.ceil(cooldownCheck.remainingSeconds! / 60);
      await safeSendMessage(
        chatId,
        `⏳ *Пожалуйста, подождите ${minutes} мин.*\n\n` +
        'Вы можете отправить новую заявку через несколько минут.\n\n' +
        '💡 Это защита от случайного дублирования заявок.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '« Вернуться в меню', callback_data: 'public_back_menu' }
            ]]
          }
        }
      );
      return;
    }
    
    session.phone = text.trim();
    
    const serviceType = session.type === 'measurement' 
      ? '🎯 Бесплатный замер + дизайн-проект'
      : '💬 Консультация';
    
    try {
      // Получаем дополнительную информацию о пользователе
      const username = msg.from?.username ? `@${msg.from.username}` : 'не указан';
      
      const application = await createApplication({
        name: session.name!,
        phone: session.phone!,
        message: `Заявка из Telegram бота: ${serviceType}`,
        serviceType,
        source: 'telegram_bot',
        priority: 'normal'
      });
      
      // Устанавливаем cooldown
      await setApplicationCooldown(chatId);
      
      // Отправляем уведомление всем получателям (админам и менеджерам)
      application.serviceType = serviceType;
      const adminText = formatApplicationMessage(application);
      
      // Отправляем всем получателям из CHAT_IDS параллельно
      const notificationPromises = CHAT_IDS.map(async (recipientId) => {
        try {
          // Админам показываем кнопки управления, обычным получателям - только информацию
          const replyMarkup = isAdmin(recipientId) 
            ? getApplicationButtons(application.id)
            : undefined;
            
          await safeSendMessage(recipientId, adminText, {
            parse_mode: 'Markdown',
            reply_markup: replyMarkup
          });
        } catch (error) {
          console.error(`[Telegram] Ошибка отправки получателю ${recipientId}:`, error);
        }
      });
      
      // Ждем завершения всех уведомлений
      await Promise.allSettled(notificationPromises);
      
      // Подтверждение клиенту
      await safeSendMessage(
        chatId,
        '✅ *Заявка успешно отправлена!*\n\n' +
        `Спасибо, ${escapeMarkdown(session.name!)}!\n\n` +
        'Наш менеджер свяжется с вами в ближайшее время по телефону:\n' +
        `📞 ${escapeMarkdown(session.phone!)}\n\n` +
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
      
      await safeSendMessage(
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
  const data = callbackQuery.data;
  const firstName = callbackQuery.from.first_name || 'друг';
  
  // Валидация callback_data
  if (!data) {
    await safeAnswerCallback(callbackQuery.id, { text: 'Ошибка: пустой callback' });
    console.error('[Telegram] Получен пустой callback_data');
    return;
  }
  
  // Проверяем rate limit для callback
  const rateLimitOk = await checkRateLimit(chatId, 'callback');
  if (!rateLimitOk) {
    await safeAnswerCallback(callbackQuery.id, { 
      text: '⏳ Пожалуйста, подождите немного',
      show_alert: true
    });
    return;
  }

  // КЛИЕНТСКИЕ callback (доступны всем пользователям)
  const publicCallbacks = [
    // Новые кнопки главного меню
    'kitchen_design',
    'wardrobe_design',
    'call_measurer',
    'price_calculation',
    // Старые кнопки (обратная совместимость)
    'design_measure',
    'consultation',
    'request',
    'back_menu',
    'activate_discount'
  ];

  // Проверяем публичные обработчики (старые и новые)
  if (data.startsWith('public_') || publicCallbacks.includes(data)) {
    await handlePublicCallbacks(callbackQuery, data, chatId, messageId, firstName);
    return;
  }

  // ТОЛЬКО для админских callback - проверяем права
  // Если не админ - просто отвечаем на callback и ничего не показываем
  if (!isAdmin(chatId)) {
    await safeAnswerCallback(callbackQuery.id);
    // Тихо игнорируем админские callback от обычных пользователей
    return;
  }

  const adminActionMatch = data.match(/^admin_(process|call|comment|delete)_(.+)$/);
  if (adminActionMatch) {
    const [, action, applicationId] = adminActionMatch;
    await handleAdminActionCallback(
      action as AdminActionType,
      applicationId,
      chatId,
      messageId,
      callbackQuery.id
    );
    return;
  }

  // Админские функции (базовые)
  if (data === 'admin_help') {
    await safeAnswerCallback(callbackQuery.id);
    await safeEditMessage(
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
    await safeAnswerCallback(callbackQuery.id);
    await safeEditMessage('🌰 *ПАНЕЛЬ АДМИНИСТРАТОРА*', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: getAdminMenu()
    });
    return;
  }

  // Остальные админские функции
  console.warn(`[Telegram] Неизвестный callback_data: ${data}`);
  await safeAnswerCallback(callbackQuery.id, {
    text: 'Эта функция в разработке'
  });
}

// ════════════════════════════════════════════════════════════
// ГЛАВНЫЙ ОБРАБОТЧИК ВЕБХУКА
// ════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Базовая валидация: проверяем, что это похоже на Telegram Update
    if (!body.update_id) {
      console.error('[Telegram] Невалидный запрос: отсутствует update_id');
      return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
    }
    
    // Логируем размер payload вместо всего содержимого
    const payloadSize = JSON.stringify(body).length;
    console.log(`[Telegram API] Получен вебхук #${body.update_id} (размер: ${payloadSize} байт)`);
    
    // Проверяем известные типы обновлений
    const knownTypes = ['message', 'callback_query', 'edited_message', 'channel_post', 'inline_query', 'my_chat_member'];
    const receivedTypes = Object.keys(body).filter(k => k !== 'update_id');
    const hasKnownType = receivedTypes.some(t => knownTypes.includes(t));
    
    if (!hasKnownType) {
      console.warn(`[Telegram] Неизвестный тип обновления: ${receivedTypes.join(', ')}`);
      // Отвечаем OK, чтобы Telegram не повторял запрос
      return NextResponse.json({ ok: true });
    }
    
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
    
    // Обработка отредактированных сообщений (игнорируем)
    if (body.edited_message) {
      console.log('[Telegram] Получено отредактированное сообщение (игнорируется)');
    }
    
    // Обработка добавления бота в группу
    if (body.my_chat_member) {
      console.log('[Telegram] Изменение статуса бота в чате:', body.my_chat_member);
    }
    
    return NextResponse.json({ ok: true });
    
  } catch (error: any) {
    console.error('[Telegram API] Ошибка обработки вебхука:', error.message || error);
    
    // Логируем stack trace для отладки
    if (error.stack) {
      console.error('[Telegram API] Stack trace:', error.stack);
    }
    
    // Возвращаем 200 OK, чтобы Telegram не повторял запрос при ошибках бизнес-логики
    // Только критические ошибки должны возвращать 5xx
    return NextResponse.json({ ok: true });
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

