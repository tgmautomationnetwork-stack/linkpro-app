'use client';

import { useState } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { ProductsService } from '@/lib/services/products.service';
import { CloudinaryService } from '@/lib/services/cloudinary.service';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image_url: '',
    is_available: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrors({ ...errors, image: '' });

    try {
      const result = await CloudinaryService.uploadImage(file);

      if (!result.success) {
        setErrors({ ...errors, image: result.error || 'Erreur upload' });
        return;
      }

      setFormData({ ...formData, image_url: result.url || '' });
      setImagePreview(result.url || '');
    } catch (error) {
      setErrors({ ...errors, image: 'Erreur lors de l\'upload' });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.price || parseInt(formData.price) < 100) {
      newErrors.price = 'Prix minimum : 100 FCFA';
    }

    if (!formData.image_url) {
      newErrors.image = 'L\'image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await ProductsService.create({
        name: formData.name.trim(),
        price: parseInt(formData.price),
        description: formData.description.trim() || undefined,
        category: formData.category.trim() || undefined,
        image_url: formData.image_url,
        is_available: formData.is_available,
      });

      if (!result.success) {
        if (result.error?.includes('Limite atteinte')) {
          setErrors({ submit: result.error });
        } else {
          setErrors({ submit: result.error || 'Erreur lors de la création' });
        }
        return;
      }

      // Success
      onSuccess();
      handleClose();
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la création du produit' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      image_url: '',
      is_available: true,
    });
    setImagePreview('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Ajouter un produit</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du produit *
            </label>
            
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData({ ...formData, image_url: '' });
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer
                    ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}
                    transition-all
                  `}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-3" />
                      <p className="text-sm text-gray-600">Upload en cours...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Cliquez pour uploader
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP jusqu'à 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            )}
            
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              } focus:border-purple-500 focus:outline-none transition-colors`}
              placeholder="Ex: Robe d'été élégante"
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
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.price ? 'border-red-300' : 'border-gray-200'
              } focus:border-purple-500 focus:outline-none transition-colors`}
              placeholder="15000"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">Choisir une catégorie</option>
              <option value="mode">Mode</option>
              <option value="accessoires">Accessoires</option>
              <option value="chaussures">Chaussures</option>
              <option value="sacs">Sacs</option>
              <option value="beaute">Beauté</option>
              <option value="electronique">Électronique</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              placeholder="Décrivez votre produit..."
            />
          </div>

          {/* Available Toggle */}
          <div className="flex items-center gap-3">
            <input
              id="available"
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Produit disponible à la vente
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  <span>Créer le produit</span>
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
