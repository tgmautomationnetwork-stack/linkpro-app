'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CloudinaryService } from '@/lib/services/cloudinary.service';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    // TODO: Load from API
    setFormData({
      full_name: user?.full_name || '',
      bio: '',
      avatar_url: '',
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrors({});

    try {
      const result = await CloudinaryService.uploadImage(file);

      if (!result.success) {
        setErrors({ avatar: result.error || 'Upload failed' });
        return;
      }

      setFormData({ ...formData, avatar_url: result.url || '' });
    } catch (error) {
      setErrors({ avatar: 'Upload error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({});

    try {
      // TODO: Update profile via API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-[28px] text-neutral-900">Settings</h1>
        <p className="text-[14px] text-neutral-600 mt-1">Manage your account settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="p-6 rounded-lg bg-white border border-neutral-200">
          <h2 className="text-[17px] font-semibold text-neutral-900 mb-6">Profile</h2>

          {/* Avatar */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-neutral-700 mb-3">
              Profile photo
            </label>
            <div className="flex items-center gap-4">
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover bg-neutral-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-[20px] font-semibold text-neutral-700">
                    {formData.full_name.charAt(0) || 'U'}
                  </span>
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`inline-flex items-center gap-2 px-4 h-9 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[13px] font-medium rounded-md transition-colors cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload photo
                    </>
                  )}
                </label>
                <p className="text-[12px] text-neutral-500 mt-1">
                  JPG, PNG or WEBP. Max 5MB.
                </p>
              </div>
            </div>
            {errors.avatar && (
              <p className="mt-2 text-[13px] text-red-600">{errors.avatar}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[15px]"
              placeholder="Marie Fotso"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:border-neutral-900 focus:outline-none text-[15px] resize-none"
              placeholder="Tell visitors about your store..."
              maxLength={160}
            />
            <p className="mt-1 text-[12px] text-neutral-500">
              {formData.bio.length}/160 characters
            </p>
          </div>
        </div>

        {/* Store Info */}
        <div className="p-6 rounded-lg bg-white border border-neutral-200">
          <h2 className="text-[17px] font-semibold text-neutral-900 mb-4">Store</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1">
                Username
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-neutral-500">linkpro.cm/</span>
                <span className="text-[14px] font-medium text-neutral-900">
                  {user?.username || 'your_username'}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-neutral-500">
                Contact support to change username
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1">
                Subscription
              </label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-neutral-100 text-neutral-900 text-[13px] font-medium rounded capitalize">
                  {user?.subscription_plan || 'free'}
                </span>
                {user?.subscription_plan === 'free' && (
                  <a href="/dashboard/upgrade">
                    <button type="button" className="text-[13px] text-neutral-600 hover:text-neutral-900 underline">
                      Upgrade
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="p-6 rounded-lg bg-white border border-neutral-200">
          <h2 className="text-[17px] font-semibold text-neutral-900 mb-4">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1">
                WhatsApp number
              </label>
              <p className="text-[14px] text-neutral-900">
                {/* TODO: Get from user data */}
                +237 6XX XXX XXX
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
                Used for authentication
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                type="button"
                className="text-[13px] text-red-600 hover:text-red-700 font-medium"
              >
                Delete account
              </button>
              <p className="mt-1 text-[12px] text-neutral-500">
                Permanently delete your account and all data
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        {errors.submit && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-[13px] text-red-700">{errors.submit}</p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <p className="text-[13px] text-emerald-700 font-medium">Settings saved</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadProfile}
            className="px-4 h-10 border border-neutral-200 text-neutral-700 text-[14px] font-medium rounded-md hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 h-10 bg-neutral-900 text-white text-[14px] font-medium rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
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
  );
}
