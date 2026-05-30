'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUIStore } from '@/stores/uiStore';
import { postService } from '@/services/post.service';
import { cn } from '@/lib/utils';

export function EditPostSheet() {
  const { sheets, closeSheet, addToast } = useUIStore();
  const queryClient = useQueryClient();
  const sheet = sheets['editPost'];
  const isOpen = sheet?.isOpen;
  const data = sheet?.data as { postId: string; content: string; createdAt: string } | undefined;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (data) {
      setContent(data.content || '');
      const created = new Date(data.createdAt);
      const deadline = new Date(created.getTime() + 30 * 60 * 1000);
      setExpired(new Date() > deadline);
    }
  }, [data]);

  const handleSave = async () => {
    if (!data || expired) return;
    setLoading(true);
    try {
      await postService.update(data.postId, { content });
      addToast('Post updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      closeSheet('editPost');
    } catch (err: any) {
      addToast(err?.message || 'Failed to update post', 'error');
    } finally {
      setLoading(false);
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
            onClick={() => closeSheet('editPost')}
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
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Edit Post</h3>
                <button onClick={() => closeSheet('editPost')} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {expired ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="font-medium">Edit window expired</p>
                  <p className="text-sm mt-1">Posts can only be edited within 30 minutes of creation.</p>
                </div>
              ) : (
                <>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    maxLength={2800}
                    className="w-full px-4 py-3 bg-background border rounded-2xl resize-none focus:outline-none focus:border-bondhu-green text-sm"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={loading || !content.trim()}
                      className={cn(
                        'px-6 py-2 rounded-xl font-medium text-sm transition-colors',
                        content.trim() && !loading
                          ? 'bg-bondhu-green text-white'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
