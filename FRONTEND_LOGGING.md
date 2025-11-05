# 🔍 ДЕТАЛЬНОЕ ЛОГИРОВАНИЕ ФРОНТЕНДА И SERVER ACTIONS

## ✅ Что добавлено

Добавлено **полное логирование на всех этапах** отправки форм:
1. **Фронтенд (браузер)** - видно в консоли браузера (F12)
2. **Server Actions** - видно в логах Vercel/терминале
3. **Telegram отправка** - видно в логах Vercel

---

## 📁 Обновленные файлы

### 1. `/app/contacts/ContactForm.tsx`
Форма обратной связи на странице контактов

### 2. `/app/components/CalculationModal.tsx`
Модальное окно калькулятора с формой заявки

### 3. `/app/contacts/actions.ts`
Server Action для обработки форм (server-side)

---

## 🔍 Что логируется

### 📱 **ФРОНТЕНД (браузер - Console F12)**

#### ContactForm (форма обратной связи):
```javascript
═════════════════════════════════════════════════════════
📝 [ContactForm] FORM SUBMISSION STARTED
═════════════════════════════════════════════════════════
[ContactForm] Timestamp: 2025-11-05T15:30:00.123Z
[ContactForm] 📋 Form data extracted:
  - Name: Иван Петров
  - Phone: +7 930 123 45 67
  - Email: ivan@example.com
  - Message: "Интересует кухня угловая..."
  - Source: contact_form
[ContactForm] 🚀 Calling submitContactForm server action...
[ContactForm] ✅ Server action completed in 1234ms
[ContactForm] 📊 Response: { success: true }
[ContactForm] ✅ SUCCESS: Form submitted successfully
═════════════════════════════════════════════════════════
```

#### CalculationModal (калькулятор):
```javascript
═════════════════════════════════════════════════════════
🧮 [CalculationModal] CALCULATOR FORM SUBMISSION STARTED
═════════════════════════════════════════════════════════
[CalculationModal] Timestamp: 2025-11-05T15:30:00.123Z
[CalculationModal] 📋 Form data:
  - Name: Мария Иванова
  - Phone: +7 930 987 65 43
  - Email: maria@example.com
[CalculationModal] ⚙️ Kitchen params:
  - Configuration: Угловая
  - Facade: МДФ
  - Hardware: Премиум Blum
  - Countertop: Искусственный камень
  - Length: 6 m
  - Price: 498720 ₽
[CalculationModal] 🎁 Discount status: ACTIVE
[CalculationModal] ✅ Validation passed
[CalculationModal] 🔄 Preparing message...
[CalculationModal] ✅ Message prepared
[CalculationModal] 📄 Message preview (first 150 chars):
─────────────────────────────────────────────────
🏠 НОВАЯ ЗАЯВКА С СКИДКОЙ 15%

👤 КОНТАКТЫ:
• Имя: Мария Иванова
• Телефон: +7 930 987 65 43
• Email: maria@example.com

🎁 КЛИЕНТ А...
─────────────────────────────────────────────────
[CalculationModal] 🔄 Creating FormData...
[CalculationModal] ✅ FormData created
[CalculationModal] 📋 FormData contents:
  - name: Мария Иванова
  - phone: +7 930 987 65 43
  - email: maria@example.com
  - source: calculator
  - message length: 456 chars
[CalculationModal] 🚀 Calling submitContactForm server action...
[CalculationModal] ✅ Server action completed in 1567ms
[CalculationModal] 📊 Response: { success: true }
[CalculationModal] ✅ SUCCESS: Calculator form submitted successfully
═════════════════════════════════════════════════════════
```

---

### 🖥️ **SERVER-SIDE (Vercel логи)**

