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
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-neutral-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[13px] font-medium text-emerald-700 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              For vendors on Instagram & TikTok
            </div>

            <h1 className="font-display text-[56px] md:text-[72px] leading-[1.05] text-neutral-900 mb-6 tracking-tight">
              Turn your social feed
              <br />
              into a <span className="text-emerald-600">mobile store</span>
            </h1>

            <p className="text-[18px] md:text-[20px] leading-relaxed text-neutral-600 mb-10 max-w-2xl mx-auto">
              One link for all your products. Real-time analytics. WhatsApp built in. 
              <strong className="font-semibold text-neutral-900"> Made for sellers in Cameroon.</strong>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link href="/signup">
                <button className="w-full sm:w-auto h-12 px-8 bg-neutral-900 text-white text-[15px] font-semibold rounded-lg hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Start for free →
                </button>
              </Link>
              <Link href="#demo">
                <button className="w-full sm:w-auto h-12 px-8 text-[15px] font-semibold text-neutral-700 bg-white border-2 border-neutral-200 hover:border-neutral-300 rounded-lg transition-all hover:shadow-md">
                  View demo
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-[14px] text-neutral-600 font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Free up to 10 products
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                2 minute setup
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                No credit card
              </div>
            </div>
          </div>

          {/* Product Preview - Enhanced */}
          <div className="max-w-6xl mx-auto mt-20 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-100 via-transparent to-transparent rounded-2xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1.5 bg-white rounded-lg border border-neutral-200 text-[13px] text-neutral-600 font-medium">
                      linkpro.cm/shop
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 bg-white">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      M
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">Marie's Shop</h3>
                      <p className="text-sm text-neutral-600">Fashion · Douala 🇨🇲</p>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {[
                      { name: 'Summer Dress', price: '15,000', color: 'from-pink-100 to-pink-200' },
                      { name: 'Sneakers', price: '22,500', color: 'from-blue-100 to-blue-200' },
                      { name: 'Handbag', price: '18,000', color: 'from-purple-100 to-purple-200' },
                      { name: 'Watch', price: '12,000', color: 'from-yellow-100 to-yellow-200' },
                      { name: 'Sunglasses', price: '8,500', color: 'from-green-100 to-green-200' },
                      { name: 'Jacket', price: '25,000', color: 'from-red-100 to-red-200' },
                    ].map((product, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="relative mb-3 overflow-hidden rounded-xl bg-neutral-100 aspect-square">
                          <div className={`absolute inset-0 bg-gradient-to-br ${product.color} group-hover:scale-110 transition-transform duration-300`}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-lg"></div>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-neutral-900 mb-1">{product.name}</h4>
                        <p className="text-base font-bold text-neutral-900">{product.price} FCFA</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Floating Button */}
                <div className="absolute bottom-6 right-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <button className="relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-6 bg-white border-y border-neutral-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Why LinkPro?</h3>
              <p className="text-2xl font-bold text-neutral-900">The numbers speak for themselves</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <div className="text-[40px] font-display font-bold text-red-600 mb-2">40-60%</div>
                <div className="text-[15px] font-medium text-neutral-700">Sales lost to manual chat</div>
                <p className="text-[13px] text-neutral-600 mt-2">Automate and recover lost revenue</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="text-[40px] font-display font-bold text-blue-600 mb-2">2 min</div>
                <div className="text-[15px] font-medium text-neutral-700">Average setup time</div>
                <p className="text-[13px] text-neutral-600 mt-2">From signup to first product</p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <div className="text-[40px] font-display font-bold text-emerald-600 mb-2">0 FCFA</div>
                <div className="text-[15px] font-medium text-neutral-700">To get started</div>
                <p className="text-[13px] text-neutral-600 mt-2">Free forever up to 10 products</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-[42px] md:text-[48px] text-neutral-900 mb-4">
                Built for social sellers
              </h2>
              <p className="text-[18px] text-neutral-600 max-w-2xl mx-auto">
                Everything you need to turn your Instagram or TikTok into a powerful sales channel
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: 'Mobile-first catalog',
                  desc: 'Add products in seconds. Photos load fast even on 3G. Optimized for African networks.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: 'Live analytics',
                  desc: 'See who visits in real-time. Track what sells. Make data-driven decisions.',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  ),
                  title: 'One-tap WhatsApp',
                  desc: 'Customers message you directly with pre-filled product info. Zero friction.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  ),
                  title: 'Source tracking',
                  desc: 'Know exactly if they came from TikTok, Instagram, or direct link. Optimize your content.',
                  color: 'from-pink-500 to-pink-600'
                }
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-2xl border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-lg transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-[18px] font-bold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-[15px] text-neutral-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 px-6 bg-neutral-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-[42px] md:text-[48px] text-neutral-900 mb-4">Simple, transparent pricing</h2>
              <p className="text-[18px] text-neutral-600">Start free. Upgrade anytime. No hidden fees.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl bg-white border-2 border-neutral-200 hover:border-neutral-300 transition-all">
                <div className="text-[14px] font-bold text-neutral-900 uppercase tracking-wide mb-2">Free</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-[48px] font-display font-bold text-neutral-900">0</span>
                  <span className="text-[16px] text-neutral-600 font-medium">FCFA/mo</span>
                </div>
                <ul className="space-y-3 text-[15px] text-neutral-700 mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span><strong>10 products</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>WhatsApp button</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <button className="w-full h-12 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[15px] font-semibold rounded-xl transition-all">
                    Start free
                  </button>
                </Link>
              </div>

              {/* Pro Plan - Featured */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-2 border-neutral-900 shadow-2xl scale-105 md:scale-110">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[13px] font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </div>
                <div className="text-[14px] font-bold uppercase tracking-wide mb-2">Pro</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-[48px] font-display font-bold">5,000</span>
                  <span className="text-[16px] text-neutral-300 font-medium">FCFA/mo</span>
                </div>
                <ul className="space-y-3 text-[15px] mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span><strong>Unlimited products</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Auto reminders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <button className="w-full h-12 bg-white hover:bg-neutral-100 text-neutral-900 text-[15px] font-bold rounded-xl transition-all shadow-lg">
                    Upgrade to Pro →
                  </button>
                </Link>
              </div>

              {/* Business Plan */}
              <div className="p-8 rounded-2xl bg-white border-2 border-neutral-200 hover:border-neutral-300 transition-all">
                <div className="text-[14px] font-bold text-neutral-900 uppercase tracking-wide mb-2">Business</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-[48px] font-display font-bold text-neutral-900">15,000</span>
                  <span className="text-[16px] text-neutral-600 font-medium">FCFA/mo</span>
                </div>
                <ul className="space-y-3 text-[15px] text-neutral-700 mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span><strong>Everything in Pro</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Team access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Custom branding</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <button className="w-full h-12 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[15px] font-semibold rounded-xl transition-all">
                    Contact sales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="font-display text-[48px] md:text-[56px] leading-tight mb-6">
              Ready to start selling?
            </h2>
            <p className="text-[20px] text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of vendors across Cameroon already using LinkPro to grow their business. 
              <strong className="text-white"> Setup takes 2 minutes.</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/signup">
                <button className="w-full sm:w-auto h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white text-[16px] font-bold rounded-xl transition-all shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1">
                  Create your store for free →
                </button>
              </Link>
              <Link href="#demo">
                <button className="w-full sm:w-auto h-14 px-10 text-[16px] font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 rounded-xl transition-all">
                  Watch demo
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-[14px] text-neutral-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Cancel anytime
              </div>
            </div>
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
