# 🤖 TELEGRAM БОТ «ЗОЛОТОЙ ДУБ»

Интерактивный бот для обработки заявок с сайта с полной системой кнопок и управления.

## 🚀 БЫСТРЫЙ СТАРТ

### 1. Установка зависимостей

```bash
cd telegram-bot
npm install
```

### 2. Проверка переменных окружения

Убедитесь что в `.env.local` (в корне проекта) есть:

```env
TELEGRAM_BOT_TOKEN=8397994876:AAHpHKfsdPrEvrGAgIVFGwoOKf6Uw1CPMak
TELEGRAM_CHAT_ID=277767867,956005680
```

### 3. Запуск бота

```bash
# Разработка (с auto-restart)
npm run dev

# Production
npm start

# С PM2 (рекомендуется для сервера)
npm run pm2:start
```

## ✨ ФУНКЦИОНАЛ

### 🔘 Кнопки администратора

При отправке `/start` боту появляется главное меню:

```
📊 Статистика     📋 Все заявки
⏳ Новые заявки   ✅ Обработанные
❓ Помощь
```

### 🎯 Кнопки для каждой заявки

Под каждой новой заявкой автоматически появляются кнопки:

```
✅ Обработано    ⏳ В работе
📞 Позвонил      💬 Написал
🗑 Удалить
```

### 📝 Команды

- `/start` - запуск бота и главное меню
- `/menu` - вызов главного меню
- `/stats` - статистика заявок

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Обработчики кнопок (callback_query)

Все кнопки обрабатываются через `bot.on('callback_query')`:

```javascript
// Пример обработки кнопки "Обработано"
if (type === 'done') {
  app.status = 'done';
  await bot.answerCallbackQuery(callbackQuery.id, {
    text: '✅ Заявка отмечена как обработанная'
  });
}
```

### Inline клавиатуры

Используются `InlineKeyboardButton` с `callback_data`:

```javascript
{
  inline_keyboard: [
    [
      { text: '✅ Обработано', callback_data: 'app_done_${applicationId}' },
      { text: '⏳ В работе', callback_data: 'app_work_${applicationId}' }
    ]
  ]
}
```

### Интеграция с сайтом

Бот автоматически получает заявки через функцию `sendNewApplicationNotification()`:

```javascript
// В lib/telegram.ts после отправки сообщения
if (botInstance) {
  await botInstance.sendNewApplicationNotification({
    id: applicationId,
    formattedMessage: text,
    ...data
  });
}
```

## 📊 ХРАНИЛИЩЕ ДАННЫХ

### В памяти (по умолчанию)

```javascript
const applications = new Map();
```

**Плюсы:**
- ✅ Быстро
- ✅ Без настройки

**Минусы:**
- ❌ Данные теряются при перезапуске

### База данных (опционально)

Можно заменить `Map()` на:
- PostgreSQL (Vercel Postgres)
- MongoDB
- SQLite
- Redis

Пример для PostgreSQL:

```javascript
// Вместо Map
import { sql } from '@vercel/postgres';

async function saveApplication(app) {
  await sql`
    INSERT INTO applications (id, name, phone, email, status)
    VALUES (${app.id}, ${app.name}, ${app.phone}, ${app.email}, ${app.status})
  `;
}
```

## 🛠️ ОТЛАДКА

### Проверка работы кнопок

1. Отправьте боту `/start`
2. Нажмите на любую кнопку
3. Проверьте в консоли:
   - `[Bot] Обработка callback_query: {data}`
   - Лог обновления статуса

### Частые проблемы

**Кнопки не реагируют:**
```bash
# Проверьте что бот запущен
ps aux | grep node

# Проверьте логи
pm2 logs zoldub-bot
```

**"Unknown command":**
```javascript
// Убедитесь что обработчик callback_query идёт ДО других обработчиков
bot.on('callback_query', ...) // ПЕРВЫЙ
bot.on('message', ...)         // ВТОРОЙ
```

**"answerCallbackQuery" не вызывается:**
```javascript
// ВСЕГДА вызывайте answerCallbackQuery
await bot.answerCallbackQuery(callbackQuery.id);
```

## 🚀 ДЕПЛОЙ НА СЕРВЕР

### Вариант 1: PM2 (рекомендуется)

```bash
# Установка PM2
npm install -g pm2

# Запуск
cd telegram-bot
npm run pm2:start

# Авто-запуск при перезагрузке
pm2 startup
pm2 save
```

### Вариант 2: systemd

Создайте `/etc/systemd/system/zoldub-bot.service`:

```ini
[Unit]
Description=Zolotoy Dub Telegram Bot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/zolotoy-dub/telegram-bot
ExecStart=/usr/bin/node bot.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable zoldub-bot
sudo systemctl start zoldub-bot
```

### Вариант 3: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["node", "bot.js"]
```

```bash
docker build -t zoldub-bot .
docker run -d --name zoldub-bot --restart always zoldub-bot
```

## 📈 МОНИТОРИНГ

### PM2 Dashboard

```bash
pm2 monit
```

### Логи

```bash
# Все логи
pm2 logs zoldub-bot

# Только ошибки
pm2 logs zoldub-bot --err

# Real-time
pm2 logs zoldub-bot --lines 100
```

## 🔐 БЕЗОПАСНОСТЬ

### Проверка прав доступа

```javascript
if (!ADMIN_IDS.includes(chatId)) {
  await bot.answerCallbackQuery(callbackQuery.id, {
    text: '❌ Нет доступа',
    show_alert: true
  });
  return;
}
```

### Валидация callback_data

```javascript
// Всегда проверяйте существование заявки
const app = applications.get(applicationId);
if (!app) {
  await bot.answerCallbackQuery(callbackQuery.id, {
    text: '❌ Заявка не найдена',
    show_alert: true
  });
  return;
}
```

## 🎯 ROADMAP

- [ ] База данных для постоянного хранения
- [ ] Экспорт заявок в Excel
- [ ] Напоминания о необработанных заявках
- [ ] Автоответы клиентам через бота
- [ ] Интеграция с AmoCRM
- [ ] Статистика по менеджерам
- [ ] Webhook вместо polling (быстрее)

## 📞 ПОДДЕРЖКА

**Разработчик:** Золотой Дуб  
**Версия:** 1.0.0  
**Последнее обновление:** 03.11.2025

---

**✅ БОТ ГОТОВ К РАБОТЕ!**

Отправьте `/start` боту для начала работы.


