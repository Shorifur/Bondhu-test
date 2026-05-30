import { create } from 'zustand';
import type { Conversation, DirectMessage } from '@bondhu/shared-types';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, DirectMessage[]>;
  typingUsers: Record<string, string[]>;
  onlineUsers: Set<string>;
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (conversation: Partial<Conversation> & { id: string }) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: DirectMessage[]) => void;
  addMessage: (conversationId: string, message: DirectMessage) => void;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),

  setConversations: (conversations) => set({ conversations }),

  updateConversation: (updated) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c,
      ),
    })),

  setActiveConversation: (activeConversationId) => set({ activeConversationId }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

  setTyping: (conversationId, userId, isTyping) =>
    set((state) => {
      const current = new Set(state.typingUsers[conversationId] || []);
      if (isTyping) current.add(userId);
      else current.delete(userId);
      return {
        typingUsers: { ...state.typingUsers, [conversationId]: Array.from(current) },
      };
    }),

  setOnlineUsers: (users) => set({ onlineUsers: new Set(users) }),
  addOnlineUser: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(userId);
      return { onlineUsers: next };
    }),
  removeOnlineUser: (userId) =>
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(userId);
      return { onlineUsers: next };
    }),
}));
