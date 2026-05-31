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

const FOOTBALL_MATCHES = [
  { id: 'f1', league: 'Premier League', team1: { name: 'Man City', flag: '🔵', score: '2' }, team2: { name: 'Arsenal', flag: '🔴', score: '1' }, status: 'LIVE', time: '78\'' },
  { id: 'f2', league: 'La Liga', team1: { name: 'Real Madrid', flag: '⚪', score: '3' }, team2: { name: 'Barcelona', flag: '🔵', score: '2' }, status: 'RESULT', time: 'FT' },
];

export default function SportsPage() {
  const [activeSport, setActiveSport] = useState('cricket');

  const { data: cricketMatches } = useQuery({
    queryKey: ['cricket-matches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 60000,
  });

  const matches = cricketMatches || [];
  const liveMatches = matches.filter((m) => m.status === 'LIVE');

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <SportIcon size={24} className="text-[#DC2626]" />
          <div>
            <h1 className="font-bold text-[15px] text-[#2D1B69] font-bangla leading-tight">খেলাধুলা</h1>
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

      {/* Live Now Section */}
      {liveMatches.length > 0 && (
        <div className="px-4 pt-3">
          <h2 className="text-sm font-bold text-[#2D1B69] mb-2 flex items-center gap-1.5">
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
      <div className="px-4 pt-3">
        <h2 className="text-sm font-bold text-[#2D1B69] mb-2 font-bangla">সাম্প্রতিক ফলাফল</h2>
        {matches.filter((m) => m.status === 'RESULT').map((match) => (
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
      </div>

      {/* Upcoming */}
      <div className="px-4 pt-3 pb-4">
        <h2 className="text-sm font-bold text-[#2D1B69] mb-2 font-bangla">আসন্ন খেলা</h2>
        {matches.filter((m) => m.status === 'UPCOMING').map((match) => (
          <div key={match.id} className="bg-white rounded-2xl p-3 mb-2 shadow-sm" style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#9B8FC0]">{match.matchType}</span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">UPCOMING</span>
            </div>
            <div className="flex items-center justify-center gap-4 py-1">
              <div className="flex flex-col items-center">
                <span className="text-2xl">{match.team1.flag}</span>
                <span className="text-xs font-semibold mt-1">{match.team1.code}</span>
              </div>
              <span className="text-[10px] text-[#9B8FC0] font-bold">VS</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl">{match.team2.flag}</span>
                <span className="text-xs font-semibold mt-1">{match.team2.code}</span>
              </div>
            </div>
            <p className="text-center text-[11px] text-[#9B8FC0] mt-1">{match.venue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
