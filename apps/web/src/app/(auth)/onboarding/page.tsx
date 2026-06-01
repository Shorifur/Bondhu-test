'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { Globe, ChevronRight, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'bn' as const, label: 'বাংলা', script: 'বন্ধনে অবিরত' },
  { code: 'en' as const, label: 'English', script: 'Connected Always' },
  { code: 'bng' as const, label: 'Banglish', script: 'Bondhune Obirrot' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { language, setLanguage } = useUIStore();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bondhu-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-bondhu-green flex items-center justify-center shadow-lg shadow-bondhu-green/20">
          <MessageCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
        <motion.div
          className="absolute -inset-2 rounded-3xl border-2 border-bondhu-green/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="font-bangla text-bondhu-green">বন্ধু</span>
          <span className="text-foreground"> Bondhu</span>
        </h1>
        <p className="text-muted-foreground text-lg font-bangla">
          {languages.find((l) => l.code === language)?.script}
        </p>
      </div>

      {/* Language Selector */}
      <div className="w-full space-y-3">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Select Language / ভাষা নির্বাচন
        </p>
        <div className="grid grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
                language === lang.code
                  ? 'border-bondhu-green bg-bondhu-green/5 text-bondhu-green'
                  : 'border-border bg-card hover:border-bondhu-green/30',
              )}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium text-sm">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="w-full space-y-3">
        <button
          onClick={() => router.push('/onboarding/phone')}
          className="w-full flex items-center justify-center gap-2 bg-bondhu-green hover:bg-bondhu-green-dark text-white font-semibold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-bondhu-green/20"
        >
          {language === 'bn' ? 'চালিয়ে যান' : language === 'bng' ? 'Cholte Thakun' : 'Continue'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
