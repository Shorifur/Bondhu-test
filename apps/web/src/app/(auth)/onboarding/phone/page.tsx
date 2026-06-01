'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Shield, Zap, Mail, Globe } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn, isBangladeshiPhone } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const bypass = useAuthStore((s) => s.bypass);
  const [mode, setMode] = useState<'choose' | 'phone'>('choose');
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

  // Mode: choose — show email + phone options
  if (mode === 'choose') {
    return (
      <div className="flex flex-col space-y-6 py-8">
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-2xl bondhu-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-extrabold text-white font-bangla">ব</span>
          </div>
          <h2 className="text-2xl font-bold text-[#0F0A1E] font-bangla">বন্ধুতে যোগ দিন</h2>
          <p className="text-muted-foreground text-sm">Join Bondhu — Bangladesh's Own Social Network</p>
        </div>

        {/* Email Signup — Primary */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/register')}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-white bondhu-gradient shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-bangla">ইমেইল দিয়ে একাউন্ট তৈরি করুন</div>
              <div className="text-[11px] opacity-90">Sign up with Email</div>
            </div>
          </button>

          <button
            onClick={() => router.push('/login')}
            className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#DDD6F3] text-[#5B21B6] font-semibold hover:bg-[#F5F2FF] transition-all flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-bangla">ইমেইল দিয়ে লগইন করুন</div>
              <div className="text-[11px] text-[#6B5E8A]">Login with Email</div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#DDD6F3]" />
          <span className="text-xs text-[#9B8FC0] font-bangla">অথবা</span>
          <div className="flex-1 h-px bg-[#DDD6F3]" />
        </div>

        {/* Phone Option */}
        <button
          onClick={() => setMode('phone')}
          className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#DDD6F3] text-[#0F0A1E] font-semibold hover:bg-[#F5F2FF] transition-all flex items-center justify-center gap-3"
        >
          <Phone className="w-5 h-5 text-[#5B21B6]" />
          <div className="text-left">
            <div className="text-sm font-bangla">ফোন নম্বর দিয়ে চালিয়ে যান</div>
            <div className="text-[11px] text-[#6B5E8A]">Continue with Phone Number</div>
          </div>
        </button>

        {/* Info for abroad users */}
        <div className="flex items-start gap-2 text-xs text-[#9B8FC0] bg-[#F5F2FF] rounded-xl p-3">
          <Globe className="w-4 h-4 mt-0.5 shrink-0 text-[#5B21B6]" />
          <p className="font-bangla">
            বাংলাদেশের বাইরে থাকলে ইমেইল দিয়ে একাউন্ট তৈরি করুন।
            <span className="block text-[10px] mt-0.5">If you are outside Bangladesh, please use email signup.</span>
          </p>
        </div>

        {/* Dev bypass */}
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

  // Mode: phone — phone number input
  return (
    <div className="flex flex-col space-y-6 py-8">
      <button onClick={() => setMode('choose')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-bangla">ফোন নম্বর দিন</h2>
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
          <p>Supported: Grameenphone (017, 013), Robi (018), Airtel (016), Banglalink (019, 014), Teletalk (015)</p>
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
    </div>
  );
}
