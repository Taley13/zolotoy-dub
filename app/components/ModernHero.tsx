"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function ModernHero() {
  return (
    <section className="relative overflow-hidden bg-[#0E2931] text-[#E2E2E0]">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/fon1.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/75" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0E2931] via-transparent to-[#12484C]/80" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="font-alone text-4xl leading-tight text-transparent bg-[linear-gradient(120deg,#f7e5b1,#e0b05c,#f7e5b1)] bg-clip-text sm:text-5xl lg:text-6xl animate-fade-up delay-100">
              Золотой Дуб
            </h1>
            <p className="font-alone text-2xl text-[#E2E2E0]/85 animate-fade-up delay-150">Уют и комфорт</p>
          </div>
          <p className="text-base text-[#E2E2E0]/85 sm:text-lg animate-fade-up delay-200">
            Мы создаём кухни и шкафы под ключ. Индивидуальный дизайн, качественные материалы и профессиональная установка — от первой идеи до готового интерьера.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#E2E2E0]/80 lg:justify-start animate-fade-up delay-300">
            {["ДСП", "МДФ", "Эмаль", "Каменные столешницы", "Blum & Hettich"].map((item) => (
              <span key={item} className="rounded-full border border-[#2B7574]/50 bg-black/10 px-4 py-1.5">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center lg:justify-start animate-fade-up delay-400">
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center rounded-full bg-[#861211] px-10 py-4 text-base font-semibold text-[#E2E2E0] shadow-[0_25px_60px_rgba(134,18,17,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a41b1a]"
            >
              Рассчитать проект
            </Link>
            <a
              href="tel:+79301933420"
              className="inline-flex items-center justify-center rounded-full border border-[#2B7574] px-10 py-4 text-base font-semibold text-[#E2E2E0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2B7574]/20"
            >
              +7 (930) 193-34-20
            </a>
          </div>
        </div>

        <div className="grid w-full gap-6 text-sm text-[#E2E2E0]/80 sm:grid-cols-2 animate-fade-up delay-500">
          {[
            { label: "Опыт работы", value: "15 лет" },
            { label: "Поставлено проектов", value: "7000+ м²" },
            { label: "Гарантия", value: "1 год" },
            { label: "Срок поставки", value: "14–21 день" },
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
