/**
 * API Route: Отправка тестового сообщения
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();
    
    if (!chatId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Chat ID не указан' 
      }, { status: 400 });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      return NextResponse.json({ 
        ok: false, 
        error: 'TELEGRAM_BOT_TOKEN не найден' 
      }, { status: 500 });
    }

    const message = 
      '🧪 *Тестовое сообщение*\n\n' +
      '✅ Webhook работает корректно!\n\n' +
      `⏰ Время: ${new Date().toLocaleString('ru-RU')}\n` +
      '🤖 Бот: Золотой Дуб (Serverless)';

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка отправки тестового сообщения:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal error' 
    }, { status: 500 });
  }
}

