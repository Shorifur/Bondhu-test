import { api } from '@/lib/api';
import type { Story } from '@bondhu/shared-types';

export const storyService = {
  async getFeed() {
    return api.get<Story[]>('stories/feed');
  },

  async view(storyId: string) {
    return api.post(`stories/${storyId}/view`, {});
  },

  async delete(storyId: string) {
    return api.delete(`stories/${storyId}`);
  },
};
