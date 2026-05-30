'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, Search, Plus } from 'lucide-react';
import { api } from '@/lib/api';

export default function ShopsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data } = useQuery<{ data: any[] }>({
    queryKey: ['shops'],
    queryFn: async () => {
      const res = await api.get('shops?limit=50');
      return (res as any).data || { data: [] };
    },
  });

  const shops = data?.data?.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Shops</h1>
        </div>
        <button onClick={() => router.push('/shop/create')} className="p-2 bg-bondhu-green text-white rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops..."
          className="w-full pl-9 pr-4 py-2 bg-muted rounded-xl text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shops.map((shop: any) => (
          <motion.button
            key={shop.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => router.push(`/shop/${shop.handle}`)}
            className="bg-card border rounded-2xl p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-muted mb-3 overflow-hidden">
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-6 h-6 m-3 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-semibold text-sm truncate">{shop.name}</h3>
            <p className="text-xs text-muted-foreground">{shop.category}</p>
            <p className="text-xs text-muted-foreground mt-1">{shop.followerCount} followers</p>
          </motion.button>
        ))}
      </div>

      {shops.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No shops yet</p>
        </div>
      )}
    </div>
  );
}
