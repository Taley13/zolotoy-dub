# 🚀 Деплой на Vercel - Полная инструкция

**Дата:** 2025-11-08  
**Проект:** Золотой Дуб  
**Статус:** ✅ ГОТОВ К ДЕПЛОЮ

---

## ✅ ТЕКУЩИЙ СТАТУС

### Деплой завершен:
```
✅ Production URL: https://zolotoy-h08tgu1tu-taley13s-projects.vercel.app
✅ Dashboard: https://vercel.com/taley13s-projects/zolotoy-dub
✅ Build: Успешно
```

### Что нужно сделать:
```
⚠️ Настроить environment variables
⚠️ Сделать redeploy после настройки
✅ Настроить домен zol-dub.online (опционально)
```

---

## 🔐 ШАГ 1: НАСТРОЙКА ENVIRONMENT VARIABLES

### Вариант A: Через Dashboard (рекомендуется) ⭐

**1. Откройте:**
```
https://vercel.com/taley13s-projects/zolotoy-dub/settings/environment-variables
```

**2. Добавьте 4 переменные:**

Для каждой переменной нажмите **"Add New"** и заполните:

#### 1️⃣ TELEGRAM_BOT_TOKEN
```
Name: TELEGRAM_BOT_TOKEN
Value: 8397994876:AAHpHKfsdPrEvrGAgIVFGwoOKf6Uw1CPMak
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ TELEGRAM_CHAT_ID
```
Name: TELEGRAM_CHAT_ID
Value: 277767867,956005680
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 3️⃣ UPSTASH_REDIS_REST_URL
```
Name: UPSTASH_REDIS_REST_URL
Value: https://healthy-parakeet-35089.upstash.io
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 4️⃣ UPSTASH_REDIS_REST_TOKEN
```
Name: UPSTASH_REDIS_REST_TOKEN
Value: AYkRAAIncDFkN2FjYjFkNGJiYjk0OTczOGFmNjM3MThlZTFjY2NhOHAxMzUwODk
Environment: ✅ Production ✅ Preview ✅ Development
```

**3. Нажмите Save для каждой переменной**

---

### Вариант B: Через CLI (автоматически)

```bash
cd ~/Desktop/zdub/zolotoy-dub

# Запустить скрипт
./setup-vercel-env.sh
```

Скрипт автоматически добавит все 4 переменные для всех окружений.

---

## 🔄 ШАГ 2: REDEPLOY ПОСЛЕ НАСТРОЙКИ

После добавления переменных окружения нужен redeploy:

```bash
cd ~/Desktop/zdub/zolotoy-dub

# Redeploy на production
npx vercel --prod --yes
```

Или через Dashboard:
1. Откройте: https://vercel.com/taley13s-projects/zolotoy-dub
2. Deployments → Latest Deployment
3. ⋯ (три точки) → Redeploy
4. Выберите "Use existing Build Cache" → Redeploy

---

## 🌐 ШАГ 3: НАСТРОЙКА ДОМЕНА zol-dub.online

### 1. Добавить домен в Vercel

**Через Dashboard:**
1. Откройте: https://vercel.com/taley13s-projects/zolotoy-dub/settings/domains
2. Нажмите **"Add"**
3. Введите: `zol-dub.online`
4. Нажмите **"Add"**

**Через CLI:**
```bash
npx vercel domains add zol-dub.online
```

### 2. Настроить DNS

Vercel покажет DNS записи для настройки. Обычно это:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME (для www):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. Дождаться проверки

- Обычно занимает 5-10 минут
- Максимум 24 часа для полной пропагации DNS
- Vercel автоматически выдаст SSL сертификат

---

## 🤖 ШАГ 4: НАСТРОЙКА TELEGRAM WEBHOOK

После успешного деплоя и добавления env переменных:

### 1. Откройте админ панель:
```
https://zol-dub.online/admin/telegram-webhook
```

Или временный URL:
```
https://zolotoy-h08tgu1tu-taley13s-projects.vercel.app/admin/telegram-webhook
```

### 2. Установите webhook:

**URL вебхука должен быть:**
```
https://zol-dub.online/api/telegram
```

Или:
```
https://zolotoy-h08tgu1tu-taley13s-projects.vercel.app/api/telegram
```

### 3. Нажмите "Установить Webhook"

### 4. Проверьте статус:
- Должно быть "🟢 Активен"
- Pending updates: 0

---

## 🧪 ШАГ 5: ТЕСТИРОВАНИЕ

### 1. Health Check
```bash
curl https://zol-dub.online/api/health
# Должно вернуть: {"status":"healthy"}
```

### 2. Telegram Webhook Info
```bash
curl https://zol-dub.online/api/telegram
# Должно вернуть: {"status":"ok","message":"Telegram webhook endpoint is ready"}
```

### 3. Telegram Bot

Найдите вашего бота в Telegram и отправьте:
```
/start
```

Должен прийти улучшенный ответ с полной информацией о компании!

### 4. Контактная форма

Откройте:
```
https://zol-dub.online/contacts
```

Отправьте тестовую заявку → должна прийти в Telegram!

---

## 📊 ПРОВЕРКА ЛОГОВ

### Просмотр логов деплоя:
```bash
npx vercel logs --follow
```

### Просмотр логов конкретного deployment:
```bash
npx vercel inspect zolotoy-h08tgu1tu-taley13s-projects.vercel.app --logs
```

### Фильтр по endpoint:
```bash
# Логи Telegram webhook
npx vercel logs --follow | grep "Telegram"

