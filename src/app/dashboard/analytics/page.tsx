'use client';

import { useState, useEffect } from 'react';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsChartSkeleton, StatsCardsSkeleton } from '@/components/ui/skeleton';

type Period = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await AnalyticsService.getOverview({
        period,
        compare: true,
      });

      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Load analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-[28px] text-neutral-900">Analytics</h1>
          <p className="text-[14px] text-neutral-600 mt-1">Track your performance</p>
        </div>
        <StatsCardsSkeleton />
        <AnalyticsChartSkeleton />
        <AnalyticsChartSkeleton />
      </div>
    );
  }

  const metrics = data?.metrics || {
    total_visits: 0,
    unique_visitors: 0,
    whatsapp_clicks: 0,
    whatsapp_opens: 0,
    click_rate: 0,
    open_rate: 0,
  };

  const comparison = data?.comparison || {
    visits_change: 0,
    clicks_change: 0,
  };

  const topSources = data?.top_sources || [];
  const dailyStats = data?.daily_stats || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] text-neutral-900">Analytics</h1>
          <p className="text-[14px] text-neutral-600 mt-1">Track your store performance over time</p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 p-1 rounded-lg bg-neutral-100">
          {[
            { value: '7d', label: '7 days' },
            { value: '30d', label: '30 days' },
            { value: '90d', label: '90 days' },
            { value: 'all', label: 'All time' },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as Period)}
              className={`px-3 h-8 text-[13px] font-medium rounded-md transition-colors ${
                period === p.value
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">Total visits</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-display text-neutral-900">{metrics.total_visits}</p>
            {comparison.visits_change !== 0 && (
              <div className={`flex items-center gap-1 text-[12px] ${
                comparison.visits_change > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {comparison.visits_change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{Math.abs(comparison.visits_change)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">Unique visitors</p>
          <p className="text-[28px] font-display text-neutral-900">{metrics.unique_visitors}</p>
        </div>

        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">WhatsApp clicks</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-display text-neutral-900">{metrics.whatsapp_clicks}</p>
            {comparison.clicks_change !== 0 && (
              <div className={`flex items-center gap-1 text-[12px] ${
                comparison.clicks_change > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {comparison.clicks_change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{Math.abs(comparison.clicks_change)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">Click rate</p>
          <p className="text-[28px] font-display text-neutral-900">{metrics.click_rate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Chart - Visits over time */}
      <div className="p-6 rounded-lg bg-white border border-neutral-200">
        <h2 className="text-[17px] font-semibold text-neutral-900 mb-6">Visits over time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis 
              dataKey="date" 
              stroke="#A3A3A3"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#A3A3A3"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="visits" 
              stroke="#171717" 
              strokeWidth={2}
              dot={{ fill: '#171717', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart - Visits vs Clicks */}
      <div className="p-6 rounded-lg bg-white border border-neutral-200">
        <h2 className="text-[17px] font-semibold text-neutral-900 mb-6">Visits vs WhatsApp clicks</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis 
              dataKey="date" 
              stroke="#A3A3A3"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#A3A3A3"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="visits" fill="#D4D4D4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicks" fill="#171717" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Sources */}
      <div className="p-6 rounded-lg bg-white border border-neutral-200">
        <h2 className="text-[17px] font-semibold text-neutral-900 mb-4">Traffic sources</h2>
        {topSources.length > 0 ? (
          <div className="space-y-3">
            {topSources.map((source: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-medium text-neutral-900 capitalize">{source.source}</span>
                    <span className="text-[13px] text-neutral-600">{source.visits} visits ({source.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-neutral-600">No traffic data yet</p>
        )}
      </div>
    </div>
  );
}
