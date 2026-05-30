'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Compass, PlusCircle, MessageSquare, User,
  Store, Briefcase, ShoppingBasket, Coffee, Trophy,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: PlusCircle, label: 'Create', href: '/create' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
  { icon: User, label: 'Profile', href: '/profile' },
];

const moreItems = [
  { icon: Store, label: 'Shop', href: '/shop' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: ShoppingBasket, label: 'Bazaar', href: '/bazaar' },
  { icon: Coffee, label: 'Adda', href: '/adda' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { setBottomNavIndex } = useUIStore();

  const activeIndex = navItems.findIndex((item) => {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  });

  // Check if any "more" item is active
  const moreActive = moreItems.some((item) => pathname.startsWith(item.href));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t safe-bottom">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={item.href}
                onClick={() => {
                  setBottomNavIndex(index);
                  router.push(item.href);
                }}
                className={cn(
                  'relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors',
                  isActive ? 'text-bondhu-green' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <item.icon className={cn('w-6 h-6', isActive && 'stroke-[2.5]')} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -bottom-2 w-1 h-1 rounded-full bg-bondhu-green"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary quick access bar for Bangladesh features */}
        <div className="flex items-center justify-around pb-2 -mt-1">
          {moreItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors',
                  isActive ? 'text-bondhu-green' : 'text-muted-foreground/60 hover:text-muted-foreground',
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[9px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
