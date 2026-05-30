'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CricketPage() {
  const router = useRouter();
  const [cricketMode, setCricketMode] = useState(true);

  if (!cricketMode) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground">Cricket mode is currently off. Check back during Bangladesh matches!</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-bondhu-green text-white rounded-xl">Go Home</button>
      </div>
    );
  }

  return (
    <div className={cn('py-4 space-y-4', 'bg-gradient-to-b from-green-700 via-green-600 to-red-600 text-white min-h-screen -mx-4 -mt-4 px-4 pt-4')}>
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-300" />
          <h1 className="text-xl font-bold">Cricket Live</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-300 animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-wider">Live Match</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold">🇧🇩 BAN</p>
            <p className="text-lg">245/6</p>
            <p className="text-xs opacity-70">50.0 overs</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs opacity-70">vs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">🇮🇳 IND</p>
            <p className="text-lg">Yet to bat</p>
            <p className="text-xs opacity-70">-</p>
          </div>
        </div>
        <p className="text-xs text-center opacity-80">Bangladesh needs 246 to win (example score)</p>
      </motion.div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Live Discussion</h3>
        <div className="space-y-3">
          {[
            { user: 'Sakib', text: 'What a shot! 🔥', time: '2m ago' },
            { user: 'Rahim', text: 'Come on Tigers! 🐯', time: '5m ago' },
          ].map((msg, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{msg.user[0]}</div>
              <div>
                <p className="text-sm font-medium">{msg.user}</p>
                <p className="text-sm opacity-90">{msg.text}</p>
                <p className="text-xs opacity-60">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {['ছক্কা 🏏', 'উইকেট 🎯', 'চার 💥'].map((r) => (
            <button key={r} className="px-3 py-1.5 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors">{r}</button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs opacity-70">
        Score widget powered by Cricbuzz (embed in production)
      </div>
    </div>
  );
}
