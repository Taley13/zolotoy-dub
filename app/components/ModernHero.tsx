'use client';

import React from 'react';

export default function ModernHero() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Золотой дуб</h1>

        <p className="text-xl sm:text-2xl text-[#f2c97c]">Уют и комфорт</p>

        <p className="text-lg sm:text-xl text-[#f2c97c]">ДСП • МДФ • Эмаль</p>

        <p className="text-base sm:text-lg text-gray-300">Индивидуальный дизайн и установка под ключ</p>

        <div className="pt-4">
          <a
            href="#calculator"
            className="inline-block px-10 py-3 border border-[#f2c97c] text-[#f2c97c] rounded-full text-sm sm:text-base tracking-wide"
          >
            Рассчитать стоимость
          </a>
        </div>
      </div>
    </section>
  );
}
'use client';
import Image from 'next/image';
import { safeLocalStorage } from '@/lib/safeStorage';

export default function ModernHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#040407] via-[#0b0303] to-[#1b0404]" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(255,132,58,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,206,120,0.25), transparent 45%), radial-gradient(circle at 60% 80%, rgba(187,12,40,0.35), transparent 55%)'
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen opacity-25 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 60%)' }}
      />
      <div className="absolute -left-32 top-10 w-96 h-96 bg-gradient-to-b from-[#ff9b2a]/70 to-transparent blur-[140px]" />
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tl from-[#c90e2b]/65 to-transparent blur-[160px]" />

      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col justify-center min-h-screen py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <p className="tracking-[0.45em] uppercase text-xs sm:text-sm text-[#ffb465]">reborn collection</p>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold drop-shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
            Золотой дуб
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-[#ffe7cf] font-serif italic">
            Смелые фактуры. Чистые линии. Живой огонь в интерьере.
          </p>

          <p className="max-w-3xl text-sm sm:text-base md:text-lg text-zinc-200/90 leading-relaxed">
            Мы создаём кухни и гардеробные в новой палитре — глубина графита, расплавленное золото и лавовые оттенки.
            Производство, монтаж и сервис под ключ за 21 день.
          </p>

          <button
            onClick={() => {
              const activationTime = Date.now();
              safeLocalStorage.setItem('discount_activation', activationTime.toString());
              if (typeof window !== 'undefined') {
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="relative group"
            aria-label="Активировать скидку 15%"
          >
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#ffb347] via-[#ff613e]/80 to-[#b10c1f] opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
            <div className="relative rounded-full border border-white/20 bg-gradient-to-r from-[#ffb347] via-[#ff613e] to-[#d80b33] px-8 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg font-semibold tracking-wide text-black shadow-[0_15px_40px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-transform duration-300">
              Включить скидку 15%
            </div>
          </button>

          <div className="flex items-center gap-4 text-[#ff8d5c] text-xs uppercase tracking-[0.4em] mt-2">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ff8d5c]/70" />
            atelier
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ff8d5c]/70" />
          </div>

          <div className="flex flex-col gap-2 text-sm sm:text-base text-zinc-300/90">
            <p>Материалы: шпон, эмаль, кварц, стекло</p>
            <p>Цифровой дизайн + VR-презентация проекта</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 px-8 py-3 text-sm sm:text-base font-semibold text-white hover:bg-white/15 transition-colors duration-300"
            >
              Рассчитать стоимость
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-sm sm:text-base font-semibold text-white hover:border-white/40 transition-colors duration-300"
            >
              Смотреть проекты
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
          <Image
            src="/images/zdub.png"
            alt="Золотой Дуб"
            width={1400}
            height={1400}
            priority
            className="w-full max-w-4xl"
          />
        </div>
      </div>
    </section>
  );
}

