'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const itemLabels: Record<string, { bn: string; icon: string }> = {
  RICE: { bn: 'চাল', icon: '🌾' },
  FISH: { bn: 'মাছ', icon: '🐟' },
  VEGETABLES: { bn: 'সবজি', icon: '🥬' },
  EGG: { bn: 'ডিম', icon: '🥚' },
  OIL: { bn: 'তেল', icon: '🛢️' },
};

export default function BazaarPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [districtId, setDistrictId] = useState('');
  const [itemType, setItemType] = useState('RICE');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('per kg');

  const { data: trends } = useQuery<Record<string, any>>({
    queryKey: ['bazaar-trends', districtId],
    queryFn: async () => {
      const res = await api.get(`bazaar/trends/${districtId || 1}`);
      return (res as any).data?.data || {};
    },
  });

  const { data: reports } = useQuery<{ data: any[] }>({
    queryKey: ['bazaar-reports', districtId],
    queryFn: async () => {
      const res = await api.get(`bazaar/reports?districtId=${districtId || ''}`);
      return (res as any).data || { data: [] };
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      await api.post('bazaar/reports', {
        districtId: Number(districtId),
        itemType,
        itemName,
        price: Number(price),
        unit,
      });
    },
    onSuccess: () => {
      setShowForm(false);
      setPrice('');
      setItemName('');
      queryClient.invalidateQueries({ queryKey: ['bazaar-reports'] });
      queryClient.invalidateQueries({ queryKey: ['bazaar-trends'] });
    },
  });

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">বাজার দর</h1>
            <p className="text-xs text-muted-foreground">Local Bazaar Prices</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="p-2 bg-bondhu-green text-white rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <input
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          placeholder="District ID"
          className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm focus:outline-none"
        />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border rounded-2xl p-4 space-y-3">
          <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="w-full px-3 py-2 bg-muted rounded-xl text-sm">
            {Object.entries(itemLabels).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.bn}</option>
            ))}
          </select>
          <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item name" className="w-full px-3 py-2 bg-muted rounded-xl text-sm" />
          <div className="flex gap-2">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (৳)" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
          </div>
          <button onClick={() => submit.mutate()} disabled={!price || !itemName} className="w-full py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium">Submit Price</button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {trends && Object.entries(trends).map(([key, val]: [string, any]) => {
          const label = itemLabels[key] || { bn: key, icon: '' };
          const up = val.changePct !== null && val.changePct >= 0;
          return (
            <motion.div key={key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{label.icon}</span>
                <span className="font-semibold text-sm">{label.bn}</span>
              </div>
              <p className="text-2xl font-bold">৳{val.current}</p>
              {val.changePct !== null && (
                <div className={cn('flex items-center gap-1 text-xs mt-1', up ? 'text-green-600' : 'text-red-600')}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(val.changePct).toFixed(1)}%
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Recent Reports</p>
        {reports?.data?.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between p-3 bg-card border rounded-xl text-sm">
            <div>
              <span className="font-medium">{r.itemName}</span>
              <span className="text-muted-foreground ml-2">{r.district?.nameEn}</span>
            </div>
            <span className="font-semibold">৳{Number(r.price).toFixed(0)} / {r.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
