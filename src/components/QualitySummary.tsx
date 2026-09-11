import React from 'react';
import { Award, CheckCircle2, Film, Gamepad2, HardDriveDownload, Video } from 'lucide-react';
import { QualityAssessment } from '../types';

interface QualitySummaryProps {
  assessment: QualityAssessment;
}

export const QualitySummary: React.FC<QualitySummaryProps> = ({ assessment }) => {
  if (!assessment) return null;

  const getBadgeColor = (grade: string) => {
    switch (grade) {
      case 'Xuất sắc':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Tốt':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Trung bình':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  const getOverallGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') {
      return 'from-emerald-500 to-teal-600 text-white';
    }
    if (grade === 'B') {
      return 'from-blue-500 to-indigo-600 text-white';
    }
    if (grade === 'C') {
      return 'from-amber-500 to-orange-600 text-white';
    }
    return 'from-rose-500 to-red-600 text-white';
  };

  const items = [
    {
      title: 'Gaming',
      sub: 'Tiêu chí: Ping & Jitter',
      icon: Gamepad2,
      result: assessment.gaming,
    },
    {
      title: 'Streaming 4K',
      sub: 'Tiêu chí: Download',
      icon: Film,
      result: assessment.streaming,
    },
    {
      title: 'Video Call',
      sub: 'Tiêu chí: Upload & Latency',
      icon: Video,
      result: assessment.videoCall,
    },
    {
      title: 'Tải tệp lớn',
      sub: 'Tiêu chí: Băng thông',
      icon: HardDriveDownload,
      result: assessment.downloading,
    },
  ];

  return (
    <div
      id="quality-summary-card"
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Khả năng đáp ứng tác vụ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đánh giá theo yêu cầu kỹ thuật của từng ứng dụng mạng
            </p>
          </div>
        </div>

        {/* Overall Grade Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 dark:text-slate-500">Điểm tổng quan</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {assessment.overallScore}/100 điểm
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getOverallGradeColor(
              assessment.overallGrade
            )} flex items-center justify-center font-black text-xl shadow-md`}
          >
            {assessment.overallGrade}
          </div>
        </div>
      </div>

      {/* Grid of Practical Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-blue-100/60 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColor(
                      item.result.grade
                    )}`}
                  >
                    {item.result.grade}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.result.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
