# 🚀 Деплой Next.js на ispmanager

## 🎯 ВАЖНО: Два варианта деплоя

### ⚙️ Проверка возможностей хостинга

**Вопрос 1:** Есть ли на хостинге Node.js?
```bash
# Войдите по SSH и выполните:
node -v
npm -v
```

**Если есть вывод версий** → Вариант A (Full Next.js)  
**Если "command not found"** → Вариант B (Static Export)

---

## 🅰️ ВАРИАНТ A: Full Next.js (с Node.js)

### Шаг 1: Подготовка проекта

```bash
cd ~/Desktop/zdub/zolotoy-dub

# Установить зависимости
npm install

# Собрать production билд
npm run build

# Проверить что билд успешен
ls -la .next
```

### Шаг 2: Создать ecosystem.config.js для PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'zolotoy-dub',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/path/to/your/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Шаг 3: Загрузка на сервер

**Файлы для загрузки:**
```
.next/              # Собранное приложение
node_modules/       # Зависимости
public/             # Статические файлы
package.json        # Манифест проекта
package-lock.json   # Lock файл
next.config.js      # Конфигурация Next.js
ecosystem.config.js # Конфигурация PM2
```

**Через FTP/SFTP:**
1. Подключиться к хостингу
2. Загрузить все файлы в `/home/user/domains/your-domain.com/`
3. Сохранить права 755 на папки, 644 на файлы

### Шаг 4: Настройка на сервере

```bash
# SSH в сервер
ssh user@your-server.com

# Перейти в директорию
cd /home/user/domains/your-domain.com/

# Запустить с PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Шаг 5: Настройка Nginx/Apache Proxy

**Для Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>

# Включить прокси модули
<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</IfModule>
```

**Для Nginx (в конфиг сайта):**
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 🅱️ ВАРИАНТ B: Static Export (без Node.js)

### ⚠️ Ограничения Static Export:
- ❌ Не работают API Routes (`/api/*`)
- ❌ Не работает Server-Side Rendering (SSR)
- ❌ Не работает ISR (Incremental Static Regeneration)
- ✅ Работают только статические страницы

### Шаг 1: Настроить next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

### Шаг 2: Удалить API routes

```bash
# Переместить API routes (они не работают в static export)
mkdir -p backup/api
mv app/api backup/api/
mv app/contacts/actions.ts backup/
```

### Шаг 3: Обновить компоненты

Заменить все использования API:
- ContactForm → отправка на внешний API или PHP скрипт
- Server Actions → клиентские запросы

### Шаг 4: Собрать статику

```bash
cd ~/Desktop/zdub/zolotoy-dub

# Собрать статический export
npm run build

# Результат будет в папке out/
ls -la out/
```

### Шаг 5: Загрузка через FTP

**Загрузить папку `out/` на хостинг:**
```
out/
├── index.html
├── catalog.html
├── contacts.html
├── _next/
│   ├── static/
│   └── ...
└── images/
```

**Путь на хостинге:**
```
/home/user/domains/your-domain.com/public_html/
```

### Шаг 6: .htaccess для статики

```apache
# .htaccess для статического Next.js экспорта

# Включить rewrite
RewriteEngine On

# HTTPS redirect (опционально)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Удалить trailing slash (если не используете trailingSlash: true)
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule ^(.*)/$ /$1 [R=301,L]

# HTML расширения
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# Кеширование статических файлов
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  
  # CSS/JS
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## 📦 ПОШАГОВАЯ ИНСТРУКЦИЯ (Static Export)

### 1️⃣ Создать бэкап

```bash
# На вашем компьютере
cd ~/Desktop/zdub
tar -czf zolotoy-dub-backup-$(date +%Y%m%d).tar.gz zolotoy-dub/

# На сервере (через SSH или File Manager)
# Скачать текущие файлы с хостинга
```

### 2️⃣ Подготовить проект

```bash
cd ~/Desktop/zdub/zolotoy-dub

# Обновить next.config.js для static export
# (добавить output: 'export')

# Собрать
npm run build
```

### 3️⃣ Проверить результат

```bash
# Проверить что папка out/ создана
ls -la out/

# Проверить размер
du -sh out/
```

### 4️⃣ Загрузить через FTP

**FileZilla или другой FTP клиент:**
1. Подключиться к хостингу
2. Перейти в `public_html/`
3. Создать папку `backup_old/`
4. Переместить старые файлы в `backup_old/`
5. Загрузить содержимое папки `out/` в `public_html/`

### 5️⃣ Создать .htaccess

В `public_html/.htaccess` вставить конфиг из шага 6 выше

### 6️⃣ Настроить переменные окружения

**⚠️ ВАЖНО:** В static export нет серверной части!

**Решения:**
1. Использовать клиентские API ключи (публичные)
2. Создать отдельный PHP скрипт для контактной формы
3. Использовать внешний API (Formspree, EmailJS и т.д.)

---

## 🔧 PHP скрипт для контактной формы (если static export)

```php
<?php
// contact.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = htmlspecialchars($data['name']);
    $phone = htmlspecialchars($data['phone']);
    $email = htmlspecialchars($data['email']);
    $message = htmlspecialchars($data['message']);
    
    // Отправка в Telegram
    $botToken = 'YOUR_BOT_TOKEN';
    $chatId = 'YOUR_CHAT_ID';
    
    $text = "📩 Новая заявка с сайта\n\n";
    $text .= "Имя: $name\n";
    $text .= "Телефон: $phone\n";
    $text .= "Email: $email\n";
    $text .= "Сообщение: $message\n";
    
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'chat_id' => $chatId,
        'text' => $text
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    echo json_encode(['success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
```

---

## ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ

### Перед деплоем:
- [ ] Создан бэкап текущего сайта
- [ ] Собран production билд
- [ ] Проверен размер файлов
- [ ] Проверены переменные окружения
- [ ] Подготовлен .htaccess

### После деплоя:
- [ ] Сайт открывается
- [ ] Все страницы работают
- [ ] Картинки загружаются
- [ ] Формы отправляются
- [ ] Нет 404 ошибок в console
- [ ] Работает на мобильных

---

## 🆘 ПРОБЛЕМЫ И РЕШЕНИЯ

### "500 Internal Server Error"
→ Проверить синтаксис .htaccess  
→ Проверить права на файлы (644/755)

### "404 Not Found"
→ Проверить trailingSlash настройку  
→ Проверить RewriteBase в .htaccess

### "Картинки не загружаются"
→ Проверить пути к файлам  
→ Проверить images.unoptimized = true

### "API не работает"
→ API routes не работают в static export  
→ Использовать PHP скрипт или внешний API

---

## 📞 НУЖНА ПОМОЩЬ?

Сообщите мне:
1. Есть ли Node.js на хостинге?
2. Какая версия ispmanager?
3. Какие ошибки появляются?

Я помогу с конкретным решением! 🚀

