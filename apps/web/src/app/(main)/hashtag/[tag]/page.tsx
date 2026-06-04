// @ts-nocheck
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Hash } from 'lucide-react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/feed/PostCard';

export default function HashtagPage() {
  const params = useParams();
  const router = useRouter();
  const tag = params.tag as string;

  const { data, isLoading } = useQuery<{ data: any[] }>({
    queryKey: ['hashtag', tag],
    queryFn: async () => {
      const res = await api.get(`search?q=${encodeURIComponent('#' + tag)}&type=posts&limit=50`);
      return (res as any).data || { data: [] };
    },
    enabled: !!tag,
  });

  const posts = data?.data || [];

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Hash className="w-6 h-6 text-bondhu-green" />
          <h1 className="text-xl font-bold">#{tag}</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-bondhu-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Hash className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No posts found for #{tag}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
