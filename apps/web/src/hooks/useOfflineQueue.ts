'use client';

import { useEffect, useCallback } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { getPendingActions, markActionSynced, markActionFailed, incrementRetryCount } from '@/lib/db';
import { api } from '@/lib/api';

export function useOfflineQueue() {
  const isOnline = useNetworkStatus();

  const syncQueue = useCallback(async () => {
    if (!isOnline) return;
    const actions = await getPendingActions();
    if (actions.length === 0) return;

    for (const action of actions) {
      try {
        switch (action.type) {
          case 'like':
            await api.post(`posts/${action.entityId}/react`, JSON.parse(action.payload || '{}'));
            break;
          case 'unlike':
            await api.delete(`posts/${action.entityId}/react/${JSON.parse(action.payload || '{}').type}`);
            break;
          case 'bookmark':
            await api.post(`posts/${action.entityId}/bookmark`);
            break;
          case 'unbookmark':
            await api.delete(`posts/${action.entityId}/bookmark`);
            break;
          case 'comment':
            await api.post('comments', JSON.parse(action.payload || '{}'));
            break;
          case 'message':
            await api.post(`conversations/${action.entityId}/messages`, JSON.parse(action.payload || '{}'));
            break;
          case 'follow':
            await api.post(`users/${action.entityId}/follow`);
            break;
          case 'unfollow':
            await api.post(`users/${action.entityId}/unfollow`);
            break;
        }
        await markActionSynced(action.id);
      } catch {
        await incrementRetryCount(action.id);
        const updated = await getPendingActions();
        const item = updated.find((a) => a.id === action.id);
        if (item && item.retryCount >= 3) {
          await markActionFailed(action.id);
        }
      }
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline, syncQueue]);

  return { isOnline, syncQueue };
}
