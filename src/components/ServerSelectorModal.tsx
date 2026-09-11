import React, { useState } from 'react';
import { Check, Globe2, Radio, RefreshCw, Server, X, Zap } from 'lucide-react';
import { NetworkInfo, ServerNode } from '../types';
import { getResolvedServerDetails, getServerRegionCode, SPEEDTEST_SERVERS } from '../utils/speedtest';

interface ServerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: ServerNode;
  onSelectServer: (server: ServerNode) => void;
  networkInfo?: NetworkInfo | null;
}

export const ServerSelectorModal: React.FC<ServerSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedServer,
  onSelectServer,
  networkInfo,
}) => {
  const [pings, setPings] = useState<Record<string, number | 'testing' | 'error'>>({});
  const [isPingingAll, setIsPingingAll] = useState(false);

  if (!isOpen) return null;

  const pingServer = async (server: ServerNode) => {
    setPings((prev) => ({ ...prev, [server.id]: 'testing' }));
    try {
      const start = performance.now();
      await fetch(`${server.pingUrl}&probe=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        mode: 'cors',
      });
      const latency = Math.max(1, Math.round(performance.now() - start));
      setPings((prev) => ({ ...prev, [server.id]: latency }));
    } catch {
      setPings((prev) => ({ ...prev, [server.id]: 'error' }));
    }
  };

  const pingAll = async () => {
    setIsPingingAll(true);
    for (const server of SPEEDTEST_SERVERS) {
      await pingServer(server);
    }
    setIsPingingAll(false);
  };

  return (
    <div
      id="server-selector-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="server-selector-modal"
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Sticky) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Chọn trạm đo tốc độ (Speedtest Server)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mặc định hệ thống tự chọn trạm gần nhất để có kết quả chính xác nhất
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar inside modal */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Có {SPEEDTEST_SERVERS.length} trạm đo khả dụng
          </span>
          <button
            onClick={pingAll}
            disabled={isPingingAll}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPingingAll ? 'animate-spin' : ''}`} />
            <span>{isPingingAll ? 'Đang đo ping...' : 'Đo độ trễ tất cả trạm'}</span>
          </button>
        </div>

        {/* Server List */}
        <div className="p-3 sm:p-4 space-y-2 overflow-y-auto flex-1 overscroll-contain">
          {SPEEDTEST_SERVERS.map((server) => {
            const isSelected = selectedServer.id === server.id;
            const currentPing = pings[server.id];
            const resolved = getResolvedServerDetails(server, networkInfo || null);
            const regionCode = resolved.regionCode;

            return (
              <div
                key={server.id}
                id={`server-item-${server.id}`}
                onClick={() => {
                  onSelectServer(server);
                  onClose();
                }}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/80 shadow-xs'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl select-none shrink-0">{resolved.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {server.isAuto ? resolved.title : server.name}
                      </h3>
                      {/* 2.1 Viền Border rõ nét cho Region code */}
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider border border-slate-300 dark:border-slate-600 bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                        {regionCode}
                      </span>
                      {server.isAuto && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                          Khuyên dùng
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {server.isAuto
                        ? `${resolved.location} · ${resolved.providerOrDatacenter}`
                        : `${server.city}, ${server.country} · ${server.provider}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Ping pill */}
                  {currentPing === 'testing' ? (
                    <span className="text-xs font-mono text-blue-500 animate-pulse">Đang đo...</span>
                  ) : typeof currentPing === 'number' ? (
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        currentPing < 35
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : currentPing < 90
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {currentPing} ms
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pingServer(server);
                      }}
                      className="text-[11px] text-slate-400 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
                      title="Đo ping trạm này"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Thử ping</span>
                    </button>
                  )}

                  {/* Radio / Check mark */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info (Sticky) */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="truncate pr-2">Gợi ý: Đo với trạm quốc tế (Mỹ/Đức) để kiểm tra băng thông cáp quang</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

