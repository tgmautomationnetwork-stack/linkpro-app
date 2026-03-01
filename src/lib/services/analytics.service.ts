// Analytics API Service
import { AuthService } from './auth.service';

export interface AnalyticsMetrics {
  total_visits: number;
  unique_visitors: number;
  whatsapp_clicks: number;
  whatsapp_opens: number;
  click_rate: number;
  open_rate: number;
}

export interface AnalyticsComparison {
  visits_change: number;
  clicks_change: number;
}

export interface TopSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface DailyStat {
  date: string;
  visits: number;
  clicks: number;
}

export interface AnalyticsOverviewResponse {
  success: boolean;
  error?: string;
  period?: string;
  metrics?: AnalyticsMetrics;
  comparison?: AnalyticsComparison | null;
  top_sources?: TopSource[];
  daily_stats?: DailyStat[];
}

export interface TrackEventRequest {
  event: 'page_view' | 'product_view' | 'whatsapp_click' | 'whatsapp_open';
  vendor_username: string;
  session_id: string;
  product_id?: string;
  metadata?: {
    source?: string;
    duration?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

export class AnalyticsService {
  private static baseUrl = '/api/analytics';

  private static getHeaders(): HeadersInit {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Client-side tracking (public, no auth required)
  static async track(data: TrackEventRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.warn('Analytics track failed:', result.error);
        return { success: false, error: result.error };
      }

      return result;
    } catch (error) {
      console.error('Analytics track error:', error);
      // Don't throw - analytics failures shouldn't break UX
      return { success: false, error: 'Tracking failed' };
    }
  }

  // Dashboard overview (requires auth)
  static async getOverview(params?: {
    period?: '7d' | '30d' | '90d' | 'all';
    compare?: boolean;
  }): Promise<AnalyticsOverviewResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.set('period', params.period);
      if (params?.compare) queryParams.set('compare', 'true');

      const url = `${this.baseUrl}/overview?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors du chargement des analytics',
        };
      }

      return result;
    } catch (error) {
      console.error('Get analytics overview error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  // Helper: Get or create session ID
  static getSessionId(): string {
    const key = 'linkpro_session_id';
    let sessionId = localStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(key, sessionId);
    }
    
    return sessionId;
  }

  // Helper: Detect traffic source from URL
  static detectSource(referrer?: string): string {
    if (!referrer) return 'direct';
    
    const lowerRef = referrer.toLowerCase();
    
    if (lowerRef.includes('tiktok')) return 'tiktok';
    if (lowerRef.includes('instagram')) return 'instagram';
    if (lowerRef.includes('facebook')) return 'facebook';
    if (lowerRef.includes('twitter') || lowerRef.includes('x.com')) return 'twitter';
    if (lowerRef.includes('google')) return 'google';
    if (lowerRef.includes('whatsapp')) return 'whatsapp';
    
    return 'other';
  }

  // Helper: Get UTM parameters from URL
  static getUtmParams(): { source?: string; medium?: string; campaign?: string } {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
    };
  }
}
