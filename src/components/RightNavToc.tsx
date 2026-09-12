import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Activity,
  Award,
  ChevronUp,
  Gauge,
  History,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { TestStage } from '../types';

interface RightNavTocProps {
  isTesting: boolean;
  stage: TestStage | string;
  hasAssessment: boolean;
}

interface TocItemDef {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  hasData: boolean;
  isNew: boolean;
  emptyHint?: string;
}

export const RightNavToc: React.FC<RightNavTocProps> = ({
  isTesting,
  stage,
  hasAssessment,
}) => {
  const [activeSection, setActiveSection] = useState<string>('speedtest-section');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [acknowledgedNews, setAcknowledgedNews] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic status flags
  const hasChartData = isTesting || stage === 'completed';
  const hasQualityData = hasAssessment && stage === 'completed';

  // Items definition with custom icons
  const items: TocItemDef[] = useMemo(() => {
    return [
      {
        id: 'speedtest-section',
        name: 'Đo tốc độ',
        shortName: 'Đo tốc độ',
        icon: Gauge,
        hasData: true,
        isNew: false,
      },
      {
        id: 'live-speed-chart-card',
        name: 'Biểu đồ trực tiếp',
        shortName: 'Biểu đồ',
        icon: Activity,
        hasData: hasChartData,
        isNew: hasChartData && !acknowledgedNews['live-speed-chart-card'],
        emptyHint: 'Chưa đo',
      },
      {
        id: 'quality-summary-card',
        name: 'Đánh giá tác vụ',
        shortName: 'Đánh giá',
        icon: Award,
        hasData: hasQualityData,
        isNew: hasQualityData && !acknowledgedNews['quality-summary-card'],
        emptyHint: 'Chờ kết quả',
      },
      {
        id: 'network-info-card',
        name: 'Thông số mạng',
        shortName: 'Mạng & IP',
        icon: Wifi,
        hasData: true,
        isNew: false,
      },
      {
        id: 'history-section',
        name: 'Lịch sử đo',
        shortName: 'Lịch sử',
        icon: History,
        hasData: true,
        isNew: false,
      },
    ];
  }, [hasChartData, hasQualityData, acknowledgedNews]);

  // ScrollSpy listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollY > 220);

      const headerOffset = 130;
      let current = 'speedtest-section';

      // Check in reverse order so the lowest visible section takes precedence
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (!item.hasData) continue;

        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            current = item.id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  // Click outside listener to collapse on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Hover handlers for smooth expand/collapse
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 250);
  };

  // Scroll to section smoothly
  const handleItemClick = (item: TocItemDef) => {
    if (item.isNew) {
      setAcknowledgedNews((prev) => ({ ...prev, [item.id]: true }));
    }

    if (!item.hasData) {
      // If function has no data yet, scroll smoothly to the speedometer to start test
      const speedDialEl = document.getElementById('speedtest-section');
      if (speedDialEl) {
        const headerOffset = 70;
        const pos = speedDialEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
      setIsExpanded(false);
      return;
    }

    const targetEl = document.getElementById(item.id);
    if (targetEl) {
      const headerOffset = 70;
      const elementPos = targetEl.getBoundingClientRect().top;
      const offsetPos = elementPos + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth',
      });

      setActiveSection(item.id);
    }

    setIsExpanded(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsExpanded(false);
  };

  return (
    <nav
      id="right-nav-toc"
      ref={containerRef}
      aria-label="Thanh mục lục điều hướng"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-40 select-none transition-all duration-300"
    >
      {/* 
        Borderless Container:
        - When idle: Fully borderless, highly transparent backdrop so underlying content is clear
        - When hovered/touched: Expands moderately with soft translucent backdrop blur
      */}
      <div
        className={`flex flex-col items-end transition-all duration-300 ${
          isExpanded
            ? 'w-48 sm:w-52 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md shadow-xl shadow-slate-900/5 dark:shadow-cyan-950/20 rounded-2xl p-2.5'
            : 'w-10 sm:w-11 bg-transparent p-0.5'
        }`}
      >
        {/* Header when expanded */}
        {isExpanded && (
          <div className="w-full flex items-center justify-between pb-1.5 mb-1 px-1 border-b border-slate-200/40 dark:border-slate-800/40 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            <span>Mục lục</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-normal lowercase">chọn mục</span>
          </div>
        )}

        {/* Vertical List of Logos / Icons */}
        <div className="w-full flex flex-col gap-1.5 sm:gap-2 py-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id && item.hasData;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center cursor-pointer transition-all duration-200 rounded-xl ${
                  isExpanded
                    ? 'px-2 py-1.5 gap-2.5 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                    : 'justify-center p-1.5'
                } ${
                  /* Khi active: highlight nhẹ đổi màu nổi bật nhưng vẫn giữ độ trong suốt */
                  isActive
                    ? isExpanded
                      ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold'
                      : 'bg-cyan-500/15 dark:bg-cyan-500/20 shadow-xs'
                    : ''
                }`}
                title={!isExpanded ? `${item.name} ${!item.hasData ? '(Chưa có thông tin)' : ''}` : undefined}
              >
                {/* ICON / LOGO:
                    - Idle & Not active: High transparency (opacity-35 dark:opacity-40) so background content stays visible
                    - Hovered: Crisp opacity
                    - Active: Light highlight with cyan color, soft translucent glow, yet maintaining transparency
                    - No data: Softest opacity (opacity-20)
                */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive
                        ? 'text-cyan-500 dark:text-cyan-400 opacity-95 scale-110 drop-shadow-[0_0_6px_rgba(6,182,212,0.35)]'
                        : item.hasData
                        ? isExpanded
                          ? 'text-slate-600 dark:text-slate-300 opacity-80'
                          : 'text-slate-600 dark:text-slate-400 opacity-35 dark:opacity-40 hover:opacity-100 hover:text-cyan-500 dark:hover:text-cyan-400'
                        : isExpanded
                        ? 'text-slate-400 dark:text-slate-600 opacity-40'
                        : 'text-slate-400 dark:text-slate-600 opacity-20'
                    }`}
                  />

                  {/* Active glowing indicator pip */}
                  {isActive && !isExpanded && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-90 animate-pulse" />
                  )}

                  {/* Notification badge for newly available section */}
                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </div>

                {/* Name Label: Visible when expanded (hover/touch) */}
                {isExpanded && (
                  <div className="flex items-center justify-between min-w-0 flex-1">
                    <span
                      className={`truncate text-xs ${
                        isActive
                          ? 'font-bold text-cyan-600 dark:text-cyan-300'
                          : item.hasData
                          ? 'text-slate-700 dark:text-slate-200 font-medium'
                          : 'text-slate-400 dark:text-slate-500 italic'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Status hint if new or empty */}
                    {item.isNew && (
                      <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase bg-emerald-500 text-white shadow-xs animate-pulse ml-1">
                        <Sparkles className="w-2 h-2" />
                        <span>Mới</span>
                      </span>
                    )}

                    {!item.hasData && (
                      <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500 italic ml-1">
                        {item.emptyHint || 'Trống'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll To Top Button (Borderless, translucent) */}
        {showScrollTop && (
          <div className="w-full pt-1.5 mt-1 flex items-center justify-center">
            <button
              onClick={scrollToTop}
              className={`flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all cursor-pointer rounded-lg ${
                isExpanded
                  ? 'w-full py-1 px-2 gap-1.5 text-xs hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  : 'p-1 opacity-30 hover:opacity-100'
              }`}
              title="Cuộn lên đầu trang"
              aria-label="Cuộn lên đầu trang"
            >
              <ChevronUp className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              {isExpanded && <span className="text-[11px]">Lên đầu trang</span>}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