#### Server Action (submitContactForm):
```
╔═══════════════════════════════════════════════════════════╗
║         [SERVER ACTION] submitContactForm CALLED          ║
╚═══════════════════════════════════════════════════════════╝
[ServerAction] Timestamp: 2025-11-05T15:30:00.456Z
[ServerAction] Environment: production
[ServerAction] 🔄 Extracting form data...
[ServerAction] ✅ Form data extracted:
  - Name: "Иван Петров"
  - Phone: "+7 930 123 45 67"
  - Email: "ivan@example.com"
  - Message: "Интересует кухня угловая 6м с МДФ фасадами..."
  - Source: calculator
[ServerAction] 🔍 Validating...
[ServerAction] ✅ Validation passed
[ServerAction] 🚀 Calling sendContactFormToTelegram...
[ServerAction] ⏱️ sendContactFormToTelegram completed in 1234ms
[ServerAction] 📊 Result: {
  "success": true,
  "applicationId": "ZD-1699123456789-ABC123DEF"
}
[ServerAction] ✅ SUCCESS: Message sent to Telegram
[ServerAction]    Application ID: ZD-1699123456789-ABC123DEF
╚═══════════════════════════════════════════════════════════╝
```

#### Telegram отправка:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 [Telegram] START: Отправка новой заявки
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Telegram] 🆔 Generated application ID: ZD-1699123456789-ABC123DEF
[Telegram] 📋 Form data received:
  - Name: "Иван Петров"
  - Phone: "+7 930 123 45 67" ✓
  - Email: "ivan@example.com" ✓
  - Message: "Интересует кухня угловая 6м с МДФ фасадами..." ✓
  - Source: calculator
[Telegram] ✅ Validation passed
[Telegram] 🔑 Checking environment variables...
[Telegram] ✅ Environment OK: Bot token found, 2 chat ID(s) configured
[Telegram] 📍 Target chat IDs: 277767867, 956005680
... (остальные логи отправки)
```

---

## 🎯 Как использовать для диагностики

### Проблема: Заявки не отправляются

#### Шаг 1: Открыть консоль браузера (F12)
```
Windows/Linux: F12 или Ctrl+Shift+I
Mac: Cmd+Option+I
```

#### Шаг 2: Открыть вкладку Console

#### Шаг 3: Заполнить и отправить форму

#### Шаг 4: Анализировать логи

---

### ✅ **Сценарий 1: Все работает**

**В консоли браузера видно:**
```
📝 [ContactForm] FORM SUBMISSION STARTED
...
[ContactForm] 🚀 Calling submitContactForm server action...
[ContactForm] ✅ Server action completed in 1234ms
[ContactForm] ✅ SUCCESS: Form submitted successfully
```

**В логах Vercel видно:**
```
[SERVER ACTION] submitContactForm CALLED
...
[ServerAction] ✅ SUCCESS: Message sent to Telegram
[Telegram] ✅ SUCCESS! Message delivered to chat 277767867
```

→ **Диагноз:** Все работает корректно ✅

---

### ❌ **Сценарий 2: Форма не отправляется (нет логов в браузере)**

**Что видно:**
- Нет логов `[ContactForm] FORM SUBMISSION STARTED`
- Форма визуально не реагирует на нажатие кнопки

**Возможные причины:**
1. JavaScript ошибка на странице (проверьте консоль на красные ошибки)
2. Кнопка `disabled` из-за validation
3. Event listener не привязан

**Что проверить:**
```javascript
// В консоли браузера выполните:
console.log('Testing form submission');
// Затем нажмите кнопку отправки
```

→ **Диагноз:** Проблема на фронтенде ⚠️

---

### ❌ **Сценарий 3: Server Action не вызывается**

**Что видно в браузере:**
```
📝 [ContactForm] FORM SUBMISSION STARTED
[ContactForm] 🚀 Calling submitContactForm server action...
// ЗАВИСЛО - нет дальнейших логов
```

**В логах Vercel:**
- Нет логов `[SERVER ACTION] submitContactForm CALLED`

**Возможные причины:**
1. Сетевая ошибка (проверьте Network вкладку в DevTools)
2. Server Action не экспортирован правильно
3. Проблема с Next.js App Router

**Что проверить:**
- Откройте вкладку Network (F12 → Network)
- Найдите запрос к server action
- Проверьте статус ответа (должен быть 200 OK)

→ **Диагноз:** Проблема с Server Action или сетью ⚠️

---

### ❌ **Сценарий 4: Server Action вызван, но Telegram не получает**

**Что видно в браузере:**
```
[ContactForm] ✅ Server action completed in 1234ms
[ContactForm] 📊 Response: { success: false, error: "..." }
[ContactForm] ❌ FAILURE: Server returned error
```

**Что видно в Vercel:**
```
[SERVER ACTION] submitContactForm CALLED
[ServerAction] 🚀 Calling sendContactFormToTelegram...
[Telegram] ❌ API Error for chat 123456789:
[Telegram]    - Description: Bad Request: chat not found
```

**Возможные причины:**
1. Неверный TELEGRAM_CHAT_ID
2. Бот не добавлен в чат
3. Неверный токен бота

→ **Диагноз:** Проблема с конфигурацией Telegram ⚠️

---

### ❌ **Сценарий 5: JavaScript ошибка**

**Что видно в браузере:**
```
[ContactForm] FORM SUBMISSION STARTED
[ContactForm] 📋 Form data extracted:
  - Name: Иван Петров
  ...
