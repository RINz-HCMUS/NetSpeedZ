export type TestStage = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

export interface ServerNode {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  provider: string;
  pingUrl: string;
  downUrl: string;
  upUrl: string;
  isAuto?: boolean;
}

export interface NetworkInfo {
  ipv4: string | null;
  maskedIpv4: string | null;
  ipv6: string | null;
  maskedIpv6: string | null;
  isp: string;
  org?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  asn?: string;
  edgeColo?: string;
  edgeCity?: string;
  edgeCountry?: string;
  edgeDatacenter?: string;
}

export interface SpeedMetrics {
  ping: number; // ms
  jitter: number; // ms
  download: number; // Mbps
  upload: number; // Mbps
}

export interface LiveDataPoint {
  time: number; // seconds from test start
  speed: number; // Mbps
  stage: 'download' | 'upload';
}

export interface TestHistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  isp: string;
  ipv4: string;
  ipv6: string;
  serverName: string;
  location: string;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
}

export interface QualityAssessment {
  gaming: { grade: 'Xuất sắc' | 'Tốt' | 'Trung bình' | 'Kém'; score: number; desc: string };
  streaming: { grade: 'Xuất sắc' | 'Tốt' | 'Trung bình' | 'Kém'; score: number; desc: string };
  videoCall: { grade: 'Xuất sắc' | 'Tốt' | 'Trung bình' | 'Kém'; score: number; desc: string };
  downloading: { grade: 'Xuất sắc' | 'Tốt' | 'Trung bình' | 'Kém'; score: number; desc: string };
  overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  overallScore: number;
}

