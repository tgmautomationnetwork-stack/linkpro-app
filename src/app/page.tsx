'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/cal-sans');
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          background: #FAFAFA;
        }
        
        .font-display {
          font-family: 'Cal Sans', -apple-system, sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="min-h-screen">
        {/* Nav */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrollY > 20 ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/50' : ''
        }`}>
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <span className="text-[15px] font-semibold tracking-tight">LinkPro</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="px-3 h-8 text-[13px] font-medium text-neutral-700 hover:text-neutral-900">
                  Sign in
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-3 h-8 bg-neutral-900 text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-colors">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[12px] font-medium text-emerald-900 mb-6">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              For vendors on Instagram & TikTok
            </div>

            <h1 className="font-display text-[52px] leading-[1.05] text-neutral-900 mb-5">
              Turn your social feed
              <br />
              into a mobile store
            </h1>

            <p className="text-[17px] leading-relaxed text-neutral-600 mb-8 max-w-xl">
              One link for all your products. Real-time analytics. WhatsApp built in. 
              Made for sellers in Cameroon.
            </p>

            <div className="flex items-center gap-3 mb-8">
              <Link href="/signup">
                <button className="h-10 px-4 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors">
                  Start for free →
                </button>
              </Link>
              <Link href="#demo">
                <button className="h-10 px-4 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors">
                  View demo
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-[13px] text-neutral-500">
              <span>✓ Free up to 10 products</span>
              <span>✓ 2 minute setup</span>
              <span>✓ No credit card</span>
            </div>
          </div>

          {/* Product Preview - Clean SVG */}
          <div className="max-w-5xl mx-auto mt-16">
            <svg viewBox="0 0 1200 680" fill="none" className="w-full drop-shadow-2xl">
              {/* Browser Window */}
              <rect x="40" y="40" width="1120" height="600" rx="8" fill="white"/>
              <rect x="40" y="40" width="1120" height="600" rx="8" stroke="#E5E5E5" strokeWidth="1"/>
              
              {/* Chrome */}
              <rect x="40" y="40" width="1120" height="36" rx="8" fill="#FAFAFA"/>
              <line x1="40" y1="76" x2="1160" y2="76" stroke="#E5E5E5"/>
              <circle cx="62" cy="58" r="4" fill="#EF4444" opacity="0.8"/>
              <circle cx="80" cy="58" r="4" fill="#F59E0B" opacity="0.8"/>
              <circle cx="98" cy="58" r="4" fill="#10B981" opacity="0.8"/>
              
              {/* URL */}
              <rect x="480" y="51" width="240" height="14" rx="7" fill="white" stroke="#E5E5E5"/>
              <text x="494" y="61" fontSize="10" fill="#737373" fontFamily="system-ui">linkpro.cm/shop</text>
              
              {/* Profile */}
              <circle cx="120" cy="130" r="24" fill="#F5F5F5"/>
              <text x="160" y="133" fontSize="16" fontWeight="600" fill="#0A0A0A" fontFamily="system-ui">Marie's Shop</text>
              <text x="160" y="150" fontSize="12" fill="#737373" fontFamily="system-ui">Fashion · Douala</text>
              
              {/* Products Grid */}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x = 90 + col * 340;
                const y = 200 + row * 200;
                
                return (
                  <g key={i}>
                    <rect x={x} y={y} width="300" height="160" rx="6" fill="#FAFAFA"/>
                    <rect x={x} y={y} width="300" height="100" rx="6" fill="#F5F5F5"/>
                    <rect x={x + 120} y={y + 35} width="60" height="30" rx="3" fill="#E5E5E5"/>
                    <text x={x + 12} y={y + 125} fontSize="13" fontWeight="500" fill="#0A0A0A" fontFamily="system-ui">Product {i + 1}</text>
                    <text x={x + 12} y={y + 145} fontSize="14" fontWeight="600" fill="#0A0A0A" fontFamily="system-ui">15,000 FCFA</text>
                  </g>
                );
              })}
              
              {/* WhatsApp Button */}
              <circle cx="1080" cy="580" r="24" fill="#25D366"/>
              <path d="M1073 577l4 3 4-3m-8 4l4 3 4-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-6 border-y border-neutral-200 bg-white">
          <div className="max-w-4xl mx-auto grid grid-cols-3 text-center gap-8">
            <div>
              <div className="text-[32px] font-display text-neutral-900 mb-1">40-60%</div>
              <div className="text-[13px] text-neutral-600">sales lost to manual chat</div>
            </div>
            <div>
              <div className="text-[32px] font-display text-neutral-900 mb-1">2 min</div>
              <div className="text-[13px] text-neutral-600">average setup time</div>
            </div>
            <div>
              <div className="text-[32px] font-display text-neutral-900 mb-1">0 FCFA</div>
              <div className="text-[13px] text-neutral-600">to get started</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-[36px] text-neutral-900 mb-12 text-center">
              Built for social sellers
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                ['Mobile catalog', 'Add products in seconds. Photos load fast on 3G.'],
                ['Live analytics', 'See who visits. Track what sells. Make decisions.'],
                ['One-tap WhatsApp', 'Customers message you directly. No friction.'],
                ['Source tracking', 'Know if they came from TikTok or Instagram.']
              ].map(([title, desc], i) => (
                <div key={i} className="p-5 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all bg-white">
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5">{title}</h3>
                  <p className="text-[13px] text-neutral-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-6 bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-[36px] text-neutral-900 mb-2 text-center">Pricing</h2>
            <p className="text-[15px] text-neutral-600 text-center mb-12">Start free. Upgrade anytime.</p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg bg-white border border-neutral-200">
                <div className="text-[13px] font-medium text-neutral-900 mb-1">Free</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[32px] font-display text-neutral-900">0</span>
                  <span className="text-[13px] text-neutral-600">FCFA/mo</span>
                </div>
                <div className="space-y-2 text-[13px] text-neutral-600 mb-6">
                  <div>10 products</div>
                  <div>Basic analytics</div>
                  <div>WhatsApp button</div>
                </div>
                <Link href="/signup">
                  <button className="w-full h-9 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[13px] font-medium rounded-md transition-colors">
                    Start free
                  </button>
                </Link>
              </div>

              <div className="p-6 rounded-lg bg-neutral-900 text-white relative">
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500 text-white text-[11px] font-medium rounded">
                  Popular
                </div>
                <div className="text-[13px] font-medium mb-1">Pro</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[32px] font-display">5,000</span>
                  <span className="text-[13px] text-neutral-400">FCFA/mo</span>
                </div>
                <div className="space-y-2 text-[13px] text-neutral-300 mb-6">
                  <div className="text-white">Unlimited products</div>
                  <div>Advanced analytics</div>
                  <div>Auto reminders</div>
                </div>
                <Link href="/signup">
                  <button className="w-full h-9 bg-white hover:bg-neutral-100 text-neutral-900 text-[13px] font-medium rounded-md transition-colors">
                    Upgrade
                  </button>
                </Link>
              </div>

              <div className="p-6 rounded-lg bg-white border border-neutral-200">
                <div className="text-[13px] font-medium text-neutral-900 mb-1">Business</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[32px] font-display text-neutral-900">15,000</span>
                  <span className="text-[13px] text-neutral-600">FCFA/mo</span>
                </div>
                <div className="space-y-2 text-[13px] text-neutral-600 mb-6">
                  <div>Everything in Pro</div>
                  <div>Team access</div>
                  <div>Priority support</div>
                </div>
                <Link href="/signup">
                  <button className="w-full h-9 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[13px] font-medium rounded-md transition-colors">
                    Contact
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-[40px] text-neutral-900 mb-4">
              Ready to start?
            </h2>
            <p className="text-[15px] text-neutral-600 mb-8">
              Join vendors across Cameroon already using LinkPro.
            </p>
            <Link href="/signup">
              <button className="h-10 px-5 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors inline-flex items-center gap-2">
                Create your store
                <span>→</span>
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 py-12 px-6 bg-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-[13px]">
            <div className="text-neutral-500">© 2025 LinkPro</div>
            <div className="flex gap-6">
              <Link href="#" className="text-neutral-600 hover:text-neutral-900">Terms</Link>
              <Link href="#" className="text-neutral-600 hover:text-neutral-900">Privacy</Link>
              <Link href="#" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
