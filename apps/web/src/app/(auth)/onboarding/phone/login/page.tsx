// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, ArrowRight } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { api } from '@/lib/api';

export default function PhoneLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Add +880 prefix if starts with 0
    if (digits.startsWith('0')) {
      return '+880' + digits.substring(1);
    }
    if (digits.startsWith('1')) {
      return '+880' + digits;
    }
    if (digits.startsWith('8')) {
      return '+' + digits;
    }
    return digits ? '+' + digits : '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError('');
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 11) {
      setError('সঠিক ফোন নম্বর দিন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.sendOtp(phone);
      setStep('otp');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'OTP পাঠাতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError('সঠিক OTP দিন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.verifyOtp(phone, otp);
      if (res.data?.tokens?.accessToken) {
        api.setToken(res.data.tokens.accessToken);
        localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        window.location.href = '/';
      } else {
        setError('ভেরিফিকেশন ব্যর্থ');
      }
    } catch (err: any) {
      setError(err?.message || 'ভেরিফিকেশন ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Back */}
        <button onClick={() => step === 'otp' ? setStep('phone') : router.push('/onboarding/phone')} className="flex items-center gap-2 text-[#6B5E8A] hover:text-[#0F0A1E] transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bangla">পেছনে</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bondhu-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F0A1E] font-bangla">
            {step === 'phone' ? 'ফোন নম্বর দিন' : 'যাচাইকরণ কোড'}
          </h1>
          <p className="text-sm text-[#6B5E8A] mt-1">
            {step === 'phone' ? 'আপনার বাংলাদেশি মোবাইল নম্বর দিন' : `${phone} এ OTP পাঠানো হয়েছে`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-bangla mb-4">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B5E8A] text-sm font-medium">+880</span>
              <input
                type="tel"
                value={phone.replace('+880', '')}
                onChange={(e) => setPhone('+880' + e.target.value.replace(/\D/g, '').substring(0, 10))}
                placeholder="1712345678"
                maxLength={10}
                className="w-full pl-16 pr-4 py-3.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] transition-colors font-medium"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length < 13}
              className="w-full py-3.5 bondhu-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all hover:shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="font-bangla">OTP পাঠান</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val) {
                      const newOtp = otp.split('');
                      newOtp[i] = val[0];
                      setOtp(newOtp.join(''));
                      setError('');
                      // Focus next
                      const next = e.target.parentElement?.nextElementSibling?.querySelector('input');
                      if (next) next.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                      const prev = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
                      if (prev) prev.focus();
                    }
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold bg-white border-2 border-[#DDD6F3] rounded-xl outline-none focus:border-[#5B21B6] transition-colors"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 4}
              className="w-full py-3.5 bondhu-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all hover:shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="font-bangla">যাচাই করুন</span>
              )}
            </button>
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-xs text-[#9B8FC0] font-bangla">{countdown} সেকেন্ড পর আবার পাঠান</p>
              ) : (
                <button onClick={handleSendOtp} className="text-sm text-[#5B21B6] font-bold hover:underline font-bangla">
                  আবার OTP পাঠান
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
