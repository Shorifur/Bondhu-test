'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SearchIcon, ShopIcon, MapPinIcon } from '@/components/ui/CulturalIcons';

const categories = ['All', 'Food', 'Clothing', 'Electronics', 'Handicrafts', 'Agriculture', 'Books', 'Services'];
const conditions = ['All', 'New', 'Used'];
const sortOptions = ['Newest', 'Price: Low-High', 'Price: High-Low', 'Popular'];

const MOCK_PRODUCTS = [
  { id: '1', name: 'হস্তশিল্প কুশন কভার', nameEn: 'Handcrafted Cushion Cover', price: 450, originalPrice: 600, image: '', shop: 'Rina Crafts', verified: true, district: 'Dhaka', condition: 'New', time: '2h ago', saves: 12 },
  { id: '2', name: 'সিল্ক শাড়ি', nameEn: 'Pure Silk Saree', price: 3500, originalPrice: 5000, image: '', shop: 'Bangla Saree House', verified: true, district: 'Rajshahi', condition: 'New', time: '5h ago', saves: 34 },
  { id: '3', name: 'বাঁশের ঝুড়ি সেট', nameEn: 'Bamboo Basket Set', price: 280, originalPrice: 350, image: '', shop: 'Village Crafts', verified: false, district: 'Barishal', condition: 'New', time: '1d ago', saves: 8 },
  { id: '4', name: 'iPhone 14 Pro', nameEn: 'iPhone 14 Pro 256GB', price: 85000, originalPrice: 120000, image: '', shop: 'TechBD', verified: true, district: 'Dhaka', condition: 'Used', time: '3h ago', saves: 56 },
  { id: '5', name: 'খাঁটি মধু ১ কেজি', nameEn: 'Pure Honey 1kg', price: 650, originalPrice: 800, image: '', shop: 'Sundarbans Honey', verified: false, district: 'Khulna', condition: 'New', time: '6h ago', saves: 23 },
  { id: '6', name: 'জামদানি শাড়ি', nameEn: 'Jamdanee Saree', price: 12000, originalPrice: 15000, image: '', shop: 'Dhakaiya Fashion', verified: true, district: 'Dhaka', condition: 'New', time: '12h ago', saves: 89 },
];

export default function ShopPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'myshop' | 'orders' | 'wishlist'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all' as const, label: 'All Products', labelBn: 'সব পণ্য' },
    { id: 'myshop' as const, label: 'My Shop', labelBn: 'আমার দোকান' },
    { id: 'orders' as const, label: 'Orders', labelBn: 'অর্ডার' },
    { id: 'wishlist' as const, label: 'Wishlist', labelBn: 'ইচ্ছেতালিকা' },
  ];

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
          <button
            onClick={() => router.push('/shop/create-shop')}
            className="px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
          >
            + দোকান তৈরি
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-[#F5F3FF] rounded-xl px-3 py-2">
            <SearchIcon size={16} className="text-[#9B8FC0] shrink-0" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#1a1a2e] placeholder:text-[#B8A9D9] outline-none w-full font-bangla"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'gradient-chip-active whitespace-nowrap' : 'gradient-chip-inactive whitespace-nowrap'}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button onClick={() => setShowFilters(!showFilters)} className="gradient-chip-inactive">☰ Filters</button>
        {selectedCategory !== 'All' && (
          <span className="gradient-chip-active text-xs">{selectedCategory} ✕</span>
        )}
        {selectedCondition !== 'All' && (
          <span className="gradient-chip-active text-xs">{selectedCondition} ✕</span>
        )}
      </div>

      {showFilters && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-3 space-y-2">
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={selectedCategory === c ? 'gradient-chip-active text-xs' : 'gradient-chip-inactive text-xs'}>{c}</button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {conditions.map((c) => (
              <button key={c} onClick={() => setSelectedCondition(c)}
                className={selectedCondition === c ? 'gradient-chip-active text-xs' : 'gradient-chip-inactive text-xs'}>{c}</button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 px-3 pt-2">
        {MOCK_PRODUCTS.map((product, i) => {
          const discount = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
              style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-[#F0EEF8] to-[#E8E4F5] relative">
                {product.image ? (
                  <img src={product.image} alt={product.nameEn} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShopIcon size={32} className="text-[#D4CCE8]" />
                  </div>
                )}
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
                <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
                  <span className="text-[#C4B5E0] text-sm">♡</span>
                </button>
              </div>

              {/* Info */}
              <div className="p-2.5 space-y-1">
                <p className="text-[11px] font-medium text-[#1a1a2e] leading-tight line-clamp-2 font-bangla">{product.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ৳{product.price.toLocaleString('bn-BD')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-[#9B8FC0] line-through">৳{product.originalPrice.toLocaleString('bn-BD')}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#7C3AED] font-medium">{product.shop}</span>
                  {product.verified && <span className="text-blue-500 text-[10px]">✓</span>}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#9B8FC0]">
                  <MapPinIcon size={10} />
                  <span>{product.district}</span>
                  <span>·</span>
                  <span className={product.condition === 'New' ? 'text-green-600' : 'text-amber-600'}>{product.condition}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
