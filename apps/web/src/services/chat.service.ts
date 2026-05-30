import { api } from '@/lib/api';
import type { Conversation, DirectMessage } from '@bondhu/shared-types';

export const chatService = {
  async getConversations() {
    return api.get<{ data: Conversation[] }>('conversations');
  },

  async createConversation(participantId: string) {
    return api.post<Conversation>('conversations', { participantId });
  },

  async getConversation(id: string) {
    return api.get<Conversation>(`conversations/${id}`);
  },

  async getMessages(conversationId: string, page = 1, limit = 50) {
    return api.get<{ data: DirectMessage[]; meta: { page: number; limit: number; total: number } }>(
      `conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    );
  },

  async sendMessage(conversationId: string, data: {
    content?: string;
    type?: string;
    mediaUrl?: string;
    replyToId?: string;
    voiceDuration?: number;
  }) {
    return api.post<DirectMessage>(`conversations/${conversationId}/messages`, { conversationId, ...data });
  },

  async markRead(conversationId: string) {
    return api.post(`conversations/${conversationId}/read`);
  },

  async forwardMessage(messageId: string, targetConversationId: string) {
    return api.post<DirectMessage>(`messages/${messageId}/forward`, { targetConversationId });
  },

  async deleteMessage(messageId: string) {
    return api.delete(`messages/${messageId}`);
  },
};
