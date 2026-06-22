export default function CustomDocumentIcon({ size = 32, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="docGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <g stroke="url(#docGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Back document */}
        <path d="M 4 6 V 22 H 18 V 20" />
        <path d="M 4 6 H 6" />
        
        {/* Front document outline and fold */}
        <path d="M 6 2 H 15 L 22 9 V 20 H 6 Z" />
        <path d="M 15 2 V 9 H 22" />
        
        {/* Square icon */}
        <rect x="9" y="4" width="2.5" height="2.5" />
        
        {/* List items */}
        <path d="M 9 9 H 9.5" />
        <path d="M 12 9 H 18" />
        
        <path d="M 9 11.5 H 9.5" />
        <path d="M 12 11.5 H 18" />
        
        <path d="M 9 14 H 9.5" />
        <path d="M 12 14 H 18" />
        
        <path d="M 9 16.5 H 9.5" />
        <path d="M 12 16.5 H 18" />
        
        <path d="M 9 19 H 9.5" />
        <path d="M 12 19 H 18" />
      </g>
    </svg>
  );
}
