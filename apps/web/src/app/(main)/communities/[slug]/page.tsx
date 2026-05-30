'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MapPin, Shield, FileText, ArrowLeft,
  UserPlus, UserMinus, Lock, Globe, Settings, Crown, ShieldCheck, Volume2, ClipboardList, Pin,
  Pencil, Ban, Trash2, CheckCircle, XCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn, formatNumber, formatTimeAgo } from '@/lib/utils';
import { districts, getDistrictById } from '@/lib/districts';
import type { Community } from '@bondhu/shared-types';

const roleBadges: Record<string, { label: string; color: string; icon: any }> = {
  OWNER: { label: 'Owner', color: 'bg-yellow-100 text-yellow-700', icon: Crown },
  ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-700', icon: ShieldCheck },
  MODERATOR: { label: 'Moderator', color: 'bg-blue-100 text-blue-700', icon: Shield },
  SECRETARY: { label: 'Secretary', color: 'bg-purple-100 text-purple-700', icon: ClipboardList },
  MEMBER: { label: 'Member', color: 'bg-gray-100 text-gray-600', icon: Users },
  MUTED: { label: 'Muted', color: 'bg-orange-100 text-orange-700', icon: Volume2 },
};

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'rules' | 'about'>('posts');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState('');
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [postContent, setPostContent] = useState('');

  const { data: communityRes, isLoading } = useQuery({
    queryKey: ['community', slug],
    queryFn: async () => {
      const res = await api.get<Community>(`communities/${slug}`);
      return res.data ?? null;
    },
    enabled: !!slug,
  });

  const community = communityRes as Community | null;

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!community) throw new Error('No community');
      return api.post(`communities/${community.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      addToast('Joined community', 'success');
    },
    onError: () => addToast('Failed to join', 'error'),
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!community) throw new Error('No community');
      return api.post(`communities/${community.id}/leave`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      addToast('Left community', 'success');
    },
    onError: (err: any) => addToast(err?.response?.data?.message || 'Failed to leave', 'error'),
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!community) throw new Error('No community');
      await api.post(`communities/${community.id}/transfer`, { newOwnerId: transferTargetId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      addToast('Ownership transferred', 'success');
      setShowTransferModal(false);
    },
    onError: () => addToast('Transfer failed', 'error'),
  });

  const addRuleMutation = useMutation({
    mutationFn: async () => {
      if (!community) throw new Error('No community');
      await api.post(`communities/${community.id}/rules`, { title: newRuleTitle, description: newRuleDesc });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      setNewRuleTitle('');
      setNewRuleDesc('');
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!community) throw new Error('No community');
      await api.post(`communities/${community.id}/posts`, { content: postContent });
    },
    onSuccess: () => {
      setPostContent('');
      queryClient.invalidateQueries({ queryKey: ['community-posts', community?.id] });
    },
  });

  const { data: postsData } = useQuery<{ data: any[] }>({
    queryKey: ['community-posts', community?.id],
    queryFn: async () => {
      if (!community) return { data: [] };
      const res = await api.get(`communities/${community.id}/posts?limit=50`);
      return (res as any).data || { data: [] };
    },
    enabled: !!community?.id,
  });

  const { data: membersData } = useQuery<{ data: any[] }>({
    queryKey: ['community-members', community?.id],
    queryFn: async () => {
      if (!community) return { data: [] };
      const res = await api.get(`communities/${community.id}/members?limit=100`);
      return (res as any).data || { data: [] };
    },
    enabled: !!community?.id && (activeTab === 'members' || activeTab === 'about'),
  });

  const { data: joinRequests } = useQuery<{ data: any[] }>({
    queryKey: ['community-join-requests', community?.id],
    queryFn: async () => {
      if (!community) return { data: [] };
      const res = await api.get(`communities/${community.id}/join-requests`);
      return (res as any).data || { data: [] };
    },
    enabled: !!community?.id && showAdminPanel,
  });

  if (isLoading) {
    return (
      <div className="py-4 space-y-4">
        <div className="h-32 bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Community not found</p>
        <button
          onClick={() => router.push('/communities')}
          className="mt-4 px-4 py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium"
        >
          Back to Communities
        </button>
      </div>
    );
  }

  const isMember = !!community.myRole;
  const canJoin = !isMember && community.joinType === 'OPEN';
  const isAdmin = community.myRole === 'OWNER' || community.myRole === 'ADMIN';
  const isOwner = community.myRole === 'OWNER';
  const isModerator = community.myRole === 'MODERATOR';
  const isSecretary = community.myRole === 'SECRETARY';
  const canManage = isAdmin || isModerator || isSecretary;
  const district = getDistrictById(community.districtId || 0);

  const handleLeave = () => {
    if (isOwner) {
      setShowTransferModal(true);
      return;
    }
    leaveMutation.mutate();
  };

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/communities')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold truncate">{community.name}</h1>
      </div>

      {/* Cover Photo */}
      <div className="relative h-40 rounded-2xl overflow-hidden">
        {community.coverUrl ? (
          <img src={community.coverUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bondhu-green/20 to-bondhu-blue/20" />
        )}
        {/* Profile Picture */}
        <div className="absolute -bottom-6 left-4">
          <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background flex items-center justify-center overflow-hidden">
            {community.avatarUrl ? (
              <img src={community.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-10 h-10 text-bondhu-green" />
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg">{community.name}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatNumber(community.memberCount)} members
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {formatNumber(community.postCount)} posts
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {canJoin && (
              <button
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className="px-4 py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium hover:bg-bondhu-green-dark transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Join
              </button>
            )}

            {isMember && !isOwner && (
              <button
                onClick={handleLeave}
                disabled={leaveMutation.isPending}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1.5"
              >
                <UserMinus className="w-4 h-4" />
                Leave
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setShowTransferModal(true)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1.5"
              >
                <UserMinus className="w-4 h-4" />
                Leave
              </button>
            )}

            {canManage && (
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm transition-colors',
                  showAdminPanel ? 'bg-bondhu-green text-white' : 'bg-muted'
                )}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{community.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-lg">
            <MapPin className="w-3 h-3" />
            {community.category}
          </span>
          {district && (
            <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-lg">
              <MapPin className="w-3 h-3" />
              {district.nameBn}
            </span>
          )}
          <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-lg">
            {community.visibility === 'PUBLIC' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {community.visibility}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-lg">
            <Shield className="w-3 h-3" />
            {community.joinType.replace(/_/g, ' ')}
          </span>
          {community.isVerified && (
            <span className="px-2 py-1 bg-bondhu-green/10 text-bondhu-green rounded-lg font-medium">
              Verified
            </span>
          )}
          {isMember && community.myRole && (
            <span className={cn('px-2 py-1 rounded-lg font-medium text-xs', roleBadges[community.myRole]?.color)}>
              {roleBadges[community.myRole]?.label}
            </span>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && canManage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border rounded-2xl p-4 space-y-4 overflow-hidden"
          >
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin Panel
            </h3>

            {/* Add Rule */}
            {(isAdmin || isSecretary) && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Add Rule</p>
                <input
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  placeholder="Rule title"
                  className="w-full px-3 py-2 bg-muted rounded-xl text-sm"
                />
                <textarea
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 bg-muted rounded-xl text-sm resize-none"
                />
                <button
                  onClick={() => addRuleMutation.mutate()}
                  disabled={!newRuleTitle.trim()}
                  className="px-4 py-2 bg-bondhu-green text-white rounded-xl text-xs font-medium"
                >
                  Add Rule
                </button>
              </div>
            )}

            {/* Join Requests */}
            {isSecretary && joinRequests?.data && joinRequests.data.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Join Requests ({joinRequests.data.length})</p>
                {joinRequests.data.map((req: any) => (
                  <div key={req.id} className="flex items-center justify-between p-2 bg-muted rounded-xl">
                    <span className="text-sm">{req.user?.profile?.displayName}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => api.post(`communities/${community.id}/approve/${req.userId}`, {}).then(() => queryClient.invalidateQueries({ queryKey: ['community-join-requests', community.id] }))}
                        className="p-1 bg-green-100 text-green-700 rounded-lg"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => api.post(`communities/${community.id}/reject/${req.userId}`, {}).then(() => queryClient.invalidateQueries({ queryKey: ['community-join-requests', community.id] }))}
                        className="p-1 bg-red-100 text-red-700 rounded-lg"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Manage Members */}
            {isAdmin && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Manage Members</p>
                <p className="text-xs text-muted-foreground">Go to Members tab to change roles</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Ownership Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-lg">Transfer Ownership</h3>
              <p className="text-sm text-muted-foreground">
                You must transfer ownership before leaving. Enter the user ID of the new owner:
              </p>
              <input
                value={transferTargetId}
                onChange={(e) => setTransferTargetId(e.target.value)}
                placeholder="New owner user ID"
                className="w-full px-4 py-2 bg-muted rounded-xl text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => transferMutation.mutate()}
                  disabled={!transferTargetId}
                  className="flex-1 py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2 bg-muted rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'posts' as const, label: 'Posts', icon: FileText },
          { id: 'members' as const, label: 'Members', icon: Users },
          { id: 'rules' as const, label: 'Rules', icon: Shield },
          { id: 'about' as const, label: 'About', icon: MapPin },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors',
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

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {isMember && (
            <div className="bg-card border rounded-2xl p-3">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write something to this community..."
                rows={2}
                className="w-full px-3 py-2 bg-muted rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => createPostMutation.mutate()}
                  disabled={!postContent.trim() || createPostMutation.isPending}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-medium',
                    postContent.trim() ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  Post
                </button>
              </div>
            </div>
          )}
          {!isMember && (
            <div className="text-center py-4 bg-muted/50 rounded-2xl">
              <p className="text-sm text-muted-foreground">Join this community to post</p>
            </div>
          )}
          {postsData?.data?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No posts yet</p>
            </div>
          )}
          {postsData?.data?.map((post: any) => (
            <div key={post.id} className="bg-card border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                  {post.user?.profile?.displayName?.[0] || 'U'}
                </div>
                <span className="text-xs font-medium">{post.user?.profile?.displayName}</span>
                <span className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt, 'bn')}</span>
              </div>
              <p className="text-sm">{post.content || 'No content'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-2">
          {membersData?.data?.map((member: any) => {
            const badge = roleBadges[member.role] || roleBadges.MEMBER;
            const BadgeIcon = badge.icon;
            return (
              <div key={member.id} className="flex items-center justify-between p-3 bg-card border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                    {member.user?.profile?.avatarUrl ? (
                      <img src={member.user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      member.user?.profile?.displayName?.[0] || 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.user?.profile?.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{member.user?.profile?.handle}</p>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1', badge.color)}>
                  <BadgeIcon className="w-3 h-3" />
                  {badge.label}
                </span>
              </div>
            );
          })}
          {(!membersData?.data || membersData.data.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No members yet</p>
            </div>
          )}
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          {((community as any).rules || []).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No rules set</p>
            </div>
          )}
          {((community as any).rules || []).map((rule: any, i: number) => (
            <div key={rule.id} className="bg-card border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-bondhu-green/10 text-bondhu-green flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <h4 className="font-semibold text-sm">{rule.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-8">{rule.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="space-y-4">
          <div className="bg-card border rounded-2xl p-4 space-y-3">
            <h4 className="font-semibold text-sm">Description</h4>
            <p className="text-sm text-muted-foreground">{community.description || 'No description'}</p>
          </div>
          <div className="bg-card border rounded-2xl p-4 space-y-3">
            <h4 className="font-semibold text-sm">Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{community.category}</span>
              </div>
              {district && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">District</span>
                  <span className="font-medium">{district.nameBn}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium">{community.visibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Join Type</span>
                <span className="font-medium">{community.joinType.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-4 space-y-3">
            <h4 className="font-semibold text-sm">Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">{community.memberCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts</span>
                <span className="font-medium">{community.postCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatTimeAgo(community.createdAt, 'bn')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
