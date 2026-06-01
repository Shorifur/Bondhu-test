'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Check, ArrowRight } from 'lucide-react';

const languages = [
  { id: 'bn', nameBn: 'বাংলা', nameEn: 'Bengali', flag: '🇧🇩', sample: 'বন্ধুতে আপনাকে স্বাগতম' },
  { id: 'en', nameBn: 'English', nameEn: 'English', flag: '🇬🇧', sample: 'Welcome to Bondhu' },
];

export default function LanguageSelectPage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string>('bn');

  const handleContinue = () => {
    localStorage.setItem('bondhu-lang', selectedLang);
    router.push('/onboarding/method');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE9FF 100%)' }}>
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
          <h1 className="text-2xl font-extrabold text-[#0F0A1E] font-bangla">ভাষা নির্বাচন করুন</h1>
          <p className="text-sm text-[#6B5E8A] mt-1">Select Your Language</p>
        </div>

        {/* Globe icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F5F2FF] flex items-center justify-center">
            <Globe className="w-6 h-6 text-[#5B21B6]" />
          </div>
        </div>

        {/* Language options */}
        <div className="space-y-3 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                selectedLang === lang.id
                  ? 'border-[#5B21B6] bg-[#F5F2FF] shadow-sm'
                  : 'border-[#DDD6F3] bg-white hover:border-[#B8A9E3] hover:bg-[#F5F2FF]/50'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1">
                <p className="font-bold text-[#0F0A1E] text-sm">{lang.nameBn}</p>
                <p className="text-[10px] text-[#6B5E8A]">{lang.nameEn}</p>
              </div>
              {selectedLang === lang.id ? (
                <div className="w-6 h-6 rounded-full bondhu-gradient flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-[#DDD6F3]" />
              )}
            </button>
          ))}
        </div>

        {/* Preview text */}
        <div className="text-center mb-6">
          <p className="text-sm text-[#6B5E8A] font-bangla">
            {languages.find(l => l.id === selectedLang)?.sample}
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 bondhu-gradient text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <span className="font-bangla">{selectedLang === 'bn' ? 'চালিয়ে যান' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Info text */}
        <p className="text-center text-[10px] text-[#9B8FC0] mt-4 font-bangla">
          {selectedLang === 'bn'
            ? 'পরবর্তী পেজে আপনি ইমেইল বা ফোন নম্বর দিয়ে সাইন আপ করতে পারবেন'
            : 'On the next page you can sign up with email or phone number'}
        </p>
      </motion.div>
    </div>
  );
}
