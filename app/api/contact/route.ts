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
    
    console.log(`[API]    - TELEGRAM_BOT_TOKEN: ${botToken ? '✓ Present' : '✗ Missing'}`);
    console.log(`[API]    - TELEGRAM_CHAT_ID: ${chatIdsRaw ? '✓ Present' : '✗ Missing'}`);

    if (!botToken || !chatIdsRaw) {
      console.error('[API] ❌ CONFIG ERROR: Environment variables missing');
      return NextResponse.json(
        { error: 'Сервис временно недоступен. Не настроены переменные окружения.' },
        { status: 500 }
      );
    }
    console.log('[API] ✅ Environment variables OK');

    console.log('[API] 🔄 Step 5: Parsing chat IDs...');
    // Разделяем chat_id по запятой и очищаем пробелы
    const chatIds = chatIdsRaw.split(',').map(id => id.trim()).filter(Boolean);
    console.log(`[API]    - Raw value: "${chatIdsRaw}"`);
    console.log(`[API]    - Parsed: [${chatIds.join(', ')}]`);
    console.log(`[API]    - Count: ${chatIds.length}`);
    
    if (chatIds.length === 0) {
      console.error('[API] ❌ No valid chat IDs found');
      return NextResponse.json(
        { error: 'Сервис временно недоступен. Не настроены получатели.' },
        { status: 500 }
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
        const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
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
          body: JSON.stringify(payload)
        });

        const responseTime = Date.now() - sendStartTime;
        console.log(`[API]    - HTTP response received (${responseTime}ms)`);
        console.log(`[API]    - Status: ${tgResp.status} ${tgResp.statusText}`);

        const responseData = await tgResp.json();
        console.log(`[API]    - JSON parsed`);
        console.log(`[API]    - Response OK: ${responseData.ok}`);

        if (!tgResp.ok) {
          console.error(`[API] ❌ Failed to send to ${chatId}:`);
          console.error(`[API]    - Error: ${responseData.description || 'Unknown error'}`);
          console.error(`[API]    - Full response:`, JSON.stringify(responseData, null, 2));
          return { chatId, success: false, error: responseData.description || 'Unknown error' };
        }

        console.log(`[API] ✅ Successfully sent to ${chatId}`);
        console.log(`[API]    - Message ID: ${responseData.result?.message_id || 'N/A'}`);
        return { chatId, success: true };
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
      return NextResponse.json({ 
        ok: true, 
        delivered: successful, 
        failed: failed,
        total: results.length 
      });
    }

    // Все отправки провалились
    console.error('[API] ❌ Request failed (all deliveries failed)');
    return NextResponse.json(
      { error: 'Не удалось отправить сообщение ни одному получателю' },
      { status: 502 }
    );

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('[API] ❌ UNEXPECTED ERROR');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('[API] Error type:', error?.constructor?.name || 'Unknown');
    
    if (error instanceof Error) {
      console.error('[API] Error name:', error.name);
      console.error('[API] Error message:', error.message);
      console.error('[API] Stack trace:');
      console.error(error.stack);
    } else {
      console.error('[API] Raw error:', error);
    }
    
    console.error('═══════════════════════════════════════════════════════════');
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }
}




