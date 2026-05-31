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
        <div className="min-h-screen w-full" style={{ backgroundColor: '#FAF8F5' }}>
          {/* Desktop: Show TopBar + Sidebar layout */}
          {/* Mobile: Show TopBar + BottomNav */}
          
          {/* Top Header Bar - visible on all screens */}
          <TopBar />

          <div className="flex">
            {/* Desktop Sidebar - hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block">
              <DesktopSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full lg:ml-0 pb-20 lg:pb-8 pt-14">
              {/* Mobile: full width with px-4 */}
              {/* Desktop: max-w-2xl centered */}
              <div className="w-full lg:max-w-2xl lg:mx-auto">
                {children}
              </div>
            </main>

            {/* Desktop Right Sidebar - hidden on mobile */}
            <div className="hidden xl:block w-80 p-4 pt-16">
              <div className="sticky top-20 space-y-4">
                {/* Trending topics or suggestions can go here */}
                <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}>
                  <h3 className="font-bold text-sm text-[#5B8C7F] mb-3 font-bangla">ট্রেন্ডিং</h3>
                  <div className="space-y-3">
                    {['#ঈদ_উল_ফিতর', '#বাংলাদেশ_ক্রিকেট', '#পদ্মা_সেতু', '#ডিজিটাল_বাংলাদেশ'].map((tag) => (
                      <div key={tag} className="flex items-center justify-between">
                        <span className="text-sm text-[#7C3AED] font-medium">{tag}</span>
                        <span className="text-[10px] text-[#9B8FC0]">2.4k posts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Nav - hidden on desktop */}
          <div className="lg:hidden">
            <BottomNav />
          </div>

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
