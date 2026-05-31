'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Share2, MessageCircle, Heart, MapPin, Store, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activePhoto, setActivePhoto] = useState(0);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const res = await api.get(`marketplace/products/${id}`, { silent: true } as any);
        return (res.data as any)?.data || null;
      } catch { return null; }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 animate-pulse space-y-4" style={{ backgroundColor: '#F8F7FF' }}>
        <div className="aspect-square bg-[#F5F2FF]" />
        <div className="px-4 space-y-3">
          <div className="h-6 bg-[#F5F2FF] rounded w-1/3" />
          <div className="h-4 bg-[#F5F2FF] rounded w-2/3" />
          <div className="h-20 bg-[#F5F2FF] rounded-xl" />
        </div>
      </div>
    );
  }

  const product = productData;
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-20" style={{ backgroundColor: '#F8F7FF' }}>
        <span className="text-6xl mb-4">📦</span>
        <h2 className="font-extrabold text-lg text-[#0F0A1E] font-bangla">পণ্য পাওয়া যায়নি</h2>
        <button onClick={() => router.push('/shop')} className="mt-4 px-5 py-2.5 bondhu-gradient text-white text-sm font-bold rounded-2xl font-bangla">দোকানে ফিরে যান</button>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Photo carousel */}
      <div className="relative bg-white">
        <div className="aspect-square overflow-hidden">
          {product.images?.length > 0 ? (
            <img src={product.images[activePhoto]} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#F5F2FF] flex items-center justify-center">
              <span className="text-6xl">📦</span>
            </div>
          )}
        </div>

        {/* Back button */}
        <button onClick={() => router.back()}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
          <ArrowLeft className="w-4 h-4 text-[#0F0A1E]" />
        </button>

        {/* Share */}
        <button onClick={() => { if (navigator.share) navigator.share({ title: product.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
          <Share2 className="w-4 h-4 text-[#5B21B6]" />
        </button>

        {/* Photo dots */}
        {product.images?.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_: any, i: number) => (
              <button key={i} onClick={() => setActivePhoto(i)}
                className={`h-2 rounded-full transition-all ${i === activePhoto ? 'bg-[#5B21B6] w-5' : 'bg-white/60 w-2'}`} />
            ))}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-14 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}% ছাড়</span>
        )}
      </div>

      {/* Thumbnails */}
      {product.images?.length > 1 && (
        <div className="flex gap-2 p-3 bg-white overflow-x-auto scrollbar-hide">
          {product.images.map((img: string, i: number) => (
            <button key={i} onClick={() => setActivePhoto(i)}
              className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === activePhoto ? 'border-[#5B21B6]' : 'border-transparent'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-4 space-y-4">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black font-bangla" style={{ background: 'linear-gradient(135deg, #5B21B6, #0D9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ৳ {Number(product.price).toLocaleString('bn-BD')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-[#9B8FC0] line-through">৳ {Number(product.originalPrice).toLocaleString('bn-BD')}</span>
            )}
            {product.isNegotiable && (
              <span className="text-xs bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-full font-bold font-bangla">💬 দাম আলোচনাসাপেক্ষ</span>
            )}
          </div>
        </div>

        {/* Title & details */}
        <div className="glass-card p-4 space-y-2">
          <h1 className="font-extrabold text-base text-[#0F0A1E] font-bangla">{product.title}</h1>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold font-bangla ${product.condition === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {product.condition === 'NEW' ? 'নতুন' : product.condition === 'USED' ? 'ব্যবহৃত' : 'মোটামুটি ভালো'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#5B21B6] font-bold font-bangla">{product.category}</span>
            {product.deliveryType !== 'pickup' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold font-bangla">
                🚚 {product.deliveryCharge === 0 ? 'বিনামূল্যে ডেলিভারি' : `ডেলিভারি ৳${product.deliveryCharge}`}
              </span>
            )}
          </div>
          {product.description && <p className="text-sm text-[#3D2B6B] leading-relaxed font-bangla">{product.description}</p>}
          <p className="text-xs text-[#9B8FC0]">পোস্ট করা হয়েছে {formatTimeAgo(product.createdAt, 'bn')}</p>
        </div>

        {/* Seller card */}
        <div className="glass-card p-4 flex items-center gap-3 cursor-pointer"
          onClick={() => product.shop?.handle && router.push(`/shop/${product.shop.handle}`)}>
          <div className="w-12 h-12 rounded-xl bg-[#F5F2FF] overflow-hidden flex items-center justify-center shrink-0">
            {product.shop?.logoUrl ? <img src={product.shop.logoUrl} className="w-full h-full object-cover" /> : <Store className="w-6 h-6 text-[#5B21B6]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-sm text-[#0F0A1E] font-bangla truncate">{product.shop?.name || 'দোকান'}</p>
            <p className="text-xs text-[#6B5E8A] flex items-center gap-1">
              <MapPin className="w-3 h-3" />{product.shop?.district?.nameBn || ''} · {product.shop?.followerCount || 0} ফলোয়ার
            </p>
            {product.shop?.isVerified && (
              <p className="text-[10px] text-[#0D9488] font-bold flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> যাচাইকৃত দোকান</p>
            )}
          </div>
          <span className="text-xs text-[#5B21B6] font-bold shrink-0">দোকান →</span>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#DDD6F3] p-3 flex gap-2 z-30">
        <button onClick={() => {/* TODO: open chat */}}
          className="flex-1 py-3 bg-[#F5F2FF] border border-[#DDD6F3] rounded-2xl text-sm font-bold text-[#5B21B6] flex items-center justify-center gap-1.5 font-bangla">
          <MessageCircle className="w-4 h-4" /> বিক্রেতাকে মেসেজ করুন
        </button>
        <button className="w-12 py-3 bg-[#F5F2FF] border border-[#DDD6F3] rounded-2xl flex items-center justify-center">
          <Heart className="w-4 h-4 text-[#6B5E8A]" />
        </button>
      </div>
    </div>
  );
}
