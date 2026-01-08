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
