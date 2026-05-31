'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X, Camera, MapPin, Phone, Clock, Store, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { ShopIcon } from '@/components/ui/CulturalIcons';
import { districts } from '@/lib/districts';

const SHOP_CATEGORIES = [
  'খাদ্য ও পানীয়', 'পোশাক ও ফ্যাশন', 'ইলেকট্রনিক্স', 'হস্তশিল্প',
  'কৃষি পণ্য', 'বই ও শিক্ষা', 'সেবা', 'আসবাবপত্র', 'গৃহস্থালি', 'সৌন্দর্য পণ্য', 'অন্যান্য',
];

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

export default function CreateShopPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [address, setAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('সকাল ৯টা — রাত ৯টা');

  // Images
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

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

  // Upload image helper
  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const token = api.getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
        method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : undefined, body: fd,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data?.url || data?.url || null;
    } catch { return null; }
  };

  // Create shop mutation
  const createShop = useMutation({
    mutationFn: async () => {
      let logoUrl: string | undefined;
      let coverUrl: string | undefined;
      if (logoFile) logoUrl = await uploadImage(logoFile) || undefined;
      if (coverFile) coverUrl = await uploadImage(coverFile) || undefined;

      const payload: any = {
        name, description, category,
        phone,
        whatsapp: whatsapp || undefined,
        address: address || undefined,
        businessHours: businessHours || undefined,
        districtId: districtId ? Number(districtId) : undefined,
      };
      if (logoUrl) payload.logoUrl = logoUrl;
      if (coverUrl) payload.coverUrl = coverUrl;

      const res = await api.post('shops', payload);
      return res.data;
    },
    onSuccess: (data: any) => {
      const handle = data?.data?.handle;
      router.push(handle ? `/shop/${handle}/manage` : '/shop');
    },
    onError: (err: any) => {
      alert(err?.message || 'দোকান তৈরি করতে ব্যর্থ');
    },
  });

  const canSubmit = name.length >= 2 && category && phone.length >= 11;

  return (
    <div className="min-h-screen pb-20 antialiased" style={{ backgroundColor: '#F8F7FF' }}>
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/shop')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F2FF]"><X className="w-4 h-4 text-[#6B5E8A]" /></button>
          <div>
            <h1 className="font-bold text-lg text-[#0F0A1E] font-bangla">নতুন দোকান তৈরি</h1>
            <p className="text-[10px] text-[#9B8FC0]">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bondhu-gradient' : 'bg-[#E0D9F7]'}`} />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={() => logoRef.current?.click()}
                className="w-24 h-24 rounded-full bg-[#F5F2FF] border-2 border-dashed border-[#DDD6F3] flex items-center justify-center hover:border-[#5B21B6] transition-colors overflow-hidden relative">
                {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <Store className="w-8 h-8 text-[#C4B5FD]" />}
              </button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
              <span className="text-xs text-[#6B5E8A] font-bangla">দোকানের লোগো (ঐচ্ছিক)</span>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla">দোকানের নাম *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: রহিমের কাঁচাবাজার"
                className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
            </div>

            {/* Category dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla">ক্যাটাগরি *</label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla text-[#0F0A1E]">
                  <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                  {SHOP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9B8FC0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla">বিবরণ</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="আপনার দোকান সম্পর্কে কিছু লিখুন..."
                className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] resize-none font-bangla" />
            </div>

            <button onClick={() => setStep(2)} disabled={!name || !category}
              className="w-full py-3 bondhu-gradient text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-40 font-bangla">
              পরবর্তী →
            </button>
          </motion.div>
        )}

        {/* Step 2: Contact & Location */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Cover */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla">কভার ছবি (ঐচ্ছিক)</label>
              <button onClick={() => coverRef.current?.click()}
                className="w-full h-28 rounded-xl bg-[#F5F2FF] border-2 border-dashed border-[#DDD6F3] flex items-center justify-center hover:border-[#5B21B6] transition-colors overflow-hidden">
                {coverPreview ? <img src={coverPreview} className="w-full h-full object-cover" /> : <div className="text-center"><Camera className="w-6 h-6 text-[#C4B5FD] mx-auto" /><p className="text-xs text-[#9B8FC0] font-bangla mt-1">কভার ছবি যোগ করুন</p></div>}
              </button>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla flex items-center gap-1"><Phone className="w-3 h-3" /> ফোন নম্বর *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla">হোয়াটসঅ্যাপ (ঐচ্ছিক)</label>
              <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
            </div>

            {/* District */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla flex items-center gap-1"><MapPin className="w-3 h-3" /> জেলা *</label>
              <div className="relative">
                <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla">
                  <option value="">জেলা নির্বাচন করুন</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9B8FC0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla">পূর্ণ ঠিকানা</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="বাড়ি/রোড/থানা"
                className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] resize-none font-bangla" />
            </div>

            {/* Business Hours */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B] font-bangla flex items-center gap-1"><Clock className="w-3 h-3" /> ব্যবসার সময়</label>
              <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} placeholder="সকাল ৯টা — রাত ৯টা"
                className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 bg-[#F5F2FF] text-[#5B21B6] rounded-xl text-sm font-bold font-bangla">← ফিরে যান</button>
              <button onClick={() => setStep(3)} disabled={!phone || phone.length < 11 || !districtId}
                className="flex-1 py-3 bondhu-gradient text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-40 font-bangla">পরবর্তী →</button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Preview */}
            <div className="glass-card overflow-hidden">
              <div className="relative h-28" style={{ background: coverPreview ? undefined : 'linear-gradient(135deg, #7C3AED, #0D9488)' }}>
                {coverPreview && <img src={coverPreview} className="w-full h-full object-cover" />}
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-3 -mt-6">
                  <div className="w-14 h-14 rounded-xl bg-[#F5F2FF] border-2 border-white shadow overflow-hidden flex items-center justify-center relative z-10">
                    {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <Store className="w-6 h-6 text-[#7C3AED]" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F0A1E] font-bangla">{name}</h3>
                    <p className="text-xs text-[#6B5E8A]">{category}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-xs text-[#6B5E8A]">
                  <p className="font-bangla">📞 {phone}</p>
                  {whatsapp && <p className="font-bangla">💬 WhatsApp: {whatsapp}</p>}
                  <p className="font-bangla">📍 {districts.find(d => String(d.id) === districtId)?.nameBn || ''}{address ? `, ${address}` : ''}</p>
                  <p className="font-bangla">🕐 {businessHours}</p>
                  {description && <p className="font-bangla mt-2 text-[#3D2B6B]">{description}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-[#F5F2FF] text-[#5B21B6] rounded-xl text-sm font-bold font-bangla">← ফিরে যান</button>
              <button onClick={() => createShop.mutate()} disabled={!canSubmit || createShop.isPending}
                className="flex-1 py-3 bondhu-gradient text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-40 font-bangla">
                {createShop.isPending ? 'তৈরি হচ্ছে...' : '✨ দোকান তৈরি করুন'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )