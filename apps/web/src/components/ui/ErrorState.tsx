'use client';

import { RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
}

export function ErrorState({ onRetry, title, subtitle }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <span className="text-5xl mb-4">😔</span>
      <h3 className="font-extrabold text-[#0F0A1E] font-bangla mb-2">
        {title || 'কিছু একটা ভুল হয়েছে'}
      </h3>
      <p className="text-sm text-[#6B5E8A] font-bangla mb-6">
        {subtitle || 'ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন।'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 text-white text-sm font-bold rounded-2xl font-bangla bondhu-gradient flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  );
}
