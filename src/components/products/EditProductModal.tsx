'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Product, ProductsService } from '@/lib/services/products.service';
import { CloudinaryService } from '@/lib/services/cloudinary.service';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product;
}

export function EditProductModal({ isOpen, onClose, onSuccess, product }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image_url: '',
    is_available: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category || '',
        description: product.description || '',
        image_url: product.image_url,
        is_available: product.is_available,
      });
      setImagePreview(product.image_url);
    }
  }, [product]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrors({});

    try {
      const result = await CloudinaryService.uploadImage(file);

      if (!result.success) {
        setErrors({ image: result.error || 'Upload failed' });
        return;
      }

      setFormData({ ...formData, image_url: result.url || '' });
      setImagePreview(result.url || null);
    } catch (error) {
      setErrors({ image: 'Upload error' });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name required';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 100) {
      newErrors.price = 'Price must be at least 100 FCFA';
    }

    if (!formData.image_url) {
      newErrors.image = 'Product image required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await ProductsService.update(product.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category || undefined,
        description: formData.description || undefined,
        image_url: formData.image_url,
        is_available: formData.is_available,
      });

      if (!result.success) {
        setErrors({ submit: result.error || 'Update failed' });
        return;
      }

      onSuccess();
    } catch (error) {
      setErrors({ submit: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-[17px] font-semibold text-neutral-900">Edit product</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Image */}
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-2">
              Product image
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg bg-neutral-100"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image_url: '' });
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="edit-image-upload"
                />
                <label
                  htmlFor="edit-image-upload"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploading
                      ? 'border-neutral-300 bg-neutral-50 cursor-not-allowed'
                      : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
                      <span className="text-[13px] text-neutral-600">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-neutral-400" />
                      <span className="text-[13px] font-medium text-neutral-700">
                        Upload new image
                      </span>
                      <span className="text-[12px] text-neutral-500">
                        JPG, PNG or WEBP. Max 5MB.
                      </span>
                    </div>
                  )}
                </label>
              </div>
            )}

            {errors.image && (
              <p className="mt-1.5 text-[13px] text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Product name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full h-10 px-3 rounded-md border ${
                errors.name ? 'border-red-300' : 'border-neutral-200'
              } focus:border-neutral-900 focus:outline-none text-[15px]`}
              placeholder="Summer dress"
            />
            {errors.name && (
              <p className="mt-1.5 text-[13px] text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Price (FCFA)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full h-10 px-3 rounded-md border ${
                errors.price ? 'border-red-300' : 'border-neutral-200'
              } focus:border-neutral-900 focus:outline-none text-[15px]`}
              placeholder="15000"
              min="100"
            />
            {errors.price && (
              <p className="mt-1.5 text-[13px] text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Category (optional)
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[15px]"
            >
              <option value="">Select category</option>
              <option value="mode">Fashion</option>
              <option value="accessoires">Accessories</option>
              <option value="chaussures">Shoes</option>
              <option value="sacs">Bags</option>
              <option value="beaute">Beauty</option>
              <option value="electronique">Electronics</option>
              <option value="autre">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[15px] resize-none"
              placeholder="Describe your product..."
              maxLength={500}
            />
            <p className="mt-1 text-[12px] text-neutral-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Available */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-[14px] font-medium text-neutral-900">
                Available for sale
              </span>
            </label>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-[13px] text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 border border-neutral-200 text-neutral-700 text-[14px] font-medium rounded-md hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 h-10 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
