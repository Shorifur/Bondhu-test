'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin, Link2, Settings, FileText, Bookmark, Check, X, Camera, Loader2,
  Calendar, Share2, Image, ShoppingBag, Briefcase, Lock, Globe, Phone,
  User, Heart, MessageCircle, Eye, Award,
} from 'lucide-react';
import { api } from '@/lib/api';
import { postService } from '@/services/post.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { formatNumber, cn } from '@/lib/utils';
import { PostCard } from '@/components/feed/PostCard';
import type { UserProfile, Post } from '@bondhu/shared-types';

/* ── i18n Dictionary ── */
const DICT = {
  bn: {
    edit: 'এডিট', share: 'শেয়ার', bioAdd: 'বায়ো যোগ করুন', bioEdit: 'বায়ো সম্পাদনা করুন',
    noBio: 'কোনো বায়ো নেই — সম্পাদনা করতে ট্যাপ করুন', save: 'সংরক্ষণ', cancel: 'বাতিল',
    public: 'পাবলিক', private: 'প্রাইভেট', followers: 'ফলোয়ার', following: 'ফলোয়িং', posts: 'পোস্ট',
    memberSince: 'যোগ দিয়েছেন', addLocation: 'অবস্থান যোগ করুন', changeLocation: 'পরিবর্তন করুন',
    likes: 'পছন্দ পেয়েছেন', comments: 'মন্তব্য পেয়েছেন', views: 'ভিউ পেয়েছেন', points: 'বন্ধু পয়েন্ট',
    noPosts: 'কোনো পোস্ট পাওয়া যায়নি', noPostsEn: 'No posts yet', createPost: 'পোস্ট তৈরি করুন',
    noMedia: 'কোনো মিডিয়া পোস্ট নেই', noMediaEn: 'No media posts yet', noSaved: 'কোনো সংরক্ষিত পোস্ট নেই', noSavedEn: 'No saved posts yet',
    loading: 'লোড হচ্ছে...', shop: 'দোকান', jobs: 'চাকরি', privateLabel: '🔒 প্রাইভেট অ্যাকাউন্ট',
    publicLabel: '🌐 পাবলিক অ্যাকাউন্ট', phoneVerified: 'ফোন যাচাইকৃত',
  },
  en: {
    edit: 'Edit', share: 'Share', bioAdd: 'Add Bio', bioEdit: 'Edit Bio',
    noBio: 'No bio yet — tap to add', save: 'Save', cancel: 'Cancel',
    public: 'Public', private: 'Private', followers: 'Followers', following: 'Following', posts: 'Posts',
    memberSince: 'Joined', addLocation: 'Add Location', changeLocation: 'change',
    likes: 'Likes Received', comments: 'Comments', views: 'Views', points: 'Points',
    noPosts: 'No posts yet', noPostsEn: 'No posts yet', createPost: 'Create Post',
    noMedia: 'No media posts', noMediaEn: 'No media posts yet', noSaved: 'No saved posts', noSavedEn: 'No saved posts yet',
    loading: 'Loading...', shop: 'Shop', jobs: 'Jobs', privateLabel: '🔒 Private Account',
    publicLabel: '🌐 Public Account', phoneVerified: 'Phone Verified',
  }
};