# Логи контактной формы
npx vercel logs --follow | grep "contact"
```

---

## 🔧 НАСТРОЙКА vercel.json

Уже настроено ✅:

```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

**Включает:**
- ✅ CORS для API
- ✅ Region: Washington DC (ближе к серверам Telegram)
- ✅ Оптимизация для Next.js

---

## 🎯 БЫСТРАЯ КОМАНДА

Если нужно добавить переменные через CLI:

```bash
cd ~/Desktop/zdub/zolotoy-dub

# Автоматическое добавление всех переменных
./setup-vercel-env.sh

# Или вручную (по одной):
echo "8397994876:AAHpHKfsdPrEvrGAgIVFGwoOKf6Uw1CPMak" | npx vercel env add TELEGRAM_BOT_TOKEN production
echo "277767867,956005680" | npx vercel env add TELEGRAM_CHAT_ID production
echo "https://healthy-parakeet-35089.upstash.io" | npx vercel env add UPSTASH_REDIS_REST_URL production
echo "AYkRAAIncDFkN2FjYjFkNGJiYjk0OTczOGFmNjM3MThlZTFjY2NhOHAxMzUwODk" | npx vercel env add UPSTASH_REDIS_REST_TOKEN production
```

---

## 📋 CHECKLIST ПОСЛЕ ДЕПЛОЯ

### Обязательные проверки:
- [ ] Добавлены все 4 переменные окружения
- [ ] Сделан redeploy после добавления переменных
- [ ] Health check возвращает "healthy"
- [ ] Telegram webhook установлен
- [ ] Бот отвечает на /start
- [ ] Контактная форма работает
- [ ] Сообщения приходят в Telegram

### Опциональные:
- [ ] Настроен домен zol-dub.online
- [ ] SSL сертификат активирован
- [ ] Analytics подключена
- [ ] Monitoring настроен

---

## 🆘 TROUBLESHOOTING

### "Environment variables not found"

**Решение:**
1. Проверить что переменные добавлены: https://vercel.com/taley13s-projects/zolotoy-dub/settings/environment-variables
2. Убедиться что выбран Production
3. Сделать Redeploy

### "Telegram webhook failed"

**Решение:**
1. Проверить что TELEGRAM_BOT_TOKEN правильный
2. Проверить что URL использует HTTPS
3. Проверить логи: `npx vercel logs`

### "Contact form not working"

**Решение:**
1. Проверить `/api/health`
2. Проверить логи: Network tab в DevTools
3. Проверить что переменные загружены

---

## 📞 ПОЛЕЗНЫЕ КОМАНДЫ

```bash
# Просмотр всех переменных
npx vercel env ls

# Удаление переменной (если ошибка)
npx vercel env rm VARIABLE_NAME production

# Просмотр deployment
npx vercel ls

# Просмотр логов
npx vercel logs --follow

# Alias домена
npx vercel alias set zolotoy-h08tgu1tu-taley13s-projects.vercel.app zol-dub.online
```

---

## 🎉 ИТОГ

**Текущий статус:**
```
✅ Проект задеплоен
✅ Production URL доступен
⚠️ Переменные окружения - нужно добавить
⏳ Redeploy - после добавления переменных
```

**После настройки переменных получите:**
```
✅ Полностью работающий сайт
✅ Telegram бот с улучшенным /start
✅ Контактная форма → Telegram уведомления
✅ Калькулятор с отправкой заявок
✅ Админ панель для управления webhook
✅ Health check для мониторинга
✅ Автоматический SSL
✅ Глобальный CDN
```

---

## 🌐 ССЫЛКИ

- **Production:** https://zolotoy-h08tgu1tu-taley13s-projects.vercel.app
- **Dashboard:** https://vercel.com/taley13s-projects/zolotoy-dub
- **Settings:** https://vercel.com/taley13s-projects/zolotoy-dub/settings
- **Env Variables:** https://vercel.com/taley13s-projects/zolotoy-dub/settings/environment-variables
- **Domains:** https://vercel.com/taley13s-projects/zolotoy-dub/settings/domains

---

**Следующий шаг: Добавьте переменные окружения!** 🔐

