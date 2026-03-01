// Vendors API Service
export interface PublicVendor {
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme_color: string;
  whatsapp_number: string;
}

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  image_url: string;
  is_available: boolean;
  view_count: number;
  click_count: number;
}

export interface VendorPublicPageResponse {
  success: boolean;
  error?: string;
  vendor?: PublicVendor;
  products?: PublicProduct[];
}

export class VendorsService {
  private static baseUrl = '/api/vendors';

  static async getPublicPage(username: string): Promise<VendorPublicPageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Boutique non trouvée',
        };
      }

      return result;
    } catch (error) {
      console.error('Get vendor public page error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }
}
