'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LeaderboardIcon, MedalIcon, CrownIcon, FireIcon, TrendUpIcon, TrendDownIcon, PointsIcon } from '@/components/ui/CulturalIcons';

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

const BADGES = [
  { min: 0, max: 500, label: 'Bronze', labelBn: 'ব্রোঞ্জ', color: '#CD7F32' },
  { min: 501, max: 2000, label: 'Silver', labelBn: 'রৌপ্য', color: '#C0C0C0' },
  { min: 2001, max: 5000, label: 'Gold', labelBn: 'স্বর্ণ', color: '#FFD700' },
  { min: 5001, max: 10000, label: 'Diamond', labelBn: 'হীরা', color: '#7DD3FC' },
  { min: 10001, max: Infinity, label: 'Legend', labelBn: 'কিংবদন্তি', color: '#A78BFA' },
];

function getBadge(points: number) {
  return BADGES.find((b) => points >= b.min && points <= b.max) || BADGES[0];
}

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Rahim Uddin', district: 'Dhaka', points: 12450, weeklyChange: 320, avatar: '', posts: 156, friends: 234 },
  { rank: 2, name: 'Fatima Begum', district: 'Chattogram', points: 11200, weeklyChange: 280, avatar: '', posts: 142, friends: 198 },
  { rank: 3, name: 'Karim Hossain', district: 'Sylhet', points: 9870, weeklyChange: -45, avatar: '', posts: 128, friends: 176 },
  { rank: 4, name: 'Ayesha Akter', district: 'Rajshahi', points: 8230, weeklyChange: 190, avatar: '', posts: 98, friends: 145 },
  { rank: 5, name: 'Mohammad Ali', district: 'Khulna', points: 7650, weeklyChange: 150, avatar: '', posts: 87, friends: 134 },
  { rank: 6, name: 'Sultana Parvin', district: 'Barishal', points: 7120, weeklyChange: 95, avatar: '', posts: 76, friends: 112 },
  { rank: 7, name: 'Nasir Uddin', district: 'Rangpur', points: 6540, weeklyChange: 210, avatar: '', posts: 89, friends: 156 },
  { rank: 8, name: 'Tasnim Rahman', district: 'Mymensingh', points: 5980, weeklyChange: 120, avatar: '', posts: 65, friends: 98 },
  { rank: 9, name: 'Jamil Hossain', district: 'Dhaka', points: 5430, weeklyChange: -20, avatar: '', posts: 72, friends: 112 },
  { rank: 10, name: 'Nusrat Jahan', district: 'Chattogram', points: 4890, weeklyChange: 180, avatar: '', posts: 56, friends: 87 },
];

const filterTabs = [
  { id: 'week', label: 'This Week', labelBn: 'এই সপ্তাহ' },
  { id: 'month', label: 'This Month', labelBn: 'এই মাস' },
  { id: 'alltime', label: 'All Time', labelBn: 'সর্বকালীন' },
  { id: 'district', label: 'My District', labelBn: 'আমার জেলা' },
  { id: 'friends', label: 'My Friends', labelBn: 'বন্ধুরা' },
];

