'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Store } from 'lucide-react';
import { api } from '@/lib/api';

export default function CreateShopPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [districtId, setDistrictId] = useState('');

  const create = useMutation({
    mutationFn: async () => {
      const res = await api.post('shops', { name, description, category, districtId: districtId ? Number(districtId) : undefined });
      return res.data;
    },
    onSuccess: (data: any) => {
      router.push(`/shop/${data?.data?.handle}`);
    },
  });

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/shop')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Create Shop</h1>
      </div>

      <div className="bg-card border rounded-2xl p-4 space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
            <Store className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shop Name" className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className="w-full px-4 py-2 bg-muted rounded-xl text-sm resize-none" />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
        <input value={districtId} onChange={(e) => setDistrictId(e.target.value)} placeholder="District ID (optional)" className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
        <button onClick={() => create.mutate()} disabled={!name} className="w-full py-2 bg-bondhu-green text-white rounded-xl font-medium">Create Shop</button>
      </div>
    </div>
  );
}
