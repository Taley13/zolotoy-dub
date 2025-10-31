import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" aria-label="Золотой Дуб" className="inline-block align-middle">
      <svg
        width="170"
        height="36"
        viewBox="0 0 680 144"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E7C56A" />
            <stop offset="50%" stopColor="#C9A141" />
            <stop offset="100%" stopColor="#9C7A2F" />
          </linearGradient>
        </defs>
        <g fill="url(#gold)" fillRule="evenodd">
          <text
            x="0"
            y="105"
            fontFamily="Cormorant, 'Times New Roman', serif"
            fontWeight="700"
            fontSize="96"
            letterSpacing="2"
          >
            Золотой дуб
          </text>
        </g>
      </svg>
    </Link>
  );
}


