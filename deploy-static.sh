#!/bin/bash

# 🚀 Скрипт для деплоя статической версии Next.js на ispmanager

set -e  # Остановить при ошибке

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYMENT SCRIPT: Золотой Дуб → ispmanager"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Проверка что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден"
    echo "   Запустите скрипт из корня проекта"
    exit 1
fi

# Шаг 1: Создать бэкап
echo "📦 Шаг 1/6: Создание бэкапа..."
BACKUP_NAME="zolotoy-dub-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "../$BACKUP_NAME" .
echo "✅ Бэкап создан: ../$BACKUP_NAME"
echo ""

# Шаг 2: Установить зависимости
echo "📚 Шаг 2/6: Установка зависимостей..."
npm install
echo "✅ Зависимости установлены"
echo ""

# Шаг 3: Проверить next.config.js
echo "⚙️  Шаг 3/6: Проверка конфигурации..."
if grep -q "output: 'export'" next.config.js; then
    echo "✅ next.config.js настроен для static export"
else
    echo "⚠️  ВНИМАНИЕ: next.config.js не настроен для static export"
    echo "   Добавьте в next.config.js:"
    echo "   output: 'export',"
    echo "   images: { unoptimized: true },"
    echo ""
    read -p "Продолжить? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Шаг 4: Собрать проект
echo "🔨 Шаг 4/6: Сборка проекта..."
npm run build
echo "✅ Проект собран"
echo ""

# Шаг 5: Проверить результат
echo "🔍 Шаг 5/6: Проверка результата..."
if [ -d "out" ]; then
    SIZE=$(du -sh out | cut -f1)
    FILES=$(find out -type f | wc -l | tr -d ' ')
    echo "✅ Папка out/ создана"
    echo "   Размер: $SIZE"
    echo "   Файлов: $FILES"
else
    echo "❌ Ошибка: папка out/ не создана"
    echo "   Проверьте ошибки сборки"
    exit 1
fi
echo ""

# Шаг 6: Создать архив для загрузки
echo "📦 Шаг 6/6: Создание архива для загрузки..."
DEPLOY_NAME="zolotoy-dub-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
cd out
tar -czf "../../$DEPLOY_NAME" .
cd ..
echo "✅ Архив создан: ../$DEPLOY_NAME"
echo ""

# Создать .htaccess
echo "📝 Создание .htaccess..."
cat > out/.htaccess << 'EOF'
# .htaccess для Next.js Static Export

RewriteEngine On

# HTTPS redirect (раскомментируйте если нужен)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# HTML расширения
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# Кеширование
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Security
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
EOF
echo "✅ .htaccess создан"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ГОТОВО К ЗАГРУЗКЕ!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Файлы готовы:"
echo "   1. Бэкап: ../$BACKUP_NAME"
echo "   2. Деплой: ../$DEPLOY_NAME"
echo ""
echo "📤 СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1. Зайдите в ispmanager File Manager"
echo "2. Перейдите в public_html/"
echo "3. Создайте папку backup_old/"
echo "4. Переместите старые файлы в backup_old/"
echo "5. Загрузите архив ../$DEPLOY_NAME"
echo "6. Распакуйте архив в public_html/"
echo "7. Проверьте что .htaccess на месте"
echo ""
echo "🌐 Или через FTP:"
echo "   - Загрузите содержимое папки out/ в public_html/"
echo ""
echo "✅ Готово! Проверьте сайт после загрузки."
echo ""

