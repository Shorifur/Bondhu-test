'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Radio, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches } from '@/lib/api/cricket';

export default function CricketPage() {
  const router = useRouter();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['cricket-matches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 60000,
  });

  const liveMatches = (matches || []).filter((m: any) => m.status === 'LIVE');
  const recentMatches = (matches || []).filter((m: any) => m.status === 'RESULT');
  const upcomingMatches = (matches || []).filter((m: any) => m.status === 'UPCOMING');

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.push('/sports')} className="p-2 -ml-2 hover:bg-[#F5F2FF] rounded-full">
            <ArrowLeft className="w-5 h-5 text-[#6B5E8A]" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D97706]" />
            <div>
              <h1 className="font-bold text-[15px] font-bangla leading-tight">ক্রিকেট লাইভ</h1>
              <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Cricket Live</p>
            </div>
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
      </header>

      {/* Loading */}
      {isLoading ? (
        <div className="px-4 pt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-[#F5F2FF]" />
          ))}
        </div>
      ) : (matches || []).length === 0 ? (
        /* Empty state when no matches */
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <span className="text-5xl mb-4">🏏</span>
          <h3 className="font-extrabold text-[#0F0A1E] font-bangla mb-2">কোনো লাইভ ম্যাচ নেই</h3>
          <p className="text-sm text-[#6B5E8A] font-bangla mb-2">এখন কোনো ক্রিকেট ম্যাচ চলছে না।</p>
          <p className="text-xs text-[#9B8FC0]">No live matches currently. Check back during Bangladesh matches!</p>
          <button
            onClick={() => router.push('/sports')}
            className="mt-6 px-6 py-3 text-white text-sm font-bold rounded-2xl font-bangla bondhu-gradient"
          >
            সব খেলা দেখুন
          </button>
        </div>
      ) : (
        <>
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <div className="px-4 pt-4">
              <h2 className="text-sm font-bold mb-3 font-bangla flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                সরাসরি — Live Now
              </h2>
              {liveMatches.map((match: any) => (
                <motion.div key={match.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-4 mb-3" style={{ border: '1px solid #FEE2E2' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wide">● Live</span>
                    <span className="text-[10px] text-[#9B8FC0]">{match.matchType} · {match.venue}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.team1.flag}</span>
                        <span className="font-semibold text-sm text-[#0F0A1E]">{match.team1.code}</span>
                      </div>
                      <span className="text-lg font-bold text-[#0F0A1E]">{match.team1.score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.team2.flag}</span>
                        <span className="font-semibold text-sm text-[#0F0A1E]">{match.team2.code}</span>
                      </div>
                      <span className="text-lg font-bold text-[#0F0A1E]">{match.team2.score}</span>
                    </div>
                  </div>
                  {match.result && <p className="mt-2 text-[11px] text-[#5B21B6] font-medium font-bangla">{match.result}</p>}
                </motion.div>
              ))}
            </div>
          )}

          {/* Recent Results */}
          {recentMatches.length > 0 && (
            <div className="px-4 pt-4">
              <h2 className="text-sm font-bold mb-3 font-bangla">সাম্প্রতিক ফলাফল</h2>
              {recentMatches.map((match: any) => (
                <div key={match.id} className="glass-card p-3 mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#9B8FC0]">{match.matchType}</span>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">RESULT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{match.team1.flag}</span>
                      <span className="text-sm font-semibold text-[#0F0A1E]">{match.team1.code}</span>
                      <span className="text-sm font-bold text-[#0F0A1E]">{match.team1.score}</span>
                    </div>
                    <span className="text-[10px] text-[#9B8FC0] font-bold">VS</span>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-sm font-bold text-[#0F0A1E]">{match.team2.score}</span>
                      <span className="text-sm font-semibold text-[#0F0A1E]">{match.team2.code}</span>
                      <span className="text-lg">{match.team2.flag}</span>
                    </div>
                  </div>
                  {match.result && <p className="mt-1.5 text-[11px] text-[#5B21B6] font-medium font-bangla">{match.result}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Upcoming */}
          {upcomingMatches.length > 0 && (
            <div className="px-4 pt-3 pb-4">
              <h2 className="text-sm font-bold mb-3 font-bangla">আসন্ন খেলা</h2>
              {upcomingMatches.map((match: any) => (
                <div key={match.id} className="glass-card p-3 mb-2">
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
          )}
        </>
      )}
    </div>
  );
}
