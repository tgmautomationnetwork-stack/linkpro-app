// Cloudinary Upload Helper (Client-side)

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  public_id?: string;
}

export class CloudinaryService {
  // Upload image to Cloudinary via unsigned upload
  static async uploadImage(file: File): Promise<UploadResult> {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        return {
          success: false,
          error: 'Configuration Cloudinary manquante',
        };
      }

      // Validate file
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Le fichier doit être une image',
        };
      }

      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'L\'image ne doit pas dépasser 5MB',
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'linkpro-products');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.error?.message || 'Erreur lors de l\'upload',
        };
      }

      const data = await response.json();

      return {
        success: true,
        url: data.secure_url,
        public_id: data.public_id,
      };

    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'upload de l\'image',
      };
    }
  }

  // Helper: Generate optimized Cloudinary URL
  static getOptimizedUrl(url: string, options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }): string {
    if (!url || !url.includes('cloudinary.com')) return url;

    const { width, height, quality = 'auto', format = 'auto' } = options || {};

    const transformations = [
      width && `w_${width}`,
      height && `h_${height}`,
      'c_fill',
      'g_auto',
      `q_${quality}`,
      `f_${format}`,
    ].filter(Boolean).join(',');

    // Insert transformations after /upload/
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  // Helper: Generate thumbnail URL
  static getThumbnailUrl(url: string, size: number = 400): string {
    return this.getOptimizedUrl(url, {
      width: size,
      height: size,
      quality: 'auto',
      format: 'auto',
    });
  }
}
