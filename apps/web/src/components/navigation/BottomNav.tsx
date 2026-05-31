'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  HomeIcon, ExploreIcon, CreateIcon, ProfileIcon, MoreIcon,
} from '@/components/ui/CulturalIcons';
import MoreBottomSheet from './MoreBottomSheet';

const navItems = [
  { icon: HomeIcon, label: 'Home', href: '/' },
  { icon: ExploreIcon, label: 'Explore', href: '/explore' },
  { icon: CreateIcon, label: 'Create', href: '/create', isCenter: true },
  { icon: ProfileIcon, label: 'Profile', href: '/profile' },
  { icon: MoreIcon, label: 'More', href: '#', isMore: true },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/profile') return pathname === '/profile' || pathname.startsWith('/profile/');
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDD6F3] safe-bottom bottom-nav-shadow"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-1">
          {navItems.map((item) => {
            const active = isActive(item.href);

            if (item.isCenter) {
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="relative -mt-5 flex flex-col items-center"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #5B21B6 0%, #0D9488 100%)',
                      boxShadow: '0 4px 20px rgba(91,33,182,0.4)',
                    }}
                  >
                    <item.icon size={24} className="text-white" />
                  </motion.div>
                </button>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isMore) setMoreOpen(true);
                  else router.push(item.href);
                }}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full relative"
              >
                <item.icon
                  size={22}
                  className={cn(
                    'transition-colors',
                    active ? 'text-[#5B21B6]' : 'text-[#4C3A8A]'
                  )}
                />
                <span className={cn(
                  'text-[10px] transition-colors',
                  active ? 'text-[#5B21B6] font-bold' : 'text-[#4C3A8A] font-semibold'
                )}>
                  {item.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-[#5B21B6]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <MoreBottomSheet isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
