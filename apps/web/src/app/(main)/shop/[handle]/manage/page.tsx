'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Store, Package, Trash2, Edit3,
  Plus, X,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { districts } from '@/lib/districts';

export default function ShopManagePage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.handle as string;
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  // Shop edit fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [districtId, setDistrictId] = useState('');

  // Product form fields
  const [pTitle, setPTitle] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCondition, setPCondition] = useState('NEW');
  const [pDescription, setPDescription] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const { data: shop, isLoading } = useQuery<any>({
    queryKey: ['shop', handle],
    queryFn: async () => {
      const res = await api.get(`shops/${handle}`);
      return (res as any).data?.data;
    },
  });

  useQuery({
    queryKey: ['shop-init', handle],
    enabled: !!shop,
    queryFn: () => {
      if (shop) {
        setName(shop.name || '');
        setDescription(shop.description || '');
        setCategory(shop.category || '');
        setDistrictId(shop.districtId ? String(shop.districtId) : '');
      }
      return shop;
    },
  });

  const updateShop = useMutation({
    mutationFn: async () => {
      await api.patch(`shops/${shop.id}`, {
        name: name || undefined,
        description: description || undefined,
        category: category || undefined,
        districtId: districtId ? Number(districtId) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
      setEditMode(false);
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      await api.post(`shops/${shop.id}/products`, {
        title: pTitle,
        description: pDescription || undefined,
        price: Number(pPrice),
        stock: Number(pStock) || 0,
        condition: pCondition,
        images: [],
      });
    },
    onSuccess: () => {
      resetProductForm();
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async () => {
      await api.patch(`shops/${shop.id}/products/${editingProductId}`, {
        title: pTitle,
        description: pDescription || undefined,
        price: Number(pPrice),
        stock: Number(pStock) || 0,
        condition: pCondition,
      });
    },
    onSuccess: () => {
      resetProductForm();
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`shops/${shop.id}/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
    },
  });

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    setPTitle('');
    setPPrice('');
    setPStock('');
    setPCondition('NEW');
    setPDescription('');
  };

  const startEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setPTitle(product.title);
    setPPrice(String(product.price));
    setPStock(String(product.stock));
    setPCondition(product.condition);
    setPDescription(product.description || '');
    setShowProductForm(true);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 border-4 border-bondhu-green border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Shop not found</p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push(`/shop/${handle}`)} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Manage Shop</h1>
      </div>

      {/* Shop Info Card */}
      <div className="bg-card border rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h2 className="font-bold">{shop.name}</h2>
              <p className="text-xs text-muted-foreground">@{shop.handle}</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <AnimatePresence>
          {editMode && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shop Name"
                className="w-full px-3 py-2 bg-muted rounded-xl text-sm"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 bg-muted rounded-xl text-sm resize-none"
              />
              <div className="flex gap-2">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm"
                />
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.nameBn}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => updateShop.mutate()}
                disabled={updateShop.isPending}
                className="w-full py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium"
              >
                {updateShop.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products ({shop.products?.length || 0})
          </h3>
          <button
            onClick={() => setShowProductForm(!showProductForm)}
            className="px-3 py-1.5 bg-bondhu-green text-white rounded-lg text-xs font-medium flex items-center gap-1"
          >
            {showProductForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {showProductForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        <AnimatePresence>
          {showProductForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border rounded-2xl p-4 space-y-3"
            >
              <input
                value={pTitle}
                onChange={(e) => setPTitle(e.target.value)}
                placeholder="Product Title"
                className="w-full px-3 py-2 bg-muted rounded-xl text-sm"
              />
              <textarea
                value={pDescription}
                onChange={(e) => setPDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 bg-muted rounded-xl text-sm resize-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  placeholder="Price (৳)"
                  className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm"
                />
                <input
                  type="number"
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                  placeholder="Stock"
                  className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm"
                />
              </div>
              <select
                value={pCondition}
                onChange={(e) => setPCondition(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-xl text-sm"
              >
                <option value="NEW">New</option>
                <option value="USED">Used</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
              <button
                onClick={() => (editingProductId ? updateProduct.mutate() : addProduct.mutate())}
                disabled={!pTitle || !pPrice || addProduct.isPending || updateProduct.isPending}
                className="w-full py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium"
              >
                {editingProductId ? 'Update Product' : 'Add Product'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {shop.products?.map((product: any) => (
            <motion.div
              key={product.id}
              layout
              className="bg-card border rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Package className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{product.title}</h4>
                <p className="text-sm font-bold text-bondhu-green">৳{Number(product.price).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Stock: {product.stock} • {product.condition}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => startEditProduct(product)}
                  className="p-1.5 hover:bg-muted rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this product?')) deleteProduct.mutate(product.id);
                  }}
                  className="p-1.5 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
          {(!shop.products || shop.products.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No products yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
