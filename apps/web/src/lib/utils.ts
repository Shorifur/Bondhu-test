import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function formatTimeAgo(date: Date | string, locale: string = 'bn'): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: locale === 'bn' ? 'বছর' : 'y', seconds: 31536000 },
    { label: locale === 'bn' ? 'মাস' : 'mo', seconds: 2592000 },
    { label: locale === 'bn' ? 'সপ্তাহ' : 'w', seconds: 604800 },
    { label: locale === 'bn' ? 'দিন' : 'd', seconds: 86400 },
    { label: locale === 'bn' ? 'ঘণ্টা' : 'h', seconds: 3600 },
    { label: locale === 'bn' ? 'মিনিট' : 'm', seconds: 60 },
    { label: locale === 'bn' ? 'সেকেন্ড' : 's', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return locale === 'bn'
        ? `${count}${interval.label} আগে`
        : `${count}${interval.label} ago`;
    }
  }

  return locale === 'bn' ? 'এখন' : 'just now';
}

export function isBangladeshiPhone(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  // +880 or 880 prefix
  const num = clean.startsWith('880') ? clean.slice(3) : clean;
  // Allow any 10-11 digit number for flexibility (standard BD mobile length)
  return /^\d{10,11}$/.test(num);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function generateShareLink(postId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'https://bondhu.app'}/p/${postId}`;
}
