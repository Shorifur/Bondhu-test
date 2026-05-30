import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Post } from '@bondhu/shared-types';

interface FeedState {
  activeTab: 'foryou' | 'latest' | 'local';
  posts: Record<string, Post[]>;
  page: Record<string, number>;
  hasMore: Record<string, boolean>;
  setActiveTab: (tab: FeedState['activeTab']) => void;
  setPosts: (tab: string, posts: Post[], append?: boolean) => void;
  setPage: (tab: string, page: number) => void;
  setHasMore: (tab: string, hasMore: boolean) => void;
  updatePost: (postId: string, updater: (post: Post) => Post) => void;
}

export const useFeedStore = create<FeedState>()(
  devtools(
    (set) => ({
      activeTab: 'foryou',
      posts: {},
      page: {},
      hasMore: {},

      setActiveTab: (activeTab) => set({ activeTab }),

      setPosts: (tab, posts, append = false) =>
        set((state) => ({
          posts: {
            ...state.posts,
            [tab]: append ? [...(state.posts[tab] || []), ...posts] : posts,
          },
        })),

      setPage: (tab, page) =>
        set((state) => ({ page: { ...state.page, [tab]: page } })),

      setHasMore: (tab, hasMore) =>
        set((state) => ({ hasMore: { ...state.hasMore, [tab]: hasMore } })),

      updatePost: (postId, updater) =>
        set((state) => {
          const newPosts = { ...state.posts };
          for (const tab of Object.keys(newPosts)) {
            newPosts[tab] = newPosts[tab].map((p) => (p.id === postId ? updater(p) : p));
          }
          return { posts: newPosts };
        }),
    }),
    { name: 'bondhu-feed' },
  ),
);
