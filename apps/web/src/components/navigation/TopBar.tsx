'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, MessageCircle, Bell, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  unreadCount: number;
}

export function TopBar() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data: unreadMessageCount = 0 } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get<Conversation[]>('conversations');
      const conversations = res.data || [];
      return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    },
    refetchInterval: 30000,
  });

  const { data: unreadNotificationCount = 0 } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get<{ unreadCount: number }>('notifications');
      return res.data?.unreadCount || 0;
    },
    refetchInterval: 30000,
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-bondhu-green flex items-center justify-center">
            <span className="text-white font-bold text-sm">ব</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">Bondhu</span>
        </button>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0, width: '80%' }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: '80%' }}
                className="absolute inset-0 flex items-center"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/explore?q=${encodeURIComponent(query)}`);
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="Search..."
                  className="w-full px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
                />
                <button onClick={() => setSearchOpen(false)} className="absolute right-2 p-1 hover:bg-muted rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="truncate">Search people, posts, hashtags...</span>
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => router.push('/create')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="p-2 hover:bg-muted rounded-full transition-colors relative"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessageCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-bondhu-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => router.push('/notifications')}
            className="p-2 hover:bg-muted rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-bondhu-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="w-8 h-8 rounded-full bg-muted overflow-hidden border border-border"
          >
            {user?.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                {user?.profile?.displayName?.[0] || 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
