// @ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { useChatStore } from '@/stores/chatStore';
import { formatTimeAgo } from '@/lib/utils';
import type { Conversation } from '@bondhu/shared-types';

export default function ChatInboxPage() {
  const router = useRouter();
  const setConversations = useChatStore((s) => s.setConversations);

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get<Conversation[] | { data: Conversation[]; meta?: unknown }>('conversations');
      const raw = res.data as any;
      const list = Array.isArray(raw) ? raw : raw?.data ?? [];
      setConversations(list);
      return list as Conversation[];
    },
  });

  const conversationList = Array.isArray(conversations)
    ? conversations
    : (conversations as any)?.data ?? [];

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-bold px-1">Messages</h1>

      <div className="space-y-1">
        {conversationList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No messages yet</p>
          </div>
        )}

        {conversationList.map((conv: Conversation, i: number) => {
          const otherParticipant = conv.participants?.find((p) => p.userId !== conv.participants?.[0]?.userId);
          const profile = otherParticipant?.user;
          const isOnline = false; // TODO: from presence

          return (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-left"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden border border-border">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                      {profile?.displayName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-bondhu-green border-2 border-background rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate">{profile?.displayName || 'Unknown'}</span>
                  {conv.lastMessageAt && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(conv.lastMessageAt, 'bn')}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage?.isDeleted ? 'Message deleted' : conv.lastMessage?.content || 'No messages'}
                  </p>
                  {(conv as any).unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-bondhu-green text-white text-xs font-bold rounded-full">
                      {(conv as any).unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
