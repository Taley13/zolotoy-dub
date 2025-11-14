#!/bin/bash

# 🚀 FTP Upload Script для ispmanager
# 
# ИСПОЛЬЗОВАНИЕ:
# ./ftp-upload.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 FTP UPLOAD: Золотой Дуб → ispmanager"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Проверка наличия lftp
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp не установлен"
    echo ""
    echo "Установите lftp:"
    echo "  macOS: brew install lftp"
    echo "  Linux: sudo apt-get install lftp"
    echo ""
    exit 1
fi

# FTP credentials (НАСТРОЙТЕ ЗДЕСЬ!)
read -p "FTP Host (например: ftp.your-domain.com): " FTP_HOST
read -p "FTP Username: " FTP_USER
read -sp "FTP Password: " FTP_PASS
echo ""
read -p "FTP Path (например: public_html/): " FTP_PATH

echo ""
echo "📋 Настройки:"
echo "  Host: $FTP_HOST"
echo "  User: $FTP_USER"
echo "  Path: $FTP_PATH"
echo ""
read -p "Продолжить? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Отменено"
    exit 1
fi

# Проверка что папка out/ существует
if [ ! -d "out" ]; then
    echo "❌ Папка out/ не найдена"
    echo "   Сначала выполните: npm run build"
    exit 1
fi

echo ""
echo "📤 Загрузка файлов на FTP..."
echo ""

# Загрузка через lftp
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" << EOF
set ssl:verify-certificate no
set ftp:ssl-allow no
cd $FTP_PATH

# Создаем backup (опционально)
!echo "Создание backup_old..."
mkdir -f backup_old
mrm backup_old/*
mput -d -a ./* backup_old/

# Удаляем старые файлы (кроме backup_old)
!echo "Очистка public_html..."
mrm -r *
!mkdir -p backup_old

# Загружаем новые файлы
!echo "Загрузка новых файлов..."
lcd out
mirror -R --parallel=4 --verbose ./ ./

!echo "✅ Загрузка завершена!"
bye
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ЗАГРУЗКА ЗАВЕРШЕНА!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Проверьте сайт: https://$FTP_HOST"
echo ""
echo "📋 Не забудьте:"
echo "  1. Загрузить contact-php-fallback.php → api/contact.php"
echo "  2. Настроить токены в contact.php"
echo "  3. Проверить права: chmod 644 api/contact.php"
echo ""

