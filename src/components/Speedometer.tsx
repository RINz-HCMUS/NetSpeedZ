import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Square } from 'lucide-react';
import { TestStage } from '../types';

interface SpeedometerProps {
  currentValue?: number;
  speed?: number;
  stage: TestStage;
  onStart: () => void;
  onStop: () => void;
  isTesting?: boolean;
}

// Convert speed (0 - 1000 Mbps) to needle angle (-125° to +125°)
// Progressive automotive tachometer curve
function speedToAngle(speed?: number): number {
  const minAngle = -125;
  const maxAngle = 125;
  const totalAngle = maxAngle - minAngle; // 250 degrees

  if (typeof speed !== 'number' || !Number.isFinite(speed) || isNaN(speed) || speed <= 0) {
    return minAngle;
  }
  if (speed >= 1000) return maxAngle;

  // Progressive sports dial throttle curve:
  // 0 - 10 Mbps: 0% -> 18% of arc
  // 10 - 50 Mbps: 18% -> 40% of arc
  // 50 - 100 Mbps: 40% -> 58% of arc
  // 100 - 250 Mbps: 58% -> 74% of arc
  // 250 - 500 Mbps: 74% -> 88% of arc
  // 500 - 1000 Mbps: 88% -> 100% of arc (Redline sector)
  let fraction = 0;
  if (speed <= 10) {
    fraction = (speed / 10) * 0.18;
  } else if (speed <= 50) {
    fraction = 0.18 + ((speed - 10) / 40) * 0.22;
  } else if (speed <= 100) {
    fraction = 0.4 + ((speed - 50) / 50) * 0.18;
  } else if (speed <= 250) {
    fraction = 0.58 + ((speed - 100) / 150) * 0.16;
  } else if (speed <= 500) {
    fraction = 0.74 + ((speed - 250) / 250) * 0.14;
  } else {
    fraction = 0.88 + ((speed - 500) / 500) * 0.12;
  }

  return minAngle + fraction * totalAngle;
}

// Supercar dial scale major ticks
const majorTicks = [
  { value: 0, label: '0', isRedline: false },
  { value: 10, label: '10', isRedline: false },
  { value: 50, label: '50', isRedline: false },
  { value: 100, label: '100', isRedline: false },
  { value: 250, label: '250', isRedline: false },
  { value: 500, label: '500', isRedline: true },
  { value: 1000, label: '1G', isRedline: true },
];

// Precision tachometer sub-ticks
const subTickValues = [
  2, 4, 6, 8,
  20, 30, 40,
  65, 80,
  140, 180, 220,
  320, 400,
  650, 800, 900,
];

