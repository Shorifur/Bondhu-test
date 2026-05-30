'use client';

import { motion } from 'framer-motion';
import { NewsIcon } from '@/components/ui/CulturalIcons';

export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  url: string;
}

interface NewsCardProps {
  news: NewsItem;
  index?: number;
}

export default function NewsCard({ news, index = 0 }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="feed-card p-3 mx-3 mb-3"
    >
      {/* Source tag */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50">
          <NewsIcon size={14} className="text-purple-500" />
          <span className="text-[11px] font-medium text-purple-600">{news.source}</span>
        </div>
        <span className="text-[10px] text-[#9B8FC0]">
          {new Date(news.publishedAt).toLocaleDateString('bn-BD')}
        </span>
      </div>

      {/* Content */}
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1a1a2e] leading-snug line-clamp-3 font-bangla">
            {news.title}
          </h3>
          {news.description && (
            <p className="text-[11px] text-[#6B5B8A] mt-1 line-clamp-2 font-bangla">
              {news.description}
            </p>
          )}
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-[11px] font-medium"
            style={{ color: '#7C3AED' }}
          >
            Read more →
          </a>
        </div>

        {/* Thumbnail */}
        {news.imageUrl && (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </motion.article>
  );
}
