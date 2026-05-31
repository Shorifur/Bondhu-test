'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin, Link2, Settings, Users, FileText, Bookmark, Check, X, Camera, Loader2,
  Calendar, Share2, Bell, Image, ShoppingBag, Briefcase, TrendingUp, Award, Phone,
} from 'lucide-react';
import { api } from '@/lib/api';
import { postService } from '@/services/post.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { formatNumber, cn } from '@/lib/utils';
import type { UserProfile, Post } from '@bondhu/shared-types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { openSheet, addToast } = useUIStore();
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'saved' | 'shop' | 'jobs'>('posts');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ═══════════════════════════════════════════════════════════
  //  QUERIES
  // ═══════════════════════════════════════════════════════════
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.profile?.handle) return null;
      const res = await api.get<UserProfile>(`users/${user.profile.handle}`);
      return res.data ?? null;
    },
    enabled: !!user?.profile?.handle,
  });

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await postService.getUserPosts(user.id, 1, 50);
      const raw = res.data as any;
      return Array.isArray(raw) ? raw : raw?.data ?? [];
    },
    enabled: !!user?.id,
  });

  const { data: savedPosts, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-posts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await postService.getBookmarkedPosts(1, 50);
      const raw = res.data as any;
      return Array.isArray(raw) ? raw : raw?.data ?? [];
    },
    enabled: !!user?.id && (activeTab === 'saved' || activeTab === 'media'),
  });

  // FIX 5: Points query
  const { data: pointsData } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      const res = await api.get('users/me/points');
      return res.data as { total: number; rank: number; streak: number } | null;
    },
    enabled: !!user?.id,
  });

  // FIX 10: My Shop query
  const { data: myShop } = useQuery({
    queryKey: ['my-shop', user?.id],
    queryFn: async () => {
      const res = await api.get('shops/mine');
      return (res.data as any) || null;
    },
    enabled: !!user?.id && activeTab === 'shop',
  });

  const { data: myShopProducts } = useQuery({
    queryKey: ['my-shop-products', user?.id],
    queryFn: async () => {
      const res = await api.get('marketplace/my-items');
      return (res.data as any)?.data || [];
    },
    enabled: !!user?.id && activeTab === 'shop',
  });

  // FIX 11: My Jobs query
  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs', user?.id],
    queryFn: async () => {
      const res = await api.get('jobs/my-posts');
      return (res.data as any)?.data || [];
    },
    enabled: !!user?.id && activeTab === 'jobs',
  });

  // FIX 12: Unread notifications
  const { data: unreadCount } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async () => {
      const res = await api.get('notifications/unread-count');
      return (res.data as any)?.count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // ═══════════════════════════════════════════════════════════
  //  MUTATIONS
  // ═══════════════════════════════════════════════════════════
  const updateBio = useMutation({
    mutationFn: async (bio: string) => {
      const res = await api.patch('users/me', { bio });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      if (user) {
        setUser({
          ...user,
          profile: user.profile ? ({ ...user.profile, ...(data as any) } as any) : null,
        });
      }
      setEditingBio(false);
    },
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = api.getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    const payload = data?.data ?? data;
    return payload?.url || null;
  };

  const updateProfileImage = useMutation({
    mutationFn: async ({ type, file }: { type: 'avatar' | 'cover'; file: File }) => {
      const url = await uploadImage(file);
      if (!url) throw new Error('Upload failed');
      await api.patch('users/me', { [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url });
      return { type, url };
    },
    onSuccess: ({ type, url }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      if (user?.profile) {
        setUser({ ...user, profile: { ...user.profile, [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url } as any });
      }
      addToast(`${type === 'avatar' ? 'Profile picture' : 'Cover photo'} updated`, 'success');
    },
    onError: () => addToast('Upload failed. Please try again.', 'error'),
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try { await updateProfileImage.mutateAsync({ type: 'avatar', file }); }
    finally { setUploadingAvatar(false); if (avatarInputRef.current) avatarInputRef.current.value = ''; }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try { await updateProfileImage.mutateAsync({ type: 'cover', file }); }
    finally { setUploadingCover(false); if (coverInputRef.current) coverInputRef.current.value = ''; }
  };

  // ═══════════════════════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════════════════════

  // FIX 4: Profile completion
  const getProfileCompletion = () => {
    const checks = [
      { done: !!(profile?.avatarUrl), label: 'প্রোফাইল ছবি যোগ করুন', labelEn: 'Add profile photo', points: 20 },
      { done: !!(profile?.coverUrl), label: 'কভার ছবি যোগ করুন', labelEn: 'Add cover photo', points: 10 },
      { done: !!(profile?.bio), label: 'বায়ো লিখুন', labelEn: 'Write a bio', points: 15 },
      { done: !!(profile?.districtId), label: 'অবস্থান যোগ করুন', labelEn: 'Add location', points: 10 },
      { done: !!(user?.phoneVerified), label: 'ফোন যাচাই করুন', labelEn: 'Verify phone', points: 30 },
      { done: !!(user?.email && user?.emailVerified), label: 'ইমেইল যাচাই করুন', labelEn: 'Verify email', points: 20 },
    ];
    const done = checks.filter(c => c.done).length;
    const percent = Math.round((done / checks.length) * 100);
    const nextTask = checks.find(c => !c.done);
    return { percent, nextTask, done, total: checks.length };
  };
  const completion = getProfileCompletion();

  // FIX 5: Badge calculation
  const getBadge = (points: number) => {
    if (points >= 10000) return { label: 'Legend', labelBn: 'কিংবদন্তি', icon: '👑', color: '#A78BFA' };
    if (points >= 5000) return { label: 'Diamond', labelBn: 'হীরা', icon: '💎', color: '#7DD3FC' };
    if (points >= 2000) return { label: 'Gold', labelBn: 'স্বর্ণ', icon: '🥇', color: '#FFD700' };
    if (points >= 500) return { label: 'Silver', labelBn: 'রৌপ্য', icon: '🥈', color: '#C0C0C0' };
    return { label: 'Bronze', labelBn: 'ব্রোঞ্জ', icon: '🥉', color: '#CD7F32' };
  };
  const myPoints = pointsData?.total || 0;
  const myBadge = getBadge(myPoints);
  const myStreak = pointsData?.streak || 0;

  // FIX 8: 5 tabs
  const tabs = [
    { id: 'posts' as const, label: 'পোস্ট', labelEn: 'Posts', icon: FileText },
    { id: 'media' as const, label: 'মিডিয়া', labelEn: 'Media', icon: Image },
    { id: 'saved' as const, label: 'সংরক্ষিত', labelEn: 'Saved', icon: Bookmark },
    { id: 'shop' as const, label: 'দোকান', labelEn: 'Shop', icon: ShoppingBag },
    { id: 'jobs' as const, label: 'চাকরি', labelEn: 'Jobs', icon: Briefcase },
  ];

  // FIX 9: Empty state
  const EmptyState = ({ icon, text, textEn, cta, href }: { icon: string; text: string; textEn: string; cta: string | null; href: string | null }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <span className="text-5xl">{icon}</span>
      <p className="text-[#6B5E8A] text-sm font-medium font-bangla">{text}</p>
      <p className="text-[#9B8FC0] text-xs">{textEn}</p>
      {cta && href && (
        <button onClick={() => router.push(href)} className="px-5 py-2.5 bondhu-gradient text-white text-sm font-semibold rounded-xl shadow-md">
          {cta}
        </button>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  RENDER HELPERS
  // ═══════════════════════════════════════════════════════════
  const posts = (activeTab === 'posts' || activeTab === 'media' ? userPosts : savedPosts) || [];
  const isLoading = activeTab === 'posts' || activeTab === 'media' ? postsLoading : savedLoading;
  const textPosts = posts.filter((post: Post) => !post.mediaAssets || post.mediaAssets.length === 0);
  const mediaPosts = posts.filter((post: Post) => post.mediaAssets && post.mediaAssets.length > 0);

  const renderMediaGrid = (items: Post[]) => (
    <div className="grid grid-cols-3 gap-1">
      {items.map((post: Post) => (
        <button key={post.id} onClick={() => router.push(`/p/${post.id}`)} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
          <img src={post.mediaAssets![0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          {post.mediaAssets!.length > 1 && (
            <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">{post.mediaAssets!.length}</div>
          )}
        </button>
      ))}
    </div>
  );

  const renderTextCards = (items: Post[]) => (
    <div className="space-y-3">
      {items.map((post: Post) => (
        <button key={post.id} onClick={() => router.push(`/p/${post.id}`)} className="w-full text-left p-4 glass-card-hover">
          <p className="text-sm line-clamp-4 whitespace-pre-wrap font-bangla text-[#0F0A1E]">{post.content}</p>
          <p className="text-xs text-[#6B5E8A] mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
        </button>
      ))}
    </div>
  );

  // FIX 10: Shop tab content
  const ShopTabContent = () => {
    if (!myShop) {
      return <EmptyState icon="🏪" text="আপনার এখনো কোনো দোকান নেই" textEn="No shop yet" cta="দোকান তৈরি করুন" href="/shop/create" />;
    }
    return (
      <div className="space-y-4">
        <div className="glass-card p-3 flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/shop/${myShop.handle}`)}>
          <div className="w-12 h-12 rounded-xl bg-[#5B21B6] flex items-center justify-center text-white font-bold text-lg">{myShop.name?.[0] || '🏪'}</div>
          <div className="flex-1">
            <p className="font-semibold text-[#0F0A1E] text-sm font-bangla">{myShop.name}</p>
            <p className="text-xs text-[#6B5E8A]">{(myShopProducts || []).length} টি পণ্য</p>
          </div>
          <span className="text-xs text-[#5B21B6] font-medium font-bangla">দোকান দেখুন →</span>
        </div>
        {(myShopProducts || []).length > 0 ? renderMediaGrid(myShopProducts as any) : <EmptyState icon="📦" text="কোনো পণ্য নেই" textEn="No products yet" cta="পণ্য যোগ করুন" href={`/shop/${myShop.handle}/manage`} />}
      </div>
    );
  };

  // FIX 11: Jobs tab content
  const JobsTabContent = () => {
    const jobs = myJobs || [];
    if (jobs.length === 0) {
      return <EmptyState icon="💼" text="কোনো চাকরির পোস্ট নেই" textEn="No job posts yet" cta="চাকরি পোস্ট করুন" href="/jobs/post" />;
    }
    return (
      <div className="space-y-3">
        {jobs.map((job: any) => (
          <div key={job.id} onClick={() => router.push(`/jobs/${job.id}`)} className="p-4 glass-card-hover cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#0F0A1E] text-sm font-bangla">{job.title}</p>
                <p className="text-xs text-[#6B5E8A] mt-0.5">{job.company?.name}</p>
              </div>
              <span className={cn('text-xs px-2 py-1 rounded-full font-medium flex-shrink-0', job.isActive ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#F5F2FF] text-[#6B5E8A]')}>{job.isActive ? 'সক্রিয়' : 'বন্ধ'}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-[#5B21B6] font-semibold">৳ {job.salaryMin?.toLocaleString('bn-BD')} — {job.salaryMax?.toLocaleString('bn-BD')}</span>
              <span className="text-xs text-[#6B5E8A]">{job._count?.applications || 0} জন আবেদন করেছেন</span>
            </div>
          </div>
        ))}
        <button onClick={() => router.push('/jobs/post')} className="w-full py-3 border-2 border-dashed border-[#DDD6F3] rounded-2xl text-sm text-[#5B21B6] font-semibold hover:bg-[#F5F2FF] transition-colors font-bangla">+ নতুন চাকরি পোস্ট করুন</button>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  //  EARLY RETURN
  // ═══════════════════════════════════════════════════════════
  if (!user) { router.push('/onboarding'); return null; }

  const displayBio = profile?.bio || (user?.profile as any)?.bio || '';

  // ═══════════════════════════════════════════════════════════
  //  MAIN RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="py-4 space-y-4 relative z-10">

      {/* FIX 4: Profile Completion Progress Bar */}
      {completion.percent < 100 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#3D2B6B] font-bangla">প্রোফাইল {completion.percent}% সম্পূর্ণ</span>
            <span className="text-xs text-[#7C3AED] font-medium">{completion.done}/{completion.total}</span>
          </div>
          <div className="w-full bg-[#E0D9F7] rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#0D9488] h-2 rounded-full transition-all" style={{ width: `${completion.percent}%` }} />
          </div>
          {completion.nextTask && (
            <p className="text-xs text-[#6B5E8A] font-bangla">👉 {completion.nextTask.label} → +{completion.nextTask.points} পয়েন্ট পাবেন</p>
          )}
        </div>
      )}

      {/* Cover */}
      <div className="relative h-40 rounded-2xl overflow-hidden cursor-pointer group" style={{ background: 'linear-gradient(135deg, rgba(91,33,182,0.15), rgba(13,148,136,0.15))' }} onClick={() => coverInputRef.current?.click()}>
        {profile?.coverUrl && <img src={profile.coverUrl} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          {uploadingCover ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
      </div>

      {/* Avatar & Actions */}
      <div className="relative px-4 -mt-12 flex items-end justify-between">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg cursor-pointer group border-4 border-[#F4F7F6]" onClick={() => avatarInputRef.current?.click()}>
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5B21B6] to-[#0D9488] text-white text-2xl font-bold">{profile?.displayName?.[0] || user?.profile?.displayName?.[0] || 'U'}</div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            {uploadingAvatar ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* FIX 6: Edit + Share + Notification buttons */}
        <div className="mb-2 flex items-center gap-2">
          <button onClick={() => router.push('/settings')} className="px-4 py-2 glass-card text-sm font-semibold text-[#3D2B6B] hover:bg-[#F5F2FF] transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Edit Profile
          </button>
          <button onClick={() => { const url = `https://bondhu.app/u/${profile?.handle || user?.profile?.handle}`; if (navigator.share) navigator.share({ title: 'Bondhu Profile', url }); else { navigator.clipboard.writeText(url); addToast('লিংক কপি হয়েছে!', 'success'); } }} className="p-2 glass-card hover:bg-[#F5F2FF] transition-colors" title="Share Profile">
            <Share2 className="w-4 h-4 text-[#5B21B6]" />
          </button>
          {/* FIX 12: Notification bell */}
          <button onClick={() => router.push('/notifications')} className="relative p-2 glass-card hover:bg-[#F5F2FF] transition-colors">
            <Bell className="w-4 h-4 text-[#5B21B6]" />
            {(unreadCount || 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{(unreadCount || 0) > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-1 space-y-1">
        <h1 className="text-xl font-bold text-[#0F0A1E] font-bangla">{profile?.displayName || user?.profile?.displayName}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[#6B5E8A] text-sm">@{profile?.handle || user?.profile?.handle}</p>
          {/* FIX 3: Phone verified badge */}
          {user?.phoneVerified && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-full font-medium">
              <Check className="w-3 h-3" /> ফোন যাচাইকৃত
            </span>
          )}
        </div>

        {/* FIX 5: Points & Rank badge */}
        <div className="flex items-center gap-3 py-2 px-1 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: myBadge.color + '22', color: myBadge.color }}>
            {myBadge.icon} {myBadge.labelBn} · {myPoints.toLocaleString('bn-BD')} পয়েন্ট
          </span>
          {myStreak > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full">
              🔥 {myStreak} দিনের স্ট্রীক
            </span>
          )}
          <button onClick={() => router.push('/leaderboard')} className="text-xs text-[#5B21B6] underline font-medium font-bangla">লিডারবোর্ড দেখুন →</button>
        </div>

        {/* Bio */}
        {editingBio ? (
          <div className="mt-2 space-y-2">
            <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} placeholder="Write your bio..." rows={3} maxLength={150} className="w-full px-3 py-2 glass-input text-sm resize-none font-bangla" />
            <div className="flex items-center gap-2">
              <button onClick={() => updateBio.mutate(bioText)} disabled={updateBio.isPending} className="flex items-center gap-1 px-3 py-1.5 bondhu-gradient text-white text-xs font-medium rounded-lg">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={() => { setEditingBio(false); setBioText(displayBio); }} className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F2FF] text-[#6B5E8A] text-xs font-medium rounded-lg">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {displayBio ? <p className="text-sm text-[#0F0A1E] font-bangla">{displayBio}</p> : <p className="text-sm text-[#9B8FC0] italic font-bangla">No bio yet. Tap to add one.</p>}
            <button onClick={() => { setBioText(displayBio); setEditingBio(true); }} className="mt-1 text-xs text-[#5B21B6] font-medium hover:underline">{displayBio ? 'Edit Bio' : 'Add Bio'}</button>
          </div>
        )}

        {/* Location & Links */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B5E8A] mt-2">
          {/* FIX 13: Location tappable */}
          {profile?.district ? (
            <button onClick={() => router.push('/settings')} className="flex items-center gap-1 hover:text-[#5B21B6] transition-colors font-bangla">
              <MapPin className="w-3.5 h-3.5" />{profile.district.nameBn} <span className="text-[10px] text-[#9B8FC0]">(পরিবর্তন করুন)</span>
            </button>
          ) : (
            <button onClick={() => router.push('/settings')} className="flex items-center gap-1 text-[#5B21B6] hover:underline font-bangla">
              <MapPin className="w-3.5 h-3.5" />অবস্থান যোগ করুন (+10 পয়েন্ট)
            </button>
          )}
          {/* FIX 2: Member Since */}
          {user?.createdAt && (
            <span className="flex items-center gap-1 font-bangla">
              <Calendar className="w-3.5 h-3.5" />যোগ দিয়েছেন {new Date(user.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" />bondhu.app/u/{profile?.handle || user?.profile?.handle}
          </span>
          {/* FIX 7: Website & WhatsApp */}
          {profile?.websiteUrl && (
            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#5B21B6] hover:underline">
              <Link2 className="w-3.5 h-3.5" />{profile.websiteUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
          {profile?.whatsappNumber && (
            <a href={`https://wa.me/${profile.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:underline">
              <Phone className="w-3.5 h-3.5" />WhatsApp
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 py-3">
          <button className="flex items-center gap-1.5 hover:underline">
            <span className="font-bold text-[#0F0A1E]">{formatNumber(profile?.postCount || 0)}</span>
            <span className="text-[#6B5E8A] text-sm">Posts</span>
          </button>
          <button className="flex items-center gap-1.5 hover:underline" onClick={() => openSheet('followList', { userId: user.id, type: 'followers' })}>
            <span className="font-bold text-[#0F0A1E]">{formatNumber(profile?.followerCount || 0)}</span>
            <span className="text-[#6B5E8A] text-sm">Followers</span>
          </button>
          <button className="flex items-center gap-1.5 hover:underline" onClick={() => openSheet('followList', { userId: user.id, type: 'following' })}>
            <span className="font-bold text-[#0F0A1E]">{formatNumber(profile?.followingCount || 0)}</span>
            <span className="text-[#6B5E8A] text-sm">Following</span>
          </button>
        </div>
      </div>

      {/* FIX 8: 5 Tabs */}
      <div className="flex border-b border-[#DDD6F3]/50 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors min-w-[64px]', activeTab === tab.id ? 'border-[#5B21B6] text-[#5B21B6]' : 'border-transparent text-[#6B5E8A] hover:text-[#3D2B6B]')}>
            <tab.icon className="w-4 h-4" />
            <span className="font-bangla">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="aspect-square bg-[#F5F2FF] rounded-lg animate-pulse" />)}
        </div>
      ) : activeTab === 'posts' ? (
        <div className="space-y-4">
          {textPosts.length > 0 && renderTextCards(textPosts)}
          {mediaPosts.length > 0 && renderMediaGrid(mediaPosts)}
          {textPosts.length === 0 && mediaPosts.length === 0 && <EmptyState icon="📝" text="কোনো পোস্ট পাওয়া যায়নি" textEn="No posts yet" cta="পোস্ট তৈরি করুন" href="/create" />}
        </div>
      ) : activeTab === 'media' ? (
        mediaPosts.length > 0 ? renderMediaGrid(mediaPosts) : <EmptyState icon="📷" text="কোনো মিডিয়া পোস্ট নেই" textEn="No media posts yet" cta="পোস্ট তৈরি করুন" href="/create" />
      ) : activeTab === 'saved' ? (
        (savedPosts || []).length > 0 ? renderTextCards(savedPosts || []) : <EmptyState icon="🔖" text="কোনো সংরক্ষিত পোস্ট নেই" textEn="No saved posts yet" cta={null} href={null} />
      ) : activeTab === 'shop' ? (
        <ShopTabContent />
      ) : activeTab === 'jobs' ? (
        <JobsTabContent />
      ) : null}
    </div>
  );
}
