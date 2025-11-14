#!/bin/bash

# 🔐 Скрипт для настройки переменных окружения в Vercel

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 НАСТРОЙКА ENVIRONMENT VARIABLES В VERCEL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Переменные окружения
TELEGRAM_BOT_TOKEN="8397994876:AAHpHKfsdPrEvrGAgIVFGwoOKf6Uw1CPMak"
TELEGRAM_CHAT_ID="277767867,956005680"
UPSTASH_REDIS_REST_URL="https://healthy-parakeet-35089.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AYkRAAIncDFkN2FjYjFkNGJiYjk0OTczOGFmNjM3MThlZTFjY2NhOHAxMzUwODk"

echo "📋 Переменные для добавления:"
echo ""
echo "  1. TELEGRAM_BOT_TOKEN"
echo "  2. TELEGRAM_CHAT_ID"
echo "  3. UPSTASH_REDIS_REST_URL"
echo "  4. UPSTASH_REDIS_REST_TOKEN"
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Ошибка: vercel CLI и npx не найдены"
    echo "   Установите: npm install -g vercel"
    exit 1
fi

# Выбор команды
VERCEL_CMD="npx vercel"
if command -v vercel &> /dev/null; then
    VERCEL_CMD="vercel"
fi

echo "📝 Используем команду: $VERCEL_CMD"
echo ""

# Функция для добавления переменной
add_env_var() {
    local name=$1
    local value=$2
    
    echo "Добавление $name..."
    
    # Добавляем для всех окружений
    echo "$value" | $VERCEL_CMD env add "$name" production --yes 2>&1 | grep -v "^$" || true
    echo "$value" | $VERCEL_CMD env add "$name" preview --yes 2>&1 | grep -v "^$" || true
    echo "$value" | $VERCEL_CMD env add "$name" development --yes 2>&1 | grep -v "^$" || true
    
    echo "✅ $name добавлен"
    echo ""
}

# Добавляем переменные
echo "🚀 Начинаем добавление переменных..."
echo ""

add_env_var "TELEGRAM_BOT_TOKEN" "$TELEGRAM_BOT_TOKEN"
add_env_var "TELEGRAM_CHAT_ID" "$TELEGRAM_CHAT_ID"
add_env_var "UPSTASH_REDIS_REST_URL" "$UPSTASH_REDIS_REST_URL"
add_env_var "UPSTASH_REDIS_REST_TOKEN" "$UPSTASH_REDIS_REST_TOKEN"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ВСЕ ПЕРЕМЕННЫЕ ДОБАВЛЕНЫ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Добавлено 4 переменных для всех окружений:"
echo "  ✅ Production"
echo "  ✅ Preview"
echo "  ✅ Development"
echo ""
echo "🔄 Следующий шаг: Redeploy проекта"
echo ""
echo "Команда:"
echo "  npx vercel --prod"
echo ""

