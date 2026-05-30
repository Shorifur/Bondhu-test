import { getRequestConfig } from 'next-intl/server';

export const locales = ['bn', 'en', 'bng'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'bn';

export default getRequestConfig(async ({ locale }) => {
  const messages = (await import(`./locales/${locale}.json`)).default;
  return { messages, timeZone: 'Asia/Dhaka' };
});
