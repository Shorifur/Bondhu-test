import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bondhu.app', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://bondhu.app/explore', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://bondhu.app/shop', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://bondhu.app/jobs', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://bondhu.app/bazaar', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://bondhu.app/leaderboard', lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: 'https://bondhu.app/points', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: 'https://bondhu.app/adda', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://bondhu.app/communities', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://bondhu.app/sports', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.6 },
    { url: 'https://bondhu.app/sos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];
}
