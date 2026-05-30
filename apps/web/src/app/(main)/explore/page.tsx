'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, Search, Hash, X, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { cn, debounce } from '@/lib/utils';
import { PostCard } from '@/components/feed/PostCard';

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get('q') || '';
  const urlType = searchParams.get('type') || '';

  const [activeTab, setActiveTab] = useState<'trends' | 'people' | 'communities' | 'posts' | 'hashtags'>(
    urlType === 'hashtags' ? 'hashtags' : urlType === 'communities' ? 'communities' : urlType === 'posts' ? 'posts' : 'trends'
  );
  const [query, setQuery] = useState(urlQ);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bondhu_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 10);
      localStorage.setItem('bondhu_recent_searches', JSON.stringify(next));
      return next;
    });
  }, []);

  const debouncedSearch = useCallback(
    debounce((q: unknown) => {
      const queryStr = String(q);
      setSearchQuery(queryStr);
      if (queryStr.trim()) saveSearch(queryStr);
    }, 300),
    [saveSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const { data: trends } = useQuery<any[]>({
    queryKey: ['trends'],
    queryFn: async () => {
      const res = await api.get('search/trends');
      return (res as any).data?.data || [];
    },
  });

  const { data: searchResults } = useQuery<{ data: any[] } | null>({
    queryKey: ['search', searchQuery, activeTab],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      let type = activeTab === 'trends' ? 'hashtags' : activeTab;
      const res = await api.get(`search?q=${encodeURIComponent(searchQuery)}&type=${type}&limit=50`);
      return (res as any).data || { data: [] };
    },
    enabled: !!searchQuery.trim(),
  });

  const tabs = [
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'people' as const, label: 'People', icon: Users },
    { id: 'posts' as const, label: 'Posts', icon: Search },
    { id: 'communities' as const, label: 'Communities', icon: Building2 },
    { id: 'hashtags' as const, label: 'Hashtags', icon: Hash },
  ];

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-bold px-1">Explore</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {!query && recentSearches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Searches</p>
            <button onClick={() => { setRecentSearches([]); localStorage.removeItem('bondhu_recent_searches'); }} className="text-xs text-destructive">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button key={s} onClick={() => setQuery(s)} className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-muted/80">
                <Clock className="w-3 h-3" /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 px-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.id ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'trends' && !query && (
        <div className="space-y-2">
          {trends?.map((trend: any, i: number) => (
            <motion.button
              key={trend.hashtag.tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/hashtag/${trend.hashtag.tag}`)}
              className="w-full flex items-center justify-between p-4 bg-card border rounded-2xl hover:bg-muted/50 transition-colors text-left"
            >
              <div>
                <p className="font-bold text-lg">#{trend.hashtag.tag}</p>
                <p className="text-sm text-muted-foreground">{trend.postVolume24h} posts in 24h</p>
              </div>
              <span className="text-2xl font-bold text-bondhu-green">{i + 1}</span>
            </motion.button>
          ))}
        </div>
      )}

      {activeTab === 'people' && (
        <div className="space-y-2">
          {searchResults?.data?.map((user: any, i: number) => (
            <motion.button
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/profile/${user.handle}`)}
              className="w-full flex items-center gap-3 p-4 bg-card border rounded-2xl hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                {user.displayName?.[0]}
              </div>
              <div>
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-sm text-muted-foreground">@{user.handle}</p>
              </div>
            </motion.button>
          ))}
          {!searchResults?.data?.length && query && <p className="text-center text-muted-foreground py-8">No users found</p>}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {searchResults?.data?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
          {!searchResults?.data?.length && query && <p className="text-center text-muted-foreground py-8">No posts found</p>}
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="space-y-2">
          {searchResults?.data?.map((community: any, i: number) => (
            <motion.button
              key={community.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/communities/${community.slug}`)}
              className="w-full flex items-center gap-3 p-4 bg-card border rounded-2xl hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold">
                {community.name?.[0]}
              </div>
              <div>
                <p className="font-semibold">{community.name}</p>
                <p className="text-sm text-muted-foreground">{community.memberCount} members</p>
              </div>
            </motion.button>
          ))}
          {!searchResults?.data?.length && query && <p className="text-center text-muted-foreground py-8">No communities found</p>}
        </div>
      )}

      {activeTab === 'hashtags' && (
        <div className="space-y-2">
          {searchResults?.data?.map((hashtag: any, i: number) => (
            <motion.button
              key={hashtag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/hashtag/${hashtag.tag}`)}
              className="w-full flex items-center justify-between p-4 bg-card border rounded-2xl hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-bondhu-green" />
                <div>
                  <p className="font-semibold">#{hashtag.tag}</p>
                  <p className="text-sm text-muted-foreground">{hashtag.postCount} posts</p>
                </div>
              </div>
            </motion.button>
          ))}
          {!searchResults?.data?.length && query && <p className="text-center text-muted-foreground py-8">No hashtags found</p>}
        </div>
      )}
    </div>
  );
}
