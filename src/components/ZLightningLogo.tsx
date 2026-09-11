import React from 'react';

interface ZLightningLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const ZLightningLogo: React.FC<ZLightningLogoProps> = ({
  className = '',
  size = 46,
  animated = true,
}) => {
  // Calculate proportional styling for small (footer) vs regular (header)
  const paddingClass = size < 30 ? 'p-1' : size < 42 ? 'p-1.5' : 'p-2';
  const roundedClass = size < 30 ? 'rounded-lg' : size < 42 ? 'rounded-xl' : 'rounded-2xl';

  return (
    <div
      id="z-lightning-logo-badge"
      style={{ width: size, height: size }}
      className={`relative ${roundedClass} ${paddingClass} bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-500/35 ring-1 ring-white/10 shrink-0 select-none group transition-all duration-300 hover:scale-105 hover:border-cyan-400/70 hover:shadow-cyan-500/40 cursor-pointer ${className}`}
      title="NetSpeedZ - Modern High-Speed Internet Telemetry"
    >
      {/* 1. Ambient Background Pulsing Aura */}
      <div
        className={`absolute inset-0 ${roundedClass} bg-radial from-cyan-400/25 via-blue-500/15 to-transparent pointer-events-none ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ animationDuration: '3s' }}
      />

      {/* 2. Cyber Scanning Laser Gleam (Moving Shimmer along border) */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
          <div
            className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 bg-[linear-gradient(45deg,transparent_40%,rgba(56,189,248,0.15)_50%,transparent_60%)] animate-spin"
            style={{ animationDuration: '8s' }}
          />
        </div>
      )}

      {/* 3. The High-Tech Vector Emblem */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(6,182,212,0.45)] overflow-visible"
      >
        <defs>
          <style>{`
            @keyframes speedStreamForward {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -20; }
            }
            @keyframes speedStreamReverse {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 20; }
            }
            @keyframes lightningDischarge {
              0%, 100% {
                opacity: 0.85;
                filter: drop-shadow(0 0 2px #ffffff);
              }
              30% {
                opacity: 1;
                filter: drop-shadow(0 0 5px #22d3ee) drop-shadow(0 0 8px #38bdf8);
              }
              50% {
                opacity: 0.7;
                filter: drop-shadow(0 0 1.5px #ffffff);
              }
              75% {
                opacity: 1;
                filter: drop-shadow(0 0 6px #67e8f9) drop-shadow(0 0 10px #60a5fa);
              }
            }
            @keyframes sparkPulse {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.45); opacity: 1; filter: drop-shadow(0 0 4px #22d3ee); }
            }
            .z-stream-top {
              animation: speedStreamForward 1.6s linear infinite;
            }
            .z-stream-bottom {
              animation: speedStreamReverse 1.8s linear infinite;
            }
            .z-lightning-core {
              animation: lightningDischarge 2.2s ease-in-out infinite;
            }
            .z-spark-beacon {
              transform-origin: 39.5px 11.5px;
              animation: sparkPulse 2s ease-in-out infinite;
            }
          `}</style>

          {/* Main neon cyan-to-blue gradient */}
          <linearGradient id="zNeonGrad" x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="35%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Core high-voltage spark gradient */}
          <linearGradient id="zCoreGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Accent speed lines gradient */}
          <linearGradient id="speedStreakGrad" x1="8" y1="8" x2="40" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow filter for lightning */}
          <filter id="neonSparkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Telemetry Speed Stream Arcs (Animated flowing dashes) */}
        <path
          d="M 10 14 C 18 8, 30 8, 38 14"
          stroke="url(#speedStreakGrad)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="3 4"
          className={animated ? 'z-stream-top' : ''}
          opacity="0.65"
        />
        <path
          d="M 10 34 C 18 40, 30 40, 38 34"
          stroke="url(#speedStreakGrad)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="3 4"
          className={animated ? 'z-stream-bottom' : ''}
          opacity="0.55"
        />

        {/* Outer Depth Shadow Silhouette */}
        <path
          d="M 11 11 H 37 C 38.2 11 39 12.3 38.3 13.3 L 26.5 22.5 H 33.5 C 34.6 22.5 35.3 23.7 34.7 24.7 L 21 40 C 20.2 40.9 18.7 40.3 19.1 39.1 L 22.5 28.5 H 14.5 C 13.4 28.5 12.7 27.3 13.3 26.3 L 22 17 H 11 C 9.9 17 9.2 15.8 9.8 14.8 L 11 11 Z"
          fill="#0f172a"
          opacity="0.6"
          transform="translate(1, 1.5)"
        />

        {/* PRIMARY EMBLEM: Aerodynamic Z fused with Supersonic Lightning Bolt */}
        <path
          d="M 10 10.5 H 36.5 C 37.8 10.5 38.6 11.9 37.9 13.0 L 26.2 22 H 33.2 C 34.4 22 35.1 23.3 34.4 24.3 L 20.8 39.2 C 19.9 40.1 18.4 39.5 18.8 38.2 L 22.3 28 H 14.2 C 13.0 28 12.3 26.7 13.0 25.7 L 22.2 16.2 H 10 C 8.9 16.2 8.2 15.0 8.8 14.0 L 10 10.5 Z"
          fill="url(#zNeonGrad)"
          stroke="#38bdf8"
          strokeWidth="0.85"
          strokeLinejoin="round"
        />

        {/* Internal Specular Facet */}
        <path
          d="M 12.5 12.2 H 34.2 L 24.8 19.5 H 17.5 L 12.5 12.2 Z"
          fill="url(#zCoreGrad)"
          opacity="0.85"
        />

        {/* Central Animated Lightning Core (Electric Energy Discharge) */}
        <path
          d="M 23 23.5 L 31.8 23.5 L 20 36.5 L 22.2 28.5 L 15.5 28.5 L 23 23.5 Z"
          fill="#ffffff"
          className={animated ? 'z-lightning-core' : ''}
          filter="url(#neonSparkGlow)"
        />

        {/* High-Tech Pulsing Spark Beacon (Top vertex) */}
        <g className={animated ? 'z-spark-beacon' : ''}>
          <circle cx="39.5" cy="11.5" r="2.2" fill="#22d3ee" opacity="0.4" />
          <circle cx="39.5" cy="11.5" r="1.4" fill="#ffffff" />
        </g>

        {/* Bottom Stabilizer Spark Dot */}
        <circle cx="8.5" cy="36.5" r="1.2" fill="#38bdf8" opacity="0.85" />
      </svg>
    </div>
  );
};
