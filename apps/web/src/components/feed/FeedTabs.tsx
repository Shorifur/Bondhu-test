'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeedTabsProps {
  tabs: { id: string; label: string; labelBn: string }[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function FeedTabs({ tabs, activeTab, onChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="feed-tab-indicator"
              className="absolute inset-0 bg-card rounded-lg shadow-sm border"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex flex-col items-center leading-tight">
            <span>{tab.label}</span>
            <span className="text-[10px] font-bangla opacity-70">{tab.labelBn}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
