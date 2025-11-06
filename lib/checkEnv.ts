/**
 * 🔐 Утилита для проверки переменных окружения
 * 
 * Проверяет наличие и корректность всех необходимых переменных
 */

export interface EnvCheckResult {
  isValid: boolean;
  missing: string[];
  invalid: string[];
  warnings: string[];
  details: Record<string, {
    present: boolean;
    valid: boolean;
    message?: string;
  }>;
}

/**
 * Проверяет все необходимые переменные окружения
 */
export function checkEnvironmentVariables(): EnvCheckResult {
  const result: EnvCheckResult = {
    isValid: true,
    missing: [],
    invalid: [],
    warnings: [],
    details: {}
  };

  // Проверка TELEGRAM_BOT_TOKEN
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    result.missing.push('TELEGRAM_BOT_TOKEN');
    result.isValid = false;
    result.details.TELEGRAM_BOT_TOKEN = {
      present: false,
      valid: false,
      message: 'Не установлен'
    };
  } else if (!/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) {
    result.invalid.push('TELEGRAM_BOT_TOKEN');
    result.isValid = false;
    result.details.TELEGRAM_BOT_TOKEN = {
      present: true,
      valid: false,
      message: 'Неверный формат. Ожидается: 1234567890:ABCdefGHI...'
    };
  } else {
    result.details.TELEGRAM_BOT_TOKEN = {
      present: true,
      valid: true,
      message: `Установлен (${botToken.split(':')[0]}:***)`
    };
  }

  // Проверка TELEGRAM_CHAT_ID
  const chatIds = process.env.TELEGRAM_CHAT_ID;
  if (!chatIds) {
    result.missing.push('TELEGRAM_CHAT_ID');
    result.isValid = false;
    result.details.TELEGRAM_CHAT_ID = {
      present: false,
      valid: false,
      message: 'Не установлен'
    };
  } else {
    const ids = chatIds.split(',').map(id => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      result.invalid.push('TELEGRAM_CHAT_ID');
      result.isValid = false;
      result.details.TELEGRAM_CHAT_ID = {
        present: true,
        valid: false,
        message: 'Пустое значение'
      };
    } else if (ids.some(id => !/^-?\d+$/.test(id))) {
      result.invalid.push('TELEGRAM_CHAT_ID');
      result.isValid = false;
      result.details.TELEGRAM_CHAT_ID = {
        present: true,
        valid: false,
        message: 'Содержит некорректные ID (должны быть числа)'
      };
    } else {
      result.details.TELEGRAM_CHAT_ID = {
        present: true,
        valid: true,
        message: `Установлены ${ids.length} получателя(ей)`
      };
    }
  }

  // Проверка UPSTASH_REDIS_REST_URL
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  if (!redisUrl) {
    result.warnings.push('UPSTASH_REDIS_REST_URL не установлен (опционально для базовой работы)');
    result.details.UPSTASH_REDIS_REST_URL = {
      present: false,
      valid: false,
      message: 'Не установлен (опционально)'
    };
  } else if (!redisUrl.startsWith('https://')) {
    result.invalid.push('UPSTASH_REDIS_REST_URL');
    result.details.UPSTASH_REDIS_REST_URL = {
      present: true,
      valid: false,
      message: 'Должен начинаться с https://'
    };
  } else {
    result.details.UPSTASH_REDIS_REST_URL = {
      present: true,
      valid: true,
      message: 'Установлен корректно'
    };
  }

  // Проверка UPSTASH_REDIS_REST_TOKEN
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisToken) {
    result.warnings.push('UPSTASH_REDIS_REST_TOKEN не установлен (опционально для базовой работы)');
    result.details.UPSTASH_REDIS_REST_TOKEN = {
      present: false,
      valid: false,
      message: 'Не установлен (опционально)'
    };
  } else {
    result.details.UPSTASH_REDIS_REST_TOKEN = {
      present: true,
      valid: true,
      message: `Установлен (${redisToken.substring(0, 10)}...)`
    };
  }

  return result;
}

/**
 * Форматирует результат проверки для вывода в консоль
 */
export function formatEnvCheckResult(result: EnvCheckResult): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('🔐 ПРОВЕРКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');
  
  // Статус
  if (result.isValid) {
    lines.push('✅ Статус: ВСЕ ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ НАСТРОЕНЫ');
  } else {
    lines.push('❌ Статус: ЕСТЬ ПРОБЛЕМЫ');
  }
  lines.push('');
  
  // Детали по каждой переменной
  lines.push('Детали:');
  for (const [name, details] of Object.entries(result.details)) {
    const icon = details.valid ? '✅' : '❌';
    lines.push(`  ${icon} ${name}`);
    lines.push(`     ${details.message}`);
  }
  
  // Отсутствующие
  if (result.missing.length > 0) {
    lines.push('');
    lines.push('❌ Отсутствуют:');
    result.missing.forEach(v => lines.push(`   - ${v}`));
  }
  
  // Некорректные
  if (result.invalid.length > 0) {
    lines.push('');
    lines.push('❌ Некорректные:');
    result.invalid.forEach(v => lines.push(`   - ${v}`));
  }
  
  // Предупреждения
  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('⚠️  Предупреждения:');
    result.warnings.forEach(w => lines.push(`   - ${w}`));
  }
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Проверяет и выводит результат в консоль
 */
export function checkAndLogEnvironment(): EnvCheckResult {
  const result = checkEnvironmentVariables();
  const formatted = formatEnvCheckResult(result);
  
  if (result.isValid) {
    console.log(formatted);
  } else {
    console.error(formatted);
  }
  
  return result;
}

