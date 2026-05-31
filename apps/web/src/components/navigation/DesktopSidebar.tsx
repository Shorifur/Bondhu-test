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
    <aside
      className="fixed left-0 top-14 bottom-0 w-64 overflow-y-auto border-r border-[#DDD6F3] px-3 py-4 hidden lg:block"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <BondhuLogo size={32} />
        <span className="font-bold text-xl text-[#0F0A1E]">Bondhu</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5">
        {navItems.map((item) => {
          if (item.isDivider) {
            return <div key="divider" className="my-2 border-t border-[#F5F2FF]" />;
          }

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 mb-2"
                style={{ background: 'linear-gradient(135deg, #5B21B6, #0D9488)' }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          }

          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          const Icon = item.icon;

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
              {Icon && (
                <Icon
                  size={20}
                  className={isActive ? 'text-[#5B21B6]' : 'text-[#4C3A8A]'}
                />
              )}
              <div>
                <span
                  className={cn(
                    'text-[15px] block',
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
    </aside>
  );
}
