import React from 'react';
import { LiveDataPoint } from '../types';

interface LiveSpeedChartProps {
  dataPoints?: LiveDataPoint[];
  data?: LiveDataPoint[];
  currentSpeed?: number;
  stage?: string;
}

export const LiveSpeedChart: React.FC<LiveSpeedChartProps> = ({
  dataPoints,
  data,
  currentSpeed = 0,
  stage = 'idle',
}) => {
  const safeData = Array.isArray(dataPoints) ? dataPoints : Array.isArray(data) ? data : [];
  const width = 640;
  const height = 180;
  const padding = { top: 20, right: 25, bottom: 30, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Compute max speed and max time safely
  const speedList = safeData.map((d) => d.speed).filter((s) => typeof s === 'number' && Number.isFinite(s));
  const maxSpeedValue = Math.max(
    10,
    ...(speedList.length > 0 ? speedList : [0]),
    typeof currentSpeed === 'number' && Number.isFinite(currentSpeed) ? currentSpeed : 0
  );
  // Round up to nice number (e.g. 20, 50, 100, 200...)
  const yMax = Math.ceil(maxSpeedValue * 1.15);

  const timeList = safeData.map((d) => d.time).filter((t) => typeof t === 'number' && Number.isFinite(t));
  const maxTime = Math.max(5, ...(timeList.length > 0 ? timeList : [0]));

  // Scale functions
  const getX = (t: number) => padding.left + (maxTime > 0 ? (t / maxTime) * plotWidth : 0);
  const getY = (s: number) => padding.top + plotHeight - (yMax > 0 ? (s / yMax) * plotHeight : 0);

  // Generate SVG path for line and area
  const points = safeData.map((d) => ({
    x: getX(d.time),
    y: getY(d.speed),
  }));

  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth bezier interpolation
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      linePath += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = padding.top + plotHeight;
    areaPath = `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  // Y-axis ticks
  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  return (
    <div
      id="live-speed-chart-card"
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Biểu đồ tốc độ thời gian thực
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Tốc độ hiện tại:
            <strong className="text-blue-600 dark:text-blue-400 font-mono">
              {currentSpeed.toFixed(1)} Mbps
            </strong>
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        {safeData.length === 0 ? (
          <div className="h-[180px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-600 text-xs">
            <svg
              className="w-8 h-8 mb-2 opacity-50 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Nhấn &ldquo;Bắt đầu kiểm tra&rdquo; để quan sát biểu đồ biến thiên tốc độ thời gian thực</span>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[180px] overflow-visible select-none"
          >
            <defs>
              <linearGradient id="chartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {yTicks.map((tickVal) => {
              const y = getY(tickVal);
              return (
                <g key={tickVal}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + plotWidth}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-slate-100 dark:text-slate-800/80"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
                  >
                    {tickVal}
                  </text>
                </g>
              );
            })}

            {/* X-axis base line */}
            <line
              x1={padding.left}
              y1={padding.top + plotHeight}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
            />

            {/* Time labels */}
            {[0, 2, 4, 6, 8].filter((t) => t <= maxTime).map((t) => (
              <text
                key={t}
                x={getX(t)}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
              >
                {t}s
              </text>
            ))}

            {/* Filled Area */}
            {areaPath && (
              <path d={areaPath} fill="url(#chartAreaGradient)" className="transition-all" />
            )}

            {/* Glowing Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all"
              />
            )}

            {/* Current point highlight */}
            {points.length > 0 && (
              <g>
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="5"
                  fill="#38bdf8"
                  className="animate-ping opacity-75"
                />
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="4"
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        )}
      </div>

      <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Giai đoạn: {stage === 'download' ? 'Tải xuống' : stage === 'upload' ? 'Tải lên' : 'Độ trễ / Sẵn sàng'}</span>
        <span>Đơn vị: Megabit trên giây (Mbps)</span>
      </div>
    </div>
  );
};
