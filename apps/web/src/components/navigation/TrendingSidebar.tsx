'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Briefcase, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

/* ── Inline SVG for Trending (avoids missing lucide icon) ── */
function TrendingIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 6l-9 9-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

/* ── Skeleton loader ── */
function SidebarSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-[#F5F2FF]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-[#F5F2FF] rounded w-3/4" />
            <div className="h-2 bg-[#F5F2FF] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Follow Button ── */
function FollowButton({ userId }: { userId: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); }}
      className="text-[10px] px-3 py-1 rounded-full bg-[#EDE9FF] text-[#5B21B6] font-bold hover:bg-[#5B21B6] hover:text-white transition-colors shrink-0"
    >
      Follow
    </button>
  );
}

export function TrendingSidebar() {
  const router = useRouter();
  const { user } = useAuthStore();

  // ── Real trending data ──
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ['trends'],
    queryFn: async () => {
      try {
        const res = await api.get('trends');
        const data = res?.data;
        if (Array.isArray(data)) return data;
        return (data as any)?.data || [];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // ── Real suggested users ──
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['user-suggestions'],
    queryFn: async () => {
      try {
        const res = await api.get('users/suggestions');
        const data = res?.data;
        if (Array.isArray(data)) return data;
        return (data as any)?.data || [];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const trends = (trendsData || []) as any[];
  const suggestions = (suggestionsData || []) as any[];

  return (
    <div className="space-y-4">
      {/* ═══════ Trending Topics ═══════ */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingIcon className="text-[#5B21B6]" size={16} />
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">ট্রেন্ডিং</h3>
        </div>

        {trendsLoading ? (
          <SidebarSkeleton count={4} />
        ) : trends.length > 0 ? (
          <div className="space-y-3">
            {trends.map((item: any, i: number) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => router.push(`/explore?q=${encodeURIComponent(item.tag || item.name || '')}`)}
              >
                <div>
                  <span className="text-[13px] text-[#5B21B6] font-semibold group-hover:underline font-bangla">{item.tag || item.name || '#' + (i + 1)}</span>
                  <p className="text-[10px] text-[#6B5E8A] font-medium">{item.postCount ? `${item.postCount} পোস্ট` : item.posts || 'জনপ্রিয়'}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#6B5E8A] font-medium font-bangla">
                  {item.category || 'ট্রেন্ড'}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9B8FC0] text-center py-4 font-bangla">এখনো কোনো ট্রেন্ড নেই</p>
        )}
      </div>

      {/* ═══════ Suggested Users ═══════ */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-[#0D9488]" />
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">অনুসরণ করুন</h3>
        </div>

        {suggestionsLoading ? (
          <SidebarSkeleton count={3} />
        ) : suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((u: any, i: number) => (
              <motion.div
                key={u.id || i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => router.push(`/profile/${u.handle}`)}
              >
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] flex items-center justify-center text-[#5B21B6] text-xs font-bold font-bangla">
                    {u.displayName?.[0] || u.name?.[0] || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#0F0A1E] truncate font-bangla">{u.displayName || u.name || 'User'}</p>
                  <p className="text-[10px] text-[#6B5E8A]">@{u.handle || 'user'}</p>
                </div>
                <FollowButton userId={u.id} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9B8FC0] text-center py-4 font-bangla">এখনো কোনো সাজেশন নেই</p>
        )}
      </div>

      {/* ═══════ Jobs CTA ═══════ */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-[#5B21B6]" />
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">চাকরি খুঁজুন</h3>
        </div>
        <p className="text-[11px] text-[#6B5E8A] mb-3 font-bangla">আপনার স্বপ্নের চাকরি খুঁজে পান আজই</p>
        <button
          onClick={() => router.push('/jobs')}
          className="w-full py-2 rounded-xl text-xs font-bold text-white bondhu-gradient shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          চাকরি পোর্টাল
        </button>
      </div>

      {/* ═══════ Footer ═══════ */}
      <div className="text-[10px] text-[#9B8FC0] text-center leading-relaxed px-2">
        <span className="font-medium">Bondhu</span> — বন্ধুত্বের নতুন মাত্রা
        <br />
        <span className="text-[9px]">© ২০২৫ বন্ধু অ্যাপ</span>
      </div>
    </div>
  );
}
