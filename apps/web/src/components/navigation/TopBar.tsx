'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { BondhuLogo, ExploreIcon, SettingsIcon } from '@/components/ui/CulturalIcons';

export function TopBar() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#F0EBF8] lg:left-64"
      style={{ backgroundColor: 'rgba(248,247,255,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="h-14 flex items-center justify-between px-4">
        {/* Left: Logo */}
        <button onClick={() => router.push('/')} className="flex items-center gap-2 shrink-0">
          <BondhuLogo size={30} />
          <span className="font-bold text-[17px] hidden sm:block" style={{ color: '#5B8C7F' }}>Bondhu</span>
        </button>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Explore / Compass */}
          <button
            onClick={() => router.push('/explore')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F0EEF8] transition-colors"
          >
            <ExploreIcon size={20} className="text-[#7C3AED]" />
          </button>

          {/* Settings / Gear */}
          <button
            onClick={() => router.push('/settings')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F0EEF8] transition-colors"
          >
            <SettingsIcon size={20} className="text-[#7C3AED]" />
          </button>

          {/* User Avatar */}
          <button
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E8E4F5] ml-1"
          >
            {user?.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#A78BFA] to-[#5EEAD4] text-white text-xs font-bold">
                {user?.profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
