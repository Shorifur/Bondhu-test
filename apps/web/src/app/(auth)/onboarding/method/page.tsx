'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, ArrowRight } from 'lucide-react';

export default function MethodSelectPage() {
  const router = useRouter();
  const lang = typeof window !== 'undefined' ? localStorage.getItem('bondhu-lang') || 'bn' : 'bn';

  const t = {
    bn: {
      title: 'বন্ধুতে যোগ দিন',
      subtitle: 'Join Bondhu',
      emailSignup: 'ইমেইল দিয়ে একাউন্ট তৈরি করুন',
      emailSignupSub: 'Sign up with Email',
      emailLogin: 'ইমেইল দিয়ে লগইন করুন',
      emailLoginSub: 'Login with Email',
      phoneOption: 'ফোন নম্বর দিয়ে চালিয়ে যান',
      phoneOptionSub: 'Continue with Phone',
      divider: 'অথবা',
      abroadInfo: 'বাংলাদেশের বাইরে থাকলে ইমেইল দিয়ে একাউন্ট তৈরি করুন।',
      abroadInfoSub: 'If you are outside Bangladesh, please use email signup.',
    },
    en: {
      title: 'Join Bondhu',
      subtitle: "Bangladesh's Own Social Network",
      emailSignup: 'Sign up with Email',
      emailSignupSub: 'Create a new account',
      emailLogin: 'Login with Email',
      emailLoginSub: 'Already have an account',
      phoneOption: 'Continue with Phone',
      phoneOptionSub: 'Bangladeshi mobile number',
      divider: 'or',
      abroadInfo: 'If you are outside Bangladesh, please use email signup.',
      abroadInfoSub: 'Email works worldwide.',
    },
  }[lang as 'bn' | 'en'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bondhu-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-extrabold text-white font-bangla">ব</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F0A1E] font-bangla">{t.title}</h1>
          <p className="text-sm text-[#6B5E8A] mt-1">{t.subtitle}</p>
        </div>

        {/* Email Signup — Primary */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/register')}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-white bondhu-gradient shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-bangla">{t.emailSignup}</div>
              <div className="text-[11px] opacity-90">{t.emailSignupSub}</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
          </button>

          <button
            onClick={() => router.push('/login')}
            className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#DDD6F3] text-[#5B21B6] font-semibold hover:bg-[#F5F2FF] transition-all flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-bangla">{t.emailLogin}</div>
              <div className="text-[11px] text-[#6B5E8A]">{t.emailLoginSub}</div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#DDD6F3]" />
          <span className="text-xs text-[#9B8FC0] font-bangla">{t.divider}</span>
          <div className="flex-1 h-px bg-[#DDD6F3]" />
        </div>

        {/* Phone Option */}
        <button
          onClick={() => router.push('/onboarding/phone-input')}
          className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#DDD6F3] text-[#0F0A1E] font-semibold hover:bg-[#F5F2FF] transition-all flex items-center justify-center gap-3"
        >
          <Phone className="w-5 h-5 text-[#5B21B6]" />
          <div className="text-left">
            <div className="text-sm font-bangla">{t.phoneOption}</div>
            <div className="text-[11px] text-[#6B5E8A]">{t.phoneOptionSub}</div>
          </div>
        </button>

        {/* Info for abroad users */}
        <div className="flex items-start gap-2 text-xs text-[#9B8FC0] bg-[#F5F2FF] rounded-xl p-3 mt-4">
          <Globe className="w-4 h-4 mt-0.5 shrink-0 text-[#5B21B6]" />
          <p className="font-bangla">
            {t.abroadInfo}
            <span className="block text-[10px] mt-0.5">{t.abroadInfoSub}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
