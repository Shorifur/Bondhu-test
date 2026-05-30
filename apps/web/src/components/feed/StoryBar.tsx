'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { storyService } from '@/services/story.service';
import { cn } from '@/lib/utils';
import type { Story } from '@bondhu/shared-types';

interface StoryRingProps {
  story: Story;
  onClick: () => void;
}

function StoryRing({ story, onClick }: StoryRingProps) {
  const profile = story.user?.profile;
  const hasViewed = story.hasViewed;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0"
    >
      <div
        className={cn(
          'relative w-16 h-16 rounded-full',
          hasViewed
            ? 'story-ring-viewed'
            : 'story-ring'
        )}
      >
        <div className="w-full h-full rounded-full bg-background border-2 border-background overflow-hidden">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bondhu-green text-white font-bold text-lg">
              {profile?.displayName?.[0] || 'U'}
            </div>
          )}
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[4rem]">
        {profile?.displayName || 'User'}
      </span>
    </button>
  );
}

export function StoryBar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: storiesRes, isLoading } = useQuery({
    queryKey: ['stories-feed'],
    queryFn: async () => {
      const res = await storyService.getFeed();
      const raw = res.data as any;
      return Array.isArray(raw) ? raw : raw?.data ?? [];
    },
  });

  const stories = (storiesRes as Story[]) || [];

  // Group stories by user
  const grouped = stories.reduce<Record<string, Story[]>>((acc, story) => {
    const uid = story.userId;
    if (!acc[uid]) acc[uid] = [];
    acc[uid].push(story);
    return acc;
  }, {});

  const userStories = Object.values(grouped).map((userStoryList) => ({
    ...userStoryList[0],
    hasViewed: userStoryList.every((s) => s.hasViewed),
  }));

  const viewMutation = useMutation({
    mutationFn: (storyId: string) => storyService.view(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories-feed'] });
    },
  });

  const handleStoryClick = (story: Story) => {
    viewMutation.mutate(story.id);
    // In a real app, open a story viewer modal
    // For now, we just mark as viewed
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
            <div className="w-10 h-2 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
      {/* Add Story button */}
      <button
        onClick={() => router.push('/create?mode=story')}
        className="flex flex-col items-center gap-1.5 shrink-0"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-bondhu-green flex items-center justify-center bg-bondhu-green/5">
          <Plus className="w-6 h-6 text-bondhu-green" />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[4rem]">
          Add Story
        </span>
      </button>

      {userStories.map((story, i) => (
        <motion.div
          key={story.userId}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
        >
          <StoryRing story={story} onClick={() => handleStoryClick(story)} />
        </motion.div>
      ))}
    </div>
  );
}
