'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { BondhuLogo, ExploreIcon, SettingsIcon } from '@/components/ui/CulturalIcons';
import { Search, Bell } from 'lucide-react';

export function TopBar() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: unreadCount } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async () => {
      try {
        const res = await api.get('notifications/unread-count');
        return (res.data as any)?.count || 0;
      } catch {
        return 0;
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#DDD6F3]/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <button onClick={() => router.push('/')} className="flex items-center gap-2.5 shrink-0">
          <BondhuLogo size={32} />
          <span className="font-bold text-lg text-[#0F0A1E] tracking-tight hidden sm:block">Bondhu</span>
        </button>

        {/* Center: Search (hidden on very small screens) */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="w-full glass-input flex items-center gap-2 px-3 py-2 rounded-xl">
            <Search className="w-4 h-4 text-[#9B8FC0] shrink-0" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              className="bg-transparent text-sm text-[#0F0A1E] placeholder:text-[#9B8FC0] outline-none w-full font-bangla"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => router.push('/explore')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F2FF] transition-colors"
          >
            <ExploreIcon size={20} className="text-[#5B21B6]" />
          </button>

          {/* Notification Bell — Universal */}
          <button
            onClick={() => router.push('/notifications')}
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F2FF] transition-colors"
          >
            <Bell className="w-5 h-5 text-[#5B21B6]" />
            {(unreadCount || 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {(unreadCount || 0) > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5F2FF] transition-colors"
          >
            <SettingsIcon size={20} className="text-[#4C3A8A]" />
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#DDD6F3] ml-1 avatar-ring"
          >
            {user?.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5B21B6] to-[#0D9488] text-white text-xs font-bold">
                {user?.profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
