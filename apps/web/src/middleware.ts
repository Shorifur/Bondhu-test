import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['bn', 'en', 'bng'];
const defaultLocale = 'bn';

function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookie && locales.includes(cookie)) return cookie;

  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const lang = acceptLang.split(',')[0].trim().split('-')[0].toLowerCase();
    if (locales.includes(lang)) return lang;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request);

  const response = NextResponse.next();
  response.headers.set('X-NEXT-INTL-LOCALE', locale);
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
