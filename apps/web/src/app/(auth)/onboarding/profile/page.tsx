// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MapPin, AtSign, Check, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const districts = [
  { id: 1, nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 2, nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম' },
  { id: 3, nameEn: 'Khulna', nameBn: 'খুলনা' },
  { id: 4, nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 5, nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 6, nameEn: 'Barisal', nameBn: 'বরিশাল' },
  { id: 7, nameEn: 'Rangpur', nameBn: 'রংপুর' },
  { id: 8, nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
];

const subDistricts: Record<number, { id: number; nameEn: string; nameBn: string }[]> = {
  1: [
    { id: 1, nameEn: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
    { id: 2, nameEn: 'Gulshan', nameBn: 'গুলশান' },
    { id: 3, nameEn: 'Mirpur', nameBn: 'মিরপুর' },
    { id: 4, nameEn: 'Uttara', nameBn: 'উত্তরা' },
  ],
  2: [
    { id: 5, nameEn: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 6, nameEn: 'Panchlaish', nameBn: 'পাঁচলাইশ' },
    { id: 7, nameEn: 'Halishahar', nameBn: 'হালিশহর' },
  ],
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [legalName, setLegalName] = useState('');
  const [handle, setHandle] = useState('');
  const [districtId, setDistrictId] = useState<number | ''>('');
  const [subDistrictId, setSubDistrictId] = useState<number | ''>('');
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkHandle = async (value: string) => {
    if (value.length < 3) { setHandleAvailable(null); return; }
    setCheckingHandle(true);
    try {
      await api.get(`users/${value}`);
      setHandleAvailable(false);
    } catch { setHandleAvailable(true); }
    finally { setCheckingHandle(false); }
  };

  const handleSubmit = async () => {
    setError('');
    if (!legalName || !handle || !districtId || !subDistrictId) {
      setError('Please fill all fields'); return;
    }
    if (!handleAvailable) { setError('Handle is not available'); return; }

    setLoading(true);
    try {
      const res = await api.post('auth/profile', {
        legalName, handle,
        districtId: Number(districtId),
        subDistrictId: Number(subDistrictId),
      });
      if (res.data) { setUser(res.data as any); router.push('/'); }
    } catch (err: any) { setError(err.message || 'Failed to create profile'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col space-y-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create your profile</h2>
        <p className="text-muted-foreground">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" />Legal Name</label>
          <input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Your full name"
            className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-bondhu-green transition-colors" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-2"><AtSign className="w-4 h-4" />Username Handle</label>
          <div className="relative">
            <input value={handle} onChange={(e) => { setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, '')); setHandleAvailable(null); }}
              onBlur={() => checkHandle(handle)} placeholder="your_handle"
              className={cn('w-full px-4 py-3 bg-card border-2 rounded-xl focus:outline-none transition-colors pr-10',
                handleAvailable === true ? 'border-bondhu-green' : handleAvailable === false ? 'border-destructive' : 'border-border focus:border-bondhu-green')} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checkingHandle ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                : handleAvailable === true ? <Check className="w-5 h-5 text-bondhu-green" /> : null}
            </div>
          </div>
          {handleAvailable === false && <p className="text-xs text-destructive">This handle is already taken</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4" />District</label>
          <select value={districtId} onChange={(e) => { setDistrictId(Number(e.target.value)); setSubDistrictId(''); }}
            className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-bondhu-green transition-colors">
            <option value="">Select district</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.nameBn} ({d.nameEn})</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-2"><MapPin className="w-4 h-4" />Sub-District / Thana</label>
          <select value={subDistrictId} onChange={(e) => setSubDistrictId(Number(e.target.value))} disabled={!districtId}
            className="w-full px-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-bondhu-green transition-colors disabled:opacity-50">
            <option value="">Select sub-district</option>
            {(subDistricts[Number(districtId)] || []).map((s) => <option key={s.id} value={s.id}>{s.nameBn} ({s.nameEn})</option>)}
          </select>
        </div>
      </div>

      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">{error}</motion.p>}

      <button onClick={handleSubmit} disabled={loading}
        className={cn('w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all',
          loading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-bondhu-green hover:bg-bondhu-green-dark shadow-lg shadow-bondhu-green/20')}>
        {loading ? 'Creating...' : 'Complete Setup'}
      </button>
    </div>
  );
}
