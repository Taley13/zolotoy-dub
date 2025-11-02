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
  const chatIds = process.env.TELEGRAM_CHAT_ID; // может быть один ID или несколько через запятую

  const telegramMessage = `
🎯 Новая заявка с сайта «Золотой Дуб»

👤 Имя: ${name}
📞 Телефон: ${phone || 'Не указано'}
✉️ E-mail: ${email || 'Не указан'}
💬 Сообщение: ${message || 'Не указано'}

⏰ ${new Date().toLocaleString('ru-RU')}
  `.trim();

  // Fallback для тестирования без Telegram
  if (!botToken || !chatIds) {
    console.log('[DEV MODE] Заявка (TELEGRAM_* не настроены):');
    console.log(telegramMessage);
    return { success: true } as const;
  }

  // Поддержка нескольких получателей через запятую
  const recipients = chatIds.split(',').map(id => id.trim()).filter(Boolean);

  try {
    const results = await Promise.all(
      recipients.map(chatId =>
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: telegramMessage }),
          cache: 'no-store'
        })
      )
    );

    const failed = results.filter(r => !r.ok);
    if (failed.length > 0) {
      const errText = await failed[0].text();
      console.error('[Telegram Error]', errText);
      return { success: false, error: 'Не удалось отправить сообщение в Telegram' } as const;
    }

    return { success: true } as const;
  } catch (error) {
    console.error('[Telegram Error]', error);
    return { success: false, error: 'Ошибка отправки в Telegram' } as const;
  }
}




