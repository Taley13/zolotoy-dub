"use client";

import { useEffect, useRef } from 'react';

export default function ParallaxHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number; y: number; vx: number; vy: number; size: number}> = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5
      });
    }

    let scrollY = 0;
    const handleScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', handleScroll);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Параллакс эффект
      const parallaxOffset = scrollY * 0.5;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy - parallaxOffset * 0.001;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.random() * 0.3})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
      
      {/* Градиентный overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
      
      {/* Контент */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="glass-neon max-w-4xl p-12">
          {/* Символ желудя */}
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-600/20 backdrop-blur-sm border border-yellow-500/30">
            <span className="text-5xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">🍂</span>
          </div>
          
          <h1 className="font-display text-5xl font-bold md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
              Золотой Дуб
            </span>
          </h1>
          
          <h2 className="mt-6 font-display text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Изготовление кухонь и шкафов на заказ
          </h2>
          
          <p className="mt-6 text-xl text-neutral-300 font-light leading-relaxed">
            <span className="font-semibold text-yellow-400">ДСП, МДФ, Эмаль.</span> Индивидуальный дизайн и установка под ключ из современных качественных надежных материалов
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#portfolio" className="btn-neon px-8 py-4 text-lg">
              Смотреть работы
            </a>
            <a href="/contacts" className="btn-outline px-8 py-4 text-lg">
              Бесплатный замер
            </a>
          </div>

          {/* Преимущества */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="mt-1 text-sm text-neutral-400">Проектов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">15</div>
              <div className="mt-1 text-sm text-neutral-400">Лет опыта</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="mt-1 text-sm text-neutral-400">Гарантия</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

