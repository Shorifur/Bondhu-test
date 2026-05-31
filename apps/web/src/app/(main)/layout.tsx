'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { BottomNav } from '@/components/navigation/BottomNav';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { TopBar } from '@/components/navigation/TopBar';
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
import { TrendingSidebar } from '@/components/navigation/TrendingSidebar';

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
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F6]">
        <div className="w-10 h-10 border-4 border-[#DDD6F3] border-t-[#5B21B6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Providers>
      <WebSocketProvider>
        {/* ── Page Background with subtle iridescent radial gradient ── */}
        <div className="min-h-screen w-full bg-[#F4F7F6] relative">
          {/* Subtle iridescent background blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#E8D5F5]/20 blur-[120px]" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#D4F1E0]/20 blur-[100px]" />
            <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-[#D0E8F9]/20 blur-[90px]" />
          </div>

          {/* Top Header — visible on all screens */}
          <TopBar />

          {/* ── 3-Column Grid Layout ── */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-20 pb-24 lg:pb-8 relative z-10">

            {/* LEFT: Desktop Navigation Sidebar (3 cols) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20">
                <DesktopSidebar />
              </div>
            </aside>

            {/* CENTER: Main Feed (6 cols on desktop, full on mobile) */}
            <main className="col-span-1 lg:col-span-6 space-y-4 min-w-0">
              {children}
            </main>

            {/* RIGHT: Trending / Discover (3 cols) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20">
                <TrendingSidebar />
              </div>
            </aside>
          </div>

          {/* Mobile Bottom Nav — hidden on desktop */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <BottomNav />
          </div>

          {/* Global overlays */}
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
