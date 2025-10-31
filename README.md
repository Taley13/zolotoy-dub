# Золотой Дуб — сайт кухонь (Next.js 14)

## Запуск

```
npm install
npm run dev
```

Откройте http://localhost:3000

## Настройка отправки заявок в Telegram

1. Создайте файл `.env.local` в корне проекта и добавьте переменные:

```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
```

2. `TELEGRAM_BOT_TOKEN` — токен бота (формат `123456789:AA...`).
3. `TELEGRAM_CHAT_ID` — ID чата/канала, куда слать заявки. Узнать можно, написав боту и используя `getUpdates`, либо через бота `@userinfobot`.
4. Перезапустите dev-сервер после изменения `.env.local`.

Форма находится на странице `/contacts` и отправляет данные в API-роут `POST /api/contact`.


