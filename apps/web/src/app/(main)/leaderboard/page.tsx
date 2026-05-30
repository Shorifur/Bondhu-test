'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Crown, Star, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { districts } from '@/lib/districts';

const levelConfig: Record<string, { label: string; labelBn: string; icon: any; color: string }> = {
  NEW_FRIEND: { label: 'New Friend', labelBn: 'নতুন বন্ধু', icon: Star, color: 'text-gray-500' },
  ACQUAINTANCE: { label: 'Acquaintance', labelBn: 'পরিচিত', icon: Medal, color: 'text-blue-500' },
  TRUSTED_FRIEND: { label: 'Trusted Friend', labelBn: 'বিশ্বস্ত বন্ধু', icon: Medal, color: 'text-purple-500' },
  STAR: { label: 'Star', labelBn: 'তারকা', icon: Trophy, color: 'text-yellow-500' },
  LEGEND: { label: 'Legend', labelBn: 'কিংবদন্তি', icon: Crown, color: 'text-red-500' },
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [districtId, setDistrictId] = useState('');

  const { data: leaderboard } = useQuery<{ data: any[] }>({
    queryKey: ['leaderboard', districtId],
    queryFn: async () => {
      const res = await api.get(`users/leaderboard?districtId=${districtId}&limit=50`);
      return (res as any).data || { data: [] };
    },
  });

  const users = leaderboard?.data || [];

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">বন্ধু পয়েন্ট</h1>
          <p className="text-xs text-muted-foreground">Bondhu Points Leaderboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <select
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm focus:outline-none"
        >
          <option value="">All Bangladesh</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.nameBn}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {users.map((user: any, index: number) => {
          const level = user.profile?.pointsLevel || 'NEW_FRIEND';
          const config = levelConfig[level] || levelConfig.NEW_FRIEND;
          const Icon = config.icon;
          const isTop3 = index < 3;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-2xl border',
                isTop3 ? 'bg-yellow-50 border-yellow-200' : 'bg-card border-border'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                index === 0 ? 'bg-yellow-400 text-white' :
                index === 1 ? 'bg-gray-300 text-white' :
                index === 2 ? 'bg-orange-300 text-white' :
                'bg-muted text-muted-foreground'
              )}>
                {index + 1}
              </div>
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
                {user.profile?.avatarUrl ? (
                  <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                    {user.profile?.displayName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.profile?.displayName}</p>
                <div className="flex items-center gap-1">
                  <Icon className={cn('w-3 h-3', config.color)} />
                  <span className={cn('text-xs', config.color)}>{config.labelBn}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">{user.profile?.bondhuPoints || 0}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </motion.div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No leaderboard data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
