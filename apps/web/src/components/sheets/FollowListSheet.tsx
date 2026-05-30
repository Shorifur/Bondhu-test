'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@bondhu/shared-types';

export function FollowListSheet() {
  const { sheets, closeSheet } = useUIStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const sheet = sheets['followList'];
  const isOpen = sheet?.isOpen;
  const data = sheet?.data as { userId: string; type: 'followers' | 'following' } | undefined;

  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
  const [followedSet, setFollowedSet] = useState<Set<string>>(new Set());

  const { data: listData, isLoading } = useQuery({
    queryKey: ['follow-list', data?.userId, data?.type],
    queryFn: async () => {
      if (!data) return [];
      const res = await api.get<{ data: UserProfile[]; meta?: unknown }>(
        `users/${data.userId}/${data.type}`,
      );
      const raw = res.data as any;
      return Array.isArray(raw) ? raw : raw?.data ?? [];
    },
    enabled: !!data,
  });

  const followUser = useMutation({
    mutationFn: async (targetId: string) => {
      await api.post(`users/${targetId}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-list'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const unfollowUser = useMutation({
    mutationFn: async (targetId: string) => {
      await api.post(`users/${targetId}/unfollow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-list'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleFollowToggle = async (targetId: string) => {
    const isFollowing = followedSet.has(targetId);
    setFollowLoading((prev) => ({ ...prev, [targetId]: true }));
    try {
      if (isFollowing) {
        await unfollowUser.mutateAsync(targetId);
        setFollowedSet((prev) => {
          const next = new Set(prev);
          next.delete(targetId);
          return next;
        });
      } else {
        await followUser.mutateAsync(targetId);
        setFollowedSet((prev) => new Set(prev).add(targetId));
      }
    } finally {
      setFollowLoading((prev) => ({ ...prev, [targetId]: false }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeSheet('followList')}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-w-2xl mx-auto h-[70vh] flex flex-col"
          >
            <div className="p-4 border-b">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold capitalize flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {data?.type}
                </h3>
                <button onClick={() => closeSheet('followList')} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-bondhu-green" />
                </div>
              ) : listData?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                listData?.map((profile: UserProfile) => {
                  const isMe = user?.id === profile.userId;
                  const isFollowing = followedSet.has(profile.userId);
                  return (
                    <div key={profile.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-sm">
                            {profile.displayName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{profile.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{profile.handle}</p>
                      </div>
                      {!isMe && (
                        <button
                          onClick={() => handleFollowToggle(profile.userId)}
                          disabled={followLoading[profile.userId]}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                            isFollowing
                              ? 'bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive'
                              : 'bg-bondhu-green text-white border-bondhu-green',
                          )}
                        >
                          {followLoading[profile.userId] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isFollowing ? (
                            'Following'
                          ) : (
                            'Follow'
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
