'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/cal-sans');
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #FAFAFA;
        }
        .font-display {
          font-family: 'Cal Sans', -apple-system, sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="min-h-screen">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-neutral-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-neutral-200 z-50 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span className="text-[15px] font-semibold">LinkPro</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-neutral-100 rounded">
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors
                      ${isActive 
                        ? 'bg-neutral-900 text-white' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                      }
                    `}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Upgrade */}
            <div className="p-4 border-t border-neutral-200">
              <div className="p-4 rounded-lg bg-neutral-900 text-white">
                <p className="text-[13px] font-medium mb-1">Free plan</p>
                <p className="text-[12px] text-neutral-400 mb-3">8 of 10 products used</p>
                <Link href="/dashboard/upgrade">
                  <button className="w-full h-8 bg-white text-neutral-900 text-[13px] font-medium rounded-md hover:bg-neutral-100 transition-colors">
                    Upgrade
                  </button>
                </Link>
              </div>
            </div>

            {/* User */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-[13px] font-semibold text-neutral-700">MF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-neutral-900 truncate">Marie Fotso</p>
                  <p className="text-[12px] text-neutral-500 truncate">@marie_shop</p>
                </div>
              </div>
              <button className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="lg:pl-64">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 h-14 flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-neutral-100 rounded">
              <Menu className="w-5 h-5 text-neutral-600" />
            </button>
          </header>

          {/* Content */}
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
