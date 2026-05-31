'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  ExploreIcon,
  CreateIcon,
  ProfileIcon,
  ShopIcon,
  BazaarIcon,
  JobsIcon,
  SportIcon,
  LeaderboardIcon,
  SOSIcon,
  PointsIcon,
  SettingsIcon,
  AddaIcon,
  BondhuLogo,
} from '@/components/ui/CulturalIcons';

const navItems = [
  { icon: HomeIcon, label: 'Home', labelBn: 'হোম', href: '/' },
  { icon: ExploreIcon, label: 'Explore', labelBn: 'অন্বেষণ', href: '/explore' },
  { icon: CreateIcon, label: 'Create', labelBn: 'তৈরি', href: '/create' },
  { icon: ProfileIcon, label: 'Profile', labelBn: 'প্রোফাইল', href: '/profile' },
  { icon: null, label: '', href: '', isDivider: true },
  { icon: ShopIcon, label: 'Shop', labelBn: 'দোকান', href: '/shop' },
  { icon: BazaarIcon, label: 'Bazaar', labelBn: 'বাজার', href: '/bazaar' },
  { icon: AddaIcon, label: 'Adda', labelBn: 'আড্ডা', href: '/adda' },
  { icon: JobsIcon, label: 'Jobs', labelBn: 'চাকরি', href: '/jobs' },
  { icon: SportIcon, label: 'Sports', labelBn: 'খেলাধুলা', href: '/sports' },
  { icon: LeaderboardIcon, label: 'Leaderboard', labelBn: 'লিডারবোর্ড', href: '/leaderboard' },
  { icon: PointsIcon, label: 'Points', labelBn: 'পয়েন্ট', href: '/points' },
  { icon: SOSIcon, label: 'SOS', labelBn: 'জরুরি', href: '/sos' },
  { icon: SettingsIcon, label: 'Settings', labelBn: 'সেটিংস', href: '/settings' },
];

export function DesktopSidebar() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { user } = useAuthStore();

  const displayName = user?.profile?.displayName || user?.phoneNumber || 'বন্ধু ব্যবহারকারী';
  const handle = user?.profile?.handle || 'user';
  const avatarUrl = user?.profile?.avatarUrl;

  return (
    <div className="space-y-4">
      {/* User Profile Card — Real Data + Clickable */}
      <button
        onClick={() => router.push('/profile')}
        className="glass-card p-4 w-full text-left hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full avatar-ring">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5B21B6] to-[#0D9488] flex items-center justify-center text-white font-bold text-sm">
                {displayName[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-[#0F0A1E] font-bangla truncate">{displayName}</h4>
            <p className="text-xs text-[#6B5E8A] font-medium truncate">@{handle}</p>
          </div>
        </div>

        {/* Real Stats from user object */}
        <div className="flex items-center justify-around mt-4 pt-3 border-t border-[#DDD6F3]/50">
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F0A1E]">{(user?.profile as any)?.postCount || 0}</p>
            <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">পোস্ট</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F0A1E]">{(user?.profile as any)?.followerCount || 0}</p>
            <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">অনুসারী</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F0A1E]">{(user?.profile as any)?.followingCount || 0}</p>
            <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">অনুসরণ</p>
          </div>
        </div>
      </button>

      {/* Navigation */}
      <nav className="glass-card p-2 space-y-0.5">
        {navItems.map((item, index) => {
          if (item.isDivider) {
            return <div key={`divider-${index}`} className="my-2 border-t border-[#DDD6F3]/50 mx-3" />;
          }

          const isActive = pathname === item.href;
          const Icon = item.icon!;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left',
                isActive
                  ? 'bg-[#EDE9FF] border-l-[3px] border-[#5B21B6] rounded-r-xl'
                  : 'hover:bg-[#F5F2FF] rounded-xl'
              )}
            >
              <Icon
                size={20}
                className={isActive ? 'text-[#5B21B6]' : 'text-[#4C3A8A]'}
              />
              <div>
                <span
                  className={cn(
                    'text-[14px] block',
                    isActive ? 'text-[#5B21B6] font-bold' : 'text-[#0F0A1E] font-semibold'
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    'block text-[11px] font-bangla font-medium -mt-0.5',
                    isActive ? 'text-[#5B21B6]' : 'text-[#6B5E8A]'
                  )}
                >
                  {item.labelBn}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
