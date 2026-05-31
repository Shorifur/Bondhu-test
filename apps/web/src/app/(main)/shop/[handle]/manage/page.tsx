'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Store, Package, Trash2, Edit3, Plus, X,
  Camera, Upload, Check, AlertTriangle, Tag, Truck,
  MessageCircle, Heart, ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { districts } from '@/lib/districts';
import { formatTimeAgo } from '@/lib/utils';

/* ── Image compression helper ── */
async function compressImage(file: File, maxDim: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > h) { if (w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; } }
      else { if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; } }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        else reject(new Error('Compression failed'));
      }, 'image/jpeg', 0.8);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/* ── Upload helper ── */
async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append('file', file);
  const token = api.getToken?.() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
      method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : undefined, body: fd,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.url || data?.url || null;
  } catch { return null; }
}

/* ── Delete Confirmation Modal ── */
function DeleteConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDeleting }: {
  isOpen: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void; isDeleting?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0A1E] font-bangla">{title}</h3>
                <p className="text-xs text-[#6B5E8A] font-bangla">{message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={onCancel} className="flex-1 py-2.5 bg-[#F5F2FF] text-[#5B21B6] rounded-xl text-sm font-bold font-bangla">
                বাতিল
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-40 font-bangla"
              >
                {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Multi Photo Upload Component ── */
function ProductPhotoUpload({ photos, onPhotosChange }: { photos: string[]; onPhotosChange: (photos: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remainingSlots = 8 - photos.length;
    const toProcess = files.slice(0, remainingSlots);
    if (toProcess.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];
    for (const file of toProcess) {
      const compressed = await compressImage(file, 800);
      const url = await uploadImage(compressed);
      if (url) newUrls.push(url);
    }
    setUploading(false);
    if (newUrls.length > 0) {
      onPhotosChange([...photos, ...newUrls]);
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#3D2B6B] font-bangla flex items-center gap-1">
        <Camera className="w-3 h-3" /> পণ্যের ছবি {photos.length > 0 && <span className="text-[#9B8FC0] font-normal">({photos.length}/8)</span>}
      </label>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((url, i) => (
            <div key={`${url}-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-[#DDD6F3]">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add more button */}
      {photos.length < 8 && (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 border-2 border-dashed border-[#DDD6F3] rounded-xl flex items-center justify-center gap-2 hover:border-[#5B21B6] hover:bg-[#F5F2FF]/50 transition-all disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-[#5B21B6] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4 text-[#9B8FC0]" />
              <span className="text-xs text-[#6B5E8A] font-bangla">ছবি যোগ করুন ({8 - photos.length} টি বাকি)</span>
            </>
          )}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}

export default function ShopManagePage() {
  const router = useRouter();
  const params = useParams();
  const handle = params.handle as string;
  const queryClient = useQueryClient();

  // ── UI State ──
  const [editMode, setEditMode] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // ── Shop edit fields ──
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // ── Product form fields ──
  const [pTitle, setPTitle] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCondition, setPCondition] = useState('NEW');
  const [pIsNegotiable, setPIsNegotiable] = useState(false);
  const [pDeliveryType, setPDeliveryType] = useState<'pickup' | 'delivery' | 'both'>('pickup');
  const [pDeliveryCharge, setPDeliveryCharge] = useState('');
  const [pPhotos, setPPhotos] = useState<string[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // ── Data fetching ──
  const { data: shop, isLoading } = useQuery<any>({
    queryKey: ['shop', handle],
    queryFn: async () => {
      const res = await api.get(`shops/${handle}`, { silent: true } as any);
      return (res as any).data?.data;
    },
  });

  // Initialize edit fields when shop data loads
  useQuery({
    queryKey: ['shop-init', handle],
    enabled: !!shop,
    queryFn: () => {
      if (shop) {
        setName(shop.name || '');
        setDescription(shop.description || '');
        setCategory(shop.category || '');
        setDistrictId(shop.districtId ? String(shop.districtId) : '');
        setPhone(shop.phone || '');
        setWhatsapp(shop.whatsapp || '');
        setAddress(shop.address || '');
        setBusinessHours(shop.businessHours || '');
        setLogoPreview(shop.logoUrl || null);
        setCoverPreview(shop.coverUrl || null);
      }
      return shop;
    },
  });

  // ── Mutations ──
  const updateShop = useMutation({
    mutationFn: async () => {
      let logoUrl = shop.logoUrl;
      let coverUrl = shop.coverUrl;
      if (logoFile) logoUrl = await uploadImage(logoFile) || logoUrl;
      if (coverFile) coverUrl = await uploadImage(coverFile) || coverUrl;

      const payload: any = {
        name: name || undefined,
        description: description || undefined,
        category: category || undefined,
        districtId: districtId ? Number(districtId) : undefined,
        phone: phone || undefined,
        whatsapp: whatsapp || undefined,
        address: address || undefined,
        businessHours: businessHours || undefined,
      };
      if (logoUrl) payload.logoUrl = logoUrl;
      if (coverUrl) payload.coverUrl = coverUrl;

      await api.patch(`shops/${shop.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
      setEditMode(false);
      setLogoFile(null);
      setCoverFile(null);
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      await api.post(`shops/${shop.id}/products`, {
        title: pTitle,
        description: pDescription || undefined,
        price: Number(pPrice),
        originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
        stock: Number(pStock) || 0,
        condition: pCondition,
        isNegotiable: pIsNegotiable,
        deliveryType: pDeliveryType,
        deliveryCharge: pDeliveryType !== 'pickup' ? Number(pDeliveryCharge) || 0 : undefined,
        images: pPhotos,
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
        originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
        stock: Number(pStock) || 0,
        condition: pCondition,
        isNegotiable: pIsNegotiable,
        deliveryType: pDeliveryType,
        deliveryCharge: pDeliveryType !== 'pickup' ? Number(pDeliveryCharge) || 0 : undefined,
        images: pPhotos.length > 0 ? pPhotos : undefined,
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
      setDeleteModalOpen(false);
      setProductToDelete(null);
    },
  });

  const toggleSold = useMutation({
    mutationFn: async ({ productId, isSold }: { productId: string; isSold: boolean }) => {
      await api.patch(`shops/${shop.id}/products/${productId}`, { isSold });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', handle] });
    },
  });

  // ── Handlers ──
  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    setPTitle('');
    setPDescription('');
    setPPrice('');
    setPOriginalPrice('');
    setPStock('');
    setPCondition('NEW');
    setPIsNegotiable(false);
    setPDeliveryType('pickup');
    setPDeliveryCharge('');
    setPPhotos([]);
  };

  const startEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setPTitle(product.title);
    setPDescription(product.description || '');
    setPPrice(String(product.price));
    setPOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
    setPStock(String(product.stock || 0));
    setPCondition(product.condition);
    setPIsNegotiable(product.isNegotiable || false);
    setPDeliveryType(product.deliveryType || 'pickup');
    setPDeliveryCharge(product.deliveryCharge ? String(product.deliveryCharge) : '');
    setPPhotos(product.images || []);
    setShowProductForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, 400);
    setLogoFile(compressed);
    setLogoPreview(URL.createObjectURL(compressed));
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, 1200);
    setCoverFile(compressed);
    setCoverPreview(URL.createObjectURL(compressed));
  };

  const askDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete);
    }
  };

  const canSubmitProduct = pTitle.length >= 2 && pPrice && Number(pPrice) > 0;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20" style={{ backgroundColor: '#F8F7FF' }}>
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pb-20" style={{ backgroundColor: '#F8F7FF' }}>
        <Store className="w-16 h-16 text-[#C4B5FD] mb-4" />
        <p className="text-[#6B5E8A] font-bangla font-medium">দোকান পাওয়া যায়নি</p>
        <button onClick={() => router.push('/shop')} className="mt-4 px-5 py-2.5 bondhu-gradient text-white text-sm font-bold rounded-2xl font-bangla">
          দোকানে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#F0EBF8] px-4 h-14 flex items-center gap-3">
        <button onClick={() => router.push(`/shop/${handle}`)} className="p-2 -ml-2 hover:bg-[#F5F2FF] rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#6B5E8A]" />
        </button>
        <h1 className="text-base font-bold text-[#0F0A1E] font-bangla">দোকান পরিচালনা</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ── Shop Info Card ── */}
        <div className="glass-card overflow-hidden">
          {/* Cover */}
          <div className="relative h-24" style={{ background: 'linear-gradient(135deg, #7C3AED, #0D9488)' }}>
            {shop.coverUrl && !editMode && <img src={shop.coverUrl} alt="" className="w-full h-full object-cover" />}
            {editMode && coverPreview && <img src={coverPreview} alt="" className="w-full h-full object-cover" />}
            {editMode && (
              <button onClick={() => coverRef.current?.click()}
                className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors">
                <Camera className="w-6 h-6 text-white" />
              </button>
            )}
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-start justify-between -mt-6">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="relative w-14 h-14 rounded-xl bg-[#F5F2FF] border-2 border-white shadow overflow-hidden flex items-center justify-center shrink-0 z-10">
                  {(!editMode && shop.logoUrl) ? (
                    <img src={shop.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (editMode && logoPreview) ? (
                    <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-7 h-7 text-[#C4B5FD]" />
                  )}
                  {editMode && (
                    <button onClick={() => logoRef.current?.click()}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
                </div>
                <div className="pt-6">
                  <h2 className="font-extrabold text-sm text-[#0F0A1E] font-bangla">{shop.name}</h2>
                  <p className="text-xs text-[#6B5E8A]">@{shop.handle}</p>
                </div>
              </div>
              <button
                onClick={() => { if (editMode) setEditMode(false); else setEditMode(true); }}
                className={cn(
                  "mt-6 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors",
                  editMode ? "bg-[#F5F2FF] text-[#5B21B6]" : "bg-[#F5F2FF] text-[#5B21B6] border border-[#DDD6F3]"
                )}
              >
                <Edit3 className="w-3 h-3" />
                {editMode ? 'বাতিল' : 'সম্পাদনা'}
              </button>
            </div>

            {/* Edit form */}
            <AnimatePresence>
              {editMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 mt-4 overflow-hidden">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="দোকানের নাম"
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="বিবরণ" rows={2}
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] resize-none font-bangla" />
                  <div className="flex gap-2">
                    <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ক্যাটাগরি"
                      className="flex-1 px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
                    <div className="relative flex-1">
                      <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla text-[#0F0A1E]">
                        <option value="">জেলা</option>
                        {districts.map((d) => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#9B8FC0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="ফোন"
                      className="flex-1 px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
                    <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp"
                      className="flex-1 px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
                  </div>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ঠিকানা"
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
                  <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} placeholder="সকাল ৯টা — রাত ৯টা"
                    className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
                  <button onClick={() => updateShop.mutate()} disabled={updateShop.isPending}
                    className="w-full py-2.5 bg-[#5B21B6] text-white rounded-xl text-sm font-bold disabled:opacity-40 font-bangla shadow-sm">
                    {updateShop.isPending ? 'সেভ হচ্ছে...' : '✓ পরিবর্তন সেভ করুন'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#DDD6F3]/50">
              {[
                { label: 'পণ্য', value: shop.products?.length || 0 },
                { label: 'ফলোয়ার', value: shop.followerCount || 0 },
                { label: 'বিক্রয়', value: shop._count?.orders || shop.salesCount || 0 },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-extrabold text-base text-[#0F0A1E]">{stat.value}</p>
                  <p className="text-[10px] text-[#9B8FC0] font-bangla">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Products Section ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla flex items-center gap-2">
              <Package className="w-4 h-4 text-[#7C3AED]" />
              পণ্য ({shop.products?.length || 0})
            </h3>
            <button
              onClick={() => { if (showProductForm) resetProductForm(); else setShowProductForm(true); }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors",
                showProductForm
                  ? "bg-[#F5F2FF] text-[#5B21B6] border border-[#DDD6F3]"
                  : "bondhu-gradient text-white shadow-sm"
              )}
            >
              {showProductForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showProductForm ? 'বাতিল' : 'নতুন পণ্য'}
            </button>
          </div>

          {/* ── Product Form ── */}
          <AnimatePresence>
            {showProductForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-4 space-y-3"
              >
                <h4 className="font-bold text-sm text-[#0F0A1E] font-bangla">
                  {editingProductId ? '✏️ পণ্য সম্পাদনা' : '➕ নতুন পণ্য যোগ করুন'}
                </h4>

                {/* Photo Upload */}
                <ProductPhotoUpload photos={pPhotos} onPhotosChange={setPPhotos} />

                {/* Title */}
                <input
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="পণ্যের নাম *"
                  className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla"
                />

                {/* Description */}
                <textarea
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="পণ্যের বিবরণ"
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] resize-none font-bangla"
                />

                {/* Price row */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9B8FC0] font-bangla">৳</span>
                    <input
                      type="number"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="বিক্রয় মূল্য *"
                      className="w-full pl-6 pr-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9B8FC0] font-bangla">৳</span>
                    <input
                      type="number"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      placeholder="আসল মূল্য"
                      className="w-full pl-6 pr-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono"
                    />
                  </div>
                </div>

                {/* Stock + Condition */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    placeholder="স্টক"
                    className="flex-1 px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono"
                  />
                  <div className="relative flex-1">
                    <select
                      value={pCondition}
                      onChange={(e) => setPCondition(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla text-[#0F0A1E]"
                    >
                      <option value="NEW">নতুন</option>
                      <option value="USED">ব্যবহৃত</option>
                      <option value="LIKE_NEW">মোটামুটি নতুন</option>
                      <option value="REFURBISHED">রিফার্বিশড</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#9B8FC0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Negotiable toggle */}
                <button
                  onClick={() => setPIsNegotiable(!pIsNegotiable)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border font-bangla",
                    pIsNegotiable
                      ? "bg-[#E1F5EE] border-[#0D9488] text-[#0F6E56]"
                      : "bg-white border-[#DDD6F3] text-[#6B5E8A]"
                  )}
                >
                  <Tag className="w-4 h-4" />
                  {pIsNegotiable ? '✓ দাম আলোচনাসাপেক্ষ' : 'দাম আলোচনাসাপেক্ষ করুন'}
                </button>

                {/* Delivery type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#3D2B6B] font-bangla flex items-center gap-1">
                    <Truck className="w-3 h-3" /> ডেলিভারি পদ্ধতি
                  </label>
                  <div className="flex gap-2">
                    {([
                      { value: 'pickup' as const, label: 'সেলফ পিকআপ' },
                      { value: 'delivery' as const, label: 'হোম ডেলিভারি' },
                      { value: 'both' as const, label: 'উভয়' },
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPDeliveryType(opt.value)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-xs font-bold border transition-all font-bangla",
                          pDeliveryType === opt.value
                            ? "bg-[#5B21B6] border-[#5B21B6] text-white"
                            : "bg-white border-[#DDD6F3] text-[#6B5E8A]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {(pDeliveryType === 'delivery' || pDeliveryType === 'both') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9B8FC0] font-bangla">৳</span>
                        <input
                          type="number"
                          value={pDeliveryCharge}
                          onChange={(e) => setPDeliveryCharge(e.target.value)}
                          placeholder="ডেলিভারি চার্জ (০ = বিনামূল্যে)"
                          className="w-full pl-6 pr-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={() => (editingProductId ? updateProduct.mutate() : addProduct.mutate())}
                  disabled={!canSubmitProduct || addProduct.isPending || updateProduct.isPending}
                  className="w-full py-3 bg-[#5B21B6] text-white rounded-xl text-sm font-bold disabled:opacity-40 font-bangla shadow-sm"
                >
                  {addProduct.isPending || updateProduct.isPending
                    ? 'প্রসেসিং...'
                    : editingProductId ? '✓ পণ্য আপডেট করুন' : '✓ পণ্য যোগ করুন'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Product List ── */}
          <div className="space-y-2">
            {shop.products?.map((product: any) => (
              <motion.div
                key={product.id}
                layout
                className={cn(
                  "glass-card p-3 flex items-start gap-3 relative overflow-hidden",
                  product.isSold && "opacity-60"
                )}
              >
                {/* Sold overlay */}
                {product.isSold && (
                  <div className="absolute inset-0 bg-black/5 z-10 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 text-[#0F0A1E] text-xs font-extrabold px-3 py-1 rounded-full font-bangla shadow-sm">
                      বিক্রি হয়ে গেছে
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-[#F5F2FF] overflow-hidden flex items-center justify-center shrink-0 relative">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-[#C4B5FD]" />
                  )}
                  {product.images?.length > 1 && (
                    <span className="absolute bottom-0.5 right-0.5 bg-black/50 text-white text-[9px] px-1 rounded-full">
                      +{product.images.length - 1}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn("font-medium text-sm truncate font-bangla", product.isSold && "line-through")}>
                    {product.title}
                  </h4>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-bold font-bangla" style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      ৳{Number(product.price).toLocaleString('bn-BD')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-[#9B8FC0] line-through">৳{Number(product.originalPrice).toLocaleString('bn-BD')}</span>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5F2FF] text-[#6B5E8A] font-bold font-bangla">
                      {product.condition === 'NEW' ? 'নতুন' : product.condition === 'USED' ? 'ব্যবহৃত' : product.condition === 'LIKE_NEW' ? 'মোটামুটি নতুন' : 'রিফার্বিশড'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5F2FF] text-[#6B5E8A] font-medium">
                      স্টক: {product.stock}
                    </span>
                    {product.isNegotiable && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] font-bold font-bangla">আলোচনাসাপেক্ষ</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 shrink-0 z-20">
                  <button
                    onClick={() => toggleSold.mutate({ productId: product.id, isSold: !product.isSold })}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      product.isSold ? "hover:bg-green-50" : "hover:bg-amber-50"
                    )}
                    title={product.isSold ? 'আনসোল্ড করুন' : 'বিক্রি হয়ে গেছে চিহ্নিত করুন'}
                  >
                    <Check className={cn("w-3.5 h-3.5", product.isSold ? "text-green-600" : "text-amber-500")} />
                  </button>
                  <button
                    onClick={() => startEditProduct(product)}
                    className="p-1.5 hover:bg-[#F5F2FF] rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#6B5E8A]" />
                  </button>
                  <button
                    onClick={() => askDeleteProduct(product.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}

            {(!shop.products || shop.products.length === 0) && (
              <div className="text-center py-12">
                <span className="text-5xl">📦</span>
                <p className="text-sm text-[#6B5E8A] font-bangla mt-3">এখনো কোনো পণ্য যোগ করা হয়নি</p>
                <button onClick={() => setShowProductForm(true)}
                  className="mt-3 px-5 py-2.5 text-[#5B21B6] text-sm font-bold rounded-2xl border border-[#DDD6F3] bg-[#F5F2FF] font-bangla">
                  প্রথম পণ্য যোগ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="পণ্য মুছে ফেলবেন?"
        message="এই পণ্যটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর পূর্বাবস্থায় ফেরানো যাবে না।"
        onConfirm={confirmDeleteProduct}
        onCancel={() => { setDeleteModalOpen(false); setProductToDelete(null); }}
        isDeleting={deleteProduct.isPending}
      />
    </div>
  );
}
