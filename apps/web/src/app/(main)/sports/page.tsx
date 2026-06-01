'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SportIcon } from '@/components/ui/CulturalIcons';
import { fetchLiveMatches } from '@/lib/api/cricket';
import { fetchFootballMatches } from '@/lib/api/football';
import type { FootballMatch } from '@/lib/api/football';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const sportTabs = [
  { id: 'cricket' as const, label: 'Cricket', labelBn: 'ক্রিকেট', icon: '🏏' },
  { id: 'football' as const, label: 'Football', labelBn: 'ফুটবল', icon: '⚽' },
];

/* ── Shared Match Card ── */
function MatchCard({ match, type }: { match: any; type: 'cricket' | 'football' }) {
  const isFootball = type === 'football';
  const isLive = isFootball ? match.status === 'LIVE' || match.status === 'HT' : match.status === 'LIVE';
  const statusLabel = isFootball
    ? (match.status === 'LIVE' ? `${match.minute || ''}' LIVE` : match.status === 'HT' ? 'HT' : match.status === 'FT' ? 'Full Time' : 'Upcoming')
    : match.status;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'bg-white rounded-2xl p-4 mb-2 shadow-sm',
        isLive && 'border border-red-200'
      )}
      style={{ boxShadow: isLive ? '0 2px 12px rgba(220,38,38,0.08)' : '0 2px 12px rgba(167,139,250,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide',
            isLive ? 'bg-red-50 text-red-600' : 'bg-[#F5F2FF] text-[#6B5E8A]'
          )}>
            {isLive ? '● Live' : statusLabel}
          </span>
        </div>
        <span className="text-[10px] text-[#9B8FC0] truncate max-w-[60%]">
          {match.matchType || match.league}{match.venue ? ` · ${match.venue}` : ''}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{match.team1.flag}</span>
            <span className="font-semibold text-sm text-[#0F0A1E]">{match.team1.code}</span>
          </div>
          <span className="text-lg font-bold text-[#0F0A1E]">
            {match.team1.score ?? (isFootball ? '0' : '-')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{match.team2.flag}</span>
            <span className="font-semibold text-sm text-[#0F0A1E]">{match.team2.code}</span>
          </div>
          <span className="text-lg font-bold text-[#0F0A1E]">
            {match.team2.score ?? (isFootball ? '0' : '-')}
          </span>
        </div>
      </div>

      {/* Result line */}
      {match.result && <p className="mt-2 text-[11px] text-[#5B21B6] font-medium font-bangla">{match.result}</p>}
    </motion.div>
  );
}

/* ── Empty State ── */
function EmptyState({ sport }: { sport: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <span className="text-5xl mb-4">{sport === 'cricket' ? '🏏' : '⚽'}</span>
      <h3 className="font-extrabold text-[#0F0A1E] font-bangla mb-2">
        {sport === 'cricket' ? 'কোনো লাইভ ম্যাচ নেই' : 'কোনো লাইভ ম্যাচ নেই'}
      </h3>
      <p className="text-sm text-[#6B5E8A] font-bangla mb-1">
        {sport === 'cricket' ? 'বাংলাদেশের ক্রিকেট ম্যাচ চলছে না' : 'কোনো ফুটবল ম্যাচ চলছে না'}
      </p>
      <p className="text-xs text-[#9B8FC0]">
        {sport === 'cricket' ? 'Check back during Bangladesh matches!' : 'Check back during match hours!'}
      </p>
    </div>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-white rounded-2xl border border-[#F5F2FF]" />
      ))}
    </div>
  );
}

export default function SportsPage() {
  const [activeSport, setActiveSport] = useState<'cricket' | 'football'>('cricket');

  // Cricket data
  const { data: cricketData, isLoading: cricketLoading } = useQuery({
    queryKey: ['cricket-matches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 60000,
    staleTime: 30000,
    enabled: activeSport === 'cricket',
  });

  // Football data
  const { data: footballData, isLoading: footballLoading } = useQuery({
    queryKey: ['football-matches'],
    queryFn: fetchFootballMatches,
    refetchInterval: 60000,
    staleTime: 30000,
    enabled: activeSport === 'football',
  });

  const cricketMatches = (cricketData || []) as any[];
  const footballMatches = (footballData || []) as FootballMatch[];

  const cricketLive = cricketMatches.filter((m) => m.status === 'LIVE');
  const cricketResults = cricketMatches.filter((m) => m.status === 'RESULT');
  const cricketUpcoming = cricketMatches.filter((m) => m.status === 'UPCOMING');

  const footballLive = footballMatches.filter((m) => m.status === 'LIVE' || m.status === 'HT');
  const footballResults = footballMatches.filter((m) => m.status === 'FT');
  const footballUpcoming = footballMatches.filter((m) => m.status === 'NS');

  const isLoading = activeSport === 'cricket' ? cricketLoading : footballLoading;
  const liveCount = activeSport === 'cricket' ? cricketLive.length : footballLive.length;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <SportIcon size={24} className="text-[#DC2626]" />
          <div>
            <h1 className="font-bold text-[15px] font-bangla leading-tight">খেলাধুলা</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Sports</p>
          </div>
          {liveCount > 0 && (
            <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[10px] font-bold text-red-600">{liveCount} LIVE</span>
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSport(tab.id)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap',
                activeSport === tab.id
                  ? 'bondhu-gradient text-white'
                  : 'bg-[#F5F2FF] text-[#6B5E8A] border border-[#DDD6F3]'
              )}
            >
              <span>{tab.icon}</span>
              <span className="font-bangla">{tab.labelBn}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ═══════ CRICKET TAB ═══════ */}
      <AnimatePresence mode="wait">
        {activeSport === 'cricket' && (
          <motion.div
            key="cricket"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {cricketLoading && <LoadingSkeleton />}

            {!cricketLoading && cricketMatches.length === 0 && <EmptyState sport="cricket" />}

            {!cricketLoading && cricketMatches.length > 0 && (
              <>
                {/* Live */}
                {cricketLive.length > 0 && (
                  <div className="px-4 pt-3">
                    <h2 className="text-sm font-bold mb-2 font-bangla flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                      Live Now — সরাসরি
                    </h2>
                    {cricketLive.map((match) => <MatchCard key={match.id} match={match} type="cricket" />)}
                  </div>
       