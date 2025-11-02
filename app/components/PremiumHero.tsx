"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PremiumHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; size: number; delay: number}>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5
      }))
    );
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Анимированные частицы */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-yellow-400/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Параллакс контент */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block glass-neon p-10 mb-8"
        >
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
              Изготовление кухонь
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent">
              и шкафов на заказ
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl mx-auto text-lg text-neutral-300 font-light"
        >
          <span className="text-yellow-400 font-semibold">ДСП • МДФ • Эмаль</span>
          <br />
          Индивидуальный дизайн и установка под ключ из современных качественных надежных материалов
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex justify-center gap-4"
        >
          <a href="#services" className="btn-neon px-8 py-4 text-lg">
            Узнать больше
          </a>
          <a href="/contacts" className="btn-outline px-8 py-4 text-lg">
            Оставить заявку
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-neutral-500">
            <span className="text-xs">Листайте вниз</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Градиентные overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
    </section>
  );
}

