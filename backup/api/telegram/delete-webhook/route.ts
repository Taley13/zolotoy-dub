/**
 * API Route: Удаление вебхука
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        ok: false, 
        error: 'TELEGRAM_BOT_TOKEN не найден' 
      }, { status: 500 });
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`
    );
    
    const data = await response.json();
    
    console.log('[Telegram] Delete webhook response:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка удаления webhook:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal error' 
    }, { status: 500 });
  }
}

