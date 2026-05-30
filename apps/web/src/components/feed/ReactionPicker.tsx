'use client';

import { motion } from 'framer-motion';
import { ReactionType } from '@bondhu/shared-types';

const reactions: { type: ReactionType; emoji: string; label: string }[] = [
  { type: ReactionType.LIKE, emoji: '❤️', label: 'Like' },
  { type: ReactionType.LOVE, emoji: '💕', label: 'Love' },
  { type: ReactionType.LAUGH, emoji: '😂', label: 'Haha' },
  { type: ReactionType.SAD, emoji: '😢', label: 'Sad' },
  { type: ReactionType.WOW, emoji: '😮', label: 'Wow' },
  { type: ReactionType.ANGRY, emoji: '😠', label: 'Angry' },
];

interface ReactionPickerProps {
  onSelect: (type: ReactionType) => void;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-card border shadow-xl rounded-2xl flex items-center gap-1 z-50"
      onMouseLeave={onClose}
    >
      {reactions.map((r, i) => (
        <motion.button
          key={r.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          whileHover={{ scale: 1.3, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(r.type)}
          className="text-2xl p-1.5 hover:bg-muted rounded-xl transition-colors"
          title={r.label}
        >
          {r.emoji}
        </motion.button>
      ))}
    </motion.div>
  );
}
