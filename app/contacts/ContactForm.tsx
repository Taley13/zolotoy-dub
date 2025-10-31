"use client";

import { useState } from 'react';
import { submitContactForm } from './actions';

export default function ContactForm() {
  const [status, setStatus] = useState<null | 'loading' | 'success' | 'error'>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await submitContactForm(formData);
    
    if (res.success) {
      setStatus('success');
      e.currentTarget.reset();
    } else {
      setStatus('error');
      setError(res.error || 'Ошибка отправки');
    }
  }

  return (
    <form className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-200">Имя</label>
          <input id="name" name="name" required placeholder="Как к вам обращаться?"
                 className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 shadow-sm outline-none ring-brand-500 focus:border-brand-500 focus:ring-2" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-neutral-200">Телефон</label>
            <input id="phone" name="phone" type="tel" placeholder="+7 (___) ___-__-__"
                   className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 shadow-sm outline-none ring-brand-500 focus:border-brand-500 focus:ring-2" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-200">E-mail</label>
            <input id="email" name="email" type="email" placeholder="you@example.com"
                   className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 shadow-sm outline-none ring-brand-500 focus:border-brand-500 focus:ring-2" />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-200">Сообщение</label>
          <textarea id="message" name="message" rows={5}
                    placeholder="Опишите задачу, размеры помещения или интересующий стиль"
                    className="w-full resize-y rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder:text-neutral-500 shadow-sm outline-none ring-brand-500 focus:border-brand-500 focus:ring-2" />
        </div>

        <label className="flex items-start gap-3 text-sm text-neutral-300">
          <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-brand-500 focus:ring-brand-500" />
          <span>Я согласен(на) на обработку персональных данных и принимаю условия политики конфиденциальности.</span>
        </label>

        <button type="submit" disabled={status === 'loading'}
                className="mt-2 inline-flex items-center justify-center rounded-md bg-brand-500 px-5 py-2.5 text-white shadow hover:bg-brand-600 transition disabled:opacity-60">
          {status === 'loading' ? 'Отправка…' : 'Отправить заявку'}
        </button>

        {status === 'success' && (
          <p className="text-sm text-green-400">Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">{error || 'Произошла ошибка. Попробуйте позже.'}</p>
        )}
      </div>
    </form>
  );
}


