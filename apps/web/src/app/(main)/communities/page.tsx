'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, MapPin, Plus, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import type { Community } from '@bondhu/shared-types';
import { ErrorState } from '@/components/ui/ErrorState';

const categories = [
  'ALL',
  'Education',
  'Business',
  'Sports',
  'Entertainment',
  'Technology',
  'Religion',
  'Health',
  'Food',
  'Travel',
  'Gaming',
  'Art',
  'Music',
  'Other',
];

export default function CommunitiesPage() {
  const router = useRouter();
  const { openSheet } = useUIStore();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const { data: communities, isLoading, isError, refetch } = useQuery({
    queryKey: ['communities', activeCategory],
    queryFn: async () => {
      const params = activeCategory !== 'ALL' ? `?category=${activeCategory}` : '';
      const res = await api.get<{ data: Community[] }>(`communities${params}`);
      return res.data?.data || [];
    },
  });

  const filtered = communities?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Communities</h1>
        <button
          onClick={() => openSheet('createCommunity')}
          className="p-2 bg-bondhu-green text-white rounded-xl"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities..."
          className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors',
              activeCategory === cat ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
            )}
          >
            {cat === 'ALL' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-[#F5F2FF] rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && <ErrorState onRetry={refetch} />}

      {/* List */}
      {!isLoading && !isError && <div className="space-y-3">
        {filtered.map((community, i) => (
          <motion.button
            key={community.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => router.push(`/communities/${community.slug}`)}
            className="w-full flex items-start gap-3 p-4 bg-card border rounded-2xl hover:bg-muted/50 transition-colors text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-bondhu-green/10 flex items-center justify-center shrink-0 overflow-hidden">
              {community.avatarUrl ? (
                <img src={community.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-7 h-7 text-bondhu-green" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{community.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{community.description}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {community.memberCount} members
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {community.category}
                </span>
              </div>
            </div>
          </motion.button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No communities found</p>
          </div>
        )}
      </div>
    </div>
  );
}
