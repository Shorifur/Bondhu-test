'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { TopBar } from '@/components/navigation/TopBar';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bondhu-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Providers>
      <WebSocketProvider>
        <div className="min-h-screen bg-background pb-20">
          <TopBar />
          <main className="max-w-2xl mx-auto pt-16 px-4">{children}</main>
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
      </WebSocketProvider>
    </Providers>
  );
}
