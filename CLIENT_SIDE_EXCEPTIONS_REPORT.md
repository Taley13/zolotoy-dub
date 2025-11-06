# 🐛 Отчет: Потенциальные Client-Side Exceptions

**Дата анализа:** 2025-11-06  
**Анализируемый проект:** Золотой Дуб (Next.js 14)

---

## 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. ❌ localStorage без SSR-проверки

**Файлы с проблемой:**
- `app/components/KitchenCalculator.tsx` (строки 101, 124)
- `app/components/CalculationModal.tsx` (строка 36)
- `app/components/ModernHero.tsx` (строка 113)

**Проблема:**
```typescript
// ❌ ПЛОХО - вызовет ReferenceError при SSR
const activationTime = localStorage.getItem('discount_activation');
```

**Ошибка при SSR:**
```
ReferenceError: localStorage is not defined
```

**Решение:**
```typescript
// ✅ ХОРОШО - безопасно для SSR
useEffect(() => {
  if (typeof window !== 'undefined') {
    const activationTime = localStorage.getItem('discount_activation');
    // ... остальной код
  }
}, []);
```

**Локации:**

#### KitchenCalculator.tsx (строка 99-132)
```typescript
useEffect(() => {
  const checkDiscount = () => {
    // ❌ localStorage без проверки
    const activationTime = localStorage.getItem('discount_activation');
    // ...
    localStorage.removeItem('discount_activation'); // ❌
  };
  // ...
}, []);
```

#### CalculationModal.tsx (строка 33-60)
```typescript
useEffect(() => {
  if (!isOpen) return;
  
  // ❌ localStorage без проверки
  const activationTime = localStorage.getItem('discount_activation');
  // ...
}, [isOpen]);
```

#### ModernHero.tsx (строка 111-113)
```typescript
// ❌ localStorage без проверки внутри onClick
localStorage.setItem('discount_activation', activationTime.toString());
```

---

### 2. ❌ document/window без проверки в event handlers

**Файл:** `app/components/ModernHero.tsx` (строки 116-118)

