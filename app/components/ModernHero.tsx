'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { safeLocalStorage } from '@/lib/safeStorage';

export default function ModernHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройка canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Золотые частицы - УВЕЛИЧЕНО количество для лучшего эффекта
    const particles: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; phase: number; twinkleSpeed: number;
    }> = [];

    for (let i = 0; i < 250; i++) { // Увеличено с 150 до 250
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1, // Размер 1-5px
        speedX: (Math.random() - 0.5) * 0.3, // Медленное движение по X
        speedY: (Math.random() - 0.5) * 0.3, // Медленное движение по Y
        opacity: Math.random() * 0.9 + 0.3, // Яркость 0.3-1.2
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01 // Скорость мерцания
      });
    }

    const animate = () => {
      // Очищаем canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Обновляем позицию
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around - частицы возвращаются с другой стороны
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Мерцание (twinkle effect)
        particle.phase += particle.twinkleSpeed;
        const twinkle = Math.sin(particle.phase) * 0.5 + 0.5; // 0-1
        const currentOpacity = particle.opacity * twinkle;

        // Рисуем частицу с золотым градиентом
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${currentOpacity})`); // Яркое золото
        gradient.addColorStop(0.4, `rgba(255, 193, 37, ${currentOpacity * 0.8})`); // Янтарь
        gradient.addColorStop(1, `rgba(255, 140, 0, 0)`); // Прозрачный край

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Дополнительное свечение для крупных частиц
        if (particle.size > 2.5 && currentOpacity > 0.6) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(255, 215, 0, ${currentOpacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden">
      {/* Холст с золотыми частицами */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="container mx-auto px-3 sm:px-4 text-center relative z-10 flex flex-col justify-center min-h-screen py-12 sm:py-16 md:py-20">
        {/* Верхняя часть - основной заголовок и подзаголовок */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* ЗОЛОТОЙ ЖЕЛУДЬ С ЭПИЧНОЙ ПОДСВЕТКОЙ */}
          <button
            onClick={() => {
              // Активируем скидку (SSR-безопасно)
              const activationTime = Date.now();
              safeLocalStorage.setItem('discount_activation', activationTime.toString());
              
              // Прокручиваем к калькулятору (с проверкой document)
              if (typeof window !== 'undefined') {
                const calculator = document.getElementById('calculator');
                calculator?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="mb-6 sm:mb-8 animate-float cursor-pointer group/acorn relative"
            aria-label="Активировать скидку 15%"
          >
            {/* Внешнее мягкое золотое свечение (большое) - уменьшено для мобилки */}
            <div className="absolute -inset-8 sm:-inset-12 bg-amber-500/20 blur-2xl sm:blur-3xl rounded-full 
                          group-hover/acorn:bg-amber-400/40 transition-all duration-700 
                          animate-glow-pulse-outer opacity-60"></div>
            
            {/* Среднее золотое свечение */}
            <div className="absolute -inset-6 sm:-inset-8 bg-amber-500/30 blur-xl sm:blur-2xl rounded-full 
                          group-hover/acorn:bg-amber-400/50 transition-all duration-500 
                          animate-glow-pulse-middle"></div>
            
            {/* Близкое яркое свечение */}
            <div className="absolute -inset-3 sm:-inset-4 bg-amber-400/40 blur-lg sm:blur-xl rounded-full 
                          group-hover/acorn:bg-amber-300/70 transition-all duration-300 
                          animate-glow-pulse-inner"></div>
            
            {/* Сам желудь с фильтрами - адаптивный размер */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 drop-shadow-2xl 
                          transform group-hover/acorn:scale-110 transition-all duration-300 
                          filter brightness-110 contrast-110
                          group-hover/acorn:brightness-125 group-hover/acorn:contrast-125"
                 style={{
                   filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 193, 37, 0.5)) drop-shadow(0 0 60px rgba(255, 140, 0, 0.3))',
                 }}>
              <Image 
                src="/images/acorn.png"
                alt="Золотой желудь - символ скидки 15%"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>
            
            {/* Tooltip с информацией о скидке - адаптивный */}
            <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover/acorn:opacity-100 
                          transition-all duration-300 pointer-events-none z-20 px-2">
              <div className="bg-gradient-to-r from-green-500/95 to-emerald-600/95 backdrop-blur-xl 
                            border-2 border-green-400/60 rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-2xl
                            animate-bounce-subtle">
                <p className="text-green-50 font-bold text-xs sm:text-sm md:text-base flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  🎁 Кликни и получи скидку 15%!
                </p>
                <p className="text-green-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  ⏰ Действует 24 часа
                </p>
              </div>
            </div>
          </button>
          
          {/* 1. Основной заголовок - Playfair Display 700 с золотым градиентом */}
          <h1 className="logo-text font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 tracking-tight drop-shadow-lg px-2">
            Золотой дуб
          </h1>
          
          {/* 2. Подзаголовок - Playfair Display 500 */}
          <p className="subheading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 italic tracking-wide drop-shadow-md px-2">
            Уют и комфорт
          </p>
        </div>

        {/* Визуальное разделение - адаптивное */}
        <div className="my-8 sm:my-10 md:my-12 flex items-center justify-center gap-3 sm:gap-4">
          <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-amber-500/60"></div>
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rotate-45 bg-amber-500/80"></div>
          <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-amber-500/60"></div>
        </div>

        {/* 3. Нижняя часть - дополнительная информация */}
        <div className="space-y-3 sm:space-y-4 px-2">
          {/* Материалы - Playfair Display 500 */}
          <p className="subheading text-lg sm:text-xl md:text-2xl text-amber-400 drop-shadow-md">
            ДСП • МДФ • Эмаль
          </p>
          
          {/* Описание услуг - Inter 400 */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-amber-100 max-w-2xl mx-auto drop-shadow-sm px-4">
            Индивидуальный дизайн и установка под ключ
          </p>

          {/* Кнопка CTA - Inter 600 */}
          <div className="mt-6 sm:mt-8 pt-3 sm:pt-4">
            <a
              href="#calculator"
              className="inline-block bg-transparent border-2 border-amber-400 text-amber-400 
                       px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full 
                       hover:bg-amber-400 hover:text-black transition-all duration-500 
                       font-button text-base sm:text-lg tracking-wide shadow-lg hover:shadow-amber-400/50
                       active:scale-95"
            >
              Рассчитать стоимость
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Плавное плавание желудя */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        /* Пульсация внешнего свечения (медленная) */
        @keyframes glow-pulse-outer {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        /* Пульсация среднего свечения */
        @keyframes glow-pulse-middle {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }
        
        /* Пульсация внутреннего свечения (быстрая) */
        @keyframes glow-pulse-inner {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        /* Легкое подпрыгивание для tooltip */
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow-pulse-outer {
          animation: glow-pulse-outer 3s ease-in-out infinite;
        }
        
        .animate-glow-pulse-middle {
          animation: glow-pulse-middle 2.5s ease-in-out infinite 0.2s;
        }
        
        .animate-glow-pulse-inner {
          animation: glow-pulse-inner 2s ease-in-out infinite 0.4s;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}