❌ [ContactForm] EXCEPTION CAUGHT
[ContactForm] Error type: TypeError
[ContactForm] Error message: Cannot read property 'x' of undefined
[ContactForm] Stack trace: ...
```

**Действия:**
1. Скопировать stack trace
2. Найти строку кода где произошла ошибка
3. Исправить ошибку

→ **Диагноз:** Ошибка в коде фронтенда 🐛

---

## 📊 Полный flow логов (успешный сценарий)

### 1️⃣ Пользователь нажимает "Отправить"
```
БРАУЗЕР (Console):
═════════════════════════════════════════════════════════
📝 [ContactForm] FORM SUBMISSION STARTED
═════════════════════════════════════════════════════════
[ContactForm] Timestamp: 2025-11-05T15:30:00.123Z
[ContactForm] 📋 Form data extracted:
  - Name: Иван Петров
  - Phone: +7 930 123 45 67
  - Email: ivan@example.com
  - Message: "Интересует кухня..."
  - Source: contact_form
[ContactForm] 🚀 Calling submitContactForm server action...
```

### 2️⃣ Server Action получает запрос
```
VERCEL (Server Logs):
╔═══════════════════════════════════════════════════════════╗
║         [SERVER ACTION] submitContactForm CALLED          ║
╚═══════════════════════════════════════════════════════════╝
[ServerAction] Timestamp: 2025-11-05T15:30:00.456Z
[ServerAction] Environment: production
[ServerAction] 🔄 Extracting form data...
[ServerAction] ✅ Form data extracted:
  - Name: "Иван Петров"
  - Phone: "+7 930 123 45 67"
  - Email: "ivan@example.com"
  - Message: "Интересует кухня..."
  - Source: contact_form
[ServerAction] 🔍 Validating...
[ServerAction] ✅ Validation passed
[ServerAction] 🚀 Calling sendContactFormToTelegram...
```

### 3️⃣ Отправка в Telegram
```
VERCEL (Server Logs):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 [Telegram] START: Отправка новой заявки
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Telegram] 🆔 Generated application ID: ZD-1699123456789-ABC123DEF
[Telegram] 📋 Form data received:
  - Name: "Иван Петров"
  - Phone: "+7 930 123 45 67" ✓
  ...
[Telegram] ✅ Environment OK: Bot token found, 2 chat ID(s) configured
[Telegram] 📍 Target chat IDs: 277767867, 956005680
[Telegram] 📤 Starting delivery to 2 recipient(s)

