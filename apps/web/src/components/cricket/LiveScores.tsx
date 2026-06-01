'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CricketIcon } from '@/components/ui/CulturalIcons';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches } from '@/lib/api/cricket';

export interface CricketMatch {
  id: string;
  series: string;
  team1: { name: string; code: string; flag: string; score: string; overs: string };
  team2: { name: string; code: string; flag: string; score: string; overs: string };
  status: 'LIVE' | 'UPCOMING' | 'RESULT';
  matchType: string;
  venue: string;
  date: string;
  result?: string;
}

interface LiveScoresProps {
  compact?: boolean;
}

export default function LiveScores({ compact = false }: LiveScoresProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'results'>('all');

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['cricket-matches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const lastUpdated = new Date();

  const filtered = matches.filter((m: CricketMatch) => {
    if (activeTab === 'live') return m.status === 'LIVE';
    if (activeTab === 'upcoming') return m.status === 'UPCOMING';
    if (activeTab === 'results') return m.status === 'RESULT';
    return true;
  });

  const tabs = [
    { key: 'all' as const, label: 'All' },
    { key: 'live' as const, label: 'Live' },
    { key: 'upcoming' as const, label: 'Upcoming' },
    { key: 'results' as const, label: 'Results' },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-sm', compact ? 'p-3' : 'p-4')}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#F5F2FF] rounded animate-pulse" />
          <div className="h-4 bg-[#F5F2FF] rounded w-24 animate-pulse" />
        </div>
        <div className="space-y-2 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-[#F5F2FF] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm', compact ? 'p-3' : 'p-4')}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CricketIcon size={20} className="text-purple-600" />
          <h3 className="font-semibold text-[#1a1a2e] text-sm">Cricket Live</h3>
          {matches.some((m: CricketMatch) => m.status === 'LIVE') && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#9B8FC0]">
          {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all',
              activeTab === tab.key ? 'gradient-chip-active' : 'gradient-chip-inactive'
            )}
          >
            {tab.label}
            {tab.key === 'live' && matches.some((m: CricketMatch) => m.status === 'LIVE') && (
              <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((match: CricketMatch) => (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl p-3 bg-[#FAFAFF] border border-[#E8E4F5]"
            >
              {/* Series name */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#9B8FC0] uppercase tracking-wide">
                  {match.matchType} · {match.series.replace(/Bangladesh vs /, '')}
                </span>
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  match.status === 'LIVE' && 'bg-red-50 text-red-600',
                  match.status === 'UPCOMING' && 'bg-blue-50 text-blue-600',
                  match.status === 'RESULT' && 'bg-green-50 text-green-600'
                )}>
                  {match.status}
                </span>
              </div>

              {/* Teams */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.team1.flag}</span>
                    <span className="text-sm font-semibold text-[#1a1a2e]">{match.team1.code}</span>
                  </div>
                  {match.team1.score && (
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1a1a2e]">{match.team1.score}</span>
                      <span className="text-[10px] text-[#9B8FC0] ml-1">({match.team1.overs})</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.team2.flag}</span>
                    <span className="text-sm font-semibold text-[#1a1a2e]">{match.team2.code}</span>
                  </div>
                  {match.team2.score && (
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1a1a2e]">{match.team2.score}</span>
                      <span className="text-[10px] text-[#9B8FC0] ml-1">({match.team2.overs})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Result / Status */}
              {match.result && <p className="mt-2 text-[11px] text-purple-600 font-medium">{match.result}</p>}
              {match.status === 'UPCOMING' && (
                <p className="mt-2 text-[11px] text-[#9B8FC0]">
                  {new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State — shows when no API key or no matches */}
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl">🏏</span>
            <p className="text-sm text-[#6B5E8A] font-bangla mt-2">
              {matches.length === 0 ? 'কোনো ম্যাচ পাওয়া যায়নি' : `No ${activeTab} matches`}
            </p>
            {matches.length === 0 && (
              <p className="text-[11px] text-[#9B8FC0] mt-1 font-bangla">
                বাংলাদেশের ম্যাচের সময় আবার চেক করুন
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
