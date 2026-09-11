import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  History,
  Trash2,
  Wifi,
} from 'lucide-react';
import { TestHistoryItem } from '../types';
import { formatHistoryServerName, parseHistoryServerForDisplay } from '../utils/speedtest';

interface HistorySectionProps {
  history: TestHistoryItem[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history = [],
  onDelete,
  onClear,
}) => {
  const safeHistory = Array.isArray(history) ? history : [];
  const [showChart, setShowChart] = useState(true);

  // Export to CSV
  const handleExportCSV = () => {
    if (safeHistory.length === 0) return;

    const headers = ['ThoiGian', 'Trạm Đo', 'Ping(ms)', 'Jitter(ms)', 'Download(Mbps)', 'Upload(Mbps)', 'NhaMang', 'IPv4', 'IPv6', 'DanhGia'];
    const rows = safeHistory.map((h) => [
      `"${h.dateStr}"`,
      `"${formatHistoryServerName(h.serverName, h.location)}"`,
      h.ping,
      h.jitter,
      h.download,
      h.upload,
      `"${h.isp}"`,
      `"${h.ipv4 || ''}"`,
      `"${h.ipv6 || ''}"`,
      h.grade,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `speedtest_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (safeHistory.length === 0) return;
    const formattedData = safeHistory.map((h) => ({
      ...h,
      serverName: formatHistoryServerName(h.serverName, h.location),
    }));
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formattedData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `speedtest_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculate stats for SVG history trend chart
  const recentTests = [...safeHistory].slice(0, 10).reverse(); // oldest to newest for left-to-right chart
  const downloadValues = recentTests.map((t) => t.download).filter((v) => typeof v === 'number' && Number.isFinite(v));
  const uploadValues = recentTests.map((t) => t.upload).filter((v) => typeof v === 'number' && Number.isFinite(v));
  const maxDownload = Math.max(10, ...(downloadValues.length > 0 ? downloadValues : [0]));
  const maxUpload = Math.max(10, ...(uploadValues.length > 0 ? uploadValues : [0]));
  const chartMaxSpeed = Math.ceil(Math.max(maxDownload, maxUpload) * 1.15);

  const chartWidth = 600;
  const chartHeight = 160;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 30;
  const plotW = chartWidth - padLeft - padRight;
  const plotH = chartHeight - padTop - padBottom;

  return (
    <div
      id="history-section"
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Lịch sử đo kiểm ({safeHistory.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lưu trữ cục bộ trên thiết bị (Local Storage)
            </p>
          </div>
        </div>

        {safeHistory.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowChart(!showChart)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              <span>{showChart ? 'Ẩn biểu đồ' : 'Xem biểu đồ'}</span>
              {showChart ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={handleExportCSV}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Xuất file CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Xuất file JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-500" />
              <span>JSON</span>
            </button>

            <button
              onClick={onClear}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 cursor-pointer"
              title="Xóa tất cả lịch sử"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa hết</span>
            </button>
          </div>
        )}
      </div>

      {safeHistory.length === 0 ? (
        <div className="py-10 text-center text-slate-400 dark:text-slate-600 text-xs flex flex-col items-center">
          <History className="w-8 h-8 mb-2 opacity-40 text-blue-500" />
          <p className="font-medium text-slate-500 dark:text-slate-400">Chưa có kết quả kiểm tra nào</p>
          <p className="mt-1 text-slate-400 dark:text-slate-500">
            Hãy chạy bài kiểm tra đầu tiên để theo dõi xu hướng tốc độ mạng theo thời gian.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Trend Chart across recent tests */}
          {showChart && recentTests.length > 1 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Xu hướng tốc độ ({recentTests.length} lần gần nhất)
                </span>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                    Download
                  </span>
                  <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-teal-500 inline-block" />
                    Upload
                  </span>
                </div>
              </div>

              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[150px] overflow-visible">
                {/* Horizontal Grid lines */}
                {[0, 0.5, 1].map((frac) => {
                  const y = padTop + plotH * (1 - frac);
                  const val = Math.round(chartMaxSpeed * frac);
                  return (
                    <g key={frac}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={padLeft + plotW}
                        y2={y}
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        className="text-slate-200 dark:text-slate-800"
                      />
                      <text
                        x={padLeft - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Bars or connecting points */}
                {recentTests.map((t, idx) => {
                  const x = padLeft + (idx / (recentTests.length - 1)) * plotW;
                  const dlY = padTop + plotH - (t.download / chartMaxSpeed) * plotH;
                  const upY = padTop + plotH - (t.upload / chartMaxSpeed) * plotH;

                  return (
                    <g key={t.id}>
                      {/* Vertical connector line */}
                      <line
                        x1={x}
                        y1={padTop}
                        x2={x}
                        y2={padTop + plotH}
                        stroke="currentColor"
                        className="text-slate-100 dark:text-slate-800/60"
                      />

                      {/* Download point */}
                      <circle cx={x} cy={dlY} r="4" fill="#2563eb" />
                      {/* Upload point */}
                      <circle cx={x} cy={upY} r="3.5" fill="#14b8a6" />

                      {/* Time text */}
                      <text
                        x={x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500"
                      >
                        #{idx + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Connecting lines for Download */}
                {recentTests.length > 1 && (
                  <>
                    <path
                      d={recentTests.reduce((acc, t, idx) => {
                        const x = padLeft + (idx / (recentTests.length - 1)) * plotW;
                        const y = padTop + plotH - (t.download / chartMaxSpeed) * plotH;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    <path
                      d={recentTests.reduce((acc, t, idx) => {
                        const x = padLeft + (idx / (recentTests.length - 1)) * plotW;
                        const y = padTop + plotH - (t.upload / chartMaxSpeed) * plotH;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                  </>
                )}
              </svg>
            </div>
          )}

          {/* History Records Table / Cards */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Trạm đo</th>
                  <th className="py-2.5 px-3">Ping / Jitter</th>
                  <th className="py-2.5 px-3">Tải xuống</th>
                  <th className="py-2.5 px-3">Tải lên</th>
                  <th className="py-2.5 px-3">Nhà mạng &amp; IP</th>
                  <th className="py-2.5 px-3 text-center">Xếp loại</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {safeHistory.map((item) => {
                  const serverDisplay = parseHistoryServerForDisplay(item.serverName, item.location);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.dateStr}</span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                        title={serverDisplay.fullString}
                      >
                        <div className="flex items-center gap-1.5 max-w-[150px] sm:max-w-[200px]">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {serverDisplay.shortLabel}
                          </span>
                          {serverDisplay.popCode && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-2xs">
                              {serverDisplay.popCode}
                            </span>
                          )}
                        </div>
                      </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {Math.round(item.ping)} ms
                      <span className="text-[11px] text-slate-400 font-normal ml-1">
                        (±{item.jitter.toFixed(1)})
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 font-mono whitespace-nowrap">
                      {item.download.toFixed(1)} Mbps
                    </td>
                    <td className="py-3 px-3 font-bold text-teal-600 dark:text-teal-400 font-mono whitespace-nowrap">
                      {item.upload.toFixed(1)} Mbps
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-[160px] truncate" title={`${item.isp} - IPv4: ${item.ipv4 || 'N/A'}`}>
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.isp}</span>
                      </div>
                      {item.ipv4 && (
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                          {item.ipv4}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block font-bold text-[11px] px-2 py-0.5 rounded-md ${
                          item.grade === 'A+' || item.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.grade === 'B'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Xóa bài kiểm tra này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
