import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" aria-label="Золотой Дуб" className="group inline-block">
      <svg
        width="48"
        height="48"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Геометрическое дерево */}
        <g filter="url(#glow)">
          {/* Ствол */}
          <rect x="90" y="110" width="20" height="60" fill="url(#goldGrad)" rx="2" />
          
          {/* Крона - геометрические элементы */}
          <polygon points="100,50 85,80 115,80" fill="url(#goldGrad)" opacity="0.9" />
          <polygon points="100,65 80,100 120,100" fill="url(#goldGrad)" opacity="0.85" />
          <polygon points="100,85 75,120 125,120" fill="url(#goldGrad)" opacity="0.8" />
          
          {/* Акцентные листья */}
          <circle cx="70" cy="90" r="8" fill="url(#goldGrad)" opacity="0.7" />
          <circle cx="130" cy="90" r="8" fill="url(#goldGrad)" opacity="0.7" />
          <circle cx="85" cy="110" r="6" fill="url(#goldGrad)" opacity="0.6" />
          <circle cx="115" cy="110" r="6" fill="url(#goldGrad)" opacity="0.6" />
        </g>
      </svg>
      <span className="ml-2 logo-text font-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
        Золотой Дуб
      </span>
    </Link>
  );
}
