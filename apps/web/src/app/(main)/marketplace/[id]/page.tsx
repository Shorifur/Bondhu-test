// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Tag, Shield, MessageCircle, Phone,
  ShoppingBag, CheckCircle2, Clock,
} from 'lucide-react';
import { marketplaceService } from '@/services/marketplace.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn, formatNumber } from '@/lib/utils';
import type { MarketplaceItem } from '@bondhu/shared-types';

export default function MarketplaceItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: itemRes, isLoading } = useQuery({
    queryKey: ['marketplace-item', id],
    queryFn: async () => {
      const res = await marketplaceService.getById(id);
      return res.data ?? null;
    },
    enabled: !!id,
  });

  const item = itemRes as MarketplaceItem | null;

  const deleteMutation = useMutation({
    mutationFn: () => marketplaceService.delete(id),
    onSuccess: () => {
      addToast('Item marked as sold', 'success');
      router.push('/marketplace');
    },
    onError: () => {
      addToast('Failed to update item', 'error');
    },
  });

  if (isLoading) {
    return (
      <div className="py-4 space-y-4">
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Item not found</p>
        <button
          onClick={() => router.push('/marketplace')}
          className="mt-4 px-4 py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const isOwner = item.sellerId === user?.id;
  const images = item.mediaAssets?.length ? item.mediaAssets : [];
  const seller = item.seller;

  return (
    <div className="py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/marketplace')}
          className="p-2 -ml-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold truncate">{item.title}</h1>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage].url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      i === currentImage ? 'bg-white' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Price & Title */}
      <div className="space-y-1">
        <p className="text-2xl font-bold text-bondhu-green">
          ৳{formatNumber(Number(item.price))}
        </p>
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {item.condition}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.category}
          </span>
          {item.isNegotiable && (
            <span className="px-2 py-0.5 bg-bondhu-green/10 text-bondhu-green rounded-full font-medium">
              Negotiable
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-card border rounded-2xl">
        <h3 className="text-sm font-semibold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {item.description}
        </p>
      </div>

      {/* Seller */}
      {seller && (
        <div className="p-4 bg-card border rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
            {seller.profile?.avatarUrl ? (
              <img src={seller.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-bondhu-green text-white font-bold">
                {seller.profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm truncate">{seller.profile?.displayName}</span>
              {item.isVerifiedSeller && (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">Seller</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addToast('Chat feature coming soon', 'info')}
              className="p-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToast('Call feature coming soon', 'info')}
              className="p-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Safety badge */}
      <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
        <Shield className="w-4 h-4 text-blue-500" />
        <p className="text-xs text-blue-600">
          Bondhu Marketplace uses escrow for verified sellers. Always verify the item before releasing payment.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {isOwner ? (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="flex-1 py-3 bg-muted text-muted-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
          >
            {deleteMutation.isPending ? 'Updating...' : 'Mark as Sold'}
          </button>
        ) : (
          <button
            onClick={() => addToast('Purchase flow coming soon', 'info')}
            className="flex-1 py-3 bg-bondhu-green text-white rounded-xl font-medium hover:bg-bondhu-green-dark transition-colors"
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Posted time */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
