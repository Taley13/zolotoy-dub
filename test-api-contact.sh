#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "════════════════════════════════════════════════════════"
echo "🧪 Тестирование API endpoint /api/contact"
echo "════════════════════════════════════════════════════════"
echo ""

# URL для тестирования (можно изменить на production)
URL="${1:-http://localhost:3000}"
ENDPOINT="$URL/api/contact"

echo "📍 Endpoint: $ENDPOINT"
echo ""

# Тест 1: GET запрос (проверка существования endpoint)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Тест 1: GET запрос (проверка что endpoint существует)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

GET_RESPONSE=$(curl -s -w "\n%{http_code}" "$ENDPOINT")
GET_HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
GET_BODY=$(echo "$GET_RESPONSE" | head -n-1)

if [ "$GET_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ GET запрос успешен (HTTP $GET_HTTP_CODE)${NC}"
    echo "📄 Response:"
    echo "$GET_BODY" | jq '.' 2>/dev/null || echo "$GET_BODY"
else
    echo -e "${RED}❌ GET запрос провалился (HTTP $GET_HTTP_CODE)${NC}"
    echo "Response: $GET_BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Тест 2: POST запрос без данных (должна быть ошибка)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

EMPTY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{}' \
    "$ENDPOINT")

EMPTY_HTTP_CODE=$(echo "$EMPTY_RESPONSE" | tail -n1)
EMPTY_BODY=$(echo "$EMPTY_RESPONSE" | head -n-1)

if [ "$EMPTY_HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ Валидация работает (HTTP $EMPTY_HTTP_CODE)${NC}"
    echo "📄 Error response:"
    echo "$EMPTY_BODY" | jq '.' 2>/dev/null || echo "$EMPTY_BODY"
else
    echo -e "${YELLOW}⚠️ Неожиданный статус: HTTP $EMPTY_HTTP_CODE${NC}"
    echo "Response: $EMPTY_BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Тест 3: POST запрос с корректными данными"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

VALID_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "phone": "+7 930 123 45 67",
      "email": "test@example.com",
      "message": "Это тестовое сообщение для проверки API"
    }' \
    "$ENDPOINT")

VALID_HTTP_CODE=$(echo "$VALID_RESPONSE" | tail -n1)
VALID_BODY=$(echo "$VALID_RESPONSE" | head -n-1)

if [ "$VALID_HTTP_CODE" = "200" ] || [ "$VALID_HTTP_CODE" = "500" ]; then
    if [ "$VALID_HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ POST запрос успешен (HTTP $VALID_HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠️ Server error (HTTP $VALID_HTTP_CODE) - возможно не настроен Telegram${NC}"
    fi
    echo "📄 Response:"
    echo "$VALID_BODY" | jq '.' 2>/dev/null || echo "$VALID_BODY"
else
    echo -e "${RED}❌ POST запрос провалился (HTTP $VALID_HTTP_CODE)${NC}"
    echo "Response: $VALID_BODY"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "📊 Итоги тестирования"
echo "════════════════════════════════════════════════════════"
echo ""

if [ "$GET_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Endpoint существует и отвечает${NC}"
else
    echo -e "${RED}❌ Endpoint не найден (404)${NC}"
    echo -e "${YELLOW}   Проверьте наличие файла: app/api/contact/route.ts${NC}"
fi

if [ "$EMPTY_HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ Валидация входных данных работает${NC}"
else
    echo -e "${YELLOW}⚠️ Валидация может работать некорректно${NC}"
fi

if [ "$VALID_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Отправка данных работает полностью${NC}"
elif [ "$VALID_HTTP_CODE" = "500" ]; then
    echo -e "${YELLOW}⚠️ API работает, но проверьте переменные окружения:${NC}"
    echo -e "${YELLOW}   - TELEGRAM_BOT_TOKEN${NC}"
    echo -e "${YELLOW}   - TELEGRAM_CHAT_ID${NC}"
else
    echo -e "${RED}❌ Отправка данных не работает${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo "💡 Для тестирования на production:"
echo "   ./test-api-contact.sh https://zol-dub.online"
echo ""

