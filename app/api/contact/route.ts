import { NextResponse } from 'next/server';

type ContactPayload = {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;
    const name = (body.name || '').toString().trim();
    const phone = (body.phone || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const message = (body.message || '').toString().trim();

    if (!name) {
      return NextResponse.json({ error: 'Укажите имя' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Сервис временно недоступен. Не настроены переменные окружения.' },
        { status: 500 }
      );
    }

    const textLines = [
      '📩 Новая заявка с сайта «Золотой Дуб»',
      `Имя: ${name}`,
      phone ? `Телефон: ${phone}` : undefined,
      email ? `E-mail: ${email}` : undefined,
      message ? `Сообщение: ${message}` : undefined,
      `Время: ${new Date().toLocaleString('ru-RU')}`,
    ].filter(Boolean) as string[];

    const text = textLines.join('\n');

    const tgResp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!tgResp.ok) {
      const errText = await tgResp.text();
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение в Telegram', details: errText },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 });
  }
}




