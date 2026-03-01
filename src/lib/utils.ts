import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in FCFA with proper spacing
 * @example formatPrice(15000) => "15,000 FCFA"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Format compact number for display
 * @example formatCompactNumber(1234) => "1.2k"
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Generate slug from text
 * @example slugify("Robe d'été") => "robe-d-ete"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Decompose accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

/**
 * Validate Cameroon WhatsApp number
 * Format: +237XXXXXXXXX (9 digits after country code)
 */
export function isValidCameroonPhone(phone: string): boolean {
  const regex = /^\+237[6-9]\d{8}$/;
  return regex.test(phone);
}

/**
 * Format phone number for display
 * @example formatPhone("+237671234567") => "+237 671 234 567"
 */
export function formatPhone(phone: string): string {
  if (!phone.startsWith('+237')) return phone;
  const digits = phone.slice(4); // Remove +237
  return `+237 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/**
 * Generate unique session ID for tracking
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID from localStorage
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  const stored = localStorage.getItem('linkpro_session_id');
  if (stored) return stored;
  
  const newSession = generateSessionId();
  localStorage.setItem('linkpro_session_id', newSession);
  return newSession;
}

/**
 * Detect source from referrer
 */
export function detectSource(referrer: string): string {
  if (!referrer) return 'direct';
  
  const url = referrer.toLowerCase();
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('google.com')) return 'google';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  
  return 'other';
}

/**
 * Detect device type from user agent
 */
export function detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos|windows phone/i.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format relative time
 * @example formatRelativeTime(new Date(Date.now() - 3600000)) => "il y a 1 heure"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'à l\'instant';
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour}h`;
  if (diffDay < 7) return `il y a ${diffDay}j`;
  if (diffDay < 30) return `il y a ${Math.floor(diffDay / 7)} sem`;
  if (diffDay < 365) return `il y a ${Math.floor(diffDay / 30)} mois`;
  return `il y a ${Math.floor(diffDay / 365)} an${Math.floor(diffDay / 365) > 1 ? 's' : ''}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Validate username (lowercase alphanumeric + underscore/dash)
 */
export function isValidUsername(username: string): boolean {
  const regex = /^[a-z0-9_-]{3,50}$/;
  return regex.test(username);
}

/**
 * Generate WhatsApp message URL
 */
export function generateWhatsAppUrl(
  phone: string,
  productName: string,
  price: number
): string {
  const cleanPhone = phone.replace(/\+/g, '');
  const message = `Bonjour ! Je veux commander *${productName}* à ${formatPrice(price)} vu sur LinkPro 🛍️`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Check if plan has reached limits
 */
export function checkPlanLimit(
  current: number,
  limit: number | null
): { reached: boolean; percentage: number } {
  if (limit === null) return { reached: false, percentage: 0 };
  
  const percentage = (current / limit) * 100;
  return {
    reached: current >= limit,
    percentage: Math.min(percentage, 100),
  };
}
