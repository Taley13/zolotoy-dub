"use client";

import { useRef, useState } from 'react';
import { submitContactForm } from './actions';

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<null | 'loading' | 'success' | 'error'>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    console.log('');
    console.log('═════════════════════════════════════════════════════════');
    console.log('📝 [ContactForm] FORM SUBMISSION STARTED');
    console.log('═════════════════════════════════════════════════════════');
    console.log('[ContactForm] Timestamp:', new Date().toISOString());
    
    setStatus('loading');
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    // Логируем данные формы
    console.log('[ContactForm] 📋 Form data extracted:');
    console.log('  - Name:', formData.get('name'));
    console.log('  - Phone:', formData.get('phone'));
    console.log('  - Email:', formData.get('email'));
    console.log('  - Message:', formData.get('message') ? `"${String(formData.get('message')).substring(0, 50)}..."` : 'empty');
    console.log('  - Source:', formData.get('source') || 'contact_form');
    
    try {
      console.log('[ContactForm] 🚀 Calling submitContactForm server action...');
      const startTime = Date.now();
      
      let res: { success: boolean; error?: string };
      
      try {
        // Пытаемся использовать server action
        res = await submitContactForm(formData);
      } catch (serverActionError) {
        console.warn('[ContactForm] ⚠️ Server action failed, trying fallback API...');
        console.warn('[ContactForm]    Server action error:', serverActionError);
        
        // Fallback: прямой HTTP fetch к API route
        try {
          const formObject = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            message: formData.get('message')
          };
          
          console.log('[ContactForm] 📡 Sending direct POST to /api/contact...');
          const apiResponse = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject)
          });
          
          console.log(`[ContactForm] 📊 API Response: ${apiResponse.status} ${apiResponse.statusText}`);
          
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            res = { success: true };
            console.log('[ContactForm] ✅ Fallback API succeeded:', apiData);
          } else {
            const errorData = await apiResponse.json().catch(() => ({ error: 'Неизвестная ошибка сервера' }));
            
            // Получаем понятное сообщение об ошибке
            let errorMessage = errorData.error || 'Произошла ошибка';
            
            // Добавляем детали в development режиме
            if (errorData.details && process.env.NODE_ENV === 'development') {
              errorMessage += ` (${errorData.details})`;
            }
            
            res = { success: false, error: errorMessage };
            console.error('[ContactForm] ❌ Fallback API failed:', errorData);
            console.error('[ContactForm]    Status code:', apiResponse.status);
          }
        } catch (fetchError) {
          console.error('[ContactForm] ❌ Fallback API also failed:', fetchError);
          throw serverActionError; // Пробрасываем оригинальную ошибку
        }
      }
      
      const duration = Date.now() - startTime;
      console.log(`[ContactForm] ✅ Request completed in ${duration}ms`);
      console.log('[ContactForm] 📊 Final response:', res);
      
      if (res.success) {
        console.log('[ContactForm] ✅ SUCCESS: Form submitted successfully');
        setStatus('success');
        formRef.current?.reset();
      } else {
        console.error('[ContactForm] ❌ FAILURE: Server returned error');
        console.error('[ContactForm]    Error message:', res.error);
        setStatus('error');
        setError(res.error || 'Ошибка отправки');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('');
      console.error('═════════════════════════════════════════════════════════');
      console.error('[ContactForm] ❌ EXCEPTION CAUGHT');
      console.error('═════════════════════════════════════════════════════════');
      console.error('[ContactForm] Error type:', error?.constructor?.name);
      console.error('[ContactForm] Error message:', errorMsg);
      if (error instanceof Error && error.stack) {
        console.error('[ContactForm] Stack trace:', error.stack);
      }
      console.error('═════════════════════════════════════════════════════════');
      
      setStatus('error');
      setError('Произошла ошибка при отправке');
    }
    
    console.log('═════════════════════════════════════════════════════════');
    console.log('');
  }

  return (
    <form ref={formRef} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg" onSubmit={handleSubmit}>
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


