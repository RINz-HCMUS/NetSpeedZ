import React from 'react';
import { CheckCircle2, Lock, ShieldCheck, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="privacy-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Chính sách bảo mật &amp; Quyền riêng tư
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cam kết bảo mật tuyệt đối cho dữ liệu người dùng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-y-auto flex-1 overscroll-contain">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <Lock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                Không thu thập dữ liệu máy chủ (Zero Server Logging)
              </strong>
              Trang web không có máy chủ backend để thu thập, lưu vết hoặc bán thông tin của bạn. Toàn bộ quá trình kiểm tra mạng diễn ra trực tiếp từ trình duyệt của bạn (Client-Side).
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                Lịch sử kiểm tra được lưu cục bộ (Local Storage)
              </strong>
              Lịch sử các lần đo tốc độ mạng chỉ được lưu trong bộ nhớ máy của bạn (trình duyệt). Bạn có toàn quyền xóa từng mục, xóa toàn bộ hoặc xuất dữ liệu (CSV/JSON) bất kỳ lúc nào.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                Bảo vệ địa chỉ IP cá nhân (IP Masking)
              </strong>
              Hệ thống mặc định che các chữ số cuối của IP để tránh lộ thông tin khi bạn quay video hoặc chụp ảnh màn hình chia sẻ cho người khác.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                Miễn phí &amp; Dễ dàng triển khai (Vercel / GitHub Pages)
              </strong>
              Trang web được xây dựng thuần tĩnh (Single Page App), không yêu cầu database tốn phí, cho phép đưa lên GitHub Pages hoặc Vercel hoàn toàn miễn phí trọn đời.
            </div>
          </div>
        </div>

        {/* Footer (Sticky) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
