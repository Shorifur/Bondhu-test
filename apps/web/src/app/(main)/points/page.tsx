// @ts-nocheck
'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { PointsIcon, FireIcon, CrownIcon } from '@/components/ui/CulturalIcons';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

const BADGES = [
  { min: 0, max: 500, label: 'Bronze', labelBn: 'ব্রোঞ্জ', color: '#CD7F32', icon: '🥉' },
  { min: 501, max: 2000, label: 'Silver', labelBn: 'রৌপ্য', color: '#C0C0C0', icon: '🥈' },
  { min: 2001, max: 5000, label: 'Gold', labelBn: 'স্বর্ণ', color: '#FFD700', icon: '🥇' },
  { min: 5001, max: 10000, label: 'Diamond', labelBn: 'হীরা', color: '#7DD3FC', icon: '💎' },
  { min: 10001, max: Infinity, label: 'Legend', labelBn: 'কিংবদন্তি', color: '#A78BFA', icon: '👑' },
];

export default function PointsPage() {
  const { user } = useAuthStore();

  // FIX 15: Real API data
  const { data: pointsData, isLoading } = useQuery({
    queryKey: ['my-points'],
    queryFn: async () => {
      const res = await api.get('users/me/points');
      return res.data as {
        total: number;
        rank: number;
        streak: number;
        weeklyPoints: number;
        history: Array<{ icon: string; action: string; actionEn: string; points: number; createdAt: string }>;
      } | null;
    },
    enabled: !!user?.id,
  });

  const myPoints = pointsData?.total || 0;
  const myStreak = pointsData?.streak || 0;
  const history = pointsData?.history || [];
  const currentBadge = BADGES.find((b) => myPoints >= b.min && myPoints <= b.max) || BADGES[0];
  const nextBadge = BADGES.find((b) => b.min > myPoints);
  const progress = nextBadge ? ((myPoints - currentBadge.min) / (nextBadge.min - currentBadge.min)) * 100 : 100;

  const EARN_MORE = [
    { action: 'পোস্ট তৈরি করুন', en: 'Create a post', points: 10 },
    { action: 'প্রোফাইল সম্পূর্ণ করুন', en: 'Complete profile', points: 50 },
    { action: 'পণ্য বিক্রি করুন', en: 'Sell a product', points: 25 },
    { action: 'চাকরির আবেদন করুন', en: 'Apply for a job', points: 5 },
    { action: 'মিসইনফরমেশন রিপোর্ট', en: 'Report misinformation', points: 15 },
    { action: 'SOS-এ সাহায্য করুন', en: 'Help via SOS', points: 30 },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <PointsIcon size={24} className="text-[#7C3AED]" />
          <div>
            <h1 className="font-bold text-[15px] font-bangla leading-tight">বন্ধু পয়েন্ট</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Bondhu Points</p>
          </div>
        </div>
      </header>

      {/* Points Hero */}
      <div className="mx-4 mt-4 p-5 rounded-3xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED, #5EEAD4)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
        <div className="relative text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-3">
            <PointsIcon size={32} className="text-white" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl font-bold">
            {isLoading ? '...' : myPoints.toLocaleString('bn-BD')}
          </motion.p>
          <p className="text-white/80 text-sm font-bangla mt-1">পয়েন্ট</p>

          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/20">
            <span className="text-base">{currentBadge.icon}</span>
            <span className="text-sm font-semibold">{currentBadge.labelBn}</span>
            <span className="text-xs text-white/70">({currentBadge.label})</span>
          </div>

          {myStreak > 0 && (
            <div className="flex items-center justify-center gap-1 mt-3">
              <FireIcon size={16} className="text-amber-300" />
              <span className="text-sm font-semibold text-amber-300">{myStreak} day streak</span>
            </div>
          )}

          {nextBadge && (
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }} className="h-full bg-amber-300 rounded-full" />
              </div>
              <p className="text-[11px] text-white/70 mt-1.5 font-bangla">{nextBadge.labelBn} পেতে আর {(nextBadge.min - myPoints).toLocaleString('bn-BD')} পয়েন্ট দরকার</p>
            </div>
          )}
        </div>
      </div>

      {/* Rank Badges Row */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide pb-1">
          {BADGES.map((badge) => {
            const isCurrent = badge.label === currentBadge.label;
            return (
              <div key={badge.label} className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[60px] ${isCurrent ? 'bg-white shadow-sm' : 'opacity-50'}`} style={isCurrent ? { boxShadow: '0 2px 8px rgba(167,139,250,0.1)' } : {}}>
                <span className="text-xl">{badge.icon}</span>
                <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: badge.color }}>{badge.labelBn}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity History */}
      <div className="px-4 pt-5">
        <h2 className="text-sm font-bold mb-3 font-bangla">পয়েন্ট ইতিহাস</h2>
        {history.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}>
            {history.map((activity, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < history.length - 1 ? 'border-b border-[#F5F3FF]' : ''}`}>
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a2e] font-bangla leading-tight">{activity.action}</p>
                  <p className="text-[10px] text-[#9B8FC0]">{activity.actionEn} · {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <span className="text-sm font-bold text-green-600">+{activity.points}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center text-[#9B8FC0] text-sm font-bangla">এখনো কোনো পয়েন্ট কার্যকলাপ নেই</div>
        )}
      </div>

      {/* How to Earn More */}
      <div className="px-4 pt-5 pb-6">
        <h2 className="text-sm font-bold mb-3 font-bangla">আরও পয়েন্ট অর্জন</h2>
        <div className="space-y-2">
          {EARN_MORE.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm" style={{ boxShadow: '0 2px 8px rgba(167,139,250,0.05)' }}>
              <div>
                <p className="text-sm font-medium text-[#1a1a2e] font-bangla">{item.action}</p>
                <p className="text-[10px] text-[#9B8FC0]">{item.en}</p>
              </div>
              <span className="text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>+{item.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
