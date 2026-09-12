import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Github,
  Globe2,
  Info,
  Lock,
  Moon,
  RotateCcw,
  Server,
  ShieldCheck,
  Sun,
  Wifi,
  Zap,
} from 'lucide-react';
import { HistorySection } from './components/HistorySection';
import { InfoModal } from './components/InfoModal';
import { LiveSpeedChart } from './components/LiveSpeedChart';
import { MetricCard } from './components/MetricCard';
import { NetworkInfoCard } from './components/NetworkInfoCard';
import { PrivacyModal } from './components/PrivacyModal';
import { QualitySummary } from './components/QualitySummary';
import { RightNavToc } from './components/RightNavToc';
import { SecurityShieldModal } from './components/SecurityShieldModal';
import { ServerSelectorModal } from './components/ServerSelectorModal';
import { Speedometer } from './components/Speedometer';
import { ZLightningLogo } from './components/ZLightningLogo';
import {
  LiveDataPoint,
  NetworkInfo,
  QualityAssessment,
  ServerNode,
  SpeedMetrics,
  TestHistoryItem,
  TestStage,
} from './types';
import {
  assessConnectionQuality,
  clearAllHistory,
  deleteHistoryItem,
  fetchDualNetworkDetails,
  getResolvedServerDetails,
  getServerRegionCode,
  loadHistory,
  measureDownload,
  measurePing,
  measureUpload,
  saveHistoryItem,
  SPEEDTEST_SERVERS,
} from './utils/speedtest';

