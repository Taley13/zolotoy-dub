#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки отправки Telegram сообщений
 * 
 * Использование:
 *   node test-telegram.js
 */

require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_IDS_RAW = process.env.TELEGRAM_CHAT_ID;

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║       ТЕСТИРОВАНИЕ TELEGRAM ОТПРАВКИ (МНОЖЕСТВЕННЫЕ ЧАТЫ)         ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

// Проверка переменных окружения
console.log('📋 Проверка конфигурации:\n');

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не установлен в .env файле');
  process.exit(1);
}

if (!CHAT_IDS_RAW) {
  console.error('❌ TELEGRAM_CHAT_ID не установлен в .env файле');
  process.exit(1);
}

console.log(`✅ TELEGRAM_BOT_TOKEN: ${BOT_TOKEN.substring(0, 10)}...`);
console.log(`✅ TELEGRAM_CHAT_ID: ${CHAT_IDS_RAW}\n`);

// Разделяем chat_id
const chatIds = CHAT_IDS_RAW.split(',').map(id => id.trim()).filter(Boolean);

console.log(`📊 Найдено ${chatIds.length} получател${chatIds.length === 1 ? 'ь' : 'ей'}:\n`);
chatIds.forEach((id, index) => {
  console.log(`   ${index + 1}. Chat ID: ${id}`);
});

console.log('\n' + '─'.repeat(70) + '\n');

// Формируем тестовое сообщение
const testMessage = `
🧪 ТЕСТОВОЕ СООБЩЕНИЕ

Это тестовое сообщение от системы "Золотой Дуб"

✅ Если вы видите это сообщение, значит:
   • Telegram бот настроен правильно
   • Chat ID корректный
   • Отправка работает

⏰ Время отправки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

🔧 Это автоматическое тестовое сообщение
`.trim();

// Функция отправки
async function sendTestMessage(chatId, index) {
  try {
    console.log(`\n🔄 Попытка ${index + 1}/${chatIds.length}: Отправка в chat ${chatId}...`);
    
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage
        })
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error(`❌ Ошибка отправки в ${chatId}:`, data.description);
      return { chatId, success: false, error: data.description };
    }

    console.log(`✅ Успешно отправлено в ${chatId}`);
    console.log(`   Message ID: ${data.result.message_id}`);
    console.log(`   Chat: ${data.result.chat.type === 'private' ? 'личный' : 'группа'}`);
    
    return { chatId, success: true, messageId: data.result.message_id };
  } catch (error) {
    console.error(`❌ Ошибка сети для ${chatId}:`, error.message);
    return { chatId, success: false, error: error.message };
  }
}

// Главная функция
async function main() {
  console.log('🚀 Начинаем отправку тестовых сообщений...\n');
  
  const results = await Promise.allSettled(
    chatIds.map((chatId, index) => sendTestMessage(chatId, index))
  );

  console.log('\n' + '═'.repeat(70));
  console.log('📊 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:');
  console.log('═'.repeat(70) + '\n');

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;

  results.forEach((result, index) => {
    const chatId = chatIds[index];
    
    if (result.status === 'fulfilled') {
      const { success, error, messageId } = result.value;
      if (success) {
        console.log(`✅ Chat ${chatId}: Доставлено (message_id: ${messageId})`);
      } else {
        console.log(`❌ Chat ${chatId}: Ошибка - ${error}`);
      }
    } else {
      console.log(`❌ Chat ${chatId}: Promise rejected - ${result.reason}`);
    }
  });

  console.log('\n' + '─'.repeat(70));
  console.log(`\n📈 Статистика: ${successful} успешных, ${failed} неудачных из ${results.length} общих\n`);

  if (successful === results.length) {
    console.log('🎉 ВСЕ ОТПРАВКИ УСПЕШНЫ! Система работает корректно.\n');
  } else if (successful > 0) {
    console.log('⚠️  ЧАСТИЧНЫЙ УСПЕХ. Проверьте логи для деталей.\n');
  } else {
    console.log('❌ ВСЕ ОТПРАВКИ ПРОВАЛИЛИСЬ. Проверьте конфигурацию.\n');
  }

  console.log('═'.repeat(70) + '\n');
}

// Запускаем
main().catch(error => {
  console.error('\n💥 Критическая ошибка:', error);
  process.exit(1);
});