**Проблема:**
```typescript
// ❌ document используется в onClick без проверки
const calculator = document.getElementById('calculator');
if (calculator) {
  calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

**Хотя код в onClick (клиентский), лучше добавить проверку:**
```typescript
// ✅ ХОРОШО
if (typeof window !== 'undefined') {
  const calculator = document.getElementById('calculator');
  calculator?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

---

### 3. ⚠️ useEffect с зависимостью от нестабильной функции

**Файл:** `app/admin/telegram-webhook/page.tsx` (строки 23-38)

**Проблема:**
```typescript
// ❌ loadWebhookInfo не обернута в useCallback
const loadWebhookInfo = async () => {
  try {
    const response = await fetch('/api/telegram/webhook-info');
    const data = await response.json();
    if (data.ok) {
      setWebhookInfo(data.result);
    }
  } catch (error) {
    console.error('Ошибка загрузки info:', error);
  }
};

useEffect(() => {
  setWebhookUrl(defaultWebhookUrl);
  loadWebhookInfo(); // ❌ Может вызвать бесконечный цикл
}, [defaultWebhookUrl, loadWebhookInfo]); // ❌ loadWebhookInfo меняется каждый рендер
```

**Решение:**
```typescript
// ✅ ХОРОШО - оборачиваем в useCallback
const loadWebhookInfo = useCallback(async () => {
  try {
    const response = await fetch('/api/telegram/webhook-info');
    const data = await response.json();
    if (data.ok) {
      setWebhookInfo(data.result);
    }
  } catch (error) {
    console.error('Ошибка загрузки info:', error);
  }
}, []); // Пустой массив зависимостей

useEffect(() => {
  setWebhookUrl(defaultWebhookUrl);
  loadWebhookInfo();
}, [defaultWebhookUrl, loadWebhookInfo]);
```

---

### 4. ⚠️ Stale closure в useEffect

**Файл:** `app/components/KitchenCalculator.tsx` (строки 134-145)

**Проблема:**
```typescript
// ❌ calculatePrice вызывается, но не в зависимостях
useEffect(() => {
  const newPrice = calculatePrice(); // Использует старые значения
  setCalculatorState({
    configuration: configuration,
    facade: facade,
    hardware: fittings,
    countertop: countertop,
    length: length,
    calculatedPrice: newPrice
  });
}, [configuration, facade, fittings, countertop, length, discountActive]);
// ❌ calculatePrice не в зависимостях, но использует все эти переменные
```

**Решение 1 - Добавить в зависимости:**
```typescript
// ✅ Добавить calculatePrice в useCallback
const calculatePrice = useCallback((): number => {
  // ... логика расчета
}, [configuration, facade, fittings, countertop, length, discountActive]);

useEffect(() => {
  const newPrice = calculatePrice();
  // ...
}, [calculatePrice, configuration, facade, fittings, countertop, length]);
```

**Решение 2 - Вычислить внутри useEffect:**
```typescript
// ✅ Просто вызвать без зависимости
useEffect(() => {
  const newPrice = calculatePrice();
  setCalculatorState({
    configuration,
    facade,
    hardware: fittings,
    countertop,
    length,
    calculatedPrice: newPrice
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [configuration, facade, fittings, countertop, length, discountActive]);
```

---

## 🟡 ПРЕДУПРЕЖДЕНИЯ (WARNINGS)

### 5. ⚠️ IntersectionObserver без проверки поддержки

**Файл:** `app/components/InteractiveShowcase.tsx` (строки 243-245)

**Проблема:**
```typescript
// ⚠️ IntersectionObserver может не поддерживаться в старых браузерах
const observer = new IntersectionObserver(/* ... */);
const cards = document.querySelectorAll('[data-card-id]');
cards.forEach(card => observer.observe(card));
```

**Решение:**
```typescript
// ✅ Проверка поддержки
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(/* ... */);
  const cards = document.querySelectorAll('[data-card-id]');
  cards.forEach(card => observer.observe(card));
}
```

---

### 6. ⚠️ Canvas API без проверки поддержки

**Файлы:**
- `app/components/ModernHero.tsx` (строка 12)
- `app/components/ParallaxHero.tsx` (строка 12)

**Проблема:**
```typescript
const ctx = canvas.getContext('2d');
if (!ctx) return; // ✅ Есть проверка, но можно улучшить

// Далее используется без повторной проверки
ctx.clearRect(0, 0, canvas.width, canvas.height); // Может быть null
```

**Текущий код безопасен, но можно добавить TypeScript guard:**
```typescript
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.warn('Canvas 2D context not supported');
  return;
}
// TypeScript теперь знает, что ctx не null
```

---

### 7. ⚠️ window.addEventListener без проверки

**Файлы:**
- `app/components/ModernHero.tsx` (строка 21)
- `app/components/ParallaxHero.tsx` (строки 31, 61)
- `app/components/InteractiveShowcase.tsx` (строка 219)

**Проблема:**
```typescript
// В useEffect, но без явной проверки
window.addEventListener('resize', resizeCanvas);
```

**Это НЕ критично, т.к. код в useEffect (выполняется только на клиенте),**
**но для консистентности можно добавить:**

```typescript
// ✅ Более явно
useEffect(() => {
  if (typeof window === 'undefined') return;
  
  const handleResize = () => {
    // ...
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## 🟢 ХОРОШИЕ ПРАКТИКИ (уже реализованы)

### ✅ 1. Правильная очистка в useEffect

**ScrollReveal.tsx:**
```typescript
useEffect(() => {
  const element = ref.current;
  if (!element) return;

  const observer = new IntersectionObserver(/* ... */);
  observer.observe(element);
  
  return () => observer.disconnect(); // ✅ Правильная очистка
}, []);
```

### ✅ 2. SSR-безопасная инициализация

**telegram-webhook/page.tsx:**
```typescript
const defaultWebhookUrl = typeof window !== 'undefined' 
  ? `${window.location.origin}/api/telegram`
  : 'https://zol-dub.online/api/telegram';
// ✅ Правильно проверяет window
```

### ✅ 3. Проверка элемента перед использованием

**ModernHero.tsx:**
```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return; // ✅ Проверка ref
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // ✅ Проверка context
  // ...
}, []);
```

---

## 📋 ПРИОРИТИЗАЦИЯ ИСПРАВЛЕНИЙ

### 🔴 Высокий приоритет (исправить немедленно)

1. **localStorage в KitchenCalculator.tsx** - может сломать SSR
2. **localStorage в CalculationModal.tsx** - может сломать SSR
3. **useEffect infinite loop в telegram-webhook** - может зависнуть страница

### 🟡 Средний приоритет (исправить скоро)

4. **Stale closure в KitchenCalculator** - может показывать неверные цены
5. **IntersectionObserver без проверки** - может не работать в старых браузерах

### 🟢 Низкий приоритет (опционально)

6. **Явные проверки window в useEffect** - больше для консистентности

---

## 🛠️ ПЛАН ИСПРАВЛЕНИЯ

### Шаг 1: Исправить localStorage (критично)

**Создать утилиту для безопасной работы с localStorage:**

```typescript
// lib/safeStorage.ts
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage.getItem error:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('localStorage.setItem error:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage.removeItem error:', error);
    }
  }
};
```

### Шаг 2: Обернуть асинхронные функции в useCallback

```typescript
// В telegram-webhook/page.tsx
import { useCallback } from 'react';

