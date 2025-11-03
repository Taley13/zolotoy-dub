'use server';

import { sendContactFormToTelegram } from '@/lib/telegram';

export async function submitContactForm(formData: FormData) {
  const name = (formData.get('name') as string || '').trim();
  const phone = (formData.get('phone') as string || '').trim();
  const email = (formData.get('email') as string || '').trim();
  const message = (formData.get('message') as string || '').trim();

  if (!name) {
    return { success: false, error: 'Укажите имя' } as const;
  }

  const result = await sendContactFormToTelegram({
    name,
    phone: phone || undefined,
    email: email || undefined,
    message: message || undefined
  });

  if (result.success) {
    return { success: true } as const;
  }

  return { 
    success: false, 
    error: result.error || 'Не удалось отправить сообщение' 
  } as const;
}




