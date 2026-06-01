'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CricketIcon, SportIcon, ShareIcon } from '@/components/ui/CulturalIcons';
import { fetchLiveMatches } from '@/lib/api/cricket';
import { useQuery } from '@tanstack/react-query';

const sportTabs = [
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'ipl', label: 'IPL', icon: '🏆' },
  { id: 'bpl', label: 'BPL', icon: '🇧🇩' },
  { id: 'kabaddi', label: 'Kabaddi', icon: '🤼' },
];

// No mock data — all match data comes from fetchLiveMatches API

export default function SportsPage() {
  const [activeSport, setActiveSport] = useState('cricket');

  const { data: cricketMatches, isLoading } = useQuery({
    queryKey: ['cricket-matches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const matches = cricketMatches || [];
  const liveMatches = matches.filter((m: any) => m.status === 'LIVE');
  const resultMatches = matches.filter((m: any) => m.status === 'RESULT');
  const upcomingMatches = matches.filter((m: any) => m.status === 'UPCOMING');

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <SportIcon size={24} className="text-[#DC2626]" />
          <div>
            <h1 className="font-bold text-[15px] font-bold font-bangla leading-tight">খেলাধুলা</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Sports</p>
          </div>
          {liveMatches.length > 0 && (
            <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[10px] font-bold text-red-600">{liveMatches.length} LIVE</span>
            </span>
          )}
        </div>

        {/* Sport Tabs */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSport(tab.id)}
              className={activeSport === tab.id ? 'gradient-chip-active whitespace-nowrap' : 'gradient-chip-inactive whitespace-nowrap'}
            >
              <span className="mr-1">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Loading */}
      {isLoading && (
        <div className="px-4 pt-4 space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-[#F5F2FF]" />
          ))}
        </div>
      )}

      {/* Empty state when no API key or no matches */}
      {!isLoading && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <span className="text-5xl mb-4">🏏</span>
          <h3 className="font-extrabold text-[#0F0A1E] font-bangla mb-2">কোনো লাইভ ম্যাচ নেই</h3>
          <p className="text-sm text-[#6B5E8A] font-bangla mb-1">বাংলাদেশের ক্রিকেট ম্যাচ চলছে না</p>
          <p className="text-xs text-[#9B8FC0]">Check back during Bangladesh matches!</p>
        </div>
      )}

      {/* Live Now Section */}
      {!isLoading && liveMatches.length > 0 && (
        <div className="px-4 pt-3">
          <h2 className="text-sm font-bold font-bold mb-2 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            Live Now — সরাসরি
          </h2>
          {liveMatches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-4 mb-2 shadow-sm"
              style={{ boxShadow: '0 2px 12px rgba(220,38,38,0.08)', border: '1px solid #FEE2E2' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wide">● Live</span>
                <span className="text-[10px] text-[#9B8FC0]">{match.matchType} · {match.venue}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{match.team1.flag}</span>
                    <span className="font-semibold text-sm text-[#1a1a2e]">{match.team1.code}</span>
                  </div>
                  <span className="text-lg font-bold text-[#1a1a2e]">{match.team1.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{match.team2.flag}</span>
                    <span className="font-semibold text-sm text-[#1a1a2e]">{match.team2.code}</span>
                  </div>
                  <span className="text-lg font-bold text-[#1a1a2e]">{match.team2.score}</span>
                </div>
              </div>
              {match.result && <p className="mt-2 text-[11px] text-purple-600 font-medium">{match.result}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Results */}
      {!isLoading && resultMatches.length > 0 && <div className="px-4 pt-3">
        <h2 className="text-sm font-bold mb-2 font-bangla">সাম্প্রতিক ফলাফল</h2>
        {resultMatches.map((match: any) => (
          <div key={match.id} className="bg-white rounded-2xl p-3 mb-2 shadow-sm" style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#9B8FC0]">{match.matchType}</span>
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">RESULT</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{match.team1.flag}</span>
                <div>
                  <span className="text-sm font-semibold text-[#1a1a2e]">{match.team1.code}</span>
                  <span className="text-sm font-bold text-[#1a1a2e] ml-2">{match.team1.score}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#9B8FC0]">VS</span>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-sm font-bold text-[#1a1a2e] mr-2">{match.team2.score}</span>
                  <span className="text-sm font-semibold text-[#1a1a2e]">{match.team2.code}</span>
                </div>
                <span className="text-lg">{match.team2.flag}</span>
              </div>
            </div>
            {match.result && <p className="mt-1.5 text-[11px] text-purple-600 font-medium">{match.result}</p>}
          </div>
        ))}
      </div>}

      {/* Upcoming */}
      {!isLoading && upcomingMatches.length > 0 && <div className="px-4 pt-3 pb-4">
        <h2 className="text-sm font-bold mb-2 font-bangla">আসন্ন খেলা</h2>
        {upcomingMatches.map((match: any) => (
          <div key={match.id} className="bg-white rounded-2xl p-3 mb-2 shadow-sm" style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#9B8FC0]">{match.matchType}</span>
      