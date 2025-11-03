"use client";

import { useState } from 'react';
import { submitContactForm } from '@/app/contacts/actions';

interface CalculationParams {
  configuration: string;
  facade: string;
  hardware: string;
  countertop: string;
  length: number;
  calculatedPrice: number;
}

interface CalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: CalculationParams;
}

export default function CalculationModal({ isOpen, onClose, params }: CalculationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleClose = () => {
    setFormData({ name: '', phone: '', email: '' });
    setSubmitStatus('idle');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните имя и телефон');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Формируем сообщение ТОЧНО по указанному формату
      const message = `
👤 КОНТАКТЫ:
• Имя: ${formData.name}
• Телефон: ${formData.phone}
• Email: ${formData.email || 'не указан'}

⚙️ ВЫБРАННЫЕ ПАРАМЕТРЫ:
• Конфигурация: ${params.configuration}
• Фасады: ${params.facade}
• Фурнитура: ${params.hardware}
• Столешница: ${params.countertop}
• Длина кухни: ${params.length} м

💰 РАСЧЕТНАЯ СТОИМОСТЬ: ${params.calculatedPrice.toLocaleString('ru-RU')} ₽
      `.trim();

      // Создаём FormData для отправки
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      if (formData.email) {
        formDataToSend.append('email', formData.email);
      }
      formDataToSend.append('message', message);
      formDataToSend.append('source', 'calculator'); // Указываем источник

      const result = await submitContactForm(formDataToSend);

      if (result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-md bg-gradient-to-br from-neutral-900 to-neutral-950 border border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/20 p-8 animate-slideUp">
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Заголовок */}
        <div className="mb-6">
          <h3 className="font-display text-2xl font-bold text-yellow-400 mb-2">
            Получить точный расчёт
          </h3>
          <p className="text-neutral-400 text-sm">
            Заполните контактные данные и мы свяжемся с вами в течение 15 минут
          </p>
        </div>

        {/* Сводка выбранных параметров */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <h4 className="text-neutral-300 font-semibold mb-3 text-sm">Ваш выбор:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Конфигурация:</span>
              <span className="text-yellow-400 font-medium">{params.configuration}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Фасады:</span>
              <span className="text-yellow-400 font-medium">{params.facade}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Фурнитура:</span>
              <span className="text-yellow-400 font-medium">{params.hardware}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Столешница:</span>
              <span className="text-yellow-400 font-medium">{params.countertop}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Длина:</span>
              <span className="text-yellow-400 font-medium">{params.length} м</span>
            </div>
            <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
              <span className="text-neutral-300 font-semibold">Примерная стоимость:</span>
              <span className="text-yellow-400 font-bold text-lg">
                {params.calculatedPrice.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поле имени */}
          <div>
            <label htmlFor="name" className="block text-neutral-300 text-sm mb-2 font-medium">
              Ваше имя <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-yellow-500/50 focus:bg-white/10 focus:outline-none transition-all"
              placeholder="Иван Иванов"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Поле телефона */}
          <div>
            <label htmlFor="phone" className="block text-neutral-300 text-sm mb-2 font-medium">
              Телефон <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-yellow-500/50 focus:bg-white/10 focus:outline-none transition-all"
              placeholder="+7 (999) 123-45-67"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Поле Email */}
          <div>
            <label htmlFor="email" className="block text-neutral-300 text-sm mb-2 font-medium">
              Email <span className="text-neutral-500">(опционально)</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-yellow-500/50 focus:bg-white/10 focus:outline-none transition-all"
              placeholder="example@mail.ru"
              disabled={isSubmitting}
            />
          </div>

          {/* Статус отправки - успех */}
          {submitStatus === 'success' && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-semibold">Заявка отправлена!</div>
                <div className="text-xs mt-1 text-green-300">Мы свяжемся с вами в ближайшее время</div>
              </div>
            </div>
          )}

          {/* Статус отправки - ошибка */}
          {submitStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-semibold">Ошибка отправки</div>
                <div className="text-xs mt-1 text-red-300">Попробуйте позже или позвоните: 8-930-193-34-20</div>
              </div>
            </div>
          )}

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold py-4 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50"
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </span>
              ) : submitStatus === 'success' ? (
                'Заявка отправлена ✓'
              ) : (
                'Отправить заявку'
              )}
            </span>
            {!isSubmitting && submitStatus !== 'success' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
          </button>

          {/* Конфиденциальность */}
          <p className="text-xs text-neutral-500 text-center mt-4">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
