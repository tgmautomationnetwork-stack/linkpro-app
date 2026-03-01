'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFCF9] antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cal+Sans:wght@600&family=Inter:wght@400;500;600&display=swap');
        
        .font-cal {
          font-family: 'Cal Sans', sans-serif;
        }
      `}</style>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5' : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="group-hover:scale-110 transition-transform">
              <rect width="28" height="28" rx="6" fill="#18181B"/>
              <path d="M9 19V9h6.5a3.25 3.25 0 110 6.5H12" stroke="#FEFCF9" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-base font-semibold text-zinc-900">LinkPro</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-all">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            For Instagram & TikTok sellers in Cameroon
          </div>

          <h1 className="font-cal text-[56px] leading-[1.1] tracking-tight text-zinc-900 mb-6">
            Your products,
            <br />
            one beautiful link
          </h1>

          <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A mobile catalog with real-time analytics and WhatsApp built in. 
            Made for African vendors who sell on social media.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/signup">
              <button className="group px-6 py-3 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-all flex items-center gap-2">
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="#example">
              <button className="px-6 py-3 text-zinc-700 font-medium rounded-lg hover:bg-zinc-100 transition-colors">
                See example
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Free up to 10 products
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              2 minute setup
            </span>
          </div>
        </div>

        {/* Product Preview SVG */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="relative">
            <svg viewBox="0 0 1200 700" className="w-full" fill="none">
              {/* Browser Window */}
              <rect x="50" y="50" width="1100" height="600" rx="12" fill="white" stroke="#E4E4E7" strokeWidth="2"/>
              
              {/* Browser Chrome */}
              <rect x="50" y="50" width="1100" height="40" rx="12" fill="#FAFAFA"/>
              <line x1="50" y1="90" x2="1150" y2="90" stroke="#E4E4E7" strokeWidth="1"/>
              <circle cx="75" cy="70" r="5" fill="#EF4444"/>
              <circle cx="95" cy="70" r="5" fill="#F59E0B"/>
              <circle cx="115" cy="70" r="5" fill="#10B981"/>
              
              {/* URL Bar */}
              <rect x="450" y="62" width="300" height="16" rx="8" fill="white" stroke="#E4E4E7"/>
              <text x="470" y="73" className="text-xs" fill="#A1A1AA" fontSize="11">linkpro.cm/marie_boutique</text>
              
              {/* Profile Header */}
              <circle cx="150" cy="150" r="30" fill="#F4F4F5"/>
              <rect x="120" y="140" width="60" height="20" rx="10" fill="#D4D4D8"/>
              
              <text x="200" y="155" className="text-sm font-semibold" fill="#18181B" fontSize="18">Marie Boutique</text>
              <text x="200" y="175" className="text-xs" fill="#71717A" fontSize="13">Mode & Accessoires · Douala</text>
              
              {/* Product Grid */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const x = 120 + (i % 3) * 320;
                const y = 220 + Math.floor(i / 3) * 220;
                return (
                  <g key={i}>
                    {/* Product Card */}
                    <rect x={x} y={y} width="280" height="180" rx="8" fill="#FAFAFA" stroke="#E4E4E7"/>
                    
                    {/* Product Image */}
                    <rect x={x} y={y} width="280" height="120" rx="8" fill="#F4F4F5"/>
                    <rect x={x + 100} y={y + 40} width="80" height="40" rx="4" fill="#D4D4D8"/>
                    
                    {/* Product Info */}
                    <rect x={x + 12} y={y + 135} width="180" height="10" rx="5" fill="#D4D4D8"/>
                    <rect x={x + 12} y={y + 152} width="80" height="12" rx="6" fill="#18181B"/>
                  </g>
                );
              })}
              
              {/* WhatsApp Button (Floating) */}
              <g filter="url(#shadow)">
                <circle cx="1050" cy="600" r="28" fill="#25D366"/>
                <path d="M1040 595l8 5 8-5M1040 600l8 5 8-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              
              <defs>
                <filter id="shadow" x="1020" y="570" width="60" height="60">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-zinc-200">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-cal text-zinc-900 mb-1">40-60%</div>
            <div className="text-sm text-zinc-600">sales lost to manual DMs</div>
          </div>
          <div>
            <div className="text-3xl font-cal text-zinc-900 mb-1">2 min</div>
            <div className="text-sm text-zinc-600">to set up your store</div>
          </div>
          <div>
            <div className="text-3xl font-cal text-zinc-900 mb-1">0 FCFA</div>
            <div className="text-sm text-zinc-600">to get started</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cal text-4xl text-zinc-900 mb-12 text-center">
            Everything you need to sell
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Mobile catalog',
                desc: 'Add products in 30 seconds. Photos optimized for 3G.',
                icon: 'M4 6h16M4 12h16M4 18h16'
              },
              {
                title: 'Real-time analytics',
                desc: 'See who visits and what they view. Make data decisions.',
                icon: 'M3 13l4-4 4 4 6-6'
              },
              {
                title: 'WhatsApp built-in',
                desc: 'One tap to message you. Get notified on every click.',
                icon: 'M8 12h.01M12 12h.01M16 12h.01'
              },
              {
                title: 'Track every visit',
                desc: 'Source, products viewed, time spent — all captured.',
                icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={feature.icon}/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cal text-4xl text-zinc-900 mb-3 text-center">Simple pricing</h2>
          <p className="text-zinc-600 text-center mb-12">Start free. Upgrade when ready.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200">
              <div className="text-sm font-medium text-zinc-900 mb-1">Free</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-cal text-zinc-900">0</span>
                <span className="text-zinc-600 text-sm">FCFA/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 mb-6">
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />10 products</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Basic analytics</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />WhatsApp button</li>
              </ul>
              <Link href="/signup">
                <button className="w-full px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-lg transition-colors text-sm">
                  Start free
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-xl bg-zinc-900 text-white relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                Popular
              </div>
              <div className="text-sm font-medium mb-1">Pro</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-cal">5,000</span>
                <span className="text-zinc-400 text-sm">FCFA/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300 mb-6">
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /><span className="font-medium text-white">Unlimited</span> products</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />Advanced analytics</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />Auto reminders</li>
              </ul>
              <Link href="/signup">
                <button className="w-full px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 font-medium rounded-lg transition-colors text-sm">
                  Start Pro
                </button>
              </Link>
            </div>

            {/* Business */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200">
              <div className="text-sm font-medium text-zinc-900 mb-1">Business</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-cal text-zinc-900">15,000</span>
                <span className="text-zinc-600 text-sm">FCFA/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 mb-6">
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Everything in Pro</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Team access</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />Priority support</li>
              </ul>
              <Link href="/signup">
                <button className="w-full px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-lg transition-colors text-sm">
                  Contact sales
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-cal text-4xl text-zinc-900 mb-4">
            Ready to sell smarter?
          </h2>
          <p className="text-zinc-600 mb-8">
            Join vendors across Cameroon using LinkPro.
          </p>
          <Link href="/signup">
            <button className="group px-6 py-3 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-all inline-flex items-center gap-2">
              Create your store
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#18181B"/>
              <path d="M9 19V9h6.5a3.25 3.25 0 110 6.5H12" stroke="#FEFCF9" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm text-zinc-600">© 2025 LinkPro</span>
          </div>
          
          <div className="flex gap-6 text-sm text-zinc-600">
            <Link href="#" className="hover:text-zinc-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
