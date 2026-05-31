'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { BottomNav } from '@/components/navigation/BottomNav';
import { PostMenuSheet } from '@/components/sheets/PostMenuSheet';
import { ShareDrawer } from '@/components/sheets/ShareDrawer';
import { FintechDrawer } from '@/components/sheets/FintechDrawer';
import { EditPostSheet } from '@/components/sheets/EditPostSheet';
import { ReportSheet } from '@/components/sheets/ReportSheet';
import { FollowListSheet } from '@/components/sheets/FollowListSheet';
import { CreateCommunitySheet } from '@/components/sheets/CreateCommunitySheet';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { Providers } from '@/app/providers';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/onboarding');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F7FF' }}>
        <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Providers>
      <WebSocketProvider>
        {/* Full-screen lavender background */}
        <div className="min-h-screen w-full flex justify-center" style={{ backgroundColor: '#F2EFFF' }}>
          {/* Phone-like centered container */}
          <div className="w-full max-w-[430px] relative shadow-2xl" style={{ backgroundColor: '#F8F7FF' }}>
            <main className="w-full">{children}</main>
            <BottomNav />
            <PostMenuSheet />
            <ShareDrawer />
            <FintechDrawer />
            <EditPostSheet />
            <ReportSheet />
            <FollowListSheet />
            <CreateCommunitySheet />
            <ToastContainer />
          </div>
        </div>
      </WebSocketProvider>
    </Providers>
  );
}
