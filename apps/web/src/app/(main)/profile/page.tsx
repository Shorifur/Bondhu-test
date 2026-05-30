'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Link2, Settings, Users, FileText, Bookmark, Check, X, Camera, Loader2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
    enabled: !!user?.id && activeTab === 'saved',
  });

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
    if (!res.ok) {
      throw new Error('Upload failed');
    }
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
        setUser({
          ...user,
          profile: { ...user.profile, [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: url } as any,
        });
      }
      addToast(`${type === 'avatar' ? 'Profile picture' : 'Cover photo'} updated`, 'success');
    },
    onError: () => {
      addToast('Upload failed. Please try again.', 'error');
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await updateProfileImage.mutateAsync({ type: 'avatar', file });
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      await updateProfileImage.mutateAsync({ type: 'cover', file });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  if (!user) {
    router.push('/onboarding');
    return null;
  }

  const displayBio = profile?.bio || (user?.profile as any)?.bio || '';
  const posts = (activeTab === 'posts' ? userPosts : savedPosts) || [];
  const isLoading = activeTab === 'posts' ? postsLoading : savedLoading;

  const textPosts = posts.filter((post: Post) => !post.mediaAssets || post.mediaAssets.length === 0);
  const mediaPosts = posts.filter((post: Post) => post.mediaAssets && post.mediaAssets.length > 0);

  const renderMediaGrid = (items: Post[]) => (
    <div className="grid grid-cols-3 gap-1">
      {items.map((post: Post) => (
        <button
          key={post.id}
          onClick={() => router.push(`/p/${post.id}`)}
          className="aspect-square bg-muted rounded-lg overflow-hidden relative group"
        >
          <img
            src={post.mediaAssets![0].url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {post.mediaAssets!.length > 1 && (
            <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {post.mediaAssets!.length}
            </div>
          )}
        </button>
      ))}
    </div>
  );

  const renderTextCards = (items: Post[]) => (
    <div className="space-y-3">
      {items.map((post: Post) => (
        <button
          key={post.id}
          onClick={() => router.push(`/p/${post.id}`)}
          className="w-full text-left p-4 bg-card border rounded-2xl hover:bg-muted/50 transition-colors"
        >
          <p className="text-sm line-clamp-4 whitespace-pre-wrap">{post.content}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="py-4 space-y-4">
      {/* Cover */}
      <div
        className="relative h-40 bg-gradient-to-br from-bondhu-green/20 to-bondhu-blue/20 rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => coverInputRef.current?.click()}
      >
        {profile?.coverUrl && (
          <img src={profile.coverUrl} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          {uploadingCover ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      {/* Avatar & Actions */}
      <div className="relative px-4 -mt-12 flex items-end justify-between">
        <div
          className="relative w-24 h-24 rounded-2xl bg-card border-4 border-background overflow-hidden shadow-lg cursor-pointer group"
          onClick={() => avatarInputRef.current?.click()}
        >
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bondhu-green text-white text-2xl font-bold">
              {profile?.displayName?.[0] || user?.profile?.displayName?.[0] || 'U'}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            {uploadingAvatar ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <button
          onClick={() => router.push('/settings')}
          className="mb-2 px-4 py-2 bg-card border rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Info */}
      <div className="px-1 space-y-1">
        <h1 className="text-xl font-bold">{profile?.displayName || user?.profile?.displayName}</h1>
        <p className="text-muted-foreground text-sm">@{profile?.handle || user?.profile?.handle}</p>

        {/* Bio with inline edit */}
        {editingBio ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="Write your bio..."
              rows={3}
              maxLength={150}
              className="w-full px-3 py-2 bg-card border rounded-xl text-sm resize-none focus:outline-none focus:border-bondhu-green"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateBio.mutate(bioText)}
                disabled={updateBio.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-bondhu-green text-white text-xs font-medium rounded-lg hover:bg-bondhu-green-dark transition-colors"
              >
                <Check className="w-3 h-3" />
                Save
              </button>
              <button
                onClick={() => { setEditingBio(false); setBioText(displayBio); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-lg hover:bg-muted/80 transition-colors"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {displayBio ? (
              <p className="text-sm">{displayBio}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No bio yet. Tap to add one.</p>
            )}
            <button
              onClick={() => { setBioText(displayBio); setEditingBio(true); }}
              className="mt-1 text-xs text-bondhu-green font-medium hover:underline"
            >
              {displayBio ? 'Edit Bio' : 'Add Bio'}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
          {profile?.district && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {profile.district.nameBn}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" />
            bondhu.app/u/{profile?.handle || user?.profile?.handle}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 py-3">
          <button className="flex items-center gap-1.5 hover:underline">
            <span className="font-bold">{formatNumber(profile?.postCount || 0)}</span>
            <span className="text-muted-foreground text-sm">Posts</span>
          </button>
          <button
            className="flex items-center gap-1.5 hover:underline"
            onClick={() => openSheet('followList', { userId: user.id, type: 'followers' })}
          >
            <span className="font-bold">{formatNumber(profile?.followerCount || 0)}</span>
            <span className="text-muted-foreground text-sm">Followers</span>
          </button>
          <button
            className="flex items-center gap-1.5 hover:underline"
            onClick={() => openSheet('followList', { userId: user.id, type: 'following' })}
          >
            <span className="font-bold">{formatNumber(profile?.followingCount || 0)}</span>
            <span className="text-muted-foreground text-sm">Following</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'posts' as const, label: 'Posts', icon: FileText },
          { id: 'saved' as const, label: 'Saved', icon: Bookmark },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-bondhu-green text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {textPosts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Text Posts
              </h3>
              {renderTextCards(textPosts)}
            </div>
          )}
          {mediaPosts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Media
              </h3>
              {renderMediaGrid(mediaPosts)}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-bangla text-lg">
            {activeTab === 'saved' ? 'কোনো সংরক্ষিত পোস্ট নেই' : 'কোনো পোস্ট পাওয়া যায়নি'}
          </p>
          <p>
            {activeTab === 'saved'
              ? 'No saved posts yet. Bookmark posts to see them here.'
              : 'No posts yet. Create your first post!'}
          </p>
        </div>
      )}
    </div>
  );
}