╔════════════════════════════════════════════════════╗
║  SENDING TO CHAT: 277767867                        ║
╚════════════════════════════════════════════════════╝
[Telegram] 🔄 Step 1/5: Preparing message payload
...
[Telegram] ✅ SUCCESS! Message delivered to chat 277767867
[Telegram]    - Message ID: 12345
...
```

### 4️⃣ Server Action возвращает результат
```
VERCEL (Server Logs):
[ServerAction] ⏱️ sendContactFormToTelegram completed in 1234ms
[ServerAction] 📊 Result: {
  "success": true,
  "applicationId": "ZD-1699123456789-ABC123DEF"
}
[ServerAction] ✅ SUCCESS: Message sent to Telegram
[ServerAction]    Application ID: ZD-1699123456789-ABC123DEF
╚═══════════════════════════════════════════════════════════╝
```

### 5️⃣ Фронтенд получает ответ
```
БРАУЗЕР (Console):
[ContactForm] ✅ Server action completed in 1234ms
[ContactForm] 📊 Response: { success: true }
[ContactForm] ✅ SUCCESS: Form submitted successfully
═════════════════════════════════════════════════════════
```

---

## 🧪 Тестирование

### Локальное тестирование:

1. **Запустить dev-сервер:**
```bash
cd /Users/taley13/Desktop/zdub/zolotoy-dub
npm run dev
```

2. **Открыть сайт:**
```
http://localhost:3000
```

3. **Открыть консоль браузера:**
```
F12 → Console
```

4. **Перейти на страницу контактов:**
```
http://localhost:3000/contacts
```

5. **Заполнить и отправить форму**

6. **Смотреть логи:**
   - **В браузере:** Console (F12)
   - **В терминале:** Логи server actions и Telegram

---

### Тестирование на Vercel:

1. **Открыть Vercel Dashboard:**
```
https://vercel.com/your-project
```

2. **Перейти в Logs:**
```
Project → Logs → Runtime Logs
```

3. **На сайте отправить форму**

4. **В Vercel Logs искать:**
```
[SERVER ACTION] submitContactForm CALLED
[Telegram] START: Отправка новой заявки
```

5. **Если логов нет:**
   - Проверить браузерную консоль
   - Проверить Network вкладку
   - Убедиться что форма отправляется

---

## 🎯 Чек-лист диагностики

При проблемах с отправкой форм:

- [ ] **Шаг 1:** Открыл консоль браузера (F12)
- [ ] **Шаг 2:** Вижу `[ContactForm] FORM SUBMISSION STARTED`?
  - Если НЕТ → проблема на фронтенде
- [ ] **Шаг 3:** Вижу `[ContactForm] 🚀 Calling submitContactForm`?
  - Если НЕТ → проблема с валидацией формы
- [ ] **Шаг 4:** Вижу `[ContactForm] ✅ Server action completed`?
  - Если НЕТ → проблема с сетью или server action
- [ ] **Шаг 5:** В Vercel логах вижу `[SERVER ACTION] submitContactForm CALLED`?
  - Если НЕТ → server action не вызывается
- [ ] **Шаг 6:** В Vercel логах вижу `[Telegram] START: Отправка новой заявки`?
  - Если НЕТ → проблема в server action до вызова Telegram функции
- [ ] **Шаг 7:** В Vercel логах вижу `[Telegram] ✅ SUCCESS!`?
  - Если НЕТ → проблема с Telegram API

---

## 🎉 Итоги

### Что получили:
- ✅ **Полное логирование** всего flow от фронтенда до Telegram
- ✅ **Логи в браузере** для диагностики фронтенда
- ✅ **Логи на сервере** для диагностики server actions
- ✅ **Детальные сообщения** об ошибках на каждом этапе
- ✅ **Время выполнения** каждой операции
- ✅ **Структурированный вывод** с эмодзи для быстрой навигации

### Преимущества:
1. **Быстрая диагностика** - сразу видно где проблема
2. **Полная прозрачность** - каждый шаг залогирован
3. **Легко читать** - структурированный вывод
4. **Работает везде** - и локально и на Vercel

---

**Дата обновления:** 5 ноября 2025  
**Версия:** 1.0  
**Статус:** ✅ Готово к диагностике любых проблем с формами

