'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';

interface Story {
  id: string;
  userId: string;
  mediaAssets: { url: string; type: string }[];
  stickers?: { type: string; payload?: any }[];
  createdAt: string;
  user?: {
    displayName: string;
    avatarUrl?: string;
    handle: string;
  };
}

export default function StoryViewerPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const DURATION = 5000;

  const { data: story, isLoading } = useQuery<Story>({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const res = await api.get(`stories/${storyId}`);
      return (res as any).data ?? null;
    },
    enabled: !!storyId,
  });

  const { data: feedStories } = useQuery<Story[]>({
    queryKey: ['stories-feed'],
    queryFn: async () => {
      const res = await api.get('stories/feed');
      return (res as any).data?.data || [];
    },
  });

  const markViewed = useMutation({
    mutationFn: async () => {
      await api.post(`stories/${storyId}/view`, {});
    },
  });

  useEffect(() => {
    if (story) {
      markViewed.mutate();
    }
  }, [story]);

  const allStories = feedStories || [];
  const currentStoryIndex = allStories.findIndex((s) => s.id === storyId);
  const currentStory = story;

  const goNext = useCallback(() => {
    if (currentStoryIndex < allStories.length - 1) {
      const next = allStories[currentStoryIndex + 1];
      router.push(`/stories/${next.id}`);
    } else {
      router.push('/');
    }
  }, [currentStoryIndex, allStories, router]);

  const goPrev = useCallback(() => {
    if (currentStoryIndex > 0) {
      const prev = allStories[currentStoryIndex - 1];
      router.push(`/stories/${prev.id}`);
    }
  }, [currentStoryIndex, allStories, router]);

  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
    lastTimeRef.current = 0;
  }, [storyId]);

  useEffect(() => {
    if (paused || !currentStory) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      progressRef.current += delta;
      const pct = Math.min((progressRef.current / DURATION) * 100, 100);
      setProgress(pct);

      if (progressRef.current >= DURATION) {
        goNext();
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, currentStory, goNext]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white">
        <p className="text-lg font-medium">Story not found</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm">
          Go Home
        </button>
      </div>
    );
  }

  const media = currentStory.mediaAssets?.[0];
  const hasImageBg = media?.type === 'IMAGE' || media?.type === 'image';

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-2 pt-12 pb-2 flex gap-1">
        <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-14 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden border-2 border-white/50">
            {currentStory.user?.avatarUrl ? (
              <img src={currentStory.user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                {currentStory.user?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{currentStory.user?.displayName}</p>
            <p className="text-white/70 text-xs">{formatTimeAgo(currentStory.createdAt, 'bn')}</p>
          </div>
        </div>
        <button onClick={() => router.push('/')} className="p-2 bg-black/30 rounded-full backdrop-blur-sm">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Story Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {hasImageBg && (
          <img
            src={media.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Background gradient if no image */}
        {!hasImageBg && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
        )}

        {/* Story text/stickers overlay */}
        <div className="relative z-10 w-full h-full">
          {(currentStory.stickers || []).map((sticker, i) => {
            if (sticker.type === 'TEXT') {
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center font-bold text-2xl px-4"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                  {sticker.payload?.text}
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 flex z-10">
          <button onClick={goPrev} className="w-1/3 h-full" />
          <div className="w-1/3 h-full" />
          <button onClick={goNext} className="w-1/3 h-full" />
        </div>
      </div>
    </div>
  );
}
