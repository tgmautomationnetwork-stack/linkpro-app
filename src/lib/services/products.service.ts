// Products API Service
import { AuthService } from './auth.service';

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  image_url: string;
  additional_images: string[];
  is_available: boolean;
  stock_quantity: number | null;
  category: string | null;
  tags: string[];
  view_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
  sort_order: number;
}

export interface ProductsResponse {
  success: boolean;
  error?: string;
  products?: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description?: string;
  image_url: string;
  category?: string;
  tags?: string[];
  is_available?: boolean;
  stock_quantity?: number | null;
}

export class ProductsService {
  private static baseUrl = '/api/products';

  private static getHeaders(): HeadersInit {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  static async list(params?: {
    page?: number;
    limit?: number;
    category?: string;
    available?: boolean;
  }): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.category) queryParams.set('category', params.category);
      if (params?.available !== undefined) queryParams.set('available', params.available.toString());

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors du chargement des produits',
        };
      }

      return result;
    } catch (error) {
      console.error('List products error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  static async create(data: CreateProductRequest): Promise<{ success: boolean; error?: string; product?: Product }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la création du produit',
        };
      }

      return result;
    } catch (error) {
      console.error('Create product error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  static async update(
    id: string,
    data: Partial<CreateProductRequest>
  ): Promise<{ success: boolean; error?: string; product?: Product }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la mise à jour',
        };
      }

      return result;
    } catch (error) {
      console.error('Update product error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la suppression',
        };
      }

      return result;
    } catch (error) {
      console.error('Delete product error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }
}
