"use client";

import React from "react";
import Link from "next/link";

export default function ModernHero() {
  return (
    <section className="relative overflow-hidden bg-[#0E2931] text-[#E2E2E0]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(43,117,116,0.45),_transparent_58%),radial-gradient(circle_at_80%_20%,_rgba(134,18,17,0.35),_transparent_55%),radial-gradient(circle_at_20%_80%,_rgba(18,72,76,0.3),_transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E2931] via-transparent to-[#12484C]/60 opacity-80" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="space-y-6 text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.6em] text-[#2B7574]">atelier {new Date().getFullYear()}</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Кухни и гардеробные в новой палитре{' '}
            <span className="text-[#2B7574]">Золотого дуба</span>
          </h1>
          <p className="text-base text-[#E2E2E0]/85 sm:text-lg">
            Современная геометрия, натуральные текстуры и продуманные сценарии хранения.
            Производим и устанавливаем под ключ за 14–21 день.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#E2E2E0]/70 lg:justify-start">
            {['ДСП', 'МДФ', 'Эмаль', 'Кварцевые столешницы', 'Blum & Hettich'].map((item) => (
              <span key={item} className="rounded-full border border-[#12484C] px-4 py-1.5">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center rounded-full bg-[#861211] px-10 py-4 text-base font-semibold text-[#E2E2E0] shadow-[0_18px_45px_rgba(134,18,17,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a41b1a]"
            >
              Рассчитать проект
            </Link>
            <a
              href="tel:+79301933420"
              className="inline-flex items-center justify-center rounded-full border border-[#2B7574] px-10 py-4 text-base font-semibold text-[#2B7574] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2B7574]/10"
            >
              +7 (930) 193-34-20
            </a>
          </div>
        </div>

        <div className="grid w-full gap-6 text-sm text-[#E2E2E0]/80 sm:grid-cols-2">
          {[
            { label: 'Опыт производства', value: '12 лет' },
            { label: 'Площадь проектов', value: '7000+ м²' },
            { label: 'Гарантия', value: '36 месяцев' },
            { label: 'Срок изготовления', value: '14–21 день' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#12484C]/60 bg-[#12484C]/35 p-5 shadow-[0_15px_50px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#E2E2E0]/60">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#E2E2E0]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