// ── Privacy Toggle Switch ──
function PrivacyToggle({ isPrivate, onToggle, isPending, lang }: {
  isPrivate: boolean; onToggle: () => void; isPending: boolean; lang: 'bn' | 'en';
}) {
  const t = DICT[lang];
  return (
    <button onClick={onToggle} disabled={isPending}
      className={cn('relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
        isPrivate ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' : 'bg-[#E1F5EE] text-[#0F6E56] border-[#0D9488]/20 hover:bg-[#D1EDE5]')}>
      {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
      {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
      <span className="font-bangla">{isPrivate ? t.private : t.public}</span>
    </button>
  );
}

// ── Stat Card ──
function StatCard({ icon: Icon, labelBn, value, color }: {
  icon: typeof Heart; labelBn: string; value: string | number; color: string;
}) {
  return (
    <div className="glass-card p-3 text-center">
      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
      <p className="text-lg font-extrabold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">{labelBn}</p>
    </div>
  );
}

// ── Empty State ──
function EmptyState({ icon, text, textEn, cta, href, router }: {
  icon: string; text: string; textEn: string; cta?: string; href?: string; router: any;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-5xl">{icon}</span>
      <p className="text-[#6B5E8A] text-sm font-medium font-bangla">{text}</p>
      <p className="text-[#9B8FC0] text-xs">{textEn}</p>
      {cta && href && (
        <button onClick={() => router.push(href)} className="px-5 py-2.5 bondhu-gradient text-white text-sm font-semibold rounded-xl shadow-md font-bangla">{cta}</button>
      )}
    </div>
  );
}

// ── Skeleton Loader ──
function ProfileSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-[#F5F2FF] rounded-xl" />
      <div className="flex items-end justify-between -mt-10 px-2">
        <div className="w-20 h-20 bg-[#F5F2FF] rounded-xl border-4 border-white" />
        <div className="flex gap-2 mb-2">
          <div className="w-20 h-8 bg-[#F5F2FF] rounded-full" />
          <div className="w-20 h-8 bg-[#F5F2FF] rounded-full" />
        </div>
      </div>
      <div className="h-4 bg-[#F5F2FF] rounded w-1/3" />
      <div className="h-3 bg-[#F5F2FF] rounded w-1/4" />
      <div className="grid grid-cols-4 gap-2">
        {[1,2,3,4].map(i => <div key={i} className="h-16 bg-[#F5F2FF] rounded-xl" />)}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { openSheet, addToast } = useUIStore();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'saved' | 'shop' | 'jobs'>('posts');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const t = DICT[lang];

  // ═══════════════════════════════════════════════════════════
  //  QUERIES
  // ═══════════════════════════════════════════════════════════
  const { data: profile, isLoading: profileLoading } = useQuery({
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
      const raw = res.data as unknown as Record<string, unknown> | unknown[];
      const posts = Array.isArray(raw) ? raw : (raw?.data as unknown[]) ?? [];
      return (posts as Post[]).map((p) => ({
        ...p,
        user: p.user || {
          id: user.id,
          displayName: user.profile?.displayName || 'User',
          handle: user.profile?.handle || 'user',
          avatarUrl: user.profile?.avatarUrl || null,
        },
      }));
    },
    enabled: !!user?.id,
  });

  const { data: savedPosts, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-posts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await postService.getBookmarkedPosts(1, 50);
      const raw = res.data as unknown as Record<string, unknown> | unknown[];
      return Array.isArray(raw) ? raw : (raw?.data as unknown[]) ?? [];
    },
    enabled: !!user?.id && activeTab === 'saved',
  });

  const { data: pointsData } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      try { const res = await api.get('users/me/points'); return res.data as { total: number; rank: number; streak: number } | null; }
      catch { return null; }
    },
    enabled: !!user?.id,
  });

  const { data: myShop } = useQuery({
    queryKey: ['my-shop', user?.id],
    queryFn: async () => { try { const res = await api.get('shops/mine'); return (res.data as Record<string, unknown> | null) || null; } catch { return null; } },
    enabled: !!user?.id && activeTab === 'shop',
  });

  const { data: myShopProducts } = useQuery({
    queryKey: ['my-shop-products', user?.id],
    queryFn: async () => { try { const res = await api.get('marketplace/my-items'); return (res.data as Record<string, unknown>)?.data as unknown[] || []; } catch { return []; } },
    enabled: !!user?.id && activeTab === 'shop',
  });

  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs', user?.id],
    queryFn: async () => { try { const res = await api.get('jobs/my-posts'); return (res.data as Record<string, unknown>)?.data as unknown[] || []; } catch { return []; } },
    enabled: !!user?.id && activeTab === 'jobs',
  });

  // ═══════════════════════════════════════════════════════════
  //  MUTATIONS
  // ═══════════════════════════════════════════════════════════
  const updateBio = useMutation({
    mutationFn: async (bio: string) => { const res = await api.patch('users/me', { bio }); return res.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile', user?.id] }); setEditingBio(false); },
  });

  const togglePrivacy = useMutation({
    mutationFn: async (isPrivate: boolean) => { const res = await api.patch('users/me', { isPrivate }); return res.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile', user?.id] }); addToast('প্রাইভেসি সেটিংস আপডেট হয়েছে', 'success'); },
    onError: () => addToast('আপডেট ব্যর্থ হয়েছে', 'error'),
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = api.getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
      method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : undefined, body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.url || data?.url || null;
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
      if (user?.profile) setUser({ ...user, profile: { ...user.profile, [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url } as any });
      addToast(`${type === 'avatar' ? 'Profile picture' : 'Cover photo'} updated`, 'success');
    },
    onError: () => addToast('Upload failed', 'error'),
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
  //  DERIVED
  // ═══════════════════════════════════════════════════════════
  const isPrivate = (profile as any)?.isPrivate ?? (user?.profile as any)?.isPrivate ?? false;
  const displayBio = profile?.bio || (user?.profile as any)?.bio || '';
  const myPoints = pointsData?.total || 0;

  const posts = ((activeTab === 'posts' || activeTab === 'media' ? userPosts : savedPosts) as Post[]) || [];
  const isLoading = activeTab === 'posts' || activeTab === 'media' ? postsLoading : savedLoading;
  const textPosts = posts.filter((p: Post) => !p.mediaAssets || p.mediaAssets.length === 0);
  const mediaPosts = posts.filter((p: Post) => p.mediaAssets && p.mediaAssets.length > 0);

  const tabs = [
    { id: 'posts' as const, label: t.posts, icon: FileText },
    { id: 'media' as const, label: lang === 'bn' ? 'মিডিয়া' : 'Media', icon: Image },
    { id: 'saved' as const, label: lang === 'bn' ? 'সংরক্ষিত' : 'Saved', icon: Bookmark },
    { id: 'shop' as const, label: t.shop, icon: ShoppingBag },
    { id: 'jobs' as const, label: t.jobs, icon: Briefcase },
  ];

  const ShopTabContent = () => {
    if (!myShop) return <EmptyState icon="🏪" text={lang === 'bn' ? 'আপনার এখনো কোনো দোকান নেই' : 'No shop yet'} textEn="No shop yet" cta={lang === 'bn' ? 'দোকান তৈরি করুন' : 'Create Shop'} href="/shop/create" router={router} />;
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
        {(myShopProducts || []).length === 0 && <EmptyState icon="📦" text={lang === 'bn' ? 'কোনো পণ্য নেই' : 'No products'} textEn="No products yet" cta={lang === 'bn' ? 'পণ্য যোগ করুন' : 'Add Products'} href={`/shop/${myShop.handle}/manage`} router={router} />}
      </div>
    );
  };

  const JobsTabContent = () => {
    const jobs = myJobs || [];
    if (jobs.length === 0) return <EmptyState icon="💼" text={lang === 'bn' ? 'কোনো চাকরির পোস্ট নেই' : 'No job posts'} textEn="No job posts yet" cta={lang === 'bn' ? 'চাকরি পোস্ট করুন' : 'Post a Job'} href="/jobs/post" router={router} />;
    return (
      <div className="space-y-3">
        {jobs.map((job: any) => (
          <div key={job.id} onClick={() => router.push(`/jobs/${job.id}`)} className="p-4 glass-card-hover cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#0F0A1E] text-sm font-bangla">{job.title}</p>
                <p className="text-xs text-[#6B5E8A] mt-0.5">{job.company?.name}</p>
              </div>
              <span className={cn('text-xs px-2 py-1 rounded-full font-medium flex-shrink-0', job.isActive ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#F5F2FF] text-[#6B5E8A]')}>{job.isActive ? (lang === 'bn' ? 'সক্রিয়' : 'Active') : (lang === 'bn' ? 'বন্ধ' : 'Closed')}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-[#5B21B6] font-semibold">৳ {job.salaryMin?.toLocaleString('bn-BD')} — {job.salaryMax?.toLocaleString('bn-BD')}</span>
              <span className="text-xs text-[#6B5E8A]">{job._count?.applications || 0} {lang === 'bn' ? 'জন আবেদন করেছেন' : 'applicants'}</span>
            </div>
          </div>
        ))}
        <button onClick={() => router.push('/jobs/post')} className="w-full py-3 border-2 border-dashed border-[#DDD6F3] rounded-2xl text-sm text-[#5B21B6] font-semibold hover:bg-[#F5F2FF] transition-colors font-bangla">+ {lang === 'bn' ? 'নতুন চাকরি পোস্ট করুন' : 'Post New Job'}</button>
      </div>
    );
  };

  if (!user) { router.push('/onboarding'); return null; }

  // Show skeleton during initial profile load
  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="py-4 space-y-4 relative z-10">

      {/* ═══════ HEADER CARD ═══════ */}
      <div className="glass-card p-5 space-y-4">
        {/* Cover */}
        <div className="relative h-32 rounded-xl overflow-hidden cursor-pointer group" style={{ background: 'linear-gradient(135deg, rgba(91,33,182,0.15), rgba(13,148,136,0.15))' }} onClick={() => coverInputRef.current?.click()}>
          {profile?.coverUrl && <img src={profile.coverUrl} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
            {uploadingCover ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>

        {/* Avatar + Actions Row */}
        <div className="flex items-end justify-between -mt-10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg cursor-pointer group border-4 border-white" onClick={() => avatarInputRef.current?.click()}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5B21B6] to-[#0D9488] text-white text-xl font-bold">{profile?.displayName?.[0] || user?.profile?.displayName?.[0] || 'U'}</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
              {uploadingAvatar ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Privacy + Edit + Share + Lang */}
          <div className="flex items-center gap-2 mb-1 flex-wrap justify-end">
            <PrivacyToggle isPrivate={isPrivate} onToggle={() => togglePrivacy.mutate(!isPrivate)} isPending={togglePrivacy.isPending} lang={lang} />
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="px-2 py-1.5 glass-card text-[10px] font-bold text-[#5B21B6] hover:bg-[#F5F2FF] rounded-full">{lang === 'bn' ? 'EN' : 'বাং'}</button>
            <button onClick={() => router.push('/settings')} className="px-3 py-1.5 glass-card text-xs font-bold text-[#3D2B6B] hover:bg-[#F5F2FF] transition-colors flex items-center gap-1.5 rounded-full"><Settings className="w-3.5 h-3.5" /> <span className="font-bangla">{t.edit}</span></button>
            <button onClick={() => { const url = `https://bondhu.app/u/${profile?.handle || user?.profile?.handle}`; if (navigator.share) navigator.share({ title: 'Bondhu Profile', url }); else { navigator.clipboard.writeText(url); addToast('লিংক কপি হয়েছে!', 'success'); } }} className="p-1.5 glass-card hover:bg-[#F5F2FF] transition-colors rounded-full" title="Share Profile"><Share2 className="w-3.5 h-3.5 text-[#5B21B6]" /></button>
          </div>
        </div>

        {/* Name + Handle */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#0F0A1E] font-bangla">{profile?.displayName || user?.profile?.displayName}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[#6B5E8A] text-sm">@{profile?.handle || user?.profile?.handle}</p>
            {user?.phoneVerified && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#E1F5EE] text-[#0F6E56] px-2 py-0.5 rounded-full font-medium"><Check className="w-3 h-3" /> {t.phoneVerified}</span>
            )}
          </div>
        </div>

        {/* Bio */}
        {editingBio ? (
          <div className="space-y-2">
            <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} placeholder={lang === 'bn' ? 'আপনার সম্পর্কে লিখুন...' : 'Write about yourself...'} rows={3} maxLength={160} className="w-full px-3 py-2 glass-input text-sm resize-none font-bangla" />
            <div className="flex items-center gap-2">
              <button onClick={() => updateBio.mutate(bioText)} disabled={updateBio.isPending} className="flex items-center gap-1 px-3 py-1.5 bondhu-gradient text-white text-xs font-bold rounded-lg"><Check className="w-3 h-3" /> {t.save}</button>
              <button onClick={() => { setEditingBio(false); setBioText(displayBio); }} className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F2FF] text-[#6B5E8A] text-xs font-bold rounded-lg"><X className="w-3 h-3" /> {t.cancel}</button>
            </div>
          </div>
        ) : (
          <div>
            {displayBio ? <p className="text-sm text-[#0F0A1E] font-bangla leading-relaxed">{displayBio}</p> : <p className="text-sm text-[#9B8FC0] italic font-bangla">{t.noBio}</p>}
            <button onClick={() => { setBioText(displayBio); setEditingBio(true); }} className="mt-1 text-xs text-[#5B21B6] font-bold hover:underline font-bangla">{displayBio ? t.bioEdit : t.bioAdd}</button>
          </div>
        )}

        {/* Location + Links Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6B5E8A]">
          {profile?.district ? (
            <button onClick={() => router.push('/settings')} className="flex items-center gap-1 hover:text-[#5B21B6] transition-colors font-bangla"><MapPin className="w-3.5 h-3.5" />{profile.district.nameBn} <span className="text-[10px] text-[#9B8FC0]">({t.changeLocation})</span></button>
          ) : (
            <button onClick={() => router.push('/settings')} className="flex items-center gap-1 text-[#5B21B6] hover:underline font-bangla"><MapPin className="w-3.5 h-3.5" />{t.addLocation}</button>
          )}
          {user?.createdAt && (
            <span className="flex items-center gap-1 font-bangla"><Calendar className="w-3.5 h-3.5" />{t.memberSince} {new Date(user.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en', { year: 'numeric', month: 'long' })}</span>
          )}
          <span className="flex items-center gap-1"><Link2 className="w-3.5 h-3.5" />bondhu.app/u/{profile?.handle || user?.profile?.handle}</span>
          {profile?.websiteUrl && (
            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#5B21B6] hover:underline"><Link2 className="w-3.5 h-3.5" />{profile.websiteUrl.replace(/^https?:\/\//, '')}</a>
          )}
          {profile?.whatsappNumber && (
            <a href={`https://wa.me/${profile.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:underline"><Phone className="w-3.5 h-3.5" />WhatsApp</a>
          )}
        </div>

        {/* Follower/Following/Posts count */}
        <div className="flex items-center gap-5 pt-1 border-t border-[#DDD6F3]/30">
          <button className="flex items-center gap-1.5 hover:underline" onClick={() => openSheet('followList', { userId: user.id, type: 'followers' })}>
            <span className="font-bold text-[#0F0A1E]">{formatNumber(profile?.followerCount || 0)}</span>
            <span className="text-[#6B5E8A] text-xs font-bangla">{t.followers}</span>
          </button>
          <button className="flex items-center gap-1.5 hover:underline" onClick={() => openSheet('followList', { userId: user.id, type: 'following' })}>
            <span className="font-bold text-[#0F0A1E]">{formatNumber(profile?.followingCount || 0)}</span>
            <span className="text-[#6B5E8A] text-xs font-bangla">{t.following}</span>
          </button>
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-[#0F0A1E]">{formatNumber(profile?.postCount || 0)}</span>
            <span className="text-[#6B5E8A] text-xs font-bangla">{t.posts}</span>
          </span>
        </div>
      </div>

      {/* ═══════ STATS ROW ═══════ */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard icon={Heart} labelBn={t.likes} value={myPoints.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en')} color="#E85D75" />
        <StatCard icon={MessageCircle} labelBn={t.comments} value={posts.reduce((sum: number, p: Post) => sum + (p.commentCount || 0), 0).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en')} color="#5B21B6" />
        <StatCard icon={Eye} labelBn={t.views} value={posts.reduce((sum: number, p: Post) => sum + (p.viewCount || 0), 0).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en')} color="#0D9488" />
        <StatCard icon={Award} labelBn={t.points} value={myPoints.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en')} color="#F59E0B" />
      </div>

      {/* ═══════ 5 TABS ═══════ */}
      <div className="flex border-b border-[#DDD6F3]/50 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors min-w-[64px]', activeTab === tab.id ? 'border-[#5B21B6] text-[#5B21B6]' : 'border-transparent text-[#6B5E8A] hover:text-[#3D2B6B]')}>
            <tab.icon className="w-4 h-4" />
            <span className="font-bangla">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════ TAB CONTENT ═══════ */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[#F5F2FF] rounded-xl animate-pulse" />)}
        </div>
      ) : activeTab === 'posts' ? (
        <div className="space-y-4">
          {textPosts.length > 0 && textPosts.map((post: Post) => <PostCard key={post.id} post={post} />)}
          {mediaPosts.length > 0 && mediaPosts.map((post: Post) => <PostCard key={post.id} post={post} />)}
          {textPosts.length === 0 && mediaPosts.length === 0 && <EmptyState icon="📝" text={t.noPosts} textEn={t.noPostsEn} cta={t.createPost} href="/create" router={router} />}
        </div>
      ) : activeTab === 'media' ? (
        mediaPosts.length > 0
          ? <div className="grid grid-cols-3 gap-1">{mediaPosts.map((post: Post) => (
              <button key={post.id} onClick={() => router.push(`/p/${post.id}`)} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                <img src={post.mediaAssets![0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {post.mediaAssets!.length > 1 && <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">{post.mediaAssets!.length}</div>}
              </button>
            ))}</div>
          : <EmptyState icon="📷" text={t.noMedia} textEn={t.noMediaEn} cta={t.createPost} href="/create" router={router} />
      ) : activeTab === 'saved' ? (
        (savedPosts || []).length > 0
          ? (savedPosts || []).map((post: Post) => <PostCard key={post.id} post={post} />)
          : <EmptyState icon="🔖" text={t.noSaved} textEn={t.noSavedEn} router={router} />
      ) : activeTab === 'shop' ? (
        <ShopTabContent />
      ) : activeTab === 'jobs' ? (
        <JobsTabContent />
      ) : null}
    </div>
  );
}