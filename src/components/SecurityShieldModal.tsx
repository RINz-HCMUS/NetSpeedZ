import React from 'react';
import { CheckCircle2, Lock, Shield, ShieldAlert, ShieldCheck, X } from 'lucide-react';

interface SecurityShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityShieldModal: React.FC<SecurityShieldModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const securityFeatures = [
    {
      title: 'Kiến trúc Non-backend (100% Static Client-Side)',
      desc: 'Toàn bộ mã nguồn chạy trực tiếp trên trình duyệt của bạn mà không thông qua bất kỳ server trung gian hay cơ sở dữ liệu lưu trữ nào. Điều này triệt tiêu hoàn toàn các hình thức tấn công nguy hiểm như SQL Injection, Remote Code Execution (RCE) hay rò rỉ cơ sở dữ liệu.',
      badge: 'Tuyệt đối an toàn',
      status: 'Đã kích hoạt',
    },
    {
      title: 'Miễn nhiễm chiếm đoạt phiên (Zero Cookies & Session Hijacking)',
      desc: 'NetSpeedZ không sử dụng cookies đăng nhập, không yêu cầu tài khoản và không cấp phát token phiên. Hacker hoàn toàn không thể thực hiện các cuộc tấn công đánh cắp phiên (Session Stealing) hoặc CSRF.',
      badge: 'Zero Tracking',
      status: 'Đã kích hoạt',
    },
    {
      title: 'Che giấu địa chỉ IP tự động (Anti-Doxxing & Privacy)',
      desc: 'Cả IPv4 và IPv6 đều được hệ thống tự động che các phân đoạn định danh nhạy cảm theo mặc định (vd: 113.161.***.***). Bạn có thể yên tâm quay video, chia sẻ ảnh chụp màn hình hoặc livestream mà không sợ bị lộ vị trí mạng cá nhân.',
      badge: 'Bảo vệ danh tính',
      status: 'Đã kích hoạt',
    },
    {
      title: 'Chống mã độc XSS & Tiêu chuẩn Content-Security',
      desc: 'Trang web tuân thủ nghiêm ngặt chuẩn Content-Security-Policy (CSP), cấm sử dụng eval() và vô hiệu hóa các API truy cập phần cứng nhạy cảm (camera, microphone, payment) để ngăn chặn mã độc tiêm vào ứng dụng.',
      badge: 'Chống XSS',
      status: 'Đã kích hoạt',
    },
    {
      title: 'Mã hóa kênh truyền TLS/HTTPS chuẩn quốc tế',
      desc: 'Tất cả các gói tin kiểm tra băng thông và truy vấn thông tin mạng đều đi qua kết nối HTTPS mã hóa TLS 1.3 / AES-256, loại bỏ hoàn toàn nguy cơ bị hacker nghe lén hoặc giả mạo đường truyền (Man-In-The-Middle).',
      badge: 'Mã hóa AES-256',
      status: 'Đã kích hoạt',
    },
    {
      title: 'Lưu trữ cục bộ trong Sandbox trình duyệt (Local-Only)',
      desc: 'Lịch sử đo tốc độ được lưu hoàn toàn trong bộ nhớ LocalStorage riêng biệt trên máy bạn. Bạn có quyền toàn quyền kiểm soát, sao lưu file JSON/CSV hoặc xóa vĩnh viễn với 1 nút bấm.',
      badge: 'Toàn quyền kiểm soát',
      status: 'Đã kích hoạt',
    },
  ];

  return (
    <div
      id="security-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="security-modal-content"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky) */}
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">Chuẩn Bảo Mật &amp; Chống Hacker</h2>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Hệ thống 6 lớp bảo vệ dữ liệu người dùng tuyệt đối trên NetSpeedZ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Overview Banner (Sticky) */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 shrink-0">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Chứng nhận an toàn:</strong> Không thu thập dữ liệu cá nhân, không mã theo dõi, không server backend trung gian.
          </span>
        </div>

        {/* Feature List (Scrollable with Momentum & Adaptive Padding) */}
        <div className="p-3.5 sm:p-5 md:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1 overscroll-contain">
          {securityFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 transition-all hover:border-emerald-500/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {feat.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    {feat.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer (Sticky) */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
            Mã nguồn minh bạch, tuân thủ tiêu chuẩn Web Safe &amp; Privacy First.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer text-xs shrink-0"
          >
            Đã hiểu &amp; An tâm
          </button>
        </div>
      </div>
    </div>
  );
};
