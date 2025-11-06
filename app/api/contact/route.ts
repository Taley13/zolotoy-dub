import { NextResponse } from 'next/server';

type ContactPayload = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
};

/**
 * GET handler для диагностики
 * Показывает что endpoint работает
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Contact API endpoint is working',
    methods: ['POST'],
    usage: 'Send POST request with { name, phone?, email?, message? }',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 [API /contact] NEW REQUEST RECEIVED');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`[API] Timestamp: ${new Date().toISOString()}`);
  console.log(`[API] Method: ${request.method}`);
  console.log(`[API] URL: ${request.url}`);
  console.log(`[API] Environment: ${process.env.NODE_ENV || 'unknown'}`);
  
  try {
    console.log('[API] 🔄 Step 1: Parsing request body...');
    const body = (await request.json()) as Partial<ContactPayload>;
    console.log('[API] ✅ Body parsed successfully');
    console.log('[API] 📋 Raw body data:', JSON.stringify(body, null, 2));
    
    console.log('[API] 🔄 Step 2: Extracting and sanitizing fields...');
    const name = (body.name || '').toString().trim();
    const phone = (body.phone || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const message = (body.message || '').toString().trim();
    
    console.log('[API] ✅ Fields extracted:');
    console.log(`  - Name: "${name}"`);
    console.log(`  - Phone: "${phone}" ${phone ? '✓' : '(empty)'}`);
    console.log(`  - Email: "${email}" ${email ? '✓' : '(empty)'}`);
    console.log(`  - Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}" ${message ? '✓' : '(empty)'}`);

    console.log('[API] 🔄 Step 3: Validating required fields...');
    if (!name) {
      console.error('[API] ❌ VALIDATION FAILED: Name is required');
      return NextResponse.json({ error: 'Укажите имя' }, { status: 400 });
    }
    console.log('[API] ✅ Validation passed');

    console.log('[API] 🔄 Step 4: Checking environment variables...');
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;
    
    // Детальная диагностика переменных окружения
    console.log('[API] Environment variables diagnostic:');
    console.log(`[API]    - TELEGRAM_BOT_TOKEN type: ${typeof botToken}`);
    console.log(`[API]    - TELEGRAM_BOT_TOKEN length: ${botToken?.length || 0}`);
    console.log(`[API]    - TELEGRAM_BOT_TOKEN present: ${botToken ? '✓ YES' : '✗ NO'}`);
    console.log(`[API]    - TELEGRAM_BOT_TOKEN value: ${botToken ? botToken.substring(0, 10) + '...' : 'UNDEFINED'}`);
    console.log(`[API]    - TELEGRAM_CHAT_ID type: ${typeof chatIdsRaw}`);
    console.log(`[API]    - TELEGRAM_CHAT_ID length: ${chatIdsRaw?.length || 0}`);
    console.log(`[API]    - TELEGRAM_CHAT_ID present: ${chatIdsRaw ? '✓ YES' : '✗ NO'}`);
    console.log(`[API]    - TELEGRAM_CHAT_ID value: "${chatIdsRaw || 'UNDEFINED'}"`);

    // Проверяем наличие всех переменных окружения
    const missingVars = [];
    if (!botToken) missingVars.push('TELEGRAM_BOT_TOKEN');
    if (!chatIdsRaw) missingVars.push('TELEGRAM_CHAT_ID');

    if (missingVars.length > 0) {
      console.error('[API] ❌ CONFIG ERROR: Missing environment variables');
      console.error(`[API]    Missing variables: ${missingVars.join(', ')}`);
      console.error('[API]    Please check:');
      console.error('[API]    1. Vercel environment variables are set');
      console.error('[API]    2. Variables are assigned to correct environment (Production/Preview/Development)');
      console.error('[API]    3. Project has been redeployed after adding variables');
      
      // Более информативное сообщение об ошибке
      return NextResponse.json(
        { 
          error: 'Временные технические неполадки. Пожалуйста, позвоните нам: 8-930-193-34-20',
          details: process.env.NODE_ENV === 'development' ? `Missing: ${missingVars.join(', ')}` : undefined
        },
        { status: 503 }
      );
    }
    console.log('[API] ✅ All required environment variables are present');

    console.log('[API] 🔄 Step 5: Parsing chat IDs...');
    // Разделяем chat_id по запятой и очищаем пробелы
    // После проверки выше, chatIdsRaw гарантированно определен
    const chatIds = chatIdsRaw!.split(',').map(id => id.trim()).filter(Boolean);
    console.log(`[API]    - Raw value: "${chatIdsRaw}"`);
    console.log(`[API]    - Parsed: [${chatIds.join(', ')}]`);
    console.log(`[API]    - Count: ${chatIds.length}`);
    
    if (chatIds.length === 0) {
      console.error('[API] ❌ No valid chat IDs found');
      console.error('[API]    TELEGRAM_CHAT_ID is set but contains no valid IDs');
      return NextResponse.json(
        { 
          error: 'Временные технические неполадки. Пожалуйста, позвоните нам: 8-930-193-34-20',
          details: process.env.NODE_ENV === 'development' ? 'No valid chat IDs' : undefined
        },
        { status: 503 }
      );
    }
    console.log('[API] ✅ Chat IDs parsed successfully');

    console.log('[API] 🔄 Step 6: Preparing message text...');
    const textLines = [
      '📩 Новая заявка с сайта «Золотой Дуб»',
      `Имя: ${name}`,
      phone ? `Телефон: ${phone}` : undefined,
      email ? `E-mail: ${email}` : undefined,
      message ? `Сообщение: ${message}` : undefined,
      `Время: ${new Date().toLocaleString('ru-RU')}`,
    ].filter(Boolean) as string[];

    const text = textLines.join('\n');
    console.log(`[API] ✅ Message text prepared (${text.length} chars)`);
    console.log('[API] 📄 Message preview:');
    console.log('─────────────────────────────────────────────');
    console.log(text);
    console.log('─────────────────────────────────────────────');

    console.log(`[API] 🔄 Step 7: Sending to ${chatIds.length} recipient(s)...`);
    // Отправляем сообщение каждому chat_id
    const sendPromises = chatIds.map(async (chatId, index) => {
      const sendStartTime = Date.now();
      console.log('');
      console.log(`[API] 📤 Send #${index + 1}/${chatIds.length}: Starting for chat ${chatId}`);
      
      try {
        const apiUrl = `https://api.telegram.org/bot${botToken!}/sendMessage`;
        const payload = { chat_id: chatId, text };
        
        console.log(`[API]    - URL: https://api.telegram.org/bot*****/sendMessage`);
        console.log(`[API]    - Payload size: ${JSON.stringify(payload).length} bytes`);
        console.log(`[API]    - Sending HTTP request...`);
        
        const tgResp = await fetch(apiUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Zolotoy-Dub-API/1.0'
          },
          body: JSON.stringify(payload),
          // Добавляем таймаут для надежности
          signal: AbortSignal.timeout(10000) // 10 секунд
        });

        const responseTime = Date.now() - sendStartTime;
        console.log(`[API]    - HTTP response received (${responseTime}ms)`);
        console.log(`[API]    - Status: ${tgResp.status} ${tgResp.statusText}`);

        const responseData = await tgResp.json();
        console.log(`[API]    - JSON parsed`);
        console.log(`[API]    - Response OK: ${responseData.ok}`);

        if (!tgResp.ok) {
          console.error(`[API] ❌ Failed to send to ${chatId}:`);
          console.error(`[API]    - Status: ${tgResp.status}`);
          console.error(`[API]    - Error: ${responseData.description || 'Unknown error'}`);
          console.error(`[API]    - Error code: ${responseData.error_code || 'N/A'}`);
          console.error(`[API]    - Full response:`, JSON.stringify(responseData, null, 2));
          
          // Специфичные ошибки Telegram API
          let errorMsg = responseData.description || 'Unknown error';
          if (responseData.error_code === 400) {
            errorMsg = 'Неверный формат chat ID или токена';
          } else if (responseData.error_code === 401) {
            errorMsg = 'Неверный токен бота';
          } else if (responseData.error_code === 403) {
            errorMsg = 'Бот заблокирован пользователем или не имеет прав';
          }
          
          return { chatId, success: false, error: errorMsg, errorCode: responseData.error_code };
        }

        console.log(`[API] ✅ Successfully sent to ${chatId}`);
        console.log(`[API]    - Message ID: ${responseData.result?.message_id || 'N/A'}`);
        return { chatId, success: true, messageId: responseData.result?.message_id };
      } catch (error) {
        const errorTime = Date.now() - sendStartTime;
        console.error(`[API] ❌ Network error sending to ${chatId} (${errorTime}ms):`);
        if (error instanceof Error) {
          console.error(`[API]    - Error type: ${error.constructor.name}`);
          console.error(`[API]    - Message: ${error.message}`);
          console.error(`[API]    - Stack:`, error.stack);
        } else {
          console.error(`[API]    - Raw error:`, error);
        }
        return { chatId, success: false, error: 'Network error' };
      }
    });

    const results = await Promise.allSettled(sendPromises);
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('[API] 📊 FINAL RESULTS');
    console.log('═══════════════════════════════════════════════════════════');
    
    // Подсчет успешных и неудачных отправок
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`[API] Total recipients: ${results.length}`);
    console.log(`[API] ✅ Successful: ${successful}`);
    console.log(`[API] ❌ Failed: ${failed}`);

    // Детальный лог результатов
    console.log('[API] Detailed results:');
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { chatId, success, error } = result.value;
        if (success) {
          console.log(`  ✅ Chat ${chatId}: Delivered`);
        } else {
          console.log(`  ❌ Chat ${chatId}: Failed - ${error}`);
        }
      } else {
        console.log(`  ❌ Chat #${index + 1}: Promise rejected - ${result.reason}`);
      }
    });

    console.log('═══════════════════════════════════════════════════════════');

    // Если хотя бы одна отправка успешна - считаем успехом
    if (successful > 0) {
      console.log('[API] ✅ Request completed successfully (at least one delivery succeeded)');
      console.log(`[API] Success rate: ${successful}/${results.length} (${Math.round(successful/results.length * 100)}%)`);
      return NextResponse.json({ 
        ok: true, 
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        delivered: successful, 
        failed: failed,
        total: results.length 
      });
    }

    // Все отправки провалились
    console.error('[API] ❌ Request failed (all deliveries failed)');
    console.error('[API] This likely indicates a configuration issue with the Telegram bot');
    
    // Собираем информацию об ошибках
    const errorSummary = results
      .filter(r => r.status === 'fulfilled' && !r.value.success)
      .map(r => r.status === 'fulfilled' ? r.value.error : 'Unknown')
      .join('; ');
    
    console.error(`[API] Error summary: ${errorSummary}`);
    
    return NextResponse.json(
      { 
        error: 'Временные технические неполадки. Пожалуйста, позвоните нам: 8-930-193-34-20',
        details: process.env.NODE_ENV === 'development' ? errorSummary : undefined
      },
      { status: 503 }
    );

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('[API] ❌ UNEXPECTED ERROR');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('[API] Error type:', error?.constructor?.name || 'Unknown');
    
    let errorMessage = 'Произошла непредвиденная ошибка';
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error('[API] Error name:', error.name);
      console.error('[API] Error message:', error.message);
      console.error('[API] Stack trace:');
      console.error(error.stack);
      
      // Специфичные типы ошибок
      if (error.name === 'SyntaxError') {
        errorMessage = 'Некорректный формат данных';
        statusCode = 400;
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Ошибка сетевого соединения';
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Превышено время ожидания';
        statusCode = 504;
      }
    } else {
      console.error('[API] Raw error:', error);
    }
    
    console.error('═══════════════════════════════════════════════════════════');
    
    return NextResponse.json({ 
      error: 'Временные технические неполадки. Пожалуйста, позвоните нам: 8-930-193-34-20',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: statusCode });
  }
}




