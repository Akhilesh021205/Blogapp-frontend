function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      
      {/* Notebook Body */}
      <rect
        x="25"
        y="15"
        width="50"
        height="70"
        rx="10"
        stroke="url(#logo-gradient)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      
      {/* Writing Lines on Notebook */}
      <path
        d="M40 38 L 60 38 M 40 52 L 60 52 M 40 66 L 53 66"
        stroke="url(#logo-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Bookmark */}
      <path
        d="M55 15 L 55 35 L 63 28 L 71 35 L 71 15"
        fill="url(#logo-gradient)"
      />
      
      {/* Ring details on the left */}
      <path
        d="M20 28 L 30 28 M 20 42 L 30 42 M 20 56 L 30 56 M 20 70 L 30 70"
        stroke="url(#logo-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;
