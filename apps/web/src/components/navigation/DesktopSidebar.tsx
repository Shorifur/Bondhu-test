'use client';

import { useRouter, usePathname } from 'next/navigation';
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
  BondhuLogo,
} from '@/components/ui/CulturalIcons';

const navItems = [
  { icon: HomeIcon, label: 'Home', labelBn: 'হোম', href: '/' },
  { icon: ExploreIcon, label: 'Explore', labelBn: 'অন্বেষণ', href: '/explore' },
  { icon: CreateIcon, label: 'Create', labelBn: 'তৈরি', href: '/create', isAction: true },
  { icon: ProfileIcon, label: 'Profile', labelBn: 'প্রোফাইল', href: '/profile' },
  { icon: null, label: '', href: '', isDivider: true },
  { icon: ShopIcon, label: 'Shop', labelBn: 'দোকান', href: '/shop' },
  { icon: BazaarIcon, label: 'Bazaar', labelBn: 'বাজার', href: '/bazaar' },
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

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full avatar-ring">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5B21B6] to-[#0D9488] flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0F0A1E] font-bangla">বন্ধু ব্যবহারকারী</h4>
            <p className="text-xs text-[#6B5E8A] font-medium">@bondhu_user</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-4 pt-3 border-t border-[#DDD6F3]/50">
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F0A1E]">১২৫</p>
            <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">পোস্ট</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F0A1E]">৮৯০</p>
            <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">অনুসারী</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F0A1E]">৩৪৫</p>
            <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">অনুসরণ</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="glass-card p-2 space-y-0.5">
        {navItems.map((item, index) => {
          if (item.isDivider) {
            return <div key={`divider-${index}`} className="my-2 border-t border-[#DDD6F3]/50 mx-3" />;
          }

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white font-bold transition-all hover:brightness-110 active:scale-[0.98] my-1"
                style={{ background: 'linear-gradient(135deg, #5B21B6, #0D9488)' }}
              >
                <item.icon size={20} />
                <div>
                  <span className="text-[14px]">{item.label}</span>
                  <span className="block text-[10px] font-bangla opacity-80 -mt-0.5">{item.labelBn}</span>
                </div>
              </button>
            );
          }

          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
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
