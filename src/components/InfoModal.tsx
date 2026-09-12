import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  CheckCircle2,
  ExternalLink,
  Film,
  Gamepad2,
  Gauge,
  Github,
  Globe,
  HardDriveDownload,
  HelpCircle,
  Info,
  Layers,
  Lock,
  Radio,
  Server,
  Sparkles,
  Video,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { SPEEDTEST_SERVERS } from '../utils/speedtest';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'about' | 'metrics' | 'standards' | 'servers';

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  if (!isOpen) return null;

  return (
    <div
      id="info-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="info-modal-content"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Thông tin kỹ thuật
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kiến trúc hệ thống, thông số mạng và tiêu chuẩn đánh giá
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Thông số đo</span>
            </button>

            <button
              onClick={() => setActiveTab('standards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'standards'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tiêu chuẩn đánh giá</span>
            </button>

            <button
              onClick={() => setActiveTab('servers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'servers'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Trạm đo</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-y-auto flex-1 overscroll-contain space-y-4">
          {/* TAB 1: TỔNG QUAN */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Kiến trúc Client-Side Direct</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  NetSpeedZ hoạt động trực tiếp từ trình duyệt đến các trạm Anycast Edge PoP băng thông cao qua giao thức HTTP/HTTPS đa luồng, không qua máy chủ proxy trung gian.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Zero-Backend &amp; No-Log</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-normal">
                    Không thu thập hay lưu trữ địa chỉ IP. Toàn bộ tiến trình đo lường diễn ra khép kín trên máy khách.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                    <Radio className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Đo đa luồng (Multi-stream)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-normal">
                    Mô phỏng chính xác dung lượng đường truyền tối đa dưới tải nặng bằng kỹ thuật song song hoá kết nối.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                    <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Dual-Stack IPv4 / IPv6</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-normal">
                    Tự động nhận diện và kiểm tra tính tương thích của cả hai giao thức địa chỉ mạng Internet.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>Lưu trữ cục bộ (Local Storage)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-normal">
                    Lịch sử đo lưu trên trình duyệt của thiết bị; hỗ trợ xuất dữ liệu ra file CSV và JSON.
                  </p>
                </div>
              </div>

              {/* Author & Open Source Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-50 via-cyan-50/30 to-blue-50/40 dark:from-slate-800/80 dark:via-cyan-950/20 dark:to-blue-950/30 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <span>Một dự án mã nguồn mở của</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 font-extrabold">Rinz</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Mã nguồn mở hoàn toàn theo giấy phép MIT. Hoan nghênh mọi đóng góp và báo lỗi.
                  </p>
                </div>
                <a
                  href="https://github.com/RINz-HCMUS/NetSpeedZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repo</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: THÔNG SỐ ĐO */}
          {activeTab === 'metrics' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="space-y-2.5">
                {/* Ping */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Ping (Latency)</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">ms</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Thời gian khứ hồi (Round-Trip Time - RTT) của gói tin từ thiết bị tới trạm đo. Mức dưới 20ms là tối ưu cho tương tác tức thì.
                  </p>
                </div>

                {/* Jitter */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Jitter (Độ lệch trễ)</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">ms</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Độ dao động thời gian giữa các gói tin liên tiếp (Packet Delay Variation). Jitter &lt; 5ms thể hiện kết nối ổn định, không bị nghẽn ngắt quãng.
                  </p>
                </div>

                {/* Download */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Download (Tải xuống)</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Mbps</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Băng thông nhận dữ liệu từ trạm đo về thiết bị trên mỗi giây. Tác động trực tiếp đến tốc độ tải trang, stream video và cập nhật ứng dụng.
                  </p>
                </div>

                {/* Upload */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <span>Upload (Tải lên)</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400">Mbps</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Băng thông truyền dữ liệu từ thiết bị lên mạng trên mỗi giây. Quyết định chất lượng livestream, họp trực tuyến và đồng bộ dữ liệu đám mây.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIÊU CHUẨN ĐÁNH GIÁ */}
          {activeTab === 'standards' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* 1. 4 Task Categories Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider">
                  Tiêu chuẩn phân hạng theo tác vụ
                </h4>

                {/* Gaming */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                    <Gamepad2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>1. Gaming (Chơi game)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-emerald-600 font-bold block">Xuất sắc</span>
                      <span className="text-slate-500 text-[10px]">Ping &le; 25ms, Jitter &le; 5ms</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-blue-600 font-bold block">Tốt</span>
                      <span className="text-slate-500 text-[10px]">Ping 26–55ms</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-amber-600 font-bold block">Trung bình</span>
                      <span className="text-slate-500 text-[10px]">Ping 56–100ms</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-rose-600 font-bold block">Kém</span>
                      <span className="text-slate-500 text-[10px]">Ping &gt; 100ms</span>
                    </div>
                  </div>
                </div>

                {/* Streaming */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                    <Film className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>2. Streaming (Phim 4K/8K)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-emerald-600 font-bold block">Xuất sắc</span>
                      <span className="text-slate-500 text-[10px]">Down &ge; 60 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-blue-600 font-bold block">Tốt</span>
                      <span className="text-slate-500 text-[10px]">Down 25–59 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-amber-600 font-bold block">Trung bình</span>
                      <span className="text-slate-500 text-[10px]">Down 10–24 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-rose-600 font-bold block">Kém</span>
                      <span className="text-slate-500 text-[10px]">Down &lt; 10 Mbps</span>
                    </div>
                  </div>
                </div>

                {/* Video Call */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                    <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>3. Video Call (Họp trực tuyến)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-emerald-600 font-bold block">Xuất sắc</span>
                      <span className="text-slate-500 text-[10px]">Up &ge; 15, Ping &le; 45</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-blue-600 font-bold block">Tốt</span>
                      <span className="text-slate-500 text-[10px]">Up &ge; 6, Ping &le; 80</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-amber-600 font-bold block">Trung bình</span>
                      <span className="text-slate-500 text-[10px]">Up 2.5–5 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-rose-600 font-bold block">Kém</span>
                      <span className="text-slate-500 text-[10px]">Up &lt; 2.5 Mbps</span>
                    </div>
                  </div>
                </div>

                {/* Large Downloads */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                    <HardDriveDownload className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>4. File Transfer (Tải tệp lớn)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-emerald-600 font-bold block">Xuất sắc</span>
                      <span className="text-slate-500 text-[10px]">Down &ge; 150 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-blue-600 font-bold block">Tốt</span>
                      <span className="text-slate-500 text-[10px]">Down 60–149 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-amber-600 font-bold block">Trung bình</span>
                      <span className="text-slate-500 text-[10px]">Down 20–59 Mbps</span>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-rose-600 font-bold block">Kém</span>
                      <span className="text-slate-500 text-[10px]">Down &lt; 20 Mbps</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Overall Grade System (A+ / A / B / C / D) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-wider">
                    Xếp hạng tốc độ chung (Thang điểm 0–100)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Trọng số: Streaming 30% &bull; Gaming 25% &bull; Call 25% &bull; File 20%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px]">
                  {/* A+ */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded font-black text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        A+
                      </span>
                      <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">&ge; 92 đ</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 leading-tight">
                        Xuất sắc vượt trội
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Tối ưu eSports &amp; tải nặng đa luồng.
                      </div>
                    </div>
                  </div>

                  {/* A */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded font-black text-xs bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        A
                      </span>
                      <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">80–91 đ</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-[11px] text-blue-700 dark:text-blue-400 leading-tight">
                        Rất tốt
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Mượt mà mọi tác vụ và stream 4K/8K.
                      </div>
                    </div>
                  </div>

                  {/* B */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded font-black text-xs bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                        B
                      </span>
                      <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">68–79 đ</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-[11px] text-sky-700 dark:text-sky-400 leading-tight">
                        Tốt
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Ổn định cao cho làm việc từ xa &amp; giải trí.
                      </div>
                    </div>
                  </div>

                  {/* C */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded font-black text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        C
                      </span>
                      <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">50–67 đ</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-[11px] text-amber-700 dark:text-amber-400 leading-tight">
                        Trung bình
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Đạt chuẩn web &amp; Full HD; có độ trễ nhẹ.
                      </div>
                    </div>
                  </div>

                  {/* D */}
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-1.5 py-0.5 rounded font-black text-xs bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        D
                      </span>
                      <span className="font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">&lt; 50 đ</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-[11px] text-rose-700 dark:text-rose-400 leading-tight">
                        Kém
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Băng thông hạn chế hoặc chập chờn.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Highlight Callout: Streaming vs Gaming (Placed at bottom as requested) */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-700/60">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-xs mb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>So sánh: Streaming 4K vs Game Online</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/70 dark:border-amber-900/40">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 text-[11px] mb-0.5">
                      <Film className="w-3.5 h-3.5" />
                      <span>Streaming 4K (Cơ chế Buffering)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                      Video được nạp trước vào bộ nhớ đệm (RAM) từ 10–30 giây. Chỉ yêu cầu băng thông Download đủ lớn (&ge; 25–40 Mbps), hoàn toàn không nhạy cảm với Ping cao hay Jitter.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200/70 dark:border-amber-900/40">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300 text-[11px] mb-0.5">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>Game Online (Độ trễ thời gian thực)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                      Truyền nhận dữ liệu liên tục từng mili-giây. Băng thông tiêu thụ rất nhỏ (~2–5 Mbps), nhưng bắt buộc Ping cực thấp (&lt; 30ms) và Jitter tiệm cận 0ms để tránh lệch khung hình.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRẠM ĐO */}
          {activeTab === 'servers' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">
                  Cơ chế định tuyến trạm đo
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Hệ thống hỗ trợ 2 chế độ: <strong>Tự động (Anycast BGP)</strong> tới Edge PoP gần nhất; hoặc <strong>Thủ công</strong> để đo theo hạ tầng nhà mạng (On-net / Off-net) và các tuyến cáp quốc tế.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                  <span>Danh mục trạm đo ({SPEEDTEST_SERVERS.length} nodes)</span>
                  <span className="text-[11px] font-normal text-slate-500">Trong nước &amp; Quốc tế</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
                  {SPEEDTEST_SERVERS.map((server) => (
                    <div
                      key={server.id}
                      className="p-2.5 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{server.flag}</span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                            {server.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {server.city}, {server.country} &bull; {server.provider}
                          </div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {server.isAuto ? 'AUTO' : server.id.split('-').pop()?.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/80">
          <span className="text-[11px] text-slate-400">
            NetSpeedZ &bull; Thông số kỹ thuật
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-xs cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
