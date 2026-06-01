'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Globe, ChevronRight } from 'lucide-react';

export default function MethodSelectPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en' | 'bng'>('bn');

  const t = {
    bn: {
      back: 'পেছনে',
      title: 'বন্ধুতে যোগ দিন',
      subtitle: 'আপনার পছন্দের উপায়ে অ্যাকাউন্ট তৈরি করুন',
      emailSignup: 'ইমেইল দিয়ে সাইন আপ',
      emailSub: 'দ্রুত এবং সহজ — বিশ্বজুড়ে কাজ করে',
      phoneSignup: 'ফোন নম্বর দিয়ে সাইন আপ',
      phoneSub: 'বাংলাদেশি মোবাইল নম্বর প্রয়োজন',
      abroad: 'বাংলাদেশের বাইরে থাকলে ইমেইল ব্যবহার করুন',
    },
    en: {
      back: 'Back',
      title: 'Join Bondhu',
      subtitle: 'Create your account your way',
      emailSignup: 'Sign up with Email',
      emailSub: 'Fast & easy — works worldwide',
      phoneSignup: 'Sign up with Phone',
      phoneSub: 'Bangladeshi mobile number required',
      abroad: 'If outside Bangladesh, use email signup',
    },
    bng: {
      back: 'Pichone',
      title: 'Bondhu-te Jog Din',
      subtitle: 'Apnar account toiri korun',
      emailSignup: 'Email diye Sign up',
      emailSub: 'Shohoj — shob jaygay kaaj kore',
      phoneSignup: 'Phone diye Sign up',
      phoneSub: 'Bangladeshi number dorkar',
      abroad: 'Bangladesher baire thakle email use korun',
    },
  }[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Back */}
        <button onClick={() => router.push('/onboarding')} className="flex items-center gap-2 text-[#6B5E8A] hover:text-[#0F0A1E] transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bangla">{t.back}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#0F0A1E] font-bangla">{t.title}</h1>
          <p className="text-sm text-[#6B5E8A] mt-1">{t.subtitle}</p>
        </div>

        {/* Email — Primary */}
        <button
          onClick={() => router.push('/register')}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-white bondhu-gradient shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mb-3"
        >
          <Mail className="w-5 h-5" />
          <div className="text-left flex-1">
            <div className="text-sm font-bangla">{t.emailSignup}</div>
            <div className="text-[11px] opacity-90">{t.emailSub}</div>
          </div>
          <ChevronRight className="w-4 h-4 opacity-70" />
        </button>

        {/* Phone */}
        <button
          onClick={() => { /* phone OTP flow */ }}
          className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#DDD6F3] text-[#0F0A1E] font-semibold hover:bg-[#F5F2FF] transition-all flex items-center justify-center gap-3"
        >
          <Phone className="w-5 h-5 text-[#5B21B6]" />
          <div className="text-left flex-1">
            <div className="text-sm font-bangla">{t.phoneSignup}</div>
            <div className="text-[11px] text-[#6B5E8A]">{t.phoneSub}</div>
          </div>
        </button>

        {/* Abroad info */}
        <div className="flex items-start gap-2 text-xs text-[#9B8FC0] bg-[#F5F2FF] rounded-xl p-3 mt-4">
          <Globe className="w-4 h-4 mt-0.5 shrink-0 text-[#5B21B6]" />
          <p className="font-bangla">{t.abroad}</p>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-[#6B5E8A] mt-6">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-[#5B21B6] font-bold hover:underline">Login</button>
        </p>
      </motion.div>
    </div>
  );
}
