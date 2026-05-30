'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Users, MapPin, ArrowLeft, Coffee } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface AddaRoom {
  id: string;
  topic: string;
  districtId: number;
  districtName: string;
  memberCount: number;
  createdAt: number;
  reactions: Record<string, number>;
}

export default function AddaPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [topic, setTopic] = useState('');
  const [districtId, setDistrictId] = useState<number | ''>('');
  const [districtName, setDistrictName] = useState('');

  const { data: rooms = [] } = useQuery({
    queryKey: ['adda-rooms'],
    queryFn: async () => {
      const res = await api.get<AddaRoom[]>('addas/rooms');
      return res.data || [];
    },
    refetchInterval: 10000,
  });

  const createRoom = useMutation({
    mutationFn: async () => {
      await api.post('addas/rooms', { topic, districtId: Number(districtId), districtName });
    },
    onSuccess: () => {
      setShowCreate(false);
      setTopic('');
      queryClient.invalidateQueries({ queryKey: ['adda-rooms'] });
    },
  });

  const react = useMutation({
    mutationFn: async ({ roomId, reaction }: { roomId: string; reaction: string }) => {
      await api.post(`addas/rooms/${roomId}/react`, { reaction });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adda-rooms'] }),
  });

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">আড্ডা কর্নার</h1>
            <p className="text-xs text-muted-foreground">Adda Corner — Virtual Tea Stall</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="p-2 bg-bondhu-green text-white rounded-full hover:bg-bondhu-green-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-2xl p-4 space-y-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic..."
            className="w-full px-4 py-2 bg-muted rounded-xl text-sm focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={districtId}
              onChange={(e) => setDistrictId(Number(e.target.value))}
              placeholder="District ID"
              className="flex-1 px-4 py-2 bg-muted rounded-xl text-sm focus:outline-none"
            />
            <input
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              placeholder="District Name"
              className="flex-1 px-4 py-2 bg-muted rounded-xl text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => createRoom.mutate()} disabled={!topic.trim()} className="flex-1 py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium">
              Create Room
            </button>
            <button onClick={() => setShowCreate(false)} className="flex-1 py-2 bg-muted rounded-xl text-sm font-medium">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {rooms.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No active adda rooms. Start one!</p>
          </div>
        )}
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{room.topic}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {room.districtName}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {room.memberCount} online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries({ 'চা ☕': 'চা', 'ভাত 🍚': 'ভাত', 'ইলিশ 🐟': 'ইলিশ', 'হাসি 😄': 'হাসি' }).map(([label, key]) => (
                <button
                  key={key}
                  onClick={() => react.mutate({ roomId: room.id, reaction: key })}
                  className="px-3 py-1 bg-muted rounded-full text-xs hover:bg-bondhu-green/10 transition-colors"
                >
                  {label} {room.reactions?.[key] || 0}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