const loadWebhookInfo = useCallback(async () => {
  try {
    const response = await fetch('/api/telegram/webhook-info');
    const data = await response.json();
    if (data.ok) {
      setWebhookInfo(data.result);
    }
  } catch (error) {
    console.error('Ошибка загрузки info:', error);
  }
}, []);
```

### Шаг 3: Исправить stale closures

```typescript
// В KitchenCalculator.tsx
const calculatePrice = useCallback((): number => {
  // ... логика
}, [configuration, facade, fittings, countertop, length, discountActive]);
```

---

## 📊 СТАТИСТИКА

| Категория | Количество |
|-----------|------------|
| 🔴 Критические ошибки | 3 |
| 🟡 Предупреждения | 4 |
| 🟢 Хорошие практики | 3 |
| **Всего проблем** | **7** |

---

## 🎯 РЕКОМЕНДАЦИИ

1. **Добавить ESLint правила:**
   - `react-hooks/exhaustive-deps` (уже есть, но нужно убрать eslint-disable)
   - Создать кастомное правило для проверки window/localStorage

2. **Создать utility хуки:**
   - `useLocalStorage` - безопасная работа с localStorage
   - `useSafeWindow` - безопасная работа с window API

3. **Добавить E2E тесты:**
   - Тест SSR рендеринга
   - Тест hydration
   - Тест работы с localStorage

4. **Error Boundary:**
   - Добавить глобальный Error Boundary для отлова runtime ошибок
   - Логировать ошибки в Sentry/LogRocket

---

## 🔍 КАК ПРОВЕРИТЬ

### Проверка SSR ошибок:
```bash
npm run build
npm run start
# Открыть DevTools → Console
# Искать ошибки ReferenceError
```

### Проверка hydration:
```bash
# В DevTools → Console включить "Preserve log"
# Перезагрузить страницу
# Искать предупреждения о hydration mismatch
```

### Проверка бесконечных циклов:
```bash
# В DevTools → Performance
# Записать профиль во время работы с компонентом
# Искать повторяющиеся ре-рендеры
```

---

**Итого:** Найдено **7 потенциальных проблем**, из них **3 критических**.  
Рекомендуется исправить критические проблемы в первую очередь.