export const Speedometer: React.FC<SpeedometerProps> = ({
  currentValue,
  speed,
  stage,
  onStart,
  onStop,
  isTesting,
}) => {
  const numericVal =
    typeof currentValue === 'number' && Number.isFinite(currentValue)
      ? currentValue
      : typeof speed === 'number' && Number.isFinite(speed)
        ? speed
        : 0;

  const activeTesting =
    typeof isTesting === 'boolean'
      ? isTesting
      : stage === 'ping' || stage === 'download' || stage === 'upload';

  const targetAngle = speedToAngle(numericVal);

  // SVG Geometry - Symmetrically centered inside viewBox 0 0 380 290
  // Center of the dial: cx = 190, cy = 142
  // Radius = 118
  // Clearance left: 190 - 118 = 72px from left margin
  // Clearance right: 190 + 118 = 308px (72px from right margin)
  // Perfectly balanced and zero clipping on the right edge!
  const cx = 190;
  const cy = 142;
  const radius = 118;
  const strokeWidth = 9;

  // Arc length for 250 degrees
  const arcFraction = 250 / 360;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * arcFraction;

  // Progress ratio 0..1
  const progressRatio = Math.max(0, Math.min(1, (targetAngle + 125) / 250));
  const rawOffset = arcLength * (1 - progressRatio);
  const strokeDashoffset = Number.isFinite(rawOffset) ? rawOffset : arcLength;

  // Major tick geometry
  const renderedMajorTicks = useMemo(() => {
    return majorTicks.map((tick) => {
      const angle = speedToAngle(tick.value);
      const rad = ((angle - 90) * Math.PI) / 180;

      const innerR = radius - 12;
      const outerR = radius + 3;
      const textR = radius - 26;

      return {
        ...tick,
        angle,
        x1: cx + innerR * Math.cos(rad),
        y1: cy + innerR * Math.sin(rad),
        x2: cx + outerR * Math.cos(rad),
        y2: cy + outerR * Math.sin(rad),
        tx: cx + textR * Math.cos(rad),
        ty: cy + textR * Math.sin(rad),
        isPassed: numericVal >= tick.value,
      };
    });
  }, [cx, cy, radius, numericVal]);

  // Sub-tick geometry
  const renderedSubTicks = useMemo(() => {
    return subTickValues.map((val) => {
      const angle = speedToAngle(val);
      const rad = ((angle - 90) * Math.PI) / 180;
      const innerR = radius - 7;
      const outerR = radius - 1;
      return {
        val,
        x1: cx + innerR * Math.cos(rad),
        y1: cy + innerR * Math.sin(rad),
        x2: cx + outerR * Math.cos(rad),
        y2: cy + outerR * Math.sin(rad),
      };
    });
  }, [cx, cy, radius]);

  // English stage titles in bold italic monospace font
  const getStageTitle = () => {
    switch (stage) {
      case 'ping':
        return 'PING LATENCY';
      case 'download':
        return 'DOWNLOAD';
      case 'upload':
        return 'UPLOAD';
      case 'completed':
        return 'TEST COMPLETED';
      default:
        return 'READY';
    }
  };

  // English status pill message in bold italic monospace font
  const getStatusMessage = () => {
    switch (stage) {
      case 'ping':
        return 'MEASURING PING...';
      case 'download':
        return 'TESTING DOWNLOAD...';
      case 'upload':
        return 'TESTING UPLOAD...';
      case 'completed':
        return 'TEST FINISHED';
      default:
        return 'READY TO TEST';
    }
  };

  return (
    <div
      id="speedometer-cluster"
      className="flex flex-col items-center justify-center relative select-none w-full max-w-[390px] mx-auto"
    >
      {/* Ambient background glow */}
      <div
        className={`absolute w-72 h-72 rounded-full transition-all duration-700 pointer-events-none -top-2 ${
          numericVal > 500
            ? 'bg-rose-500/15 dark:bg-rose-500/20 blur-3xl'
            : activeTesting
            ? 'bg-blue-500/15 dark:bg-sky-500/20 blur-3xl'
            : 'bg-slate-300/10 dark:bg-blue-500/5 blur-2xl'
        }`}
      />

      {/* Supercar Instrument Dial */}
      <div className="relative w-full aspect-[380/290] flex items-center justify-center">
        <svg
          viewBox="0 0 380 290"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Speed Track Gradient (Cyan -> Electric Blue -> Violet -> Crimson Redline) */}
            <linearGradient id="supercarSpeedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="80%" stopColor="#8b5cf6" />
              <stop offset="90%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            {/* Glowing Supercar Needle Gradient */}
            <linearGradient id="supercarNeedleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="90%" stopColor="#fca5a5" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Glowing Laser Filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Center Pivot Metallic Radial */}
            <radialGradient id="centerHubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>

          {/* 1. Outer Bezel Track with Mechanical Punctures */}
          <circle
            cx={cx}
            cy={cy}
            r={radius + 14}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            strokeLinecap="round"
            className="text-slate-300 dark:text-slate-800"
          />

          {/* 2. Background Gauge Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(145 ${cx} ${cy})`}
            className="text-slate-200 dark:text-slate-800"
          />

          {/* High-speed Redline sector highlight at 500-1000 Mbps */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength * 0.12} ${circumference}`}
            strokeDashoffset={-arcLength * 0.88}
            strokeLinecap="round"
            transform={`rotate(145 ${cx} ${cy})`}
            className="opacity-30"
          />

          {/* 3. Active Speed Sweep Laser Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="url(#supercarSpeedGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(145 ${cx} ${cy})`}
            filter="url(#gaugeGlow)"
            className="transition-all duration-150 ease-out"
          />

          {/* 4. Precision Sub-ticks */}
          {renderedSubTicks.map((st) => (
            <line
              key={`sub-${st.val}`}
              x1={st.x1}
              y1={st.y1}
              x2={st.x2}
              y2={st.y2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-300 dark:text-slate-700"
            />
          ))}

          {/* 5. Major Ticks & Racing Italic Numerals */}
          {renderedMajorTicks.map((tick) => (
            <g key={`major-${tick.value}`}>
              {/* Tick Mark */}
              <line
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={
                  tick.isRedline
                    ? '#ef4444'
                    : tick.isPassed
                    ? '#0284c7'
                    : 'currentColor'
                }
                strokeWidth={2.5}
                strokeLinecap="round"
                className={tick.isRedline || tick.isPassed ? '' : 'text-slate-400 dark:text-slate-600'}
              />

              {/* Major Scale Number (Bold Italic Monospace) */}
              <text
                x={tick.tx}
                y={tick.ty}
                textAnchor="middle"
                dominantBaseline="central"
                className={`font-mono text-[11px] font-bold italic select-none ${
                  tick.isRedline
                    ? 'fill-red-500 dark:fill-red-400'
                    : tick.isPassed
                    ? 'fill-sky-600 dark:fill-sky-400 font-extrabold'
                    : 'fill-slate-500 dark:fill-slate-400'
                }`}
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* REDLINE Label near 1G mark */}
          <text
            x={cx + 66}
            y={cy + 78}
            className="text-[8px] font-mono font-black italic uppercase tracking-wider fill-red-500 opacity-60 select-none"
          >
            REDLINE
          </text>

          {/* 6. Supercar Racing Needle (Rotates in the upper 250° zone only) */}
          <g
            transform={`rotate(${targetAngle} ${cx} ${cy})`}
            className="transition-transform duration-150 ease-out"
          >
            {/* Needle Trail Glow */}
            <line
              x1={cx}
              y1={cy + 16}
              x2={cx}
              y2={cy - radius + 8}
              stroke="url(#supercarNeedleGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#gaugeGlow)"
              opacity="0.5"
            />

            {/* Aerodynamic Needle Blade */}
            <path
              d={`M ${cx - 3} ${cy + 10} L ${cx - 0.7} ${cy - radius + 10} L ${cx + 0.7} ${cy - radius + 10} L ${cx + 3} ${cy + 10} Z`}
              fill="url(#supercarNeedleGrad)"
              stroke="#ffffff"
              strokeWidth="0.3"
            />

            {/* Needle Glowing White Core */}
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - radius + 8}
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Needle Counterweight Fin */}
            <polygon
              points={`${cx - 4},${cy + 8} ${cx},${cy + 20} ${cx + 4},${cy + 8} ${cx},${cy + 12}`}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="0.8"
            />
          </g>

          {/* 7. Center Hub Pivot (Machined Titanium / Alloy Look) */}
          <circle
            cx={cx}
            cy={cy}
            r={15}
            fill="url(#centerHubGrad)"
            stroke="currentColor"
            strokeWidth="1.8"
            className="text-slate-400 dark:text-slate-600 shadow-md"
          />
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.2"
            className={activeTesting ? 'animate-pulse' : ''}
          />
          <circle
            cx={cx}
            cy={cy}
            r={2.5}
            fill={activeTesting ? '#38bdf8' : '#94a3b8'}
          />
        </svg>

        {/* 8. Lower Digital Speed Telemetry Display (Clean floating text, no background box) */}
        {/* Uses font-mono, italic, bold/black for complete consistency with gauge scale text! */}
        <div className="absolute inset-x-0 bottom-5 sm:bottom-6 flex flex-col items-center justify-center pointer-events-none z-10">
          {/* Stage Name in English & Italic Monospace font */}
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-mono text-[11px] sm:text-xs font-black italic uppercase tracking-widest mb-1 ${
              numericVal > 500
                ? 'text-red-500 dark:text-red-400'
                : 'text-sky-500 dark:text-sky-400'
            }`}
          >
            {getStageTitle()}
          </motion.div>

          {/* Speed Digital Value & Unit in Italic Monospace font */}
          <div className="flex items-baseline justify-center gap-1.5 leading-none">
            <span
              id="speedometer-value"
              className="text-4xl sm:text-[44px] font-mono font-black italic tracking-tighter text-slate-900 dark:text-white tabular-nums leading-none drop-shadow-xs"
            >
              {numericVal > 0 ? numericVal.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs sm:text-sm font-mono font-extrabold italic uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              {stage === 'ping' ? 'MS' : 'MBPS'}
            </span>
          </div>
        </div>
      </div>

      {/* English Status Pill in Italic Monospace font */}
      <div
        id="speedtest-status-pill"
        className={`mt-2 mb-3.5 px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-bold italic uppercase tracking-wider flex items-center gap-2 border transition-all ${
          stage === 'completed'
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
            : activeTesting
            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-2xs'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
        }`}
      >
        {activeTesting ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
        ) : stage === 'completed' ? (
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
        )}
        <span>{getStatusMessage()}</span>
      </div>

      {/* Start / Retest / Stop Button with Italic Monospace font */}
      <div>
        {!activeTesting ? (
          <motion.button
            id="start-speedtest-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="px-9 sm:px-10 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-mono font-black italic uppercase tracking-wider text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            {stage === 'completed' ? (
              <RotateCcw className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{stage === 'completed' ? 'RETEST' : 'START TEST'}</span>
          </motion.button>
        ) : (
          <motion.button
            id="stop-speedtest-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStop}
            className="px-8 py-3 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 font-mono font-black italic uppercase tracking-wider text-sm hover:bg-rose-500/20 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>STOP TEST</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
