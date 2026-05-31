'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ShopIcon, BazaarIcon, JobsIcon, SportIcon,
  LeaderboardIcon, SOSIcon, AddaIcon, PointsIcon,
} from '@/components/ui/CulturalIcons';

interface MoreBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: ShopIcon, labelBn: 'দোকান', label: 'Shop', href: '/shop', color: '#7C3AED', bg: '#F3EEFD' },
  { icon: BazaarIcon, labelBn: 'বাজার', label: 'Bazaar', href: '/bazaar', color: '#059669', bg: '#ECFDF5' },
  { icon: JobsIcon, labelBn: 'চাকরি', label: 'Jobs', href: '/jobs', color: '#2563EB', bg: '#EFF6FF' },
  { icon: SportIcon, labelBn: 'খেলাধুলা', label: 'Sports', href: '/sports', color: '#DC2626', bg: '#FEF2F2' },
  { icon: LeaderboardIcon, labelBn: 'লিডারবোর্ড', label: 'Leaderboard', href: '/leaderboard', color: '#D97706', bg: '#FFFBEB' },
  { icon: SOSIcon, labelBn: 'জরুরি সেবা', label: 'SOS', href: '/sos', color: '#E11D48', bg: '#FFF1F2' },
  { icon: AddaIcon, labelBn: 'আড্ডা', label: 'Adda', href: '/adda', color: '#0891B2', bg: '#ECFEFF' },
  { icon: PointsIcon, labelBn: 'পয়েন্ট', label: 'Points', href: '/points', color: '#7C3AED', bg: '#F3EEFD' },
];

export default function MoreBottomSheet({ isOpen, onClose }: MoreBottomSheetProps) {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    onClose();
    setTimeout(() => router.push(href), 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-t-3xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-[#E8E4F5]" />
            </div>

            {/* Title */}
            <div className="px-5 pb-4">
              <h2 className="text-base font-bold text-[#2D1B69]">More Options</h2>
              <p className="text-xs text-[#9B8FC0] font-bangla">আরও অপশন</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-2 px-5 pb-8">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.href)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95 hover:brightness-95"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.icon size={26} style={{ color: item.color }} />
                  <span className="text-[11px] font-semibold leading-tight text-center" style={{ color: item.color }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] font-bangla leading-tight text-center opacity-60" style={{ color: item.color }}>
                    {item.labelBn}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
