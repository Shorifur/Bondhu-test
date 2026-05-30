'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { useFeedStore } from '@/stores/feedStore';
import { PostCard } from '@/components/feed/PostCard';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { StoryBar } from '@/components/feed/StoryBar';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import type { Post } from '@bondhu/shared-types';

const tabs = [
  { id: 'foryou' as const, label: 'For You', labelBn: 'আপনার জন্য' },
  { id: 'latest' as const, label: 'Latest', labelBn: 'সর্বশেষ' },
  { id: 'local' as const, label: 'Local', labelBn: 'স্থানীয়' },
];

export default function HomePage() {
  const router = useRouter();
  const { activeTab, setActiveTab, posts, setPosts, page, setPage, hasMore, setHasMore } = useFeedStore();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ['feed', activeTab],
    queryFn: async () => {
      let res;
      switch (activeTab) {
        case 'foryou':
          res = await postService.getForYouFeed(1, 20);
          break;
        case 'latest':
          res = await postService.getLatestFeed(1, 20);
          break;
        case 'local':
          res = await postService.getLocalFeed(1, 20);
          break;
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
        case 'foryou':
          res = await postService.getForYouFeed(nextPage, 20);
          break;
        case 'latest':
          res = await postService.getLatestFeed(nextPage, 20);
          break;
        case 'local':
          res = await postService.getLocalFeed(nextPage, 20);
          break;
      }
      if (res?.data) {
        setPosts(activeTab, res.data.data, true);
        setHasMore(activeTab, res.data.meta.hasMore);
        setPage(activeTab, nextPage);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const lastElementRef = useInfiniteScroll(loadMore, hasMore[activeTab] ?? true, isLoadingMore);
  const currentPosts = posts[activeTab] || [];

  return (
    <div className="space-y-4 py-4">
      <StoryBar />
      <FeedTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as typeof activeTab)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-bondhu-green" />
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-bangla text-lg">কোনো পোস্ট পাওয়া যায়নি</p>
              {activeTab === 'local' ? (
                <>
                  <p className="mt-1">No local posts. Set your district in settings to see nearby content.</p>
                  <button
                    onClick={() => router.push('/settings')}
                    className="mt-3 px-4 py-2 bg-bondhu-green text-white text-sm font-medium rounded-xl hover:bg-bondhu-green-dark transition-colors"
                  >
                    Go to Settings
                  </button>
                </>
              ) : (
                <p>No posts found. Follow people to see content here.</p>
              )}
            </div>
          ) : (
            <>
              {currentPosts.map((post, index) => (
                <div
                  key={post.id}
                  ref={index === currentPosts.length - 1 ? lastElementRef : undefined}
                >
                  <PostCard post={post} />
                </div>
              ))}
              {isLoadingMore && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-bondhu-green" />
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
