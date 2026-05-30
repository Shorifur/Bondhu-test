'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Repeat, Quote, Send, Users, Link2, Share, Download, EyeOff } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { cn, generateShareLink } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function ShareDrawer() {
  const router = useRouter();
  const { sheets, closeSheet } = useUIStore();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [showCommunityPicker, setShowCommunityPicker] = useState(false);
  const sheet = sheets['share'];
  const isOpen = sheet?.isOpen;
  const data = sheet?.data as { postId: string } | undefined;

  const handleCopyLink = async () => {
    if (!data) return;
    const link = generateShareLink(data.postId);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRepost = async () => {
    if (!data) return;
    try {
      await api.post('posts', { sharedPostId: data.postId });
      closeSheet('share');
    } catch (err: any) {
      alert(err.message || 'Failed to repost');
    }
  };

  const handleQuote = () => {
    if (!data) return;
    closeSheet('share');
    router.push(`/create?quote=${data.postId}`);
  };

  const handleSendDM = () => {
    if (!data) return;
    closeSheet('share');
    router.push(`/chat?share=${data.postId}`);
  };

  const handlePostToCommunity = () => {
    if (!data) return;
    setShowCommunityPicker(true);
  };

  const handleNativeShare = async () => {
    if (!data) return;
    const url = generateShareLink(data.postId);
    if (navigator.share) {
      await navigator.share({ url, title: 'Check out this post on Bondhu' });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveMedia = async () => {
    if (!data) return;
    // Fetch post to get media
    try {
      const res = await api.get(`posts/${data.postId}`);
      const post = (res as any).data;
      const media = post?.mediaAssets?.[0];
      if (media?.url) {
        const response = await fetch(media.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = media.url.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('No media to save');
      }
    } catch {
      alert('Failed to save media');
    }
  };

  const handleHide = async () => {
    if (!data) return;
    try {
      await api.patch(`posts/${data.postId}`, { hiddenFromTimeline: true });
      closeSheet('share');
    } catch (err: any) {
      alert(err.message || 'Failed to hide post');
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
            onClick={() => closeSheet('share')}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-w-2xl mx-auto"
          >
            <div className="p-4 space-y-4">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto" />

              <h3 className="font-semibold text-lg">Share</h3>

              {!showCommunityPicker ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">Internal</p>
                    <ShareButton icon={Repeat} label="Repost Instantly" onClick={handleRepost} />
                    <ShareButton icon={Quote} label="Quote Share" onClick={handleQuote} />
                    <ShareButton icon={Send} label="Send via Direct Message" onClick={handleSendDM} />
                    <ShareButton icon={Users} label="Post to Community" onClick={handlePostToCommunity} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">External</p>
                    <ShareButton icon={Link2} label={copied ? 'Copied!' : 'Copy Link'} onClick={handleCopyLink} />
                    <ShareButton icon={Share} label="Native Share Sheet" onClick={handleNativeShare} />
                    <ShareButton icon={Download} label="Save Media" onClick={handleSaveMedia} />
                    <ShareButton icon={EyeOff} label="Hide from Timeline" onClick={handleHide} />
                  </div>
                </>
              ) : (
                <CommunityPicker postId={data?.postId || ''} onClose={() => setShowCommunityPicker(false)} onDone={() => closeSheet('share')} />
              )}

              <button
                onClick={() => closeSheet('share')}
                className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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

function ShareButton({ icon: Icon, label, onClick }: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left"
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function CommunityPicker({ postId, onClose, onDone }: { postId: string; onClose: () => void; onDone: () => void }) {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useState(() => {
    if (!loaded) {
      api.get('communities?limit=50').then((res) => {
        setCommunities((res as any).data?.data || []);
        setLoaded(true);
      });
    }
  });

  const shareToCommunity = async (communityId: string) => {
    await api.post(`communities/${communityId}/posts`, { content: '', mediaAssetIds: [] });
    onDone();
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">Select Community</p>
      {communities.map((c) => (
        <button key={c.id} onClick={() => shareToCommunity(c.id)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">{c.name[0]}</div>
          <span className="font-medium text-sm">{c.name}</span>
        </button>
      ))}
      <button onClick={onClose} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground">Back</button>
    </div>
  );
}
