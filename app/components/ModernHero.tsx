"use client";

import React from "react";
import Link from "next/link";

export default function ModernHero() {
  return (
    <section className="relative overflow-hidden bg-brand-primary text-brand-neutral">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(43,117,116,0.35),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(134,18,17,0.35),_transparent_50%),radial-gradient(circle_at_20%_80%,_rgba(18,72,76,0.35),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_45%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="space-y-6 text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.6em] text-brand-teal/70">atelier {new Date().getFullYear()}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-brand-neutral">
            Кухни и гардеробные в новой палитре{' '}
            <span className="text-brand-teal">Золотого дуба</span>
          </h1>
          <p className="text-base sm:text-lg text-brand-neutral/80">
            Современная геометрия, натуральные текстуры и продуманные сценарии хранения.
            Производим и устанавливаем под ключ за 14–21 день.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-brand-neutral/70 lg:justify-start">
            {["ДСП", "МДФ", "Эмаль", "Кварцевые столешницы", "Blum & Hettich"].map((item) => (
              <span key={item} className="rounded-full border border-brand-outline px-4 py-1.5">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="#calculator" className="btn-neon px-10 py-4">
              Рассчитать проект
            </Link>
            <a href="tel:+79301933420" className="btn-outline px-10 py-4 text-center">
              +7 (930) 193-34-20
            </a>
          </div>
        </div>

        <div className="grid w-full gap-6 text-sm text-brand-neutral/80 sm:grid-cols-2">
          {[
            { label: "Опыт производства", value: "12 лет" },
            { label: "Площадь проектов", value: "7000+ м²" },
            { label: "Гарантия", value: "36 месяцев" },
            { label: "Срок изготовления", value: "14–21 день" }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-brand-outline bg-brand-surface/40 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-brand-neutral/60">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-brand-neutral">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

