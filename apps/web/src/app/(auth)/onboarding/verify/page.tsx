'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function OtpVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const login = useAuthStore((s) => s.login);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      setActiveIndex(index + 1);
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d) && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(
    async (code: string) => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await login(phone, code);
        if (res.requiresProfile) {
          router.push('/onboarding/profile');
        } else {
          router.push('/');
        }
      } catch (err: any) {
        setError(err.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        setActiveIndex(0);
        inputsRef.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [phone, login, router, loading],
  );

  const handleResend = async () => {
    setTimer(60);
    await api.post('auth/otp/send', { phoneNumber: phone });
  };

  return (
    <div className="flex flex-col space-y-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Verify your number</h2>
        <p className="text-muted-foreground flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Code sent to {phone}
        </p>
      </div>

      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => setActiveIndex(i)}
            className={cn(
              'w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-card transition-all focus:outline-none',
              activeIndex === i ? 'border-bondhu-green shadow-lg shadow-bondhu-green/10' : 'border-border',
              digit && 'border-bondhu-green/50',
            )}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-destructive">
          {error}
        </motion.p>
      )}

      <div className="text-center space-y-2">
        {timer > 0 ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>Resend in {timer}s</span>
          </div>
        ) : (
          <button onClick={handleResend} className="text-bondhu-green font-medium hover:underline">
            Call me via Voice OTP
          </button>
        )}
      </div>

      <button
        onClick={() => handleVerify(otp.join(''))}
        disabled={loading || otp.some((d) => !d)}
        className={cn(
          'w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all',
          loading || otp.some((d) => !d)
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-bondhu-green hover:bg-bondhu-green-dark shadow-lg shadow-bondhu-green/20',
        )}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  );
}
