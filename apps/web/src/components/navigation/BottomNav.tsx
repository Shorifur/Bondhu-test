'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ExploreIcon,
  CreateIcon,
  ProfileIcon,
  MoreIcon,
} from '@/components/ui/CulturalIcons';
import MoreDrawer from './MoreDrawer';

const mainNavItems = [
  { icon: HomeIcon, label: 'Home', href: '/' },
  { icon: ExploreIcon, label: 'Explore', href: '/explore' },
  { icon: CreateIcon, label: 'Create', href: '/create', isFab: true },
  { icon: ProfileIcon, label: 'Profile', href: '/profile' },
  { icon: MoreIcon, label: 'More', href: '#more', isMore: true },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleClick = (item: typeof mainNavItems[0]) => {
    if (item.isMore) {
      setMoreOpen(true);
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8E4F5] bottom-nav-shadow safe-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);

            if (item.isFab) {
              return (
                <button
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className="relative -mt-6 flex flex-col items-center"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center shadow-lg',
                      active
                        ? 'bondhu-gradient-purple text-white'
                        : 'bg-gradient-to-br from-purple-400 to-teal-300 text-white'
                    )}
                  >
                    <item.icon size={24} />
                  </motion.div>
                  <span className={cn(
                    'text-[10px] mt-0.5 font-medium',
                    active ? 'text-purple-600' : 'text-[#9B8FC0]'
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full"
              >
                <item.icon
                  size={22}
                  className={cn(
                    'transition-colors',
                    active ? 'text-purple-600' : 'text-[#9B8FC0]'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    active ? 'text-purple-600' : 'text-[#9B8FC0]'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* More drawer */}
      <MoreDrawer isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
