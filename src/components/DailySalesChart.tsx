import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  DollarSign,
  ArrowUpRight,
  Filter,
  BarChart2,
  LineChart as LineChartIcon,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';
import { formatRupiah } from '../utils/formatters';

interface DailySalesChartProps {
  orders: Order[];
  isDark?: boolean;
}

interface DailySummary {
  dateKey: string; // YYYY-MM-DD
  displayDate: string; // "05 Nov"
  fullDate: string; // "Kamis, 5 November 2026"
  timestamp: number;
  revenue: number; // total paid amount
  paidOrderCount: number;
  totalOrderCount: number;
  pendingAmount: number;
  topProduct?: string;
}

export const DailySalesChart: React.FC<DailySalesChartProps> = ({ orders, isDark = true }) => {
  // Chart metric: 'revenue' | 'orders' | 'combined'
  const [metric, setMetric] = useState<'revenue' | 'orders' | 'combined'>('revenue');
  // Days range: 7 | 14 | 30
  const [daysRange, setDaysRange] = useState<number>(7);

  // Group and aggregate orders by day
  const dailyData = useMemo(() => {
    const dayMap = new Map<string, DailySummary>();

    // Generate past N days slots so zero-sale days are also shown continuously
    const now = new Date();
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const displayDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const fullDate = d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      dayMap.set(dateKey, {
        dateKey,
        displayDate,
        fullDate,
        timestamp: d.getTime(),
        revenue: 0,
        paidOrderCount: 0,
        totalOrderCount: 0,
        pendingAmount: 0,
      });
    }

    // Tally real orders into daily buckets
    orders.forEach((ord) => {
      const orderDate = new Date(ord.createdAt);
      const dateKey = orderDate.toISOString().slice(0, 10);

      if (dayMap.has(dateKey)) {
        const bucket = dayMap.get(dateKey)!;
        bucket.totalOrderCount += 1;

        if (ord.paymentStatus === 'paid') {
          bucket.revenue += ord.totalAmount;
          bucket.paidOrderCount += 1;

          // Track first product name
          if (!bucket.topProduct && ord.items && ord.items[0]) {
            bucket.topProduct = ord.items[0].product.name;
          }
        } else if (ord.paymentStatus === 'pending') {
          bucket.pendingAmount += ord.totalAmount;
        }
      }
    });

    return Array.from(dayMap.values());
  }, [orders, daysRange]);

