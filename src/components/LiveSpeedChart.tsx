import React, { useState, useRef, useMemo } from 'react';
import { ArrowDown, ArrowUp, Activity, CheckCircle2, Radio } from 'lucide-react';
import { LiveDataPoint, SpeedMetrics, TestStage } from '../types';

interface LiveSpeedChartProps {
  dataPoints?: LiveDataPoint[];
  data?: LiveDataPoint[];
  currentSpeed?: number;
  stage?: TestStage | string;
  metrics?: SpeedMetrics;
}

export const LiveSpeedChart: React.FC<LiveSpeedChartProps> = ({
  dataPoints,
  data,
  currentSpeed = 0,
  stage = 'idle',
  metrics,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'download' | 'upload'>('all');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const safeData = Array.isArray(dataPoints) ? dataPoints : Array.isArray(data) ? data : [];

  // Separate download and upload data points into two distinct series
  const downloadData = useMemo(
    () => safeData.filter((d) => d.stage === 'download'),
    [safeData]
  );
  const uploadData = useMemo(
    () => safeData.filter((d) => d.stage === 'upload'),
    [safeData]
  );

  const width = 680;
  const height = 210;
  const padding = { top: 25, right: 28, bottom: 35, left: 50 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Max speed across both series and metrics
  const maxSpeedValue = useMemo(() => {
    const allSpeeds = safeData
      .map((d) => d.speed)
      .filter((s) => typeof s === 'number' && Number.isFinite(s));
    return Math.max(
      15,
      ...allSpeeds,
      metrics?.download || 0,
      metrics?.upload || 0,
      typeof currentSpeed === 'number' && Number.isFinite(currentSpeed) ? currentSpeed : 0
    );
  }, [safeData, metrics, currentSpeed]);

  // Round up to an aesthetically pleasing ceiling
  const yMax = Math.ceil((maxSpeedValue * 1.15) / 10) * 10;

  // Max time across all samples (or minimum 7s for standard speed test run)
  const maxTime = useMemo(() => {
    const allTimes = safeData
      .map((d) => d.time)
      .filter((t) => typeof t === 'number' && Number.isFinite(t));
    return Math.max(7, ...allTimes);
  }, [safeData]);

  // Scaling helpers
  const getX = (t: number) => {
    const clampedT = Math.max(0, Math.min(t, maxTime));
    return padding.left + (clampedT / maxTime) * plotWidth;
  };

  const getY = (s: number) => {
    const clampedS = Math.max(0, Math.min(s, yMax));
    return padding.top + plotHeight - (clampedS / yMax) * plotHeight;
  };

  // Convert samples to SVG coordinates
  const downloadPoints = useMemo(
    () => downloadData.map((d) => ({ x: getX(d.time), y: getY(d.speed), raw: d })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [downloadData, maxTime, yMax]
  );

  const uploadPoints = useMemo(
    () => uploadData.map((d) => ({ x: getX(d.time), y: getY(d.speed), raw: d })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadData, maxTime, yMax]
  );

  // Bezier curve generator
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y} L ${pts[0].x + 0.1} ${pts[0].y}`;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const buildAreaPath = (pts: { x: number; y: number }[], linePath: string) => {
    if (pts.length === 0 || !linePath) return '';
    const firstX = pts[0].x;
    const lastX = pts[pts.length - 1].x;
    const bottomY = padding.top + plotHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const downloadLinePath = useMemo(() => buildSmoothPath(downloadPoints), [downloadPoints]);
  const downloadAreaPath = useMemo(
    () => buildAreaPath(downloadPoints, downloadLinePath),
    [downloadPoints, downloadLinePath]
  );

  const uploadLinePath = useMemo(() => buildSmoothPath(uploadPoints), [uploadPoints]);
  const uploadAreaPath = useMemo(
    () => buildAreaPath(uploadPoints, uploadLinePath),
    [uploadPoints, uploadLinePath]
  );

  // Y-axis grid ticks (4 ticks)
  const yTicks = useMemo(() => {
    return [
      0,
      Math.round((yMax * 0.33) / 5) * 5,
      Math.round((yMax * 0.66) / 5) * 5,
      yMax,
    ];
  }, [yMax]);

  // X-axis time ticks
  const xTicks = useMemo(() => {
    const step = maxTime > 10 ? 3 : 2;
    const ticks: number[] = [];
    for (let t = 0; t <= maxTime; t += step) {
      ticks.push(t);
    }
    if (ticks[ticks.length - 1] < maxTime) {
      ticks.push(Math.round(maxTime));
    }
    return ticks;
  }, [maxTime]);

  // Determine current active display values for legend
  const downloadDisplayVal = useMemo(() => {
    if (stage === 'download') return currentSpeed.toFixed(1);
    if (metrics?.download && metrics.download > 0) return metrics.download.toFixed(1);
    if (downloadData.length > 0) return downloadData[downloadData.length - 1].speed.toFixed(1);
    return null;
  }, [stage, currentSpeed, metrics, downloadData]);

  const uploadDisplayVal = useMemo(() => {
    if (stage === 'upload') return currentSpeed.toFixed(1);
    if (metrics?.upload && metrics.upload > 0) return metrics.upload.toFixed(1);
    if (uploadData.length > 0) return uploadData[uploadData.length - 1].speed.toFixed(1);
    return null;
  }, [stage, currentSpeed, metrics, uploadData]);

  // Touch and Mouse Scrubber
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;

    // Scale to viewBox coordinates
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const svgX = relativeX * scaleX;
    const svgY = relativeY * scaleY;

    if (svgX >= padding.left && svgX <= padding.left + plotWidth) {
      const timeAtCursor = ((svgX - padding.left) / plotWidth) * maxTime;
      setTouchPos({ x: svgX, y: svgY });
      setHoverIndex(timeAtCursor);
    }
  };

  const handlePointerLeave = () => {
    setTouchPos(null);
    setHoverIndex(null);
  };

  // Find nearest values at hover time
  const hoverStats = useMemo(() => {
    if (hoverIndex === null) return null;
    const t = hoverIndex;

    const findNearest = (pts: LiveDataPoint[]) => {
      if (pts.length === 0) return null;
      return pts.reduce((prev, curr) =>
        Math.abs(curr.time - t) < Math.abs(prev.time - t) ? curr : prev
      );
    };

    const dlMatch = findNearest(downloadData);
    const ulMatch = findNearest(uploadData);

    return {
      time: Math.round(t * 10) / 10,
      download: dlMatch?.speed ?? null,
      upload: ulMatch?.speed ?? null,
    };
  }, [hoverIndex, downloadData, uploadData]);

  const isTestActive = stage === 'download' || stage === 'upload' || stage === 'ping';
  const isCompleted = stage === 'completed';

  return (
    <div
      id="live-speed-chart-card"
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all flex flex-col scroll-mt-20"
    >
      {/* Header: Title, Live Status & Multi-Line Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        {/* Title & Active State Badge */}
        <div className="flex items-center gap-2.5">
          {isTestActive ? (
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </div>
          ) : isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <Activity className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          )}

          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Biểu đồ tốc độ thời gian thực</span>
            {stage === 'download' && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-full border border-cyan-200 dark:border-cyan-800">
                Đang đo Tải xuống
              </span>
            )}
            {stage === 'upload' && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800">
                Đang đo Tải lên
              </span>
            )}
            {isCompleted && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                Hoàn thành
              </span>
            )}
          </h3>
        </div>

        {/* Legend Pills with Distinct Colors & Values */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Download Legend Pill */}
          <div
            onClick={() =>
              setActiveFilter((prev) => (prev === 'download' ? 'all' : 'download'))
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-all ${
              activeFilter === 'download'
                ? 'bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-semibold ring-2 ring-cyan-500/20'
                : activeFilter === 'upload'
                ? 'opacity-40 border-slate-200 dark:border-slate-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Nhấn để lọc xem chỉ đường Tải xuống"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-xs flex-shrink-0" />
            <span className="flex items-center gap-1 font-medium">
              <ArrowDown className="w-3 h-3 text-cyan-500 inline" />
              Tải xuống:
            </span>
            <strong className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              {downloadDisplayVal !== null ? `${downloadDisplayVal} Mbps` : '--'}
            </strong>
          </div>

          {/* Upload Legend Pill */}
          <div
            onClick={() => setActiveFilter((prev) => (prev === 'upload' ? 'all' : 'upload'))}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-all ${
              activeFilter === 'upload'
                ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold ring-2 ring-purple-500/20'
                : activeFilter === 'download'
                ? 'opacity-40 border-slate-200 dark:border-slate-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Nhấn để lọc xem chỉ đường Tải lên"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs flex-shrink-0" />
            <span className="flex items-center gap-1 font-medium">
              <ArrowUp className="w-3 h-3 text-purple-500 inline" />
              Tải lên:
            </span>
            <strong className="font-mono text-purple-600 dark:text-purple-400 font-bold">
              {uploadDisplayVal !== null ? `${uploadDisplayVal} Mbps` : '--'}
            </strong>
          </div>

          {/* All Series Reset Button if filtered */}
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Hiện cả hai
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden select-none touch-pan-y">
        {safeData.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs gap-2">
            <Radio className="w-8 h-8 opacity-40 text-cyan-500 animate-pulse" />
            <span>Đang thiết lập tiến trình đo kiểm băng thông đa luồng...</span>
          </div>
        ) : (
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-[190px] sm:h-[210px] overflow-visible select-none cursor-crosshair"
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseLeave={handlePointerLeave}
              onTouchMove={(e) => {
                if (e.touches.length > 0) {
                  handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchEnd={handlePointerLeave}
              onTouchCancel={handlePointerLeave}
            >
              <defs>
                {/* Download Area Gradient (Cyan / Sky) */}
                <linearGradient id="downloadAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
                  <stop offset="70%" stopColor="#0891b2" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                </linearGradient>

                {/* Upload Area Gradient (Violet / Purple) */}
                <linearGradient id="uploadAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.28" />
                  <stop offset="70%" stopColor="#7e22ce" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Ticks */}
              {yTicks.map((tickVal) => {
                const y = getY(tickVal);
                return (
                  <g key={`ytick-${tickVal}`}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + plotWidth}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="3 4"
                      className="text-slate-100 dark:text-slate-800/80"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500 select-none"
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

              {/* X-axis Time labels */}
              {xTicks.map((t) => (
                <text
                  key={`xtick-${t}`}
                  x={getX(t)}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500 select-none"
                >
                  {t}s
                </text>
              ))}

              {/* ==================================================== */}
              {/* 1. DOWNLOAD SERIES (CYAN) - INDEPENDENT PATH         */}
              {/* ==================================================== */}
              {(activeFilter === 'all' || activeFilter === 'download') && (
                <g id="download-series-group">
                  {/* Download Filled Area */}
                  {downloadAreaPath && (
                    <path
                      d={downloadAreaPath}
                      fill="url(#downloadAreaGrad)"
                      className="transition-opacity duration-300"
                    />
                  )}

                  {/* Download Glow Line */}
                  {downloadLinePath && (
                    <path
                      d={downloadLinePath}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all"
                    />
                  )}

                  {/* Download Marker: Active Pulse during download, Crisp Static Dot when finished */}
                  {downloadPoints.length > 0 && (
                    <g id="download-tip-indicator">
                      {stage === 'download' ? (
                        <>
                          {/* Native SVG animate ring (Never drifts or runs off canvas) */}
                          <circle
                            cx={downloadPoints[downloadPoints.length - 1].x}
                            cy={downloadPoints[downloadPoints.length - 1].y}
                            r="8"
                            fill="#06b6d4"
                            opacity="0.4"
                          >
                            <animate
                              attributeName="r"
                              values="4.5;11;4.5"
                              dur="1.2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.6;0.1;0.6"
                              dur="1.2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle
                            cx={downloadPoints[downloadPoints.length - 1].x}
                            cy={downloadPoints[downloadPoints.length - 1].y}
                            r="4.5"
                            fill="#06b6d4"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </>
                      ) : (
                        /* Static neat marker dot once download is complete */
                        <circle
                          cx={downloadPoints[downloadPoints.length - 1].x}
                          cy={downloadPoints[downloadPoints.length - 1].y}
                          r="4"
                          fill="#06b6d4"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* ==================================================== */}
              {/* 2. UPLOAD SERIES (PURPLE) - INDEPENDENT PATH         */}
              {/* ==================================================== */}
              {(activeFilter === 'all' || activeFilter === 'upload') && (
                <g id="upload-series-group">
                  {/* Upload Filled Area */}
                  {uploadAreaPath && (
                    <path
                      d={uploadAreaPath}
                      fill="url(#uploadAreaGrad)"
                      className="transition-opacity duration-300"
                    />
                  )}

                  {/* Upload Glow Line */}
                  {uploadLinePath && (
                    <path
                      d={uploadLinePath}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all"
                    />
                  )}

                  {/* Upload Marker: Active Pulse during upload, Crisp Static Dot when finished */}
                  {uploadPoints.length > 0 && (
                    <g id="upload-tip-indicator">
                      {stage === 'upload' ? (
                        <>
                          {/* Native SVG animate ring (Never drifts or runs off canvas) */}
                          <circle
                            cx={uploadPoints[uploadPoints.length - 1].x}
                            cy={uploadPoints[uploadPoints.length - 1].y}
                            r="8"
                            fill="#a855f7"
                            opacity="0.4"
                          >
                            <animate
                              attributeName="r"
                              values="4.5;11;4.5"
                              dur="1.2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.6;0.1;0.6"
                              dur="1.2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle
                            cx={uploadPoints[uploadPoints.length - 1].x}
                            cy={uploadPoints[uploadPoints.length - 1].y}
                            r="4.5"
                            fill="#a855f7"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </>
                      ) : (
                        /* Static neat marker dot once upload is complete */
                        <circle
                          cx={uploadPoints[uploadPoints.length - 1].x}
                          cy={uploadPoints[uploadPoints.length - 1].y}
                          r="4"
                          fill="#a855f7"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* ==================================================== */}
              {/* 3. INTERACTIVE TOUCH / HOVER SCRUBBER CROSSHAIR     */}
              {/* ==================================================== */}
              {touchPos && hoverStats && (
                <g id="chart-scrubber-group">
                  {/* Vertical Crosshair Line */}
                  <line
                    x1={touchPos.x}
                    y1={padding.top}
                    x2={touchPos.x}
                    y2={padding.top + plotHeight}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Intersect point for Download if available */}
                  {hoverStats.download !== null && (
                    <circle
                      cx={touchPos.x}
                      cy={getY(hoverStats.download)}
                      r="4.5"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}

                  {/* Intersect point for Upload if available */}
                  {hoverStats.upload !== null && (
                    <circle
                      cx={touchPos.x}
                      cy={getY(hoverStats.upload)}
                      r="4.5"
                      fill="#a855f7"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                </g>
              )}
            </svg>

            {/* Floating Tooltip Pill during Touch / Hover */}
            {touchPos && hoverStats && (
              <div
                className="absolute pointer-events-none z-20 py-1.5 px-3 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] shadow-xl border border-slate-700/80 flex flex-col gap-1 transition-transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(touchPos.x / width) * 100}%`,
                  top: `${Math.max(28, (touchPos.y / height) * 100 - 14)}%`,
                }}
              >
                <div className="font-mono text-slate-400 font-semibold border-b border-slate-700/60 pb-0.5">
                  ⏱️ Thời gian: {hoverStats.time}s
                </div>
                <div className="flex items-center gap-3">
                  {hoverStats.download !== null && (
                    <span className="text-cyan-300 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Tải xuống: <strong>{hoverStats.download.toFixed(1)} Mbps</strong>
                    </span>
                  )}
                  {hoverStats.upload !== null && (
                    <span className="text-purple-300 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Tải lên: <strong>{hoverStats.upload.toFixed(1)} Mbps</strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sub-Caption */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span>💡 Chạm hoặc rê chuột trên biểu đồ để xem chi tiết tốc độ tại từng giây</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Đơn vị: <strong>Mbps (Megabit/giây)</strong></span>
          <span>&bull;</span>
          <span>Trục X: <strong>Thời gian (giây)</strong></span>
        </div>
      </div>
    </div>
  );
};
