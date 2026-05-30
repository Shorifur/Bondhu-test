'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Shield, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn, isBangladeshiPhone } from '@/lib/utils';

export default function PhoneInputPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bypass = useAuthStore((s) => s.bypass);
  const [phone, setPhone] = useState('+880');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!isBangladeshiPhone(phone)) {
      setError('Please enter a valid Bangladeshi mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('auth/otp/send', { phoneNumber: phone });
      if (res.data) {
        router.push(`/onboarding/verify?phone=${encodeURIComponent(phone)}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Enter your mobile number</h2>
        <p className="text-muted-foreground">We will send a verification code to your phone</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
            <Phone className="w-5 h-5" />
            <span className="font-semibold">+880</span>
          </div>
          <input
            type="tel"
            value={phone.replace('+880', '')}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 11);
              setPhone('+880' + val);
            }}
            placeholder="1XXXXXXXXX"
            className="w-full pl-24 pr-4 py-4 bg-card border-2 border-border rounded-2xl text-lg font-medium focus:outline-none focus:border-bondhu-green transition-colors"
          />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">
            {error}
          </motion.p>
        )}

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Supported operators: Grameenphone (017, 013), Robi (018), Airtel (016), Banglalink (019, 014), Teletalk (015)</p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !isBangladeshiPhone(phone)}
        className={cn(
          'w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all',
          loading || !isBangladeshiPhone(phone)
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-bondhu-green hover:bg-bondhu-green-dark shadow-lg shadow-bondhu-green/20',
        )}
      >
        {loading ? 'Sending...' : 'Send Verification Code'}
      </button>

      <button
        onClick={() => {
          bypass();
          router.push('/');
        }}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border-2 border-amber-500 text-amber-600 font-semibold hover:bg-amber-50 transition-colors"
      >
        <Zap className="w-4 h-4" />
        Bypass Authentication (Dev Mode)
      </button>
    </div>
  );
}
