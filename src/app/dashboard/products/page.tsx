'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { ProductsService, Product } from '@/lib/services/products.service';
import { formatPrice } from '@/lib/utils';
import { AddProductModal } from '@/components/products/AddProductModal';
import { EditProductModal } from '@/components/products/EditProductModal';
import { ProductTableSkeleton, StatsCardsSkeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await ProductsService.list({ limit: 100 });
      if (result.success && result.products) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Load products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const result = await ProductsService.update(product.id, {
        is_available: !product.is_available,
      });
      if (result.success) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, is_available: !p.is_available } : p
        ));
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      const result = await ProductsService.delete(product.id);
      if (result.success) {
        setProducts(products.filter(p => p.id !== product.id));
      }
    } catch (error) {
      console.error('Delete product error:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] text-neutral-900">Products</h1>
          <p className="text-[14px] text-neutral-600 mt-1">Manage your catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 h-9 bg-neutral-900 text-white text-[13px] font-medium rounded-md hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[14px]"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-10 px-3 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[14px]"
        >
          <option value="">All categories</option>
          <option value="mode">Fashion</option>
          <option value="accessoires">Accessories</option>
          <option value="chaussures">Shoes</option>
          <option value="sacs">Bags</option>
          <option value="beaute">Beauty</option>
        </select>
      </div>

      {/* Stats */}
      {loading ? (
        <StatsCardsSkeleton />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white border border-neutral-200">
            <p className="text-[13px] text-neutral-600 mb-1">Total</p>
            <p className="text-[24px] font-display text-neutral-900">{products.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-neutral-200">
            <p className="text-[13px] text-neutral-600 mb-1">Available</p>
            <p className="text-[24px] font-display text-emerald-600">{products.filter(p => p.is_available).length}</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-neutral-200">
            <p className="text-[13px] text-neutral-600 mb-1">Unavailable</p>
            <p className="text-[24px] font-display text-neutral-400">{products.filter(p => !p.is_available).length}</p>
          </div>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <ProductTableSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <Plus className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-[16px] font-semibold text-neutral-900 mb-1">
            {searchQuery || filterCategory ? 'No results' : 'No products'}
          </h3>
          <p className="text-[14px] text-neutral-600 mb-6">
            {searchQuery || filterCategory ? 'Try adjusting filters' : 'Add your first product to get started'}
          </p>
          {!searchQuery && !filterCategory && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 h-9 bg-neutral-900 text-white text-[13px] font-medium rounded-md"
            >
              <Plus className="w-4 h-4" />
              Add product
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-white border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-neutral-200">
              <tr className="text-left">
                <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Product</th>
                <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Price</th>
                <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Category</th>
                <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Views</th>
                <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover bg-neutral-100"
                      />
                      <span className="text-[14px] font-medium text-neutral-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[14px] text-neutral-900">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-[13px] text-neutral-600">{product.category || '—'}</td>
                  <td className="px-4 py-3 text-[13px] text-neutral-600">{product.view_count}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium ${
                      product.is_available 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
                        title={product.is_available ? 'Mark unavailable' : 'Mark available'}
                      >
                        {product.is_available ? (
                          <EyeOff className="w-4 h-4 text-neutral-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-neutral-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowEditModal(true);
                        }}
                        className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadProducts();
          setShowAddModal(false);
        }}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            loadProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
