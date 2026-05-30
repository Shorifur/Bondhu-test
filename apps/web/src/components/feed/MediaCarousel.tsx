'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaAsset } from '@bondhu/shared-types';

interface MediaCarouselProps {
  assets: MediaAsset[];
}

export function MediaCarousel({ assets }: MediaCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % assets.length);
  const prev = () => setCurrent((c) => (c - 1 + assets.length) % assets.length);

  return (
    <div className="relative rounded-xl overflow-hidden bg-muted aspect-[4/3]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          {assets[current].type === 'VIDEO' ? (
            <div className="relative w-full h-full">
              <img
                src={assets[current].thumbnailUrl || assets[current].url}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-bondhu-green fill-bondhu-green ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={assets[current].url}
              alt={assets[current].altText || ''}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {assets.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {assets.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50',
                )}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs font-medium">
            {current + 1}/{assets.length}
          </div>
        </>
      )}
    </div>
  );
}
