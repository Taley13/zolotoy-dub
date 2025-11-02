import Link from 'next/link';

export default function PremiumLogo() {
  return (
    <Link href="/" className="group relative inline-flex items-center gap-3">
      {/* Геометричное дерево */}
      <svg width="40" height="40" viewBox="0 0 100 100" className="transition-transform group-hover:scale-110">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Ствол */}
        <rect x="45" y="60" width="10" height="30" fill="url(#goldGrad)" filter="url(#glow)" />
        
        {/* Треугольная крона - геометрично */}
        <polygon points="50,15 25,45 75,45" fill="url(#goldGrad)" filter="url(#glow)" opacity="0.9" />
        <polygon points="50,25 30,52 70,52" fill="url(#goldGrad)" filter="url(#glow)" opacity="0.7" />
        <polygon points="50,35 35,60 65,60" fill="url(#goldGrad)" filter="url(#glow)" opacity="0.5" />
        
        {/* Геометрические акценты */}
        <circle cx="50" cy="20" r="3" fill="#FFD700" opacity="0.8" />
        <circle cx="35" cy="35" r="2" fill="#FFA500" opacity="0.6" />
        <circle cx="65" cy="35" r="2" fill="#FFA500" opacity="0.6" />
      </svg>
      
      {/* Текст */}
      <div className="flex flex-col">
        <span className="font-display text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
          Золотой Дуб
        </span>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Premium Furniture</span>
      </div>
    </Link>
  );
}

