"use client";

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="hero" className="relative h-[92vh] w-full overflow-hidden">
      {/* Video background if present */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        autoPlay
        loop
        muted
        playsInline
        src="/videos/hero.mp4"
        onError={(e) => {
          // Fallback: do nothing if video missing
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[20%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(201,161,65,0.12),rgba(0,0,0,0)_120deg)] blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          className="logo-text font-elegant text-5xl font-bold tracking-tight text-brand-400 sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Золотой Дуб
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-lg text-neutral-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Премиальные кухни из массива дуба. Индивидуальный дизайн. Безупречное качество.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          <a href="#portfolio" className="btn-gold px-6 py-3 text-lg">Наши работы</a>
          <a href="/contacts" className="rounded-md border border-brand-500/50 px-6 py-3 text-lg text-brand-300 hover:bg-brand-500/10 transition">Оставить заявку</a>
        </motion.div>
      </div>
    </section>
  );
}


