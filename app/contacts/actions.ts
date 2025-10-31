'use server';

export async function submitContactForm(formData: FormData) {
  const name = (formData.get('name') as string || '').trim();
  const phone = (formData.get('phone') as string || '').trim();
  const email = (formData.get('email') as string || '').trim();
  const message = (formData.get('message') as string || '').trim();

  if (!name) {
    return { success: false, error: 'Укажите имя' } as const;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return { success: false, error: 'Сервис недоступен: не настроены TELEGRAM_*' } as const;
  }

  const telegramMessage = `
🎯 Новая заявка с сайта «Золотой Дуб»

👤 Имя: ${name}
📞 Телефон: ${phone || 'Не указано'}
✉️ E-mail: ${email || 'Не указан'}
💬 Сообщение: ${message || 'Не указано'}

⏰ ${new Date().toLocaleString('ru-RU')}
  `.trim();

  const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: telegramMessage }),
    cache: 'no-store'
  });

  if (!resp.ok) {
    return { success: false, error: 'Не удалось отправить сообщение в Telegram' } as const;
  }

  return { success: true } as const;
}




