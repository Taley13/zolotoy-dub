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

        {/* ЭПИЧНЫЙ золотой дуб (SVG) */}
        <svg 
          width="140" 
          height="160" 
          viewBox="0 0 200 220" 
          className="transform group-hover/tree:scale-110 transition-transform duration-500 drop-shadow-2xl"
        >
          {/* ЭПИЧНАЯ крона - детализированные дубовые листья */}
          <g filter="url(#goldGlow)">
            {/* Центральная верхушка */}
            <path d="M 100 25 C 95 20, 90 18, 85 20 C 80 22, 78 27, 80 32 C 82 37, 87 40, 92 38 C 97 40, 102 40, 107 38 C 112 37, 115 32, 117 27 C 119 22, 117 18, 112 16 C 107 14, 102 16, 100 20 Z" 
                  fill="url(#goldTextureGradient)" 
                  stroke="url(#goldStroke)" 
                  strokeWidth="0.5"
            />
            
            {/* Левая часть кроны */}
            <path d="M 70 40 C 65 35, 60 33, 55 35 C 50 37, 48 42, 50 47 C 52 52, 57 55, 62 53 C 67 55, 72 55, 77 53 C 82 52, 85 47, 87 42 C 89 37, 87 33, 82 31 C 77 29, 72 31, 70 35 Z" 
                  fill="url(#goldTextureGradient)" 
                  stroke="url(#goldStroke)" 
                  strokeWidth="0.5"
            />
            
            {/* Правая часть кроны */}
            <path d="M 130 40 C 125 35, 120 33, 115 35 C 110 37, 108 42, 110 47 C 112 52, 117 55, 122 53 C 127 55, 132 55, 137 53 C 142 52, 145 47, 147 42 C 149 37, 147 33, 142 31 C 137 29, 132 31, 130 35 Z" 
                  fill="url(#goldTextureGradient)" 
                  stroke="url(#goldStroke)" 
                  strokeWidth="0.5"
            />
            
            {/* Нижний уровень - большие листья */}
            <path d="M 60 58 C 55 53, 50 51, 45 53 C 40 55, 38 60, 40 65 C 42 70, 47 73, 52 71 C 57 73, 62 73, 67 71 C 72 70, 75 65, 77 60 C 79 55, 77 51, 72 49 C 67 47, 62 49, 60 53 Z" 
                  fill="url(#goldTextureGradient)" 
                  stroke="url(#goldStroke)" 
                  strokeWidth="0.5"
            />
            <path d="M 100 55 C 95 50, 90 48, 85 50 C 80 52, 78 57, 80 62 C 82 67, 87 70, 92 68 C 97 70, 102 70, 107 68 C 112 67, 115 62, 117 57 C 119 52, 117 48, 112 46 C 107 44, 102 46, 100 50 Z" 
                  fill="url(#goldTextureGradient)" 
                  stroke="url(#goldStroke)" 
                  strokeWidth="0.5"
            />
            <path d="M 140 58 C 135 53, 130 51, 125 53 C 120 55, 118 60, 120 65 C 122 70, 127 73, 132 71 C 137 73, 142 73, 147 71 C 152 70, 155 65, 157 60 C 159 55, 157 51, 152 49 C 147 47, 142 49, 140 53 Z" 
                  fill="url(#goldTextureGradient)" 
                  stroke="url(#goldStroke)" 
                  strokeWidth="0.5"
            />
          </g>

          {/* Мощный ствол */}
          <g filter="url(#innerShadow)">
            <rect x="90" y="75" width="20" height="80" rx="3" fill="url(#trunkGradient)" />
            
            {/* Текстура коры - вертикальные линии */}
            <line x1="92" y1="78" x2="92" y2="150" stroke="#5B4428" strokeWidth="1" opacity="0.5" />
            <line x1="96" y1="76" x2="96" y2="152" stroke="#5B4428" strokeWidth="0.8" opacity="0.4" />
            <line x1="100" y1="77" x2="100" y2="151" stroke="#7B5F3F" strokeWidth="1" opacity="0.6" />
            <line x1="104" y1="76" x2="104" y2="152" stroke="#5B4428" strokeWidth="0.8" opacity="0.4" />
            <line x1="108" y1="78" x2="108" y2="150" stroke="#5B4428" strokeWidth="1" opacity="0.5" />
            
            {/* Кольца роста */}
            <ellipse cx="100" cy="100" rx="8" ry="2" fill="none" stroke="#5B4428" strokeWidth="0.5" opacity="0.3" />
            <ellipse cx="100" cy="120" rx="9" ry="2" fill="none" stroke="#5B4428" strokeWidth="0.5" opacity="0.3" />
          </g>

          {/* Массивные корни */}
          <g stroke="url(#rootGradient)" fill="none" strokeLinecap="round">
            {/* Левые корни */}
            <path d="M 90 155 Q 75 165 60 160 Q 50 158 45 165" strokeWidth="5" opacity="0.9" />
            <path d="M 92 155 Q 80 170 65 175 Q 55 178 48 182" strokeWidth="4" opacity="0.8" />
            <path d="M 88 158 Q 70 168 55 165" strokeWidth="3.5" opacity="0.7" />
            
            {/* Правые корни */}
            <path d="M 110 155 Q 125 165 140 160 Q 150 158 155 165" strokeWidth="5" opacity="0.9" />
            <path d="M 108 155 Q 120 170 135 175 Q 145 178 152 182" strokeWidth="4" opacity="0.8" />
            <path d="M 112 158 Q 130 168 145 165" strokeWidth="3.5" opacity="0.7" />
          </g>

          {/* Мерцающие золотые блики - имитация листьев на свету */}
          <g>
            <circle cx="100" cy="28" r="3" fill="#FFD700" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="45" r="2.5" fill="#FBBF24" opacity="0.7">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="45" r="2.5" fill="#FBBF24" opacity="0.7">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="85" cy="60" r="2" fill="#F59E0B" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="115" cy="60" r="2" fill="#F59E0B" opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="62" r="1.8" fill="#FBBF24" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="62" r="1.8" fill="#FBBF24" opacity="0.5">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.6s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Градиенты и фильтры */}
          <defs>
            {/* Золотой металлический градиент для кроны */}
            <radialGradient id="goldTextureGradient" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
              <stop offset="20%" stopColor="#FCD34D" stopOpacity="1" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#D97706" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.85" />
            </radialGradient>
            
            {/* Градиент обводки */}
            <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            
            {/* Градиент ствола - объёмный */}
            <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B4428" />
              <stop offset="20%" stopColor="#6B5438" />
              <stop offset="50%" stopColor="#8B6F47" />
              <stop offset="80%" stopColor="#6B5438" />
              <stop offset="100%" stopColor="#5B4428" />
            </linearGradient>
            
            {/* Градиент корней */}
            <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B6F47" stopOpacity="1" />
              <stop offset="50%" stopColor="#7B5F3F" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5B4428" stopOpacity="0.8" />
            </linearGradient>
            
            {/* Золотое свечение */}
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Внутренняя тень для ствола */}
            <filter id="innerShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
              <feOffset dx="1" dy="1" result="offsetblur"/>
              <feFlood floodColor="#000000" floodOpacity="0.3"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
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