interface StatsSummary {
  totalRevenue: number;
  totalPaidOrders: number;
  avgDailyRevenue: number;
  avgTicket: number;
  peakDay: DailySummary | null;
}

  // Overall metrics across the selected window
  const stats = useMemo<StatsSummary>(() => {
    let totalRevenue = 0;
    let totalPaidOrders = 0;
    let peakDay: DailySummary | null = null;

    dailyData.forEach((day) => {
      totalRevenue += day.revenue;
      totalPaidOrders += day.paidOrderCount;
      if (!peakDay || day.revenue > peakDay.revenue) {
        peakDay = day;
      }
    });

    const avgDailyRevenue = daysRange > 0 ? Math.round(totalRevenue / daysRange) : 0;
    const avgTicket = totalPaidOrders > 0 ? Math.round(totalRevenue / totalPaidOrders) : 0;

    return {
      totalRevenue,
      totalPaidOrders,
      avgDailyRevenue,
      avgTicket,
      peakDay,
    };
  }, [dailyData, daysRange]);

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailySummary = payload[0].payload;
      return (
        <div
          className={`p-3 rounded-2xl shadow-2xl border text-xs space-y-1.5 backdrop-blur-md ${
            isDark
              ? 'bg-[#0f172a]/95 border-slate-700 text-white'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b pb-1.5 border-slate-200 dark:border-slate-800">
            <span className="font-bold text-[11px] text-slate-500 dark:text-slate-400">
              {data.fullDate}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500 dark:text-blue-400 font-mono font-bold">
              {data.paidOrderCount} Lunas
            </span>
          </div>

          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Omset Lunas:</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                {formatRupiah(data.revenue)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Total Transaksi:</span>
              <span className="font-mono font-bold">{data.totalOrderCount} pesanan</span>
            </div>

            {data.pendingAmount > 0 && (
              <div className="flex items-center justify-between gap-4 text-amber-500 text-[11px]">
                <span>Menunggu Bayar:</span>
                <span className="font-mono">{formatRupiah(data.pendingAmount)}</span>
              </div>
            )}

            {data.topProduct && (
              <div className="text-[10px] text-slate-400 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60 truncate max-w-[200px]">
                Item: {data.topProduct}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Axis and grid styling based on theme
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-4">
      {/* 1. KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Omset */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#11192b] border-blue-500/30'
              : 'bg-blue-50/70 border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Total Omset ({daysRange} Hari)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight truncate">
            {formatRupiah(stats.totalRevenue)}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-500 font-bold inline-flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              {stats.totalPaidOrders} Transaksi
            </span>
            <span>lunas terverifikasi</span>
          </div>
        </div>

        {/* Rata-Rata Penjualan Harian */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#11192b] border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rata-Rata / Hari</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight truncate">
            {formatRupiah(stats.avgDailyRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Rerata omset harian toko
          </div>
        </div>

        {/* Rata-Rata Per Order (Basket Size) */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#11192b] border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rata-Rata / Order</span>
            <ShoppingBag className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight truncate">
            {formatRupiah(stats.avgTicket)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Nilai keranjang per pembeli
          </div>
        </div>

        {/* Peak Day / Hari Terlaris */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#11192b] border-amber-500/30'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Puncak Penjualan</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight truncate">
            {stats.peakDay ? formatRupiah(stats.peakDay.revenue) : 'Rp 0'}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {stats.peakDay && stats.peakDay.revenue > 0 ? stats.peakDay.displayDate : 'Belum ada'}
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div
        className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
          isDark
            ? 'bg-[#0b101c] border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* Metric Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMetric('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metric === 'revenue'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Omset (Rp)</span>
          </button>

          <button
            type="button"
            onClick={() => setMetric('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metric === 'orders'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Order (Transaksi)</span>
          </button>

          <button
            type="button"
            onClick={() => setMetric('combined')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              metric === 'combined'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kombinasi</span>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            Periode:
          </span>
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setDaysRange(days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                daysRange === days
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {days} Hari
            </button>
          ))}
        </div>
      </div>

      {/* 3. Recharts Visual Chart Container */}
      <div
        className={`p-4 rounded-3xl border ${
          isDark
            ? 'bg-[#0f172a] border-slate-800/90'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Tren Penjualan Harian Yuraa Store</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Recharts Engine
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Data akumulasi otomatis dari pesanan yang masuk dan lunas via DANA
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            {metric !== 'orders' && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Omset Lunas</span>
              </div>
            )}
            {metric !== 'revenue' && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Jumlah Transaksi</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            {metric === 'revenue' ? (
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: textColor, fontSize: 11 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: textColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => {
                    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`;
                    if (val >= 1000) return `${Math.round(val / 1000)}k`;
                    return `${val}`;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 6, fill: '#60a5fa', stroke: '#1d4ed8', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : metric === 'orders' ? (
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: textColor, fontSize: 11 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: textColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="paidOrderCount"
                  name="Order Lunas"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            ) : (
              // Combined View
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="combRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: textColor, fontSize: 11 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: textColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: textColor, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#combRev)"
                  name="Omset (Rp)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Table Breakdown of Daily Sales */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? 'bg-[#0f172a] border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Rincian Harian ({daysRange} Hari Terakhir)
          </span>
          <span className="text-[11px] text-slate-500">
            Total {stats.totalPaidOrders} Transaksi Terverifikasi
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 text-[10px] uppercase font-bold sticky top-0">
              <tr>
                <th className="py-2 px-3">Tanggal</th>
                <th className="py-2 px-3">Omset Lunas</th>
                <th className="py-2 px-3 text-center">Order Lunas</th>
                <th className="py-2 px-3 text-right">Rerata Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {dailyData
                .slice()
                .reverse()
                .map((day) => {
                  const dayAvg =
                    day.paidOrderCount > 0 ? Math.round(day.revenue / day.paidOrderCount) : 0;
                  const isPeak = stats.peakDay?.dateKey === day.dateKey && day.revenue > 0;

                  return (
                    <tr
                      key={day.dateKey}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isPeak ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-sans font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span>{day.displayDate}</span>
                          {isPeak && (
                            <span className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500">
                              Peak
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{day.fullDate.split(',')[0]}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(day.revenue)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            day.paidOrderCount > 0
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {day.paidOrderCount}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">
                        {dayAvg > 0 ? formatRupiah(dayAvg) : '-'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
