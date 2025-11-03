'use client';
import { useEffect, useRef } from 'react';

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

      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col justify-center min-h-screen py-20">
        {/* Верхняя часть - основной заголовок и подзаголовок */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Изображение желудя */}
          <div className="mb-8 animate-float">
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/20 blur-xl rounded-full"></div>
              <div className="relative text-7xl md:text-8xl drop-shadow-2xl">
                🌰
              </div>
            </div>
          </div>
          
          {/* 1. Основной заголовок */}
          <h1 className="font-brand text-7xl md:text-9xl font-bold text-amber-200 mb-6 tracking-tight drop-shadow-lg">
            Золотой дуб
          </h1>
          
          {/* 2. Подзаголовок - поэтичный курсив */}
          <p className="font-script text-3xl md:text-5xl text-amber-300 italic tracking-wide drop-shadow-md">
            Уют и комфорт
          </p>
        </div>

        {/* Визуальное разделение */}
        <div className="my-12 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/60"></div>
          <div className="h-2 w-2 rotate-45 bg-amber-500/80"></div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/60"></div>
        </div>

        {/* 3. Нижняя часть - дополнительная информация */}
        <div className="space-y-4">
          {/* Материалы - акцентно */}
          <p className="font-display text-xl md:text-2xl font-semibold text-amber-400 drop-shadow-md">
            ДСП • МДФ • Эмаль
          </p>
          
          {/* Описание услуг - обычный текст */}
          <p className="font-body text-base md:text-lg text-amber-100 max-w-2xl mx-auto drop-shadow-sm">
            Индивидуальный дизайн и установка под ключ
          </p>

          {/* Кнопка CTA */}
          <div className="mt-8 pt-4">
            <a
              href="#calculator"
              className="inline-block bg-transparent border-2 border-amber-400 text-amber-400 px-10 py-4 rounded-full 
                       hover:bg-amber-400 hover:text-black transition-all duration-500 
                       font-display text-lg tracking-wide shadow-lg hover:shadow-amber-400/50"
            >
              Рассчитать стоимость
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}