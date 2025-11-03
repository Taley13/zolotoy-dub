"use client";

import { useEffect, useState, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function ModernHero() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);

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

    // Создаём больше частиц с разными параметрами
    const particles: Particle[] = [];
    const particleCount = 150; // Увеличено с ~30

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1, // 1-4px
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    // Анимация
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Обновляем позицию
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around экрана
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Мерцание (twinkling)
        particle.twinklePhase += particle.twinkleSpeed;
        const twinkle = Math.sin(particle.twinklePhase) * 0.5 + 0.5;
        const currentOpacity = particle.opacity * twinkle;

        // Рисуем частицу с золотым градиентом
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${currentOpacity})`); // Яркое золото
        gradient.addColorStop(0.5, `rgba(255, 193, 37, ${currentOpacity * 0.8})`); // Янтарь
        gradient.addColorStop(1, `rgba(255, 140, 0, 0)`); // Прозрачный край

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Добавляем свечение для больших частиц
        if (particle.size > 2) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(255, 215, 0, ${currentOpacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4">
      {/* Минималистичный фон с градиентами */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
      
      {/* Canvas с золотыми частицами */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Floating орбы - более яркие */}
      <div className="absolute top-20 left-[10%] h-96 w-96 rounded-full bg-yellow-500/20 blur-3xl animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute bottom-20 right-[15%] h-80 w-80 rounded-full bg-amber-600/20 blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-yellow-400/10 blur-3xl animate-pulse" style={{animationDuration: '15s', animationDelay: '4s'}} />

      {/* Главный контент */}
      <div className={`relative z-10 max-w-6xl text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Символ желудя с микро-анимацией */}
        <div className="mb-8 inline-flex">
          <div className="group relative">
            <div className="absolute -inset-4 rounded-full bg-yellow-500/20 blur-xl transition-all duration-500 group-hover:bg-yellow-500/30 group-hover:scale-110" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-600/5 backdrop-blur-sm transition-all duration-300 group-hover:border-yellow-400/50 group-hover:scale-105">
              <span className="text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🌰</span>
            </div>
          </div>
        </div>

        {/* Основной заголовок - крупная типографика */}
        <h1 className="mb-6">
          <div className={`font-brand text-6xl font-bold sm:text-7xl md:text-8xl lg:text-9xl transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent hover:from-yellow-200 hover:via-yellow-400 hover:to-amber-500 transition-all duration-500">
              Золотой Дуб
            </span>
          </div>
        </h1>

        {/* Подзаголовок */}
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="font-display text-3xl font-light text-white sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
            Изготовление кухонь<br className="sm:hidden" /> и шкафов на заказ
          </h2>
        </div>

        {/* Описание с glass панелью */}
        <div className={`mt-8 inline-block transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="group rounded-2xl border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-xl transition-all duration-300 hover:border-yellow-500/30 hover:bg-white/10">
            <p className="font-script text-2xl text-yellow-300 sm:text-3xl italic">
              Уют и комфорт
            </p>
            <p className="mt-3 text-lg text-neutral-300 font-light sm:text-xl">
              <span className="font-medium text-yellow-400">ДСП • МДФ • Эмаль</span>
            </p>
            <p className="mt-2 text-base text-neutral-400 italic">
              Индивидуальный дизайн и установка под ключ
            </p>
          </div>
        </div>

        {/* Кнопки CTA с микро-анимациями */}
        <div className={`mt-12 flex flex-wrap justify-center gap-4 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="#calculator"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-10 py-5 text-lg font-semibold text-black shadow-2xl transition-all duration-300 hover:from-yellow-400 hover:to-amber-500 hover:shadow-yellow-500/50 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Рассчитать стоимость</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </a>

          <a
            href="/contacts"
            className="group rounded-xl border-2 border-yellow-500/50 bg-black/20 px-10 py-5 text-lg font-semibold text-yellow-400 backdrop-blur-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 hover:shadow-lg hover:shadow-yellow-500/20 hover:scale-105 active:scale-95"
          >
            Бесплатный замер
          </a>
        </div>

        {/* Статистика с анимацией */}
        <div className={`mt-16 grid grid-cols-3 gap-8 transition-all duration-700 delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {[
            { value: '500+', label: 'Проектов' },
            { value: '15', label: 'Лет опыта' },
            { value: '100%', label: 'Гарантия' },
          ].map((stat, i) => (
            <div key={i} className="group cursor-default">
              <div className="text-4xl font-bold text-yellow-400 transition-all duration-300 group-hover:text-yellow-300 group-hover:scale-110 md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-1200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="animate-bounce">
          <svg className="h-8 w-8 text-yellow-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

