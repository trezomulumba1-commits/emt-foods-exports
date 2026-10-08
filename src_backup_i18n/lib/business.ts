export type BusinessActivity = {
  id: number;
  title: string;
  detail: string;
  time: string;
};

export type BusinessMetrics = {
  totalVisitors: number;
  visitorsToday: number;
  activeLeads: number;
  quoteRequests: number;
  conversionRate: number;
  averageOrderValue: number;
  responseTime: string;
  topChannel: string;
  weeklyTrend: number[];
  lastSeenDate: string;
  pageViews: number;
  recentActivity: BusinessActivity[];
};

const defaultBusinessMetrics: BusinessMetrics = {
  totalVisitors: 1842,
  visitorsToday: 37,
  activeLeads: 14,
  quoteRequests: 8,
  conversionRate: 6.8,
  averageOrderValue: 1480,
  responseTime: '1.2 hrs',
  topChannel: 'Direct / WhatsApp',
  weeklyTrend: [18, 24, 15, 32, 28, 41, 37],
  lastSeenDate: new Date().toISOString().slice(0, 10),
  pageViews: 92,
  recentActivity: [
    { id: 1, title: 'New buyer inquiry', detail: 'Organic sesame request from Dubai', time: '12 mins ago' },
    { id: 2, title: 'Quote accepted', detail: '2x maize lot moved to pipeline', time: '48 mins ago' },
    { id: 3, title: 'Logistics update', detail: 'Shipping docs prepared for Lusaka hub', time: '1 hr ago' },
  ],
};

export const readBusinessMetrics = (): BusinessMetrics => {
  if (typeof window === 'undefined') return defaultBusinessMetrics;
  try {
    const stored = window.localStorage.getItem('emt-business-dashboard');
    if (!stored) return defaultBusinessMetrics;
    const parsed = JSON.parse(stored) as Partial<BusinessMetrics>;
    return { ...defaultBusinessMetrics, ...parsed };
  } catch {
    return defaultBusinessMetrics;
  }
};

export const persistBusinessMetrics = (updater: (prev: BusinessMetrics) => BusinessMetrics) => {
  if (typeof window === 'undefined') return;
  const current = readBusinessMetrics();
  const next = updater(current);
  window.localStorage.setItem('emt-business-dashboard', JSON.stringify(next));
  return next;
};

export const recordBusinessActivity = (title: string, detail: string, incrementVisitors = false) => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  persistBusinessMetrics(prev => ({
    ...prev,
    totalVisitors: incrementVisitors ? prev.totalVisitors + 1 : prev.totalVisitors,
    visitorsToday: incrementVisitors ? (prev.lastSeenDate === today ? prev.visitorsToday + 1 : 1) : prev.visitorsToday,
    lastSeenDate: incrementVisitors ? today : prev.lastSeenDate,
    pageViews: prev.pageViews + 1,
    recentActivity: [
      { id: now.getTime(), title, detail, time: 'just now' },
      ...prev.recentActivity,
    ].slice(0, 5),
  }));
};
