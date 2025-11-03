"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiscountAcorn() {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsAnimating(true);
    
    // Сохраняем время активации скидки
    const activationTime = Date.now();
    localStorage.setItem('discount_activation', activationTime.toString());
    
    // Анимация перед переходом
    setTimeout(() => {
      router.push('/#calculator');
      // Прокрутка к калькулятору
      setTimeout(() => {
        const calculator = document.getElementById('calculator');
        if (calculator) {
          calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 500);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full 
          bg-gradient-to-r from-yellow-500/20 to-amber-600/20 
          border-2 border-yellow-500/40
          hover:border-yellow-400 hover:bg-yellow-500/30
          transition-all duration-300
          ${isAnimating ? 'animate-bounce scale-110' : ''}
        `}
      >
        {/* Пульсирующее свечение */}
        <div className="absolute -inset-1 bg-yellow-500/30 rounded-full blur-md animate-pulse"></div>
        
        {/* Желудь */}
        <span className="relative text-2xl animate-wiggle">🌰</span>
        
        {/* Текст */}
        <span className="relative text-sm font-semibold text-yellow-400 whitespace-nowrap hidden sm:inline">
          Получи подарок!
        </span>

        {/* Значок подарка */}
        <span className="relative text-lg">🎁</span>
      </button>

      {/* Tooltip при hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        <div className="bg-neutral-900 border border-yellow-500/50 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap">
          <p className="text-xs text-yellow-400 font-semibold">🎉 Скидка 15% на первый заказ!</p>
          <p className="text-xs text-neutral-400 mt-1">Действует 24 часа</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

