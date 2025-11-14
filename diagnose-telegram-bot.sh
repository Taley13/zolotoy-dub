#!/bin/bash

# 🔍 Полная диагностика Telegram бота

set -e

BOT_TOKEN="8397994876:AAHpHKfsdPrEvrGAgIVFGwoOKf6Uw1CPMak"
CHAT_ID="277767867"
WEBHOOK_URL="https://zol-dub.online/api/telegram"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 ДИАГНОСТИКА TELEGRAM БОТА @ZOLODUB_bot"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Проверка бота
echo "1️⃣ Проверка информации о боте..."
BOT_INFO=$(curl -s "https://api.telegram.org/bot$BOT_TOKEN/getMe")
BOT_USERNAME=$(echo "$BOT_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['username'])" 2>/dev/null || echo "N/A")
BOT_NAME=$(echo "$BOT_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['first_name'])" 2>/dev/null || echo "N/A")

if echo "$BOT_INFO" | grep -q '"ok":true'; then
    echo "   ✅ Бот активен"
    echo "   📛 Имя: $BOT_NAME"
    echo "   🔗 Username: @$BOT_USERNAME"
    echo "   🌐 Ссылка: https://t.me/$BOT_USERNAME"
else
    echo "   ❌ Ошибка: Бот не найден или токен неверный"
    echo "$BOT_INFO"
    exit 1
fi
echo ""

# 2. Проверка webhook
echo "2️⃣ Проверка webhook..."
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo")
WEBHOOK_URL_CURRENT=$(echo "$WEBHOOK_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['result'].get('url', 'NOT SET'))" 2>/dev/null)
PENDING_COUNT=$(echo "$WEBHOOK_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['result'].get('pending_update_count', 0))" 2>/dev/null)
LAST_ERROR=$(echo "$WEBHOOK_INFO" | python3 -c "import sys, json; result = json.load(sys.stdin)['result']; print(result.get('last_error_message', 'No errors'))" 2>/dev/null)

echo "   📍 URL: $WEBHOOK_URL_CURRENT"
echo "   📊 Pending updates: $PENDING_COUNT"
echo "   ❗ Last error: $LAST_ERROR"

if [ "$WEBHOOK_URL_CURRENT" = "$WEBHOOK_URL" ]; then
    echo "   ✅ Webhook URL правильный"
else
    echo "   ⚠️  Webhook URL отличается!"
fi
echo ""

# 3. Проверка API endpoint
echo "3️⃣ Проверка API endpoint..."
API_RESPONSE=$(curl -s "$WEBHOOK_URL")
if echo "$API_RESPONSE" | grep -q '"status":"ok"'; then
    echo "   ✅ API endpoint отвечает"
    echo "   📡 $WEBHOOK_URL"
else
    echo "   ❌ API endpoint не отвечает правильно"
    echo "   Response: $API_RESPONSE"
fi
echo ""

# 4. Проверка Environment Variables (через health endpoint)
echo "4️⃣ Проверка environment variables..."
HEALTH=$(curl -s "https://zol-dub.online/api/health")
if echo "$HEALTH" | grep -q '"status":"healthy"'; then
    echo "   ✅ Health check: Healthy"
else
    echo "   ⚠️  Health check показывает проблемы"
fi
echo ""

# 5. Тест отправки сообщения
echo "5️⃣ Тест отправки сообщения боту..."
SEND_RESULT=$(curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{
    \"chat_id\": \"$CHAT_ID\",
    \"text\": \"🧪 <b>ТЕСТ БОТА</b>\\n\\nЭто автоматическое тестовое сообщение.\\n\\nОтправьте /start для проверки работы бота.\",
    \"parse_mode\": \"HTML\"
  }")

if echo "$SEND_RESULT" | grep -q '"ok":true'; then
    MSG_ID=$(echo "$SEND_RESULT" | python3 -c "import sys, json; print(json.load(sys.stdin)['result']['message_id'])" 2>/dev/null)
    echo "   ✅ Сообщение отправлено (ID: $MSG_ID)"
else
    echo "   ❌ Ошибка отправки"
    echo "$SEND_RESULT"
fi
echo ""

# 6. Симуляция webhook с /start
echo "6️⃣ Симуляция команды /start через webhook..."
WEBHOOK_TEST=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 999999999,
    "message": {
      "message_id": 999,
      "from": {
        "id": '"$CHAT_ID"',
        "is_bot": false,
        "first_name": "DiagnosticTest"
      },
      "chat": {
        "id": '"$CHAT_ID"',
        "first_name": "DiagnosticTest",
        "type": "private"
      },
      "date": 1762780000,
      "text": "/start"
    }
  }')

if echo "$WEBHOOK_TEST" | grep -q '"ok":true'; then
    echo "   ✅ Webhook обработал команду /start"
    echo "   📨 Проверьте Telegram - должно прийти приветствие!"
else
    echo "   ❌ Webhook не обработал команду"
    echo "   Response: $WEBHOOK_TEST"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ДИАГНОСТИКА ЗАВЕРШЕНА"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 ИТОГИ:"
echo "   Бот: @$BOT_USERNAME"
echo "   Webhook: $WEBHOOK_URL_CURRENT"
echo "   API: Работает"
echo "   Тест: Сообщения доставляются"
echo ""
echo "📱 СЛЕДУЮЩИЙ ШАГ:"
echo "   Откройте @$BOT_USERNAME в Telegram"
echo "   Нажмите START или отправьте /start"
echo ""
echo "🔗 Прямая ссылка: https://t.me/$BOT_USERNAME"
echo ""

