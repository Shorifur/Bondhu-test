// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag, MapPin, Tag, Plus, Loader2 } from 'lucide-react';
import { marketplaceService } from '@/services/marketplace.service';
import { useUIStore } from '@/stores/uiStore';
import { cn, formatNumber } from '@/lib/utils';
import type { MarketplaceItem } from '@bondhu/shared-types';

export default function MarketplacePage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: items, isLoading } = useQuery({
    queryKey: ['marketplace', verifiedOnly, maxPrice],
    queryFn: async () => {
      const res = await marketplaceService.browse({ verifiedOnly, maxPrice, limit: 50 });
      return res.data?.data || [];
    },
  });

  const filtered = items?.filter((item) =>
    searchQuery ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
  );

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-bondhu-green" />
          Marketplace
        </h1>
        <button
          onClick={() => addToast('Create listing coming soon', 'info')}
          className="p-2 bg-bondhu-green text-white rounded-xl hover:bg-bondhu-green-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              verifiedOnly ? 'bg-bondhu-green/10 border-bondhu-green text-bondhu-green' : 'bg-card border-border',
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Verified Only
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground text-xs">Max: ৳{formatNumber(maxPrice)}</span>
            <input
              type="range"
              min={0}
              max={500000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 accent-bondhu-green"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-2xl overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered?.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => router.push(`/marketplace/${item.id}`)}
              className="bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-shadow text-left"
            >
              <div className="aspect-square bg-muted relative">
                {item.mediaAssets?.[0] ? (
                  <img src={item.mediaAssets[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
                {item.isVerifiedSeller && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-bondhu-green text-white text-[10px] font-bold rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="font-semibold text-sm line-clamp-1">{item.title}</p>
                <p className="text-bondhu-green font-bold text-sm">৳{formatNumber(Number(item.price))}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{item.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.condition}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {filtered?.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No items found</p>
        </div>
      )}
    </div>
  );
}
