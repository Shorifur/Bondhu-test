'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, MapPin, ArrowRight, Eye, EyeOff, ChevronDown, Check, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { districts } from '@/lib/districts';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [legalName, setLegalName] = useState('');
  const [handle, setHandle] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateStep1 = () => {
    if (!email || !email.includes('@')) { setError('Valid email required'); return false; }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!legalName || legalName.length < 2) { setError('Enter your full name'); return false; }
    if (!handle || handle.length < 3) { setError('Handle must be at least 3 characters'); return false; }
    if (!/^[a-zA-Z0-9_]+$/.test(handle)) { setError('Handle: letters, numbers, underscores only'); return false; }
    if (!districtId) { setError('Select your district'); return false; }
    if (!gender) { setError('Select your gender'); return false; }
    return true;
  };

  const handleNext = () => { setError(''); if (validateStep1()) setStep(2); };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const res = await api.post('auth/register', {
        email, password, legalName, handle,
        districtId: Number(districtId),
        gender,
      });
      const data = (res as any)?.data;

      if (data?.tokens?.accessToken) {
        api.setToken(data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        setSuccess(true);
        setTimeout(() => { window.location.href = '/'; }, 1500);
      } else {
        setError('Registration failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0F0A1E] font-bangla">Account Created!</h2>
          <p className="text-sm text-[#6B5E8A] mt-2">Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bondhu-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-extrabold text-white font-bangla">ব</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F0A1E] font-bangla">New Account</h1>
          <p className="text-sm text-[#6B5E8A] mt-1">Create your Bondhu account</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bondhu-gradient' : 'bg-[#DDD6F3]'}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bondhu-gradient' : 'bg-[#DDD6F3]'}`} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-bangla mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Email & Password */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0]" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8FC0]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0]" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
              </div>
            </div>

            <button onClick={handleNext} className="w-full py-3.5 bondhu-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-sm text-[#6B5E8A] mt-4">
              Already have an account?{' '}
              <button onClick={() => router.push('/login')} className="text-[#5B21B6] font-bold hover:underline">Login</button>
            </p>
          </motion.div>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0]" />
                <input type="text" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Rafiq Ahmed"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">Username (@handle)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8FC0] text-sm">@</span>
                <input type="text" value={handle} onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="rafiq_ahmed"
                  className="w-full pl-8 pr-4 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
              </div>
              <p className="text-[10px] text-[#9B8FC0]">Letters, numbers, underscores only</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">District</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0] z-10" />
                <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla text-[#0F0A1E]">
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.nameBn} - {d.nameEn}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3D2B6B]">Gender</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0] z-10" />
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla text-[#0F0A1E]">
                  <option value="">Select Gender</option>
                  <option value="male">Male / পুরুষ</option>
                  <option value="female">Female / মহিলা</option>
                  <option value="other">Other / অন্যান্য</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8FC0] pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-3 bg-[#F5F2FF] text-[#5B21B6] rounded-xl text-sm font-bold">Back</button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3.5 bondhu-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
