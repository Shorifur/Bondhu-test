'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { X, Pin, Archive, Edit3, Trash2, Bell, Eye, VolumeX, UserMinus, Flag, ArrowLeft, Globe, Lock, Users, Loader2 } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { postService } from '@/services/post.service';
import { cn } from '@/lib/utils';

export function PostMenuSheet() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { sheets, closeSheet, openSheet, addToast } = useUIStore();
  const { user } = useAuthStore();
  const sheet = sheets['postMenu'];
  const isOpen = sheet?.isOpen;
  const data = sheet?.data as { postId: string; userId: string; content: string; createdAt: string } | undefined;
  const isAuthor = user?.id === data?.userId;

  const [subMenu, setSubMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, payload?: any) => {
    if (!data) return;
    try {
      setLoading(action);
      switch (action) {
        case 'pin':
          await postService.pin(data.postId);
          addToast('Post pinned', 'success');
          break;
        case 'archive':
          await postService.archive(data.postId);
          addToast('Post archived', 'success');
          break;
        case 'delete':
          await postService.delete(data.postId);
          addToast('Post deleted', 'success');
          queryClient.invalidateQueries({ queryKey: ['user-posts'] });
          queryClient.invalidateQueries({ queryKey: ['feed'] });
          break;
        case 'visibility':
          await api.patch(`posts/${data.postId}`, { visibility: payload });
          addToast('Visibility updated', 'success');
          queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
          queryClient.invalidateQueries({ queryKey: ['user-posts'] });
          queryClient.invalidateQueries({ queryKey: ['feed'] });
          break;
        case 'mute':
          await api.post(`users/${data.userId}/mute`);
          addToast('User muted', 'success');
          break;
        case 'unfollow':
          await api.post(`users/${data.userId}/unfollow`);
          addToast('Unfollowed user', 'success');
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          break;
        case 'report':
          openSheet('report', { targetId: data.postId, type: 'POST' });
          break;
        case 'edit':
          openSheet('editPost', { postId: data.postId, content: data.content, createdAt: data.createdAt });
          break;
        case 'notify':
          addToast('Notification settings updated', 'success');
          break;
      }
    } catch (err: any) {
      addToast(err?.message || 'Action failed', 'error');
    } finally {
      setLoading(null);
      if (action !== 'edit' && action !== 'report') {
        closeSheet('postMenu');
        setSubMenu(null);
      }
    }
  };

  const visibilityOptions = [
    { value: 'PUBLIC', label: 'Public', icon: Globe, desc: 'Anyone can see' },
    { value: 'FOLLOWERS', label: 'Followers', icon: Users, desc: 'Only followers' },
    { value: 'PRIVATE', label: 'Private', icon: Lock, desc: 'Only you' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { closeSheet('postMenu'); setSubMenu(null); }}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-w-2xl mx-auto"
          >
            <div className="p-4 space-y-2">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />

              {subMenu === 'delete' && (
                <div className="space-y-3">
                  <button onClick={() => setSubMenu(null)} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <p className="text-sm text-muted-foreground">Are you sure you want to delete this post? This action cannot be undone.</p>
                  <SheetButton
                    icon={Trash2}
                    label="Confirm Delete"
                    destructive
                    onClick={() => handleAction('delete')}
                    isLoading={loading === 'delete'}
                  />
                </div>
              )}

              {subMenu === 'visibility' && (
                <div className="space-y-2">
                  <button onClick={() => setSubMenu(null)} className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  {visibilityOptions.map((opt) => (
                    <SheetButton
                      key={opt.value}
                      icon={opt.icon}
                      label={opt.label}
                      onClick={() => handleAction('visibility', opt.value)}
                      isLoading={loading === 'visibility'}
                    />
                  ))}
                </div>
              )}

              {!subMenu && (
                <>
                  {isAuthor && (
                    <div className="space-y-1">
                      <SheetButton icon={Pin} label="Pin to Top of Profile" onClick={() => handleAction('pin')} isLoading={loading === 'pin'} />
                      <SheetButton icon={Archive} label="Move to Private Archive" onClick={() => handleAction('archive')} isLoading={loading === 'archive'} />
                      <SheetButton icon={Edit3} label="Edit Post (30 min window)" onClick={() => handleAction('edit')} isLoading={loading === 'edit'} />
                      <SheetButton icon={Trash2} label="Delete Post" destructive onClick={() => setSubMenu('delete')} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <SheetButton icon={Bell} label="Toggle Comment Notifications" onClick={() => handleAction('notify')} isLoading={loading === 'notify'} />
                    <SheetButton icon={Eye} label="Change Visibility" onClick={() => setSubMenu('visibility')} />
                    <SheetButton icon={VolumeX} label="Mute Future Updates" onClick={() => handleAction('mute')} isLoading={loading === 'mute'} />
                    <SheetButton icon={UserMinus} label="Unfollow User" onClick={() => handleAction('unfollow')} isLoading={loading === 'unfollow'} />
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border">
                    <SheetButton icon={Flag} label="Report Content" destructive onClick={() => handleAction('report')} />
                  </div>
                </>
              )}

              <button
                onClick={() => { closeSheet('postMenu'); setSubMenu(null); }}
                className="w-full py-3 mt-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetButton({ icon: Icon, label, destructive, onClick, isLoading }: {
  icon: React.ElementType;
  label: string;
  destructive?: boolean;
  onClick: () => void;
  isLoading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left disabled:opacity-50',
        destructive ? 'text-destructive' : 'text-foreground',
      )}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
      <span className="font-medium">{label}</span>
    </button>
  );
}
