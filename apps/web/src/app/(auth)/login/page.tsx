// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('auth/login', { email, password });
      const data = (res as any)?.data;

      if (data?.tokens?.accessToken) {
        api.setToken(data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        window.location.href = '/';
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bondhu-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-extrabold text-white font-bangla">ব</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F0A1E] font-bangla">বন্ধুতে লগইন</h1>
          <p className="text-sm text-[#6B5E8A] mt-1">Welcome back to Bondhu</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-bangla">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3D2B6B] font-bangla">ইমেইল / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3D2B6B] font-bangla">পাসওয়ার্ড / Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8FC0]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bondhu-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all hover:shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="font-bangla">লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#DDD6F3]" />
          <span className="text-xs text-[#9B8FC0]">or</span>
          <div className="flex-1 h-px bg-[#DDD6F3]" />
        </div>

        {/* Phone Login */}
        <button
          onClick={() => router.push('/onboarding/phone')}
          className="w-full py-3 bg-white border border-[#DDD6F3] text-[#5B21B6] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#F5F2FF] transition-colors"
        >
          <span className="font-bangla">ফোন নম্বর দিয়ে লগইন</span>
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-[#6B5E8A] mt-6">
          একাউন্ট নেই?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-[#5B21B6] font-bold hover:underline font-bangla inline-flex items-center gap-1"
          >
            নতুন একাউন্ট <ArrowRight className="w-3 h-3" />
          </button>
        </p>
      </motion.div>
    </div>
  );
}
