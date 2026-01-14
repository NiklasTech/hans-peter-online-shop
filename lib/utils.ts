import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Static cache buster value - generated once when module loads on client
const CACHE_BUSTER = typeof window !== 'undefined' ? Date.now() : '';

export function addCacheBuster(url: string): string {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Use static cache buster to avoid hydration mismatch
  if (!CACHE_BUSTER) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${CACHE_BUSTER}`;
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'gerade eben';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `vor ${diffInMinutes} Min.`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `vor ${diffInHours} Std.`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `vor ${diffInWeeks} Woche${diffInWeeks > 1 ? 'n' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `vor ${diffInMonths} Monat${diffInMonths > 1 ? 'en' : ''}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `vor ${diffInYears} Jahr${diffInYears > 1 ? 'en' : ''}`;
}
