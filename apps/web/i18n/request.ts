import { getRequestConfig } from 'next-intl/server';

export const locales = ['bn', 'en', 'bng'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'bn';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale;
  return { locale, messages: {}, timeZone: 'Asia/Dhaka' };
});