export default function LeaderboardPage() {
  const [activeFilter, setActiveFilter] = useState('week');
  const myPoints = 1235;
  const myRank = 47;
  const myBadge = getBadge(myPoints);

  // Top 3 for podium
  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const rest = LEADERBOARD_DATA.slice(3);

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <LeaderboardIcon size={24} className="text-[#D97706]" />
          <div>
            <h1 className="font-bold text-[15px] text-[#2D1B69] font-bangla leading-tight">লিডারবোর্ড</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Leaderboard</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {filterTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
              className={activeFilter === tab.id ? 'gradient-chip-active whitespace-nowrap' : 'gradient-chip-inactive whitespace-nowrap'}>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* My Rank Card */}
      <div className="mx-4 mt-3 p-4 rounded-2xl text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-4 -translate-x-4" />
        <div className="relative flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
            #{myRank}
          </div>
          <div>
            <p className="font-bold text-lg font-bangla">আপনার পয়েন্ট</p>
            <p className="text-white/80 text-sm">{myPoints.toLocaleString('bn-BD')} points</p>
            <div className="flex items-center gap-1 mt-1">
              <FireIcon size={14} className="text-amber-300" />
              <span className="text-xs text-white/80">7 day streak</span>
            </div>
          </div>
          <div className="ml-auto text-center">
            <CrownIcon size={24} className="text-amber-300 mx-auto" />
            <span className="text-[10px] font-medium mt-0.5 block" style={{ color: myBadge.color }}>{myBadge.label}</span>
          </div>
        </div>
        {/* Progress to next rank */}
        <div className="relative mt-3">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-amber-300 rounded-full" style={{ width: `${(myPoints / 2000) * 100}%` }} />
          </div>
          <p className="text-[10px] text-white/70 mt-1 font-bangla">Gold পেতে আর {2001 - myPoints} পয়েন্ট দরকার</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 pt-4">
        <h2 className="text-sm font-bold text-[#2D1B69] mb-3 font-bangla">শীর্ষ ৩</h2>
        <div className="flex items-end justify-center gap-3 pb-2">
          {/* 2nd */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full p-[2px] mb-2" style={{ background: `linear-gradient(135deg, ${RANK_COLORS[1]}, #E8E4F5)` }}>
              <div className="w-full h-full rounded-full bg-[#F0EEF8] flex items-center justify-center font-bold text-sm text-[#2D1B69]">
                {top3[1].name[0]}
              </div>
            </div>
            <div className="w-20 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-xl flex items-end justify-center pb-1">
              <span className="text-lg font-bold text-gray-500">2</span>
            </div>
            <p className="text-[10px] font-semibold mt-1 text-center leading-tight">{top3[1].name}</p>
            <p className="text-[10px] text-[#9B8FC0]">{top3[1].points.toLocaleString()}</p>
          </div>

          {/* 1st */}
          <div className="flex flex-col items-center -mt-2">
            <CrownIcon size={20} className="text-amber-400 mb-1" />
            <div className="w-16 h-16 rounded-full p-[2.5px] mb-2" style={{ background: `linear-gradient(135deg, ${RANK_COLORS[0]}, #FFE4A1)` }}>
              <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center font-bold text-lg text-[#2D1B69]">
                {top3[0].name[0]}
              </div>
            </div>
            <div className="w-24 h-20 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-xl flex items-end justify-center pb-1">
              <span className="text-2xl font-bold text-amber-700">1</span>
            </div>
            <p className="text-[11px] font-bold mt-1 text-center leading-tight">{top3[0].name}</p>
            <p className="text-[10px] font-bold text-[#7C3AED]">{top3[0].points.toLocaleString()}</p>
          </div>

          {/* 3rd */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full p-[2px] mb-2" style={{ background: `linear-gradient(135deg, ${RANK_COLORS[2]}, #F5E6D3)` }}>
              <div className="w-full h-full rounded-full bg-orange-50 flex items-center justify-center font-bold text-sm text-[#2D1B69]">
                {top3[2].name[0]}
              </div>
            </div>
            <div className="w-20 h-12 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-xl flex items-end justify-center pb-1">
              <span className="text-lg font-bold text-orange-700">3</span>
            </div>
            <p className="text-[10px] font-semibold mt-1 text-center leading-tight">{top3[2].name}</p>
            <p className="text-[10px] text-[#9B8FC0]">{top3[2].points.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="px-4 pt-4 space-y-2">
        <h2 className="text-sm font-bold text-[#2D1B69] font-bangla">র‍্যাঙ্কিং</h2>
        {rest.map((entry, i) => {
          const badge = getBadge(entry.points);
          const isUp = entry.weeklyChange > 0;
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
              style={{ boxShadow: '0 2px 8px rgba(167,139,250,0.05)' }}
            >
              <span className="text-sm font-bold text-[#9B8FC0] w-6 text-center">{entry.rank}</span>
              <div className="w-10 h-10 rounded-full bg-[#F0EEF8] flex items-center justify-center font-bold text-sm text-[#7C3AED]">
                {entry.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-[#1a1a2e] truncate">{entry.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>{badge.label}</span>
                </div>
                <p className="text-[10px] text-[#9B8FC0]">{entry.district} · {entry.posts} posts · {entry.friends} friends</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#2D1B69]">{entry.points.toLocaleString()}</p>
                <div className="flex items-center gap-0.5 justify-end">
                  {isUp ? <TrendUpIcon size={12} className="text-green-500" /> : <TrendDownIcon size={12} className="text-red-400" />}
                  <span className={`text-[10px] ${isUp ? 'text-green-500' : 'text-red-400'}`}>{isUp ? '+' : ''}{entry.weeklyChange}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
