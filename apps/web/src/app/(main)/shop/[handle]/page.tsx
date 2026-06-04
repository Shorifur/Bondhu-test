// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, MessageCircle, Zap, Radio } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ShopDetailPage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.handle as string;
  const queryClient = useQueryClient();
  const [showProductForm, setShowProductForm] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [condition, setCondition] = useState('NEW');

  const { data, isLoading } = useQuery<any>({
    queryKey: ['shop', handle],
    queryFn: async () => {
      const res = await api.get(`shops/${handle}`);
      return (res as any).data?.data;
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      await api.post(`shops/${data.id}/products`, {
        title,
        price: Number(price),
        stock: Number(stock),
        condition,
        images: [],
      });
    },
    onSuccess: () => {
      setShowProductForm(false);
      setTitle('');
      setPrice('');
      setStock('');
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
    },
  });

  if (isLoading) return <div className="py-12 text-center">Loading...</div>;
  if (!data) return <div className="py-12 text-center text-muted-foreground">Shop not found</div>;

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/shop')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold truncate">{data.name}</h1>
      </div>

      <div className="relative h-32 bg-gradient-to-br from-bondhu-green/20 to-bondhu-blue/20 rounded-2xl overflow-hidden">
        {data.coverUrl && <img src={data.coverUrl} alt="" className="w-full h-full object-cover" />}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center border">
          {data.logoUrl ? <img src={data.logoUrl} alt="" className="w-full h-full object-cover rounded-2xl" /> : <Store className="w-8 h-8 text-muted-foreground" />}
        </div>
        <div className="flex-1">
          <h2 className="font-bold">{data.name}</h2>
          <p className="text-sm text-muted-foreground">{data.category} • {data.followerCount} followers</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => router.push(`/chat?user=${data.ownerId}`)} className="flex-1 py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" /> Contact Seller
        </button>
        <button disabled className="flex-1 py-2 bg-muted rounded-xl text-sm font-medium flex items-center justify-center gap-2 opacity-60">
          <Zap className="w-4 h-4" /> Boost
        </button>
        <button disabled className="flex-1 py-2 bg-muted rounded-xl text-sm font-medium flex items-center justify-center gap-2 opacity-60">
          <Radio className="w-4 h-4" /> Live Sale
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Products</h3>
        <button onClick={() => setShowProductForm(!showProductForm)} className="text-xs text-bondhu-green font-medium">{showProductForm ? 'Cancel' : 'Add Product'}</button>
      </div>

      {showProductForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border rounded-2xl p-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Title" className="w-full px-3 py-2 bg-muted rounded-xl text-sm" />
          <div className="flex gap-2">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (৳)" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
          </div>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-3 py-2 bg-muted rounded-xl text-sm">
            <option value="NEW">New</option>
            <option value="USED">Used</option>
          </select>
          <button onClick={() => addProduct.mutate()} disabled={!title || !price} className="w-full py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium">Add Product</button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {data.products?.map((product: any) => (
          <div key={product.id} className="bg-card border rounded-2xl p-3">
            <div className="w-full h-24 bg-muted rounded-xl mb-2 flex items-center justify-center text-2xl">📦</div>
            <h4 className="font-medium text-sm truncate">{product.title}</h4>
            <p className="text-sm font-bold text-bondhu-green">৳{Number(product.price).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
