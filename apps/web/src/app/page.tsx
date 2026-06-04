'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F6]">
      <div className="w-10 h-10 border-4 border-[#DDD6F3] border-t-[#5B21B6] rounded-full animate-spin" />
    </div>
  );
}
