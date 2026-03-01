'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ExternalLink, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    visits: 127,
    visits_change: 32,
    clicks: 34,
    click_rate: 26.8,
    products: { used: 8, total: 10 }
  });

  const activities = [
    { source: 'Instagram', product: 'Summer Dress', time: '2m ago' },
    { source: 'TikTok', product: 'Leather Bag', time: '5m ago' },
    { source: 'Direct', product: 'Sneakers', time: '12m ago' },
    { source: 'Instagram', product: 'Sunglasses', time: '25m ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] text-neutral-900">Dashboard</h1>
          <p className="text-[14px] text-neutral-600 mt-1">Track your store performance</p>
        </div>
        
        <Link href="https://linkpro.cm/marie_shop" target="_blank">
          <button className="flex items-center gap-2 px-4 h-9 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[13px] font-medium rounded-md transition-colors">
            View store
            <ExternalLink className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">Visits</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-display text-neutral-900">{stats.visits}</p>
            <div className="flex items-center gap-1 text-[12px] text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{stats.visits_change}%</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">WhatsApp clicks</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-display text-neutral-900">{stats.clicks}</p>
            <p className="text-[12px] text-neutral-500">{stats.click_rate}% rate</p>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-white border border-neutral-200">
          <p className="text-[13px] font-medium text-neutral-600 mb-1">Products</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-display text-neutral-900">{stats.products.used}</p>
            <p className="text-[12px] text-neutral-500">of {stats.products.total}</p>
          </div>
          {stats.products.used >= stats.products.total - 2 && (
            <p className="text-[12px] text-amber-600 mt-2">
              Nearing limit. <Link href="/dashboard/upgrade" className="underline">Upgrade</Link>
            </p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-semibold text-neutral-900">Recent activity</h2>
          <Link href="/dashboard/analytics">
            <button className="text-[13px] text-neutral-600 hover:text-neutral-900 font-medium">
              View all →
            </button>
          </Link>
        </div>

        <div className="rounded-lg bg-white border border-neutral-200 divide-y divide-neutral-200">
          {activities.map((activity, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-[14px] font-medium text-neutral-900">{activity.product}</p>
                  <p className="text-[13px] text-neutral-600">From {activity.source}</p>
                </div>
              </div>
              <p className="text-[13px] text-neutral-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[17px] font-semibold text-neutral-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/products">
            <button className="w-full p-4 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-left">
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5" />
                <div>
                  <p className="text-[14px] font-medium">Add product</p>
                  <p className="text-[13px] text-neutral-400">Upload a new item</p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/dashboard/analytics">
            <button className="w-full p-4 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-neutral-700">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-neutral-900">View analytics</p>
                  <p className="text-[13px] text-neutral-600">Detailed insights</p>
                </div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
