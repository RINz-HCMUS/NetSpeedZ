import React, { useState } from 'react';
import { ArrowRight, Copy, Eye, EyeOff, Globe, HelpCircle, Info, MapPin, RefreshCw, Server, Wifi } from 'lucide-react';
import { NetworkInfo, ServerNode } from '../types';
import { getResolvedServerDetails, getServerRegionCode } from '../utils/speedtest';

interface NetworkInfoCardProps {
  info: NetworkInfo | null;
  selectedServer: ServerNode;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenPrivacy: () => void;
  onOpenServerModal: () => void;
  onOpenSecurityModal?: () => void;
  disabled?: boolean;
}

export const NetworkInfoCard: React.FC<NetworkInfoCardProps> = ({
  info,
  selectedServer,
  isLoading,
  onRefresh,
  onOpenServerModal,
  disabled = false,
}) => {
  // Default to hiding both IPv4 and IPv6 completely for maximum privacy
  const [showRealIpv4, setShowRealIpv4] = useState(false);
  const [showRealIpv6, setShowRealIpv6] = useState(false);
  const [copiedType, setCopiedType] = useState<'v4' | 'v6' | null>(null);
  const [showRefreshTip, setShowRefreshTip] = useState(false);

  // Default fully masked values
  const maskedFullIpv4 = '••••••••••••';
  const maskedFullIpv6 = '••••:••••:••••:••••:••••:••••:••••:••••';

  const displayIpv4 = info?.ipv4
    ? showRealIpv4
      ? info.ipv4
      : maskedFullIpv4
    : isLoading
      ? 'Đang phát hiện...'
      : 'Không khả dụng';

  const displayIpv6 = info?.ipv6
    ? showRealIpv6
      ? info.ipv6
      : maskedFullIpv6
    : isLoading
      ? 'Đang kiểm tra...'
      : 'Chưa hỗ trợ IPv6';

  const copyToClipboard = (text: string, type: 'v4' | 'v6') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const regionCode = getServerRegionCode(selectedServer);
  const resolvedServer = getResolvedServerDetails(selectedServer, info);

  return (
    <div
      id="network-info-card"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors scroll-mt-20"
    >
      {/* Card Header: Tiêu đề gọn gàng & nút Làm mới có giải thích rõ mục đích */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Wifi className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Thông số mạng &amp; Điểm kết nối
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Địa chỉ IP, nhà cung cấp (ISP) và trạm đo kiểm tra
          </p>
        </div>

        {/* Header Right: Nút Làm mới với giải thích mục đích rõ ràng */}
        <div className="flex items-center gap-2 relative">
          <button
            id="refresh-network-info-btn"
            onClick={onRefresh}
            disabled={isLoading || disabled}
            title="Nhấn để dò lại IP & Nhà mạng mới nhất (sau khi đổi Wi-Fi hoặc bật/tắt VPN)"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-500' : 'text-blue-600 dark:text-blue-400'}`} />
            <span>Làm mới IP</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRefreshTip(!showRefreshTip)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded cursor-pointer"
            title="Tìm hiểu công dụng của nút Làm mới"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Tooltip giải thích công dụng của nút Làm mới */}
          {showRefreshTip && (
            <div className="absolute right-0 top-10 z-20 w-72 p-3 bg-slate-900 text-slate-100 rounded-xl shadow-xl text-xs border border-slate-700 leading-relaxed animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-bold text-blue-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Mục đích nút "Làm mới":
                </span>
                <button
                  onClick={() => setShowRefreshTip(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  &times;
                </button>
              </div>
              Gửi yêu cầu dò lại địa chỉ IPv4/IPv6 công cộng và truy vấn lại ASN/ISP mới nhất. Rất hữu ích khi bạn vừa chuyển Wi-Fi, đổi mạng 4G/5G hoặc bật/tắt VPN.
            </div>
          )}
        </div>
      </div>

      {/* 3.2 Đặt 3 mục thông tin mạng lên trước: ISP, IPv4, IPv6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mục 1: Nhà cung cấp mạng (ISP) */}
        <div
          id="info-card-isp"
          className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Nhà cung cấp mạng (ISP)</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {info?.isp || (isLoading ? 'Đang nhận diện...' : 'Nhà mạng Internet')}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{[info?.city, info?.country].filter(Boolean).join(', ') || 'Việt Nam'}</span>
            </div>
          </div>
          <div className="pt-2 mt-3 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400 dark:text-slate-500 truncate">
            Tổ chức: {info?.org || info?.asn || 'AS131429'}
          </div>
        </div>

        {/* Mục 2: Địa chỉ IPv4 */}
        <div
          id="info-card-ipv4"
          className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span>Địa chỉ IPv4</span>
              </div>
              {info?.ipv4 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowRealIpv4(!showRealIpv4)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    title={showRealIpv4 ? 'Ẩn địa chỉ IP' : 'Nhấn để hiện địa chỉ IP đầy đủ'}
                  >
                    {showRealIpv4 ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showRealIpv4 ? 'Ẩn' : 'Hiện'}</span>
                  </button>
                  <button
                    onClick={() => info.ipv4 && copyToClipboard(info.ipv4, 'v4')}
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    title="Sao chép địa chỉ IPv4"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedType === 'v4' ? 'Đã chép' : 'Chép'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-base font-mono font-bold text-slate-900 dark:text-white tracking-wider my-1">
              {displayIpv4}
            </div>
          </div>

          <div className="pt-2 mt-3 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400 dark:text-slate-500">
            {showRealIpv4 ? 'Đang hiện địa chỉ IP thực' : 'Đã che toàn bộ để bảo vệ quyền riêng tư'}
          </div>
        </div>

        {/* Mục 3: Địa chỉ IPv6 (với break-all ngắt dòng đầy đủ) */}
        <div
          id="info-card-ipv6"
          className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span>Địa chỉ IPv6</span>
              </div>
              {info?.ipv6 ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowRealIpv6(!showRealIpv6)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    title={showRealIpv6 ? 'Ẩn địa chỉ IPv6' : 'Nhấn để hiện địa chỉ IPv6 đầy đủ'}
                  >
                    {showRealIpv6 ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showRealIpv6 ? 'Ẩn' : 'Hiện'}</span>
                  </button>
                  <button
                    onClick={() => info.ipv6 && copyToClipboard(info.ipv6, 'v6')}
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    title="Sao chép địa chỉ IPv6"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedType === 'v6' ? 'Đã chép' : 'Chép'}</span>
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                  IPv4 Only
                </span>
              )}
            </div>

            {/* Crucial: break-all font-mono leading-relaxed to show complete long IPv6 addresses without truncating */}
            <div
              className={`text-xs sm:text-sm font-mono font-bold break-all leading-relaxed my-1 ${
                info?.ipv6
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500 font-normal italic'
              }`}
            >
              {displayIpv6}
            </div>
          </div>

          <div className="pt-2 mt-3 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400 dark:text-slate-500">
            {info?.ipv6
              ? (showRealIpv6 ? 'Đang hiện địa chỉ IPv6 thực' : 'Đã che toàn bộ để bảo vệ quyền riêng tư')
              : 'Giao thức thế hệ mới (tùy thuộc modem & nhà mạng)'}
          </div>
        </div>
      </div>

      {/* 3.1 & 3.2 Mục Trạm đo hiện tại được đưa xuống SAU 3 mục thông tin, tách 2 dòng rõ ràng, có viền Region */}
      <div
        id="current-server-banner"
        className="mt-4 p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            {/* Dòng 1: Tên trạm đo hiện tại + Region viền rõ nét */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                Trạm đo hiện tại:
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {resolvedServer.flag} {resolvedServer.title}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider border border-blue-300 dark:border-blue-700 bg-white/90 dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-2xs">
                {resolvedServer.regionCode}
              </span>
              {selectedServer.isAuto && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">
                  Tự động
                </span>
              )}
            </div>

            {/* Dòng 2: Địa điểm và thông tin cụm máy chủ trạm đo */}
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {resolvedServer.location}
              </span>
              <span>&bull;</span>
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {resolvedServer.providerOrDatacenter}
              </span>
            </div>
          </div>
        </div>

        {/* Nút Đổi trạm đo */}
        <button
          id="card-change-server-btn"
          onClick={onOpenServerModal}
          disabled={disabled}
          className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100/60 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
          title="Bấm để chọn máy chủ kiểm tra khác"
        >
          <span>Đổi trạm đo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

