import { api } from '@/lib/api';
import type { Post, ReactionType, Comment } from '@bondhu/shared-types';

export interface FeedResponse {
  data: Post[];
  meta: { page: number; limit: number; total?: number; hasMore: boolean };
}

export const postService = {
  async create(data: {
    content?: string;
    contentMarkdown?: boolean;
    locationName?: string;
    districtId?: number;
    subDistrictId?: number;
    visibility?: string;
    mediaAssetIds?: string[];
    hashtagNames?: string[];
  }) {
    return api.post<Post>('posts', data);
  },

  async getById(id: string) {
    return api.get<Post>(`posts/${id}`);
  },

  async update(id: string, data: { content?: string }) {
    return api.patch<Post>(`posts/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`posts/${id}`);
  },

  async pin(id: string) {
    return api.post<{ isPinned: boolean }>(`posts/${id}/pin`);
  },

  async archive(id: string) {
    return api.post<{ isArchived: boolean }>(`posts/${id}/archive`);
  },

  async getForYouFeed(page = 1, limit = 20) {
    return api.get<FeedResponse>(`posts/feed/foryou?page=${page}&limit=${limit}`);
  },

  async getLatestFeed(page = 1, limit = 20) {
    return api.get<FeedResponse>(`posts/feed/latest?page=${page}&limit=${limit}`);
  },

  async getLocalFeed(page = 1, limit = 20) {
    return api.get<FeedResponse>(`posts/feed/local?page=${page}&limit=${limit}`);
  },

  async getUserPosts(userId: string, page = 1, limit = 20) {
    return api.get<FeedResponse>(`posts/user/${userId}?page=${page}&limit=${limit}`);
  },

  async react(id: string, type: ReactionType) {
    return api.post(`posts/${id}/react`, { type });
  },

  async removeReaction(id: string, type: ReactionType) {
    return api.delete(`posts/${id}/react/${type}`);
  },

  async bookmark(id: string) {
    return api.post(`posts/${id}/bookmark`);
  },

  async removeBookmark(id: string) {
    return api.delete(`posts/${id}/bookmark`);
  },

  async share(id: string) {
    return api.post(`posts/${id}/share`);
  },

  async getBookmarkedPosts(page = 1, limit = 20) {
    return api.get<FeedResponse>(`posts/bookmarks?page=${page}&limit=${limit}`);
  },
};
