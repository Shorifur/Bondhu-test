'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CricketIcon } from '@/components/ui/CulturalIcons';

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

const MOCK_MATCHES: CricketMatch[] = [
  {
    id: '1',
    series: 'Bangladesh vs India - 2nd ODI',
    team1: { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', score: '246/7', overs: '48.2' },
    team2: { name: 'India', code: 'IND', flag: '🇮🇳', score: '0/0', overs: '0.0' },
    status: 'LIVE',
    matchType: 'ODI',
    venue: 'Sher-e-Bangla Stadium, Dhaka',
    date: '2026-05-31T14:00:00Z',
    result: 'Bangladesh opt to bat',
  },
  {
    id: '2',
    series: 'Bangladesh vs Pakistan - 1st T20I',
    team1: { name: 'Pakistan', code: 'PAK', flag: '🇵🇰', score: '189/5', overs: '20.0' },
    team2: { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', score: '142/8', overs: '18.4' },
    status: 'RESULT',
    matchType: 'T20I',
    venue: 'Zohur Ahmed Chowdhury Stadium, Chattogram',
    date: '2026-05-28T18:00:00Z',
    result: 'Pakistan won by 47 runs',
  },
  {
    id: '3',
    series: 'Bangladesh vs Sri Lanka - Test Match',
    team1: { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', score: '', overs: '' },
    team2: { name: 'Sri Lanka', code: 'SL', flag: '🇱🇰', score: '', overs: '' },
    status: 'UPCOMING',
    matchType: 'Test',
    venue: 'Sylhet International Stadium',
    date: '2026-06-05T04:00:00Z',
  },
];

export default function LiveScores({ compact = false }: LiveScoresProps) {
  const [matches, setMatches] = useState<CricketMatch[]>(MOCK_MATCHES);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'results'>('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In production: fetch from cricket API here
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = matches.filter((m) => {
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

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm', compact ? 'p-3' : 'p-4')}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CricketIcon size={20} className="text-purple-600" />
          <h3 className="font-semibold text-[#1a1a2e] text-sm">Cricket Live</h3>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
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
              activeTab === tab.key
                ? 'gradient-chip-active'
                : 'gradient-chip-inactive'
            )}
          >
            {tab.label}
            {tab.key === 'live' && matches.some((m) => m.status === 'LIVE') && (
              <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((match) => (
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
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    match.status === 'LIVE' && 'bg-red-50 text-red-600',
                    match.status === 'UPCOMING' && 'bg-blue-50 text-blue-600',
                    match.status === 'RESULT' && 'bg-green-50 text-green-600'
                  )}
                >
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
              {match.result && (
                <p className="mt-2 text-[11px] text-purple-600 font-medium">{match.result}</p>
              )}
              {match.status === 'UPCOMING' && (
                <p className="mt-2 text-[11px] text-[#9B8FC0]">
                  {new Date(match.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-6">
            <CricketIcon size={32} className="text-[#E8E4F5] mx-auto mb-2" />
            <p className="text-sm text-[#9B8FC0]">No {activeTab === 'all' ? '' : activeTab} matches</p>
          </div>
        )}
      </div>
    </div>
  );
}
