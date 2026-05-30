'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Video, Send, Mic, ImageIcon, DollarSign } from 'lucide-react';
import { chatService } from '@/services/chat.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useWebSocketContext } from '@/components/providers/WebSocketProvider';
import { formatTimeAgo, cn } from '@/lib/utils';
import type { DirectMessage, Conversation } from '@bondhu/shared-types';

export default function ChatWindowPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const { user } = useAuthStore();
  const openSheet = useUIStore((s) => s.openSheet);
  const { sendMessage: wsSendMessage, startTyping, stopTyping, joinConversation, leaveConversation } = useWebSocketContext();
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatService.getConversation(conversationId).then((r) => r.data as Conversation),
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId, 1, 50).then((r) => r.data?.data || []),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      // Try WebSocket first, fallback to REST
      wsSendMessage(conversationId, content, 'TEXT');
      // Also persist via REST for reliability
      await chatService.sendMessage(conversationId, { content, type: 'TEXT' });
    },
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const markRead = useMutation({
    mutationFn: () => chatService.markRead(conversationId),
  });

  useEffect(() => {
    joinConversation(conversationId);
    markRead.mutate();
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation]);

  const handleInputChange = (value: string) => {
    setContent(value);
    startTyping(conversationId);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => stopTyping(conversationId), 2000);
  };

  const otherUser = conversation?.participants?.find((p) => p.userId !== user?.id);
  const profile = otherUser?.user;
  const typingUsers = useAuthStore.getState().user?.id
    ? [] // Get from chatStore in real implementation
    : [];

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b glass-panel shrink-0">
        <button onClick={() => router.push('/chat')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-muted overflow-hidden border border-border">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-sm">
              {profile?.displayName?.[0] || 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{profile?.displayName}</p>
          <p className="text-xs text-muted-foreground">@{profile?.handle}</p>
        </div>
        <button className="p-2 hover:bg-muted rounded-full">
          <Phone className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-muted rounded-full">
          <Video className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm',
                  isMe
                    ? 'bg-bondhu-green text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm',
                )}
              >
                {msg.isDeleted ? (
                  <span className="italic opacity-60">Message deleted</span>
                ) : (
                  <>
                    {msg.content}
                    {msg.mediaUrl && (
                      <img src={msg.mediaUrl} alt="" className="mt-2 rounded-lg max-h-48 object-cover" />
                    )}
                  </>
                )}
                <div className={cn('text-[10px] mt-1', isMe ? 'text-white/60' : 'text-muted-foreground')}>
                  {formatTimeAgo(msg.createdAt, 'bn')}
                  {isMe && msg.isRead && ' · Read'}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground">
          Typing...
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t bg-card shrink-0">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-full text-muted-foreground">
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onTouchStart={() => setIsRecording(true)}
            onTouchEnd={() => setIsRecording(false)}
            className={cn(
              'p-2 rounded-full transition-colors',
              isRecording ? 'bg-bondhu-red text-white' : 'hover:bg-muted text-muted-foreground',
            )}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            value={content}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && content.trim()) sendMessageMutation.mutate(); }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
          />
          <button
            onClick={() => openSheet('fintech', { conversationId, receiverId: otherUser?.userId })}
            className="p-2 hover:bg-muted rounded-full text-bondhu-green font-bold text-lg"
          >
            <DollarSign className="w-5 h-5" />
          </button>
          <button
            onClick={() => sendMessageMutation.mutate()}
            disabled={!content.trim() || sendMessageMutation.isPending}
            className={cn(
              'p-2.5 rounded-xl transition-colors',
              content.trim() ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
