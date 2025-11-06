/**
 * API Route: Получение информации о текущем вебхуке
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        ok: false, 
        error: 'TELEGRAM_BOT_TOKEN не найден' 
      }, { status: 500 });
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
    );
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка получения webhook info:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal error' 
    }, { status: 500 });
  }
}

