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

    // Золотые частицы
    const particles: Array<{
      x: number; y: number; size: number; speed: number; opacity: number; phase: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.phase += 0.02;
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }

        const twinkle = Math.sin(particle.phase) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity * twinkle})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 overflow-hidden">
      {/* Холст с золотыми частицами */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col justify-center min-h-screen py-20">
        {/* Верхняя часть - основной заголовок и подзаголовок */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* 1. Основной заголовок */}
          <h1 className="font-brand text-7xl md:text-9xl font-bold text-amber-50 mb-6 tracking-tight">
            Золотой дуб
          </h1>
          
          {/* 2. Подзаголовок - поэтичный курсив */}
          <p className="font-script text-3xl md:text-5xl text-amber-200 italic tracking-wide">
            Уют и комфорт
          </p>
        </div>

        {/* Визуальное разделение */}
        <div className="my-12 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/50"></div>
          <div className="h-2 w-2 rotate-45 bg-amber-400/50"></div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/50"></div>
        </div>

        {/* 3. Нижняя часть - дополнительная информация */}
        <div className="space-y-4">
          {/* Материалы - акцентно */}
          <p className="font-display text-xl md:text-2xl font-semibold text-yellow-400">
            ДСП • МДФ • Эмаль
          </p>
          
          {/* Описание услуг - обычный текст */}
          <p className="font-body text-base md:text-lg text-amber-100/80 max-w-2xl mx-auto">
            Индивидуальный дизайн и установка под ключ
          </p>

          {/* Кнопка CTA */}
          <div className="mt-8 pt-4">
            <a
              href="#calculator"
              className="inline-block bg-transparent border-2 border-amber-400 text-amber-400 px-10 py-4 rounded-full 
                       hover:bg-amber-400 hover:text-slate-900 transition-all duration-500 
                       font-display text-lg tracking-wide shadow-lg hover:shadow-amber-400/50"
            >
              Рассчитать стоимость
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}