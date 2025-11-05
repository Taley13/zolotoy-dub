'use server';

import { sendContactFormToTelegram } from '@/lib/telegram';

export async function submitContactForm(formData: FormData) {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         [SERVER ACTION] submitContactForm CALLED          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('[ServerAction] Timestamp:', new Date().toISOString());
  console.log('[ServerAction] Environment:', process.env.NODE_ENV);
  
  console.log('[ServerAction] 🔄 Extracting form data...');
  const name = (formData.get('name') as string || '').trim();
  const phone = (formData.get('phone') as string || '').trim();
  const email = (formData.get('email') as string || '').trim();
  const message = (formData.get('message') as string || '').trim();
  const source = (formData.get('source') as 'contact_form' | 'calculator') || 'contact_form';

  console.log('[ServerAction] ✅ Form data extracted:');
  console.log('  - Name:', name ? `"${name}"` : 'EMPTY');
  console.log('  - Phone:', phone ? `"${phone}"` : 'EMPTY');
  console.log('  - Email:', email ? `"${email}"` : 'EMPTY');
  console.log('  - Message:', message ? `"${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"` : 'EMPTY');
  console.log('  - Source:', source);

  console.log('[ServerAction] 🔍 Validating...');
  if (!name) {
    console.error('[ServerAction] ❌ VALIDATION FAILED: Name is empty');
    return { success: false, error: 'Укажите имя' } as const;
  }
  console.log('[ServerAction] ✅ Validation passed');

  console.log('[ServerAction] 🚀 Calling sendContactFormToTelegram...');
  const startTime = Date.now();
  
  try {
    const result = await sendContactFormToTelegram({
      name,
      phone: phone || undefined,
      email: email || undefined,
      message: message || undefined,
      source
    });

    const duration = Date.now() - startTime;
    console.log(`[ServerAction] ⏱️ sendContactFormToTelegram completed in ${duration}ms`);
    console.log('[ServerAction] 📊 Result:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('[ServerAction] ✅ SUCCESS: Message sent to Telegram');
      console.log('[ServerAction]    Application ID:', result.applicationId);
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log('');
      return { success: true } as const;
    }

    console.error('[ServerAction] ❌ FAILURE: sendContactFormToTelegram returned error');
    console.error('[ServerAction]    Error:', result.error);
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    
    return { 
      success: false, 
      error: result.error || 'Не удалось отправить сообщение' 
    } as const;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('');
    console.error('╔═══════════════════════════════════════════════════════════╗');
    console.error('║    [SERVER ACTION] EXCEPTION IN submitContactForm        ║');
    console.error('╚═══════════════════════════════════════════════════════════╝');
    console.error('[ServerAction] Time elapsed:', duration, 'ms');
    console.error('[ServerAction] Error type:', error?.constructor?.name);
    
    if (error instanceof Error) {
      console.error('[ServerAction] Error name:', error.name);
      console.error('[ServerAction] Error message:', error.message);
      console.error('[ServerAction] Stack trace:');
      console.error(error.stack);
    } else {
      console.error('[ServerAction] Raw error:', error);
    }
    console.error('╚═══════════════════════════════════════════════════════════╝');
    console.error('');
    
    return { 
      success: false, 
      error: 'Произошла ошибка на сервере' 
    } as const;
  }
}