export default function App() {
  // Theme state: dark / light mode toggle
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('netspeedz_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Selected speed test server
  const [selectedServer, setSelectedServer] = useState<ServerNode>(SPEEDTEST_SERVERS[0]);

  // Network info (Dual IPv4 & IPv6 + ISP)
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  // Speed test state
  const [stage, setStage] = useState<TestStage>('idle');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [metrics, setMetrics] = useState<SpeedMetrics>({
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
  });
  const [liveDataPoints, setLiveDataPoints] = useState<LiveDataPoint[]>([]);
  const [assessment, setAssessment] = useState<QualityAssessment | null>(null);

  // History state
  const [history, setHistory] = useState<TestHistoryItem[]>([]);

  // Modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showServerModal, setShowServerModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Abort controller for cancelling ongoing test
  const abortControllerRef = useRef<AbortController | null>(null);

  // Apply dark mode class to document root element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try {
        localStorage.setItem('netspeedz_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('netspeedz_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Load initial network details & history
  useEffect(() => {
    loadNetworkInfo();
    setHistory(loadHistory());
  }, []);

  const loadNetworkInfo = async () => {
    setIsLoadingInfo(true);
    try {
      const info = await fetchDualNetworkDetails();
      setNetworkInfo(info);
    } catch {
      // ignore
    } finally {
      setIsLoadingInfo(false);
    }
  };

  // Run the full speed test
  const handleStartTest = async () => {
    if (stage !== 'idle' && stage !== 'completed' && stage !== 'error') return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setStage('ping');
    setCurrentSpeed(0);
    setLiveDataPoints([]);
    setAssessment(null);
    setMetrics({ ping: 0, jitter: 0, download: 0, upload: 0 });

    try {
      // 1. Measure Ping & Jitter against selected server
      const pingResult = await measurePing(
        selectedServer,
        (currentPing) => {
          setCurrentSpeed(currentPing);
          setMetrics((prev) => ({ ...prev, ping: currentPing }));
        },
        signal
      );

      setMetrics((prev) => ({
        ...prev,
        ping: pingResult.ping,
        jitter: pingResult.jitter,
      }));

      // 2. Measure Download Speed
      setStage('download');
      setCurrentSpeed(0);

      const downloadMbps = await measureDownload(
        selectedServer,
        (mbps, elapsed) => {
          setCurrentSpeed(mbps);
          setMetrics((prev) => ({ ...prev, download: mbps }));
          setLiveDataPoints((prev) => [
            ...prev,
            { time: Math.round(elapsed * 10) / 10, speed: mbps, stage: 'download' },
          ]);
        },
        signal
      );

      setMetrics((prev) => ({ ...prev, download: downloadMbps }));

      // 3. Measure Upload Speed
      setStage('upload');
      setCurrentSpeed(0);

      const uploadMbps = await measureUpload(
        selectedServer,
        (mbps, elapsed) => {
          setCurrentSpeed(mbps);
          setMetrics((prev) => ({ ...prev, upload: mbps }));
          setLiveDataPoints((prev) => [
            ...prev,
            { time: Math.round(elapsed * 10) / 10, speed: mbps, stage: 'upload' },
          ]);
        },
        signal
      );

      setMetrics((prev) => ({ ...prev, upload: uploadMbps }));

      // 4. Assessment and Complete
      setStage('completed');
      setCurrentSpeed(downloadMbps);

      const quality = assessConnectionQuality(
        pingResult.ping,
        pingResult.jitter,
        downloadMbps,
        uploadMbps
      );
      setAssessment(quality);

      // Save to local history
      const now = new Date();
      const resolved = getResolvedServerDetails(selectedServer, networkInfo);
      const historyRecord: TestHistoryItem = {
        id: `test_${Date.now()}`,
        timestamp: Date.now(),
        dateStr: `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        ping: pingResult.ping,
        jitter: pingResult.jitter,
        download: downloadMbps,
        upload: uploadMbps,
        isp: networkInfo?.isp || 'Mạng Internet',
        ipv4: networkInfo?.ipv4 || '',
        ipv6: networkInfo?.ipv6 || '',
        serverName: selectedServer.isAuto ? resolved.realName : selectedServer.name,
        location: resolved.location,
        grade: quality.overallGrade,
      };

      const updatedHistory = saveHistoryItem(historyRecord);
      setHistory(updatedHistory);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        setStage('idle');
        setCurrentSpeed(0);
      } else {
        setStage('error');
      }
    }
  };

  const handleStopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStage('idle');
    setCurrentSpeed(0);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  const isTesting = stage === 'ping' || stage === 'download' || stage === 'upload';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand Header conforming to user format */}
          <div className="flex items-start sm:items-center gap-3.5">
            {/* 1. Logo tia sét cách điệu chữ Z hiện đại tối giản */}
            <ZLightningLogo size={46} />

            {/* Header Text */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  <span>NetSpeed</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 font-extrabold ml-0.5 drop-shadow-xs">
                    Z
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 leading-tight">
                Kiểm tra &amp; phân tích đường truyền mạng của bạn
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span className="text-blue-500 font-bold">-</span> Non-backend, không lưu dữ liệu
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="text-emerald-500 font-bold">-</span> Miễn phí &amp; bảo mật
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-center">
            {/* Server Quick Selector Button */}
            <button
              id="header-server-selector-btn"
              onClick={() => setShowServerModal(true)}
              disabled={isTesting}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 sm:px-3 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50 border border-slate-200/80 dark:border-slate-700 shrink-0"
              title="Đổi trạm đo tốc độ"
            >
              <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{selectedServer.isAuto ? 'Tự động - Edge gần nhất' : selectedServer.name}</span>
              <span className="sm:hidden whitespace-nowrap max-w-[110px] truncate">{selectedServer.isAuto ? 'Tự động' : selectedServer.name}</span>
            </button>

            {/* Info / FAQ Modal Button */}
            <button
              id="info-modal-btn"
              onClick={() => setShowInfoModal(true)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              title="Thông tin NetSpeedZ & Giải đáp tiêu chí đo"
              aria-label="Thông tin & Hướng dẫn"
            >
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
              title={isDark ? 'Bấm để chuyển sang chế độ sáng' : 'Bấm để chuyển sang chế độ tối'}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* Speed Dial & 4 Metric Cards */}
        <div id="speedtest-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center scroll-mt-20">
          {/* Central Speedometer Dial (7 columns on large screen) */}
          <div className="lg:col-span-7 flex flex-col items-center p-5 sm:p-6 lg:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
            {/* Background subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 2.1 Không gian con tách riêng biệt cho thông tin máy chủ đo lường có viền Region rõ ràng */}
            <div className="w-full flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800/80 z-10">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Máy chủ đo:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 min-w-0">
                  <span className="truncate max-w-[130px] sm:max-w-none">{selectedServer.flag} {selectedServer.name}</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold tracking-wider border border-blue-300 dark:border-blue-700 bg-blue-50/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 shadow-2xs shrink-0">
                    {getServerRegionCode(selectedServer)}
                  </span>
                </span>
              </div>
              <button
                id="change-server-speedometer-btn"
                onClick={() => !isTesting && setShowServerModal(true)}
                disabled={isTesting}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
                title="Bấm để đổi trạm đo tốc độ"
              >
                <span>Đổi trạm</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Vòng đo & nút điều khiển chính căn chỉnh khoảng cách hợp lý, hài hòa */}
            <div className="w-full flex flex-col items-center justify-center pt-1">
              <Speedometer
                currentValue={currentSpeed}
                speed={currentSpeed}
                stage={stage}
                onStart={handleStartTest}
                onStop={handleStopTest}
                isTesting={isTesting}
              />
            </div>
          </div>

          {/* 4 Key Metrics (5 columns on large screen) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <MetricCard
              type="ping"
              value={metrics.ping}
              unit="ms"
              stage={stage}
              isActive={stage === 'ping'}
              isCompleted={stage !== 'idle' && stage !== 'ping'}
            />
            <MetricCard
              type="jitter"
              value={metrics.jitter}
              unit="ms"
              stage={stage}
              isActive={stage === 'ping'}
              isCompleted={stage !== 'idle' && stage !== 'ping'}
            />
            <MetricCard
              type="download"
              value={metrics.download}
              unit="Mbps"
              stage={stage}
              isActive={stage === 'download'}
              isCompleted={stage === 'upload' || stage === 'completed'}
            />
            <MetricCard
              type="upload"
              value={metrics.upload}
              unit="Mbps"
              stage={stage}
              isActive={stage === 'upload'}
              isCompleted={stage === 'completed'}
            />

            {/* Action Bar when completed */}
            {stage === 'completed' && (
              <div className="col-span-2 pt-1 flex items-center justify-between">
                <button
                  id="re-test-btn"
                  onClick={handleStartTest}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Kiểm tra lại</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Bandwidth Chart during active test or completed */}
        {(isTesting || stage === 'completed') && (
          <LiveSpeedChart
            dataPoints={liveDataPoints}
            data={liveDataPoints}
            stage={stage}
            currentSpeed={currentSpeed}
            metrics={metrics}
          />
        )}

        {/* Qualitative assessment when test finishes */}
        {assessment && stage === 'completed' && <QualitySummary assessment={assessment} />}

        {/* Network & IP Information Card (Dual IPv4/IPv6 with privacy masking) */}
        <NetworkInfoCard
          info={networkInfo}
          selectedServer={selectedServer}
          isLoading={isLoadingInfo}
          onRefresh={loadNetworkInfo}
          onOpenPrivacy={() => setShowPrivacyModal(true)}
          onOpenServerModal={() => setShowServerModal(true)}
          onOpenSecurityModal={() => setShowSecurityModal(true)}
          disabled={isTesting}
        />

        {/* Test History Section */}
        <HistorySection
          history={history}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ZLightningLogo size={36} />
            <div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-center sm:justify-start gap-1.5 leading-tight">
                <span>NetSpeed</span>
                <span className="text-cyan-500 font-black">Z</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Một dự án mã nguồn mở của{' '}
                <a
                  href="https://github.com/RINz-HCMUS/NetSpeedZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Rinz
                  <ExternalLink className="w-2.5 h-2.5 inline opacity-70" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              id="footer-github-link"
              href="https://github.com/RINz-HCMUS/NetSpeedZ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>GitHub Repository</span>
            </a>

            <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>

            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
            >
              Chính sách quyền riêng tư
            </button>
          </div>
        </div>
      </footer>

      {/* Right Navigation Table of Contents */}
      <RightNavToc
        isTesting={isTesting}
        stage={stage}
        hasAssessment={!!assessment}
      />

      {/* Server Selection Modal */}
      <ServerSelectorModal
        isOpen={showServerModal}
        onClose={() => setShowServerModal(false)}
        selectedServer={selectedServer}
        onSelectServer={(server) => setSelectedServer(server)}
        networkInfo={networkInfo}
      />

      {/* Security & Anti-Hacker Standards Modal */}
      <SecurityShieldModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />

      {/* Info & Guide Tabbed Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
}
