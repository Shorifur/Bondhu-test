'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ENV } from '@/lib/env';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import { queryClient } from '@/lib/queryClient';
import type { DirectMessage, Conversation } from '@bondhu/shared-types';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { tokens, isAuthenticated, user } = useAuthStore();
  const addMessage = useChatStore((s) => s.addMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const addOnlineUser = useChatStore((s) => s.addOnlineUser);
  const removeOnlineUser = useChatStore((s) => s.removeOnlineUser);
  const updateConversation = useChatStore((s) => s.updateConversation);

  const connect = useCallback(() => {
    if (!tokens?.accessToken || !isAuthenticated) return;
    if (socketRef.current?.connected) return;

    const socket = io(ENV.WS_URL, {
      path: '/ws',
      auth: { token: tokens.accessToken },
      query: { token: tokens.accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('[WS] Connected');
      // Join all conversation rooms
      const conversations = useChatStore.getState().conversations;
      conversations.forEach((c) => {
        socket.emit('conversation:join', { conversationId: c.id });
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
    });

    let errorCount = 0;
    socket.on('connect_error', (err) => {
      errorCount++;
      // Only log first 3 errors to avoid console spam when API is offline
      if (errorCount <= 3) {
        console.warn('[WS] Connection error (is API running?):', err.message);
      }
    });

    // Presence
    socket.on('presence:broadcast', (data: { userId: string; status: string }) => {
      if (data.status === 'online') addOnlineUser(data.userId);
      else removeOnlineUser(data.userId);
    });

    // Typing
    socket.on('typing:start', (data: { conversationId: string; userId: string }) => {
      setTyping(data.conversationId, data.userId, true);
    });

    socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
      setTyping(data.conversationId, data.userId, false);
    });

    // Messages
    socket.on('message:received', (message: DirectMessage) => {
      addMessage(message.conversationId, message);
      // Invalidate queries for fresh data
      queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    socket.on('message:read', (data: { conversationId: string; userId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    // Feed real-time updates
    socket.on('post:created', (post: { userId: string }) => {
      if (post.userId !== user?.id) {
        queryClient.invalidateQueries({ queryKey: ['feed'] });
      }
    });

    // Call signaling
    socket.on('call:offer', (data: { callerId: string; sdp: string; conversationId: string }) => {
      // Forward to call UI handler
      window.dispatchEvent(new CustomEvent('ws:call:offer', { detail: data }));
    });

    socket.on('call:answer', (data: { calleeId: string; sdp: string }) => {
      window.dispatchEvent(new CustomEvent('ws:call:answer', { detail: data }));
    });

    socket.on('call:ice-candidate', (data: { senderId: string; candidate: RTCIceCandidateInit }) => {
      window.dispatchEvent(new CustomEvent('ws:call:ice-candidate', { detail: data }));
    });

    socket.on('call:end', () => {
      window.dispatchEvent(new CustomEvent('ws:call:end'));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [tokens?.accessToken, isAuthenticated, user?.id, addMessage, setTyping, addOnlineUser, removeOnlineUser]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string, type = 'TEXT') => {
    socketRef.current?.emit('message:send', { conversationId, content, type });
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:start', { conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:stop', { conversationId });
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('conversation:join', { conversationId });
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('conversation:leave', { conversationId });
  }, []);

  const sendCallSignal = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected: !!socketRef.current?.connected,
    emit,
    sendMessage,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    sendCallSignal,
  };
}
