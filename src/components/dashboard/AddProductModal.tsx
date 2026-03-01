'use client';

import { useState } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import ImageUpload from '@/components/upload/ImageUpload';
import { formatPrice } from '@/lib/utils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category: '',
    is_available: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (url: string) => {
    handleInputChange('image_url', url);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.price) {
      newErrors.price = 'Le prix est requis';
    } else if (parseInt(formData.price) < 100) {
      newErrors.price = 'Prix minimum : 100 FCFA';
    }

    if (!formData.image_url) {
      newErrors.image_url = 'L\'image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('linkpro_token');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: parseInt(formData.price),
          description: formData.description.trim() || null,
          image_url: formData.image_url,
          category: formData.category.trim() || null,
          is_available: formData.is_available,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.upgrade_required) {
          setErrors({ submit: data.error });
          return;
        }
        throw new Error(data.error || 'Erreur lors de la création');
      }

      // Success
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Create product error:', error);
      setErrors({ submit: error.message || 'Erreur lors de la création du produit' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      image_url: '',
      category: '',
      is_available: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-600" />
            Ajouter un produit
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo du produit *
            </label>
            <ImageUpload
              onUploadComplete={handleImageUpload}
              currentImage={formData.image_url}
              folder="products"
            />
            {errors.image_url && (
              <p className="mt-2 text-sm text-red-600">{errors.image_url}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              } focus:border-purple-500 focus:outline-none transition-colors`}
              placeholder="Robe d'été légère"
              maxLength={200}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Prix (FCFA) *
            </label>
            <input
              id="price"
              type="number"
              min="100"
              step="100"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.price ? 'border-red-300' : 'border-gray-200'
              } focus:border-purple-500 focus:outline-none transition-colors`}
              placeholder="15000"
            />
            {formData.price && parseInt(formData.price) >= 100 && (
              <p className="mt-1 text-sm text-gray-500">
                ≈ {formatPrice(parseInt(formData.price))}
              </p>
            )}
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              placeholder="Belle robe légère parfaite pour l'été. Tissu respirant 100% coton..."
              maxLength={2000}
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {formData.description.length}/2000
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie (optionnel)
            </label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Mode, Accessoires, Chaussures..."
              maxLength={50}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <input
              id="available"
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) => handleInputChange('is_available', e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Produit disponible immédiatement
            </label>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errors.submit}</p>
              {errors.submit.includes('Passez à PRO') && (
                <button
                  type="button"
                  onClick={() => window.location.href = '/dashboard/upgrade'}
                  className="mt-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  Passer à PRO maintenant →
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Ajouter le produit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
