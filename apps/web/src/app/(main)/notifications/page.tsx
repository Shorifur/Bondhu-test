// @ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { api } from '@/lib/api';
import { formatTimeAgo, cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  title?: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actor?: {
    profile?: {
      displayName: string;
      avatarUrl?: string | null;
      handle: string;
    };
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get<{ data: Notification[]; unreadCount: number }>('notifications');
      return res.data;
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await api.post('notifications/read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-4 h-4 text-bondhu-red" />;
      case 'COMMENT':
        return <MessageCircle className="w-4 h-4 text-bondhu-blue" />;
      case 'FOLLOW':
        return <UserPlus className="w-4 h-4 text-bondhu-green" />;
      case 'MENTION':
        return <AtSign className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="text-xs text-bondhu-green font-medium hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n, i) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => {
                if (n.actor?.profile?.handle) {
                  router.push(`/profile/${n.actor.profile.handle}`);
                }
              }}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors',
                n.isRead ? 'hover:bg-muted' : 'bg-bondhu-green/5 hover:bg-bondhu-green/10',
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center">
                  {n.actor?.profile?.avatarUrl ? (
                    <img src={n.actor.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm">{n.actor?.profile?.displayName?.[0] || 'U'}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border">
                  {getIcon(n.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{n.actor?.profile?.displayName || 'Someone'}</span>{' '}
                  {n.body}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatTimeAgo(n.createdAt, 'bn')}
                </p>
              </div>
              {!n.isRead && <span className="w-2 h-2 bg-bondhu-green rounded-full shrink-0" />}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
