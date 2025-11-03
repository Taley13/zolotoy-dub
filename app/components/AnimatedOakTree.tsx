"use client";

import { useEffect, useState } from 'react';

interface AnimatedOakTreeProps {
  onClick?: () => void;
}

export default function AnimatedOakTree({ onClick }: AnimatedOakTreeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Генерируем массив листьев с разными параметрами
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 2,
    leftPosition: 20 + Math.random() * 60,
    rotation: Math.random() * 360
  }));

  return (
    <div className="relative inline-block group/tree cursor-pointer" onClick={onClick}>
      {/* Мягкая золотая подсветка */}
      <div className="absolute inset-0 -inset-x-8 -inset-y-12 bg-amber-500/20 blur-3xl rounded-full group-hover/tree:bg-amber-400/30 transition-all duration-500"></div>
      
      <div className="relative">
        {/* Падающие золотые листья */}
        <div className="absolute inset-0 -inset-x-8 -top-4 overflow-visible pointer-events-none">
          {mounted && leaves.map((leaf) => (
            <div
              key={leaf.id}
              className="absolute w-full h-32 animate-fall"
              style={{
                left: `${leaf.leftPosition}%`,
                animationDelay: `${leaf.delay}s`,
                animationDuration: `${leaf.duration}s`,
              }}
            >
              <div 
                className="text-2xl opacity-80"
                style={{
                  transform: `rotate(${leaf.rotation}deg)`,
                  filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))'
                }}
              >
                🍂
              </div>
            </div>
          ))}
        </div>

        {/* Стилизованный дуб (SVG) */}
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 100 100" 
          className="transform group-hover/tree:scale-110 transition-transform duration-300"
        >
          {/* Крона дерева */}
          <circle cx="50" cy="35" r="25" fill="url(#goldGradient)" opacity="0.9" />
          <circle cx="35" cy="40" r="20" fill="url(#goldGradient)" opacity="0.85" />
          <circle cx="65" cy="40" r="20" fill="url(#goldGradient)" opacity="0.85" />
          <circle cx="50" cy="50" r="22" fill="url(#goldGradient)" opacity="0.8" />
          
          {/* Ствол */}
          <rect x="45" y="55" width="10" height="35" rx="2" fill="#8B6F47" />
          <rect x="43" y="70" width="14" height="3" rx="1" fill="#6B5438" opacity="0.6" />
          
          {/* Корни */}
          <path 
            d="M 40 88 Q 35 92 30 90 M 60 88 Q 65 92 70 90" 
            stroke="#6B5438" 
            strokeWidth="2" 
            fill="none"
            opacity="0.7"
          />

          {/* Золотые акценты на кроне */}
          <circle cx="50" cy="30" r="3" fill="#FFD700" opacity="0.9">
            <animate 
              attributeName="opacity" 
              values="0.6;1;0.6" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="38" cy="38" r="2.5" fill="#FFD700" opacity="0.8">
            <animate 
              attributeName="opacity" 
              values="0.5;0.9;0.5" 
              dur="2.5s" 
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="62" cy="38" r="2.5" fill="#FFD700" opacity="0.8">
            <animate 
              attributeName="opacity" 
              values="0.5;0.9;0.5" 
              dur="2.3s" 
              repeatCount="indefinite"
            />
          </circle>

          {/* Определение градиентов */}
          <defs>
            <radialGradient id="goldGradient" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.75" />
            </radialGradient>
          </defs>
        </svg>

        {/* Tooltip при hover */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover/tree:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
          <div className="bg-gradient-to-r from-green-500/95 to-emerald-600/95 backdrop-blur-xl border-2 border-green-400/50 rounded-xl px-5 py-3 shadow-2xl">
            <p className="text-green-100 font-bold text-base flex items-center gap-2">
              <span className="text-xl">🎁</span>
              Кликни и получи скидку 15%!
            </p>
            <p className="text-green-200 text-xs mt-1 text-center">Действует 24 часа</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-40px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(120px) translateX(20px) rotate(180deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}

