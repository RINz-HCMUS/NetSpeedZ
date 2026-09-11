import React from 'react';
import { Activity, ArrowDownCircle, ArrowUpCircle, Gauge } from 'lucide-react';
import { TestStage } from '../types';

interface MetricCardProps {
  type: 'ping' | 'jitter' | 'download' | 'upload';
  value: number;
  stage?: TestStage;
  isActive?: boolean;
  isCompleted?: boolean;
  unit?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  type,
  value,
  stage,
  isActive,
  isCompleted,
  unit,
}) => {
  const isTesting =
    typeof isActive === 'boolean'
      ? isActive
      : (type === 'ping' && stage === 'ping') ||
        (type === 'jitter' && stage === 'ping') ||
        (type === 'download' && stage === 'download') ||
        (type === 'upload' && stage === 'upload');

  const getDetails = () => {
    switch (type) {
      case 'ping':
        return {
          title: 'Độ trễ (Ping)',
          unit: 'ms',
          desc: 'Thời gian gửi nhận gói tin',
          icon: Activity,
          color: 'text-sky-500 dark:text-sky-400',
          bgColor: 'bg-sky-50 dark:bg-sky-950/40',
          borderColor: 'border-sky-200 dark:border-sky-800',
          activeBorder: 'border-sky-500 ring-2 ring-sky-400/30',
        };
      case 'jitter':
        return {
          title: 'Độ dao động (Jitter)',
          unit: 'ms',
          desc: 'Độ ổn định đường truyền',
          icon: Gauge,
          color: 'text-indigo-500 dark:text-indigo-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
          borderColor: 'border-indigo-200 dark:border-indigo-800',
          activeBorder: 'border-indigo-500 ring-2 ring-indigo-400/30',
        };
      case 'download':
        return {
          title: 'Tải xuống (Download)',
          unit: 'Mbps',
          desc: 'Tốc độ nhận dữ liệu về máy',
          icon: ArrowDownCircle,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/40',
          borderColor: 'border-blue-200 dark:border-blue-800',
          activeBorder: 'border-blue-500 ring-2 ring-blue-400/40',
        };
      case 'upload':
        return {
          title: 'Tải lên (Upload)',
          unit: 'Mbps',
          desc: 'Tốc độ truyền dữ liệu đi',
          icon: ArrowUpCircle,
          color: 'text-teal-600 dark:text-teal-400',
          bgColor: 'bg-teal-50 dark:bg-teal-950/40',
          borderColor: 'border-teal-200 dark:border-teal-800',
          activeBorder: 'border-teal-500 ring-2 ring-teal-400/40',
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  return (
    <div
      id={`metric-card-${type}`}
      className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 shadow-sm ${
        isTesting
          ? `${details.activeBorder} shadow-md`
          : `${details.borderColor} hover:border-slate-300 dark:hover:border-slate-700`
      }`}
    >
      {/* Active Pulse Pill */}
      {isTesting && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          Đang đo
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${details.bgColor} ${details.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {details.title}
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
            {details.desc}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
          {value > 0 ? (type === 'ping' ? Math.round(value) : value.toFixed(1)) : '--'}
        </span>
        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
          {details.unit}
        </span>
      </div>
    </div>
  );
};
