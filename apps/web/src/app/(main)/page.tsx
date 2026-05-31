'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { useFeedStore } from '@/stores/feedStore';
import { PostCard } from '@/components/feed/PostCard';
import { StoryBar } from '@/components/feed/StoryBar';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Post } from '@bondhu/shared-types';
import type { NewsItem } from '@/components/feed/NewsCard';
import { fetchBangladeshNews } from '@/lib/api/news';
import NewsCard from '@/components/feed/NewsCard';
import { BondhuLogo, SearchIcon, SettingsIcon } from '@/components/ui/CulturalIcons';

const filterChips = [
  { id: 'foryou' as const, label: 'For You', labelBn: 'আপনার জন্য' },
  { id: 'latest' as const, label: 'Latest', labelBn: 'সর্বশেষ' },
  { id: 'local' as const, label: 'Local', labelBn: 'স্থানীয়' },
  { id: 'friends' as const, label: 'Friends', labelBn: 'বন্ধু' },
  { id: 'trending' as const, label: 'Trending', labelBn: 'ট্রেন্ডিং' },
  { id: 'nearby' as const, label: 'Nearby', labelBn: 'কাছাকাছি' },
];

export default function HomePage() {
  const router = useRouter();
  const { activeTab, setActiveTab, posts, setPosts, page, setPage, hasMore, setHasMore } = useFeedStore();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const { data: newsData } = useQuery({
    queryKey: ['bangladesh-news'],
    queryFn: () => fetchBangladeshNews(8),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => { if (newsData) setNewsItems(newsData); }, [newsData]);

  const { isLoading } = useQuery({
    queryKey: ['feed', activeTab],
    queryFn: async () => {
      let res;
      switch (activeTab) {
        case 'foryou': res = await postService.getForYouFeed(1, 20); break;
        case 'latest': res = await postService.getLatestFeed(1, 20); break;
        case 'local': res = await postService.getLocalFeed(1, 20); break;
        default: res = await postService.getForYouFeed(1, 20); break;
      }
      if (res?.data) {
        setPosts(activeTab, res.data.data);
        setHasMore(activeTab, res.data.meta.hasMore);
        setPage(activeTab, 1);
      }
      return res?.data;
    },
  });

  const loadMore = async () => {
    if (isLoadingMore || !hasMore[activeTab]) return;
    setIsLoadingMore(true);
    const nextPage = (page[activeTab] || 1) + 1;
    try {
      let res;
      switch (activeTab) {
        case 'foryou': res = await postService.getForYouFeed(nextPage, 20); break;
        case 'latest': res = await postService.getLatestFeed(nextPage, 20); break;
        case 'local': res = await postService.getLocalFeed(nextPage, 20); break;
        default: res = await postService.getForYouFeed(nextPage, 20); break;
      }
      if (res?.data) {
        setPosts(activeTab, res.data.data, true);
        setHasMore(activeTab, res.data.meta.hasMore);
        setPage(activeTab, nextPage);
      }
    } finally { setIsLoadingMore(false); }
  };

  const lastElementRef = useInfiniteScroll(loadMore, hasMore[activeTab] ?? true, isLoadingMore);
  const currentPosts = posts[activeTab] || [];

  // Mix news into feed every 4th post
  const mixedFeed = (() => {
    const items: Array<{ type: 'post'; data: Post } | { type: 'news'; data: NewsItem }> = [];
    let newsIndex = 0;
    currentPosts.forEach((post, i) => {
      items.push({ type: 'post', data: post });
      if ((i + 1) % 4 === 0 && newsIndex < newsItems.length) {
        items.push({ type: 'news', data: newsItems[newsIndex] });
        newsIndex++;
      }
    });
    return items;
  })();

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        {/* Row 1: Logo + Actions */}
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-2.5">
            <BondhuLogo size={30} />
            <span className="font-bold text-[16px] text-[#2D1B69] tracking-tight">Bondhu</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/explore')}
              className="w-9 h-9 rounded-full bg-[#F5F3FF] flex items-center justify-center hover:bg-[#EDE9FE] transition-colors">
              <SearchIcon size={17} className="text-[#7C3AED]" />
            </button>
            <button onClick={() => router.push('/settings')}
              className="w-9 h-9 rounded-full bg-[#F5F3FF] flex items-center justify-center hover:bg-[#EDE9FE] transition-colors">
              <SettingsIcon size={17} className="text-[#7C3AED]" />
            </button>
          </div>
        </div>

        {/* Row 2: Stories */}
        <div className="px-4 py-2.5">
          <StoryBar />
        </div>

        {/* Row 3: Filter Chips */}
        <div className="px-4 pb-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveTab(chip.id)}
              className={activeTab === chip.id
                ? 'gradient-chip-active whitespace-nowrap'
                : 'gradient-chip-inactive whitespace-nowrap'
              }
            >
              {chip.label}
            </button>
          ))}
        </div>
      </header>

      {/* Feed */}
      <main className="pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="space-y-3 px-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#F0EEF8]" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-[#F0EEF8] rounded w-24" />
                        <div className="h-2 bg-[#F0EEF8] rounded w-16" />
                      </div>
                    </div>
                    <div className="h-3 bg-[#F0EEF8] rounded w-full mb-2" />
                    <div className="h-3 bg-[#F0EEF8] rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : currentPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-bangla text-lg text-[#9B8FC0]">কোনো পোস্ট পাওয়া যায়নি</p>
                <p className="text-sm text-[#9B8FC0] mt-1">Follow people to see content here</p>
              </div>
            ) : (
              <>
                {mixedFeed.map((item, index) => {
                  if (item.type === 'news') {
                    return <NewsCard key={`news-${item.data.id}`} news={item.data} index={index} />;
                  }
                  return (
                    <div key={item.data.id} ref={index === mixedFeed.length - 1 ? lastElementRef : undefined}>
                      <PostCard post={item.data} />
                    </div>
                  );
                })}
                {isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[#E8E4F5] border-t-[#A78BFA] rounded-full animate-spin" />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
