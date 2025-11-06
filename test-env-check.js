#!/usr/bin/env node

/**
 * 🧪 Скрипт для проверки переменных окружения и API endpoints
 * 
 * Использование:
 *   node test-env-check.js
 *   node test-env-check.js --remote https://your-domain.vercel.app
 */

const https = require('https');
const http = require('http');

const args = process.argv.slice(2);
const isRemote = args.includes('--remote');
const remoteUrl = isRemote ? args[args.indexOf('--remote') + 1] : 'http://localhost:3000';

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 ПРОВЕРКА СИСТЕМЫ');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Режим: ${isRemote ? 'УДАЛЕННЫЙ' : 'ЛОКАЛЬНЫЙ'}`);
console.log(`URL: ${remoteUrl}`);
console.log('');

// Функция для HTTP запросов
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Проверка локальных переменных окружения
if (!isRemote) {
  console.log('📋 ЛОКАЛЬНЫЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ:');
  console.log('');
  
  const vars = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN'
  ];
  
  vars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const displayValue = varName.includes('TOKEN') 
        ? value.substring(0, 10) + '...' 
        : value;
      console.log(`✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`❌ ${varName}: НЕ УСТАНОВЛЕН`);
    }
  });
  
  console.log('');
}

// Проверка endpoints
async function checkEndpoints() {
  console.log('🔍 ПРОВЕРКА ENDPOINTS:');
  console.log('');
  
  const endpoints = [
    { name: 'Health Check', path: '/api/health' },
    { name: 'Contact API', path: '/api/contact' },
    { name: 'Telegram Webhook', path: '/api/telegram' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `${remoteUrl}${endpoint.path}`;
      console.log(`Проверка: ${endpoint.name}`);
      console.log(`URL: ${url}`);
      
      const response = await makeRequest(url);
      
      if (response.status === 200) {
        console.log(`✅ Статус: ${response.status} OK`);
        if (endpoint.path === '/api/health' && typeof response.data === 'object') {
          console.log(`   Статус системы: ${response.data.status || 'unknown'}`);
          if (response.data.checks?.environmentVariables) {
            const envCheck = response.data.checks.environmentVariables;
            console.log(`   Переменные окружения: ${envCheck.status}`);
            if (envCheck.missing && envCheck.missing.length > 0) {
              console.log(`   ❌ Отсутствуют: ${envCheck.missing.join(', ')}`);
            }
            if (envCheck.invalid && envCheck.invalid.length > 0) {
              console.log(`   ❌ Некорректные: ${envCheck.invalid.join(', ')}`);
            }
          }
        }
      } else {
        console.log(`⚠️  Статус: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Ошибка: ${error.message}`);
    }
    console.log('');
  }
}

// Запуск проверок
checkEndpoints().then(() => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Проверка завершена');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  if (!isRemote) {
    console.log('💡 Для проверки удаленного сервера используйте:');
    console.log('   node test-env-check.js --remote https://your-domain.vercel.app');
    console.log('');
  }
}).catch((error) => {
  console.error('❌ Ошибка при проверке:', error);
  process.exit(1);
});

