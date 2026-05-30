'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Flag } from 'lucide-react';
import { api } from '@/lib/api';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const REPORT_REASONS = [
  { code: 'SPAM', label: 'Spam or misleading' },
  { code: 'HARASSMENT', label: 'Harassment or bullying' },
  { code: 'HATE_SPEECH', label: 'Hate speech' },
  { code: 'VIOLENCE', label: 'Violence or dangerous content' },
  { code: 'NUDITY', label: 'Nudity or sexual content' },
  { code: 'FAKE_NEWS', label: 'Misinformation' },
  { code: 'COPYRIGHT', label: 'Copyright infringement' },
  { code: 'OTHER', label: 'Other' },
];

export function ReportSheet() {
  const { sheets, closeSheet, addToast } = useUIStore();
  const sheet = sheets['report'];
  const isOpen = sheet?.isOpen;
  const data = sheet?.data as { targetId: string; type: 'POST' | 'USER' | 'COMMENT' } | undefined;

  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!data || !selectedReason) return;
    setLoading(true);
    try {
      await api.post('reports', {
        type: data.type,
        code: selectedReason,
        description: description.trim() || undefined,
        ...(data.type === 'POST' ? { postId: data.targetId } : data.type === 'COMMENT' ? { commentId: data.targetId } : { reportedUserId: data.targetId }),
      });
      addToast('Report submitted. Thank you for keeping our community safe.', 'success');
      setSelectedReason('');
      setDescription('');
      closeSheet('report');
    } catch (err: any) {
      addToast(err?.message || 'Failed to submit report', 'error');
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
            onClick={() => closeSheet('report')}
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
                <h3 className="font-semibold flex items-center gap-2">
                  <Flag className="w-4 h-4 text-destructive" />
                  Report Content
                </h3>
                <button onClick={() => closeSheet('report')} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.code}
                    onClick={() => setSelectedReason(reason.code)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm',
                      selectedReason === reason.code
                        ? 'border-bondhu-green bg-bondhu-green/5 font-medium'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details (optional)..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 bg-background border rounded-2xl resize-none focus:outline-none focus:border-bondhu-green text-sm"
              />

              <button
                onClick={handleSubmit}
                disabled={!selectedReason || loading}
                className={cn(
                  'w-full py-3 rounded-xl font-medium text-sm transition-colors',
                  selectedReason && !loading
                    ? 'bg-destructive text-white'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Submit Report'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
