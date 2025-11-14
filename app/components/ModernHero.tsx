"use client";

import React from "react";

export default function ModernHero() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Золотой дуб</h1>
        <p className="text-xl md:text-2xl text-[#f2c97c]">Уют и комфорт</p>
        <p className="text-lg md:text-xl text-[#f2c97c]">ДСП • МДФ • Эмаль</p>
        <p className="text-base md:text-lg text-gray-300">Индивидуальный дизайн и установка под ключ</p>
        <button className="bg-white text-black px-10 py-3 rounded-full text-sm sm:text-base tracking-wide">
          Рассчитать стоимость
        </button>
      </div>
    </section>
  );
}

