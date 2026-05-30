import type { NewsItem } from '@/components/feed/NewsCard';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || '';

/**
 * Fetch Bangladesh news
 * Uses NewsAPI.org free tier (100 requests/day)
 * Falls back to mock data if no API key
 */
export async function fetchBangladeshNews(limit: number = 5): Promise<NewsItem[]> {
  // If no API key, return mock data
  if (!NEWS_API_KEY) {
    return getMockNews();
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=Bangladesh&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      return getMockNews();
    }

    return data.articles.map((a: any, i: number): NewsItem => ({
      id: `news-${i}-${Date.now()}`,
      title: a.title || 'Untitled',
      description: a.description || '',
      imageUrl: a.urlToImage,
      source: a.source?.name || 'News',
      publishedAt: a.publishedAt || new Date().toISOString(),
      url: a.url || '#',
    }));
  } catch {
    return getMockNews();
  }
}

function getMockNews(): NewsItem[] {
  return [
    {
      id: 'news-1',
      title: 'বাংলাদেশে নতুন ডিজিটাল পেমেন্ট সিস্টেম চালু',
      description: 'Central bank launches new digital payment infrastructure for rural areas...',
      imageUrl: '',
      source: 'Prothom Alo',
      publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      url: '#',
    },
    {
      id: 'news-2',
      title: 'ঢাকায় মেট্রোরেল নতুন রুট উদ্বোধন',
      description: 'New metro rail route opened connecting Uttara to Motijheel...',
      imageUrl: '',
      source: 'Daily Star',
      publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      url: '#',
    },
    {
      id: 'news-3',
      title: 'বাংলাদেশ ক্রিকেট দল ভারত সফরে',
      description: 'Bangladesh cricket team arrives in India for ODI series...',
      imageUrl: '',
      source: 'BD News',
      publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      url: '#',
    },
    {
      id: 'news-4',
      title: 'পদ্মা সেতুতে রেকর্ড টোল আয়',
      description: 'Padma Bridge toll collection reaches all-time high this month...',
      imageUrl: '',
      source: 'Bangla Tribune',
      publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      url: '#',
    },
    {
      id: 'news-5',
      title: 'সিলেটে নতুন আইটি পার্ক উদ্বোধন',
      description: 'New IT park inaugurated in Sylhet to boost tech industry...',
      imageUrl: '',
      source: 'The Financial Express',
      publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      url: '#',
    },
  ];
}
