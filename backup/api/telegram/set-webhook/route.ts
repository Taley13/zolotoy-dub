/**
 * API Route: Установка вебхука
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ 
        ok: false, 
        error: 'URL не указан' 
      }, { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        ok: false, 
        error: 'TELEGRAM_BOT_TOKEN не найден' 
      }, { status: 500 });
    }

    // Устанавливаем вебхук
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }
    );
    
    const data = await response.json();
    
    console.log('[Telegram] Set webhook response:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка установки webhook:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal error' 
    }, { status: 500 });
  }
}

