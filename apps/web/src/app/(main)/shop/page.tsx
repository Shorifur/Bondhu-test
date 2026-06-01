'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Package, ClipboardList, Store, MessageCircle, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { ShopIcon, SearchIcon, MapPinIcon } from '@/components/ui/CulturalIcons';

const CATEGORIES = ['সব', 'খাদ্য', 'পোশাক', 'ইলেকট্রনিক্স', 'হস্তশিল্প', 'কৃষি', 'বই', 'সেবা'];
const CATEGORIES_EN = ['All', 'Food', 'Clothing', 'Electronics', 'Handicrafts', 'Agriculture', 'Books', 'Services'];
const CONDITIONS = ['সব', 'নতুন', 'ব্যবহৃত'];

/* ── Product Card ── */
function ProductCard({ product, onToggleWishlist, isWishlisted }: { product: any; onToggleWishlist?: () => void; isWishlisted?: boolean }) {
  const router = useRouter();
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer relative"
      style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}
      onClick={() => router.push(`/shop/product/${product.id}`)}
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-[#F0EEF8] to-[#E8E4F5] relative">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-[#D4CCE8]" />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{discount}% ছাড়</span>
        )}
        {product.isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white/90 text-[#0F0A1E] text-xs font-extrabold px-3 py-1 rounded-full font-bangla">বিক্রি হয়ে গেছে</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-[#C4B5E0]'}`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1">
        <p className="text-[11px] font-medium text-[#1a1a2e] leading-tight line-clamp-2 font-bangla">{product.title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold font-bangla" style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ৳{Number(product.price).toLocaleString('bn-BD')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-[#9B8FC0] line-through">৳{Number(product.originalPrice).toLocaleString('bn-BD')}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#7C3AED] font-medium font-bangla">{product.shop?.name || 'দোকান'}</span>
          {product.shop?.isVerified && <span className="text-blue-500 text-[10px]">✓</span>}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#9B8FC0]">
          <MapPinIcon size={10} />
          <span className="font-bangla">{product.shop?.district?.nameBn || ''}</span>
          <span>·</span>
          <span className={product.condition === 'NEW' ? 'text-green-600' : 'text-amber-600'}>{product.condition === 'NEW' ? 'নতুন' : 'ব্যবহৃত'}</span>
        </div>
        {/* Contact Button */}
        <button
          onClick={(e) => { e.stopPropagation(); /* TODO: open chat */ }}
          className="w-full py-1.5 mt-1 text-[10px] font-bold text-white rounded-lg bondhu-gradient font-bangla"
        >
          যোগাযোগ করুন
        </button>
      </div>
    </motion.div>
  );
}

/* ── Skeleton Loader ── */
function ShopSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 bg-[#F5F2FF] rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#F5F2FF] rounded-2xl aspect-[3/4]" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'myshop' | 'orders' | 'wishlist'>('all');
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all' as const, label: 'সব পণ্য', icon: ShoppingBag },
    { id: 'myshop' as const, label: 'আমার দোকান', icon: Store },
    { id: 'orders' as const, label: 'অর্ডার', icon: ClipboardList },
    { id: 'wishlist' as const, label: 'ইচ্ছেতালিকা', icon: Heart },
  ];

  // Fetch real products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['shop-products', selectedCategory, searchQuery],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'সব') params.set('category', selectedCategory);
        if (searchQuery) params.set('q', searchQuery);
        const res = await api.get(`marketplace/products?${params}`, { silent: true });
        return (res as unknown as { data: { data: unknown[] } })?.data?.data || [];
      } catch { return []; }
    },
  });

  // Check if user already has a shop
  const { data: myShop } = useQuery({
    queryKey: ['my-shop'],
    queryFn: async () => {
      try { const res = await api.get('shops/mine', { silent: true }); return (res as unknown as { data: { data: unknown } })?.data?.data || null; }
      catch { return null; }
    },
    enabled: !!user?.id,
  });

  // Orders
  const { data: ordersData } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      try { const res = await api.get('orders/mine', { silent: true }); return (res as unknown as { data: { data: unknown[] } })?.data?.data || []; }
      catch { return []; }
    },
    enabled: activeTab === 'orders' && !!user?.id,
  });

  // Wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      try { const res = await api.get('marketplace/wishlist', { silent: true }); return (res as unknown as { data: { data: unknown[] } })?.data?.data || []; }
      catch { return []; }
    },
    enabled: activeTab === 'wishlist' && !!user?.id,
  });

  // Toggle wishlist
  const toggleWishlist = useMutation({
    mutationFn: async (productId: string) => {
      await api.post('marketplace/wishlist/toggle', { productId }, { silent: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const products = productsData || [];
  const orders = ordersData || [];
  const wishlist = wishlistData || [];
  const isLoading = activeTab === 'all' && productsLoading;

  // Filter products client-side for now
  const filteredProducts = products.filter((p: any) => {
    if (selectedCategory !== 'সব') {
      const idx = CATEGORIES.indexOf(selectedCategory);
      const enCat = idx >= 0 ? CATEGORIES_EN[idx] : selectedCategory;
      if (!p.category?.toLowerCase().includes(enCat.toLowerCase())) return false;
    }
    if (searchQuery && !p.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <ShopIcon size={24} className="text-[#7C3AED]" />
          <div>
            <h1 className="font-bold text-[15px] font-bangla leading-tight" style={{ color: '#5B8C7F' }}>দোকান</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Shop</p>
          </div>
          <div className="flex-1" />
          {/* Show different button based on whether user has a shop */}
          {myShop ? (
            <button onClick={() => router.push(`/shop/${myShop.handle}/manage`)}
              className="px-3 py-1.5 rounded-full text-white text-xs font-medium bondhu-gradient shadow-sm">
              ⚙️ পরিচালনা
            </button>
          ) : (
            <button onClick={() => router.push('/shop/create-shop')}
              className="px-3 py-1.5 rounded-full text-white text-xs font-medium bondhu-gradient shadow-sm font-bangla">
              + দোকান তৈরি
            </button>
          )}
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-[#F5F3FF] rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#9B8FC0] shrink-0" />
            <input type="text" placeholder="পণ্য খুঁজুন..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#1a1a2e] placeholder:text-[#B8A9D9] outline-none w-full font-bangla" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-2 pb-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap',
                activeTab === tab.id ? 'bondhu-gradient text-white' : 'bg-[#F5F2FF] text-[#6B5E8A] border border-[#DDD6F3]')}>
              <tab.icon className="w-3 h-3" />
              <span className="font-bangla">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ═══════ ALL PRODUCTS TAB ═══════ */}
      {activeTab === 'all' && (
        <>
          {/* Category filter chips */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap font-bangla',
                  selectedCategory === c ? 'bg-[#5B21B6] text-white' : 'bg-white text-[#6B5E8A] border border-[#DDD6F3]')}>
                {c}
              </button>
            ))}
          </div>

          {isLoading ? <ShopSkeleton /> : (
            <div className="grid grid-cols-2 gap-3 px-3 pt-1">
              {filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product}
                  isWishlisted={wishlist.some((w: any) => w.productId === product.id)}
                  onToggleWishlist={() => toggleWishlist.mutate(product.id)} />
              )) : (
                <div className="col-span-2 text-center py-16">
                  <span className="text-5xl">📦</span>
                  <p className="text-sm text-[#6B5E8A] font-bangla mt-4">কোনো পণ্য পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ═══════ MY SHOP TAB ═══════ */}
      {activeTab === 'myshop' && (
        <div className="px-4 py-4">
          {myShop ? (
            <div className="space-y-4">
              {/* Shop header card */}
              <div className="glass-card p-4">
                <div className="relative h-24 rounded-xl overflow-hidden mb-3" style={{ background: 'linear-gradient(135deg, #7C3AED, #0D9488)' }}>
                  {myShop.coverUrl && <img src={myShop.coverUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#F5F2FF] border-2 border-white shadow overflow-hidden flex items-center justify-center -mt-8 relative z-10">
                    {myShop.logoUrl ? <img src={myShop.logoUrl} className="w-full h-full object-cover" /> : <ShopIcon size={24} className="text-[#7C3AED]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-[#0F0A1E] font-bangla truncate">{myShop.name}</h3>
                    <p className="text-xs text-[#6B5E8A]">@{myShop.handle} · <span className="font-bangla">{myShop.category}</span></p>
                  </div>
                  <button onClick={() => router.push(`/shop/${myShop.handle}/manage`)}
                    className="px-3 py-1.5 bg-[#F5F2FF] border border-[#DDD6F3] rounded-xl text-xs font-bold text-[#5B21B6] font-bangla">
                    পরিচালনা
                  </button>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#DDD6F3]/50">
                  {[
                    { label: 'পণ্য', value: myShop.products?.length || 0 },
                    { label: 'ফলোয়ার', value: myShop.followerCount || 0 },
                    { label: 'বিক্রয়', value: myShop._count?.orders || 0 },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-extrabold text-base text-[#0F0A1E]">{stat.value}</p>
                      <p className="text-[10px] text-[#9B8FC0] font-bangla">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add product button */}
              <button onClick={() => router.push(`/shop/${myShop.handle}/manage`)}
                className="w-full py-3 border-2 border-dashed border-[#DDD6F3] rounded-2xl text-sm text-[#5B21B6] font-bold hover:bg-[#F5F2FF] transition-colors font-bangla">
                + নতুন পণ্য যোগ করুন
              </button>

              {/* My products grid */}
              {myShop.products?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {myShop.products.map((product: any) => (
                    <ProductCard key={product.id} product={{ ...product, shop: myShop }} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-[#9B8FC0] font-bangla">এখনো কোনো পণ্য যোগ করা হয়নি</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="font-extrabold text-[#0F0A1E] text-base font-bangla mb-2">আপনার এখনো কোনো দোকান নেই</h3>
              <p className="text-sm text-[#6B5E8A] font-bangla mb-6 leading-relaxed">আপনার পণ্য বিক্রি করতে প্রথমে একটি দোকান তৈরি করুন। সম্পূর্ণ বিনামূল্যে!</p>
              <button onClick={() => router.push('/shop/create-shop')}
                className="px-6 py-3 text-white text-sm font-bold rounded-2xl bondhu-gradient shadow-md font-bangla">
                🏪 দোকান তৈরি করুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════ ORDERS TAB ═══════ */}
      {activeTab === 'orders' && (
        <div className="px-4 py-4 space-y-3">
          {orders.length > 0 ? orders.map((order: any) => (
            <div key={order.id} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#F5F2FF] overflow-hidden flex items-center justify-center">
                  {order.product?.images?.[0] ? <img src={order.product.images[0]} className="w-full h-full object-cover" /> : <span className="text-2xl">📦</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#0F0A1E] font-bangla line-clamp-1">{order.product?.title}</p>
                  <p className="text-xs text-[#6B5E8A] font-bangla">{order.shop?.name}</p>
                  <p className="text-sm font-extrabondhu text-[#5B21B6] font-bangla">৳ {Number(order.totalAmount).toLocaleString('bn-BD')}</p>
                </div>
                <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full font-bangla shrink-0',
                  order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                  {order.status === 'PENDING' ? 'অপেক্ষমান' : order.status === 'CONFIRMED' ? 'নিশ্চিত' : order.status === 'DELIVERED' ? 'পৌঁছে গেছে' : 'বাতিল'}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-16">
              <span className="text-5xl">📦</span>
              <p className="text-sm text-[#6B5E8A] font-bangla mt-4">কোনো অর্ডার নেই</p>
              <button onClick={() => setActiveTab('all')} className="mt-4 px-5 py-2.5 text-white text-sm font-bold rounded-2xl bondhu-gradient shadow-md font-bangla">
                কেনাকাটা শুরু করুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════ WISHLIST TAB ═══════ */}
      {activeTab === 'wishlist' && (
        <div className="px-3 pt-2">
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {wishlist.map((item: any) => (
                <ProductCard key={item.id} product={item.product || item} isWishlisted={true}
                  onToggleWishlist={() => toggleWishlist.mutate(item.productId || item.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl">🤍</span>
              <p className="text-sm text-[#6B5E8A] font-bangla mt-4">সংরক্ষিত পণ্য নেই</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
