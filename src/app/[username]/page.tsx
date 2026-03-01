'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, MapPin } from 'lucide-react';
import { VendorsService } from '@/lib/services/vendors.service';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { formatPrice } from '@/lib/utils';

export default function PublicVendorPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    loadVendorData();
  }, [username]);

  const loadVendorData = async () => {
    try {
      const result = await VendorsService.getPublicPage(username);
      if (result.success) {
        setData(result);
        
        // Track page view
        await AnalyticsService.track({
          event: 'page_view',
          vendor_username: username,
          session_id: AnalyticsService.getSessionId(),
          metadata: {
            source: AnalyticsService.detectSource(document.referrer),
            ...AnalyticsService.getUtmParams()
          }
        });
      }
    } catch (error) {
      console.error('Load vendor error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (product: any) => {
    await AnalyticsService.track({
      event: 'product_view',
      vendor_username: username,
      session_id: AnalyticsService.getSessionId(),
      product_id: product.id
    });
    setSelectedProduct(product);
  };

  const handleWhatsAppClick = async (product: any) => {
    await AnalyticsService.track({
      event: 'whatsapp_click',
      vendor_username: username,
      session_id: AnalyticsService.getSessionId(),
      product_id: product.id
    });

    const message = `Hi, I'm interested in ${product.name} (${formatPrice(product.price)})`;
    const url = `https://wa.me/${data.vendor.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

  if (!data || !data.vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-[24px] font-semibold text-neutral-900 mb-2">Store not found</h1>
          <p className="text-[14px] text-neutral-600">This store doesn't exist or is unavailable.</p>
        </div>
      </div>
    );
  }

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

      <div className="min-h-screen pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {data.vendor.avatar_url && (
                <img 
                  src={data.vendor.avatar_url} 
                  alt={data.vendor.full_name}
                  className="w-12 h-12 rounded-full object-cover bg-neutral-100"
                />
              )}
              {!data.vendor.avatar_url && (
                <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-[16px] font-semibold text-neutral-700">
                    {data.vendor.full_name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-[17px] font-semibold text-neutral-900">{data.vendor.full_name}</h1>
                {data.vendor.bio && (
                  <p className="text-[13px] text-neutral-600 flex items-center gap-1">
                    {data.vendor.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Products */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          {data.products && data.products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.products.map((product: any) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group text-left rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all overflow-hidden"
                >
                  <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
                        <span className="px-3 py-1 bg-neutral-800 text-white text-[12px] font-medium rounded">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-[14px] font-medium text-neutral-900 line-clamp-2 mb-1">{product.name}</h3>
                    <p className="text-[15px] font-semibold text-neutral-900">{formatPrice(product.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[15px] text-neutral-600">No products available yet</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-center">
            <a href="https://linkpro.cm" target="_blank" className="text-[13px] text-neutral-600 hover:text-neutral-900">
              Created with LinkPro
            </a>
          </div>
        </footer>

        {/* Product Modal */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="w-full max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square bg-neutral-100 relative">
                <img 
                  src={selectedProduct.image_url} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-[20px] font-semibold text-neutral-900 mb-2">{selectedProduct.name}</h2>
                <p className="text-[24px] font-display text-neutral-900 mb-4">{formatPrice(selectedProduct.price)}</p>
                
                {selectedProduct.description && (
                  <p className="text-[14px] text-neutral-600 mb-6">{selectedProduct.description}</p>
                )}

                {selectedProduct.is_available ? (
                  <button
                    onClick={() => handleWhatsAppClick(selectedProduct)}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white text-[15px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Message on WhatsApp
                  </button>
                ) : (
                  <div className="w-full h-11 bg-neutral-100 text-neutral-500 text-[15px] font-medium rounded-lg flex items-center justify-center">
                    Out of stock
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
