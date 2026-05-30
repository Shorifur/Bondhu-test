'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ShopIcon,
  JobsIcon,
  BazaarIcon,
  AddaIcon,
  CricketIcon,
  LeaderboardIcon,
  SettingsIcon,
  SOSIcon,
} from '@/components/ui/CulturalIcons';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: ShopIcon, label: 'Shop', labelBn: 'দোকান', href: '/shop', color: '#7C3AED' },
  { icon: JobsIcon, label: 'Jobs', labelBn: 'চাকরি', href: '/jobs', color: '#2563EB' },
  { icon: BazaarIcon, label: 'Bazaar', labelBn: 'বাজার', href: '/bazaar', color: '#059669' },
  { icon: AddaIcon, label: 'Adda', labelBn: 'আড্ডা', href: '/adda', color: '#D97706' },
  { icon: CricketIcon, label: 'Cricket', labelBn: 'ক্রিকেট', href: '/cricket', color: '#DC2626' },
  { icon: LeaderboardIcon, label: 'Leaderboard', labelBn: 'লিডারবোর্ড', href: '/leaderboard', color: '#7C3AED' },
  { icon: SettingsIcon, label: 'Settings', labelBn: 'সেটিংস', href: '/settings', color: '#6B7280' },
  { icon: SOSIcon, label: 'SOS Emergency', labelBn: 'জরুরী', href: '/settings?sos=1', color: '#DC2626' },
];

export default function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-t-3xl pb-safe"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-[#E8E4F5]" />
            </div>

            {/* Title */}
            <div className="px-5 pb-4">
              <h2 className="text-lg font-bold text-[#1a1a2e]">More</h2>
              <p className="text-xs text-[#9B8FC0] font-bangla">আরও অপশন</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3 px-5 pb-8">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.href)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors hover:bg-[#FAFAFF] active:bg-[#F0EEF8]"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}12` }}
                  >
                    <item.icon size={24} style={{ color: item.color }} />
                  </div>
                  <span className="text-[11px] font-medium text-[#1a1a2e] leading-tight text-center">
                    {item.label}
                  </span>
                  <span className="text-[9px] text-[#9B8FC0] font-bangla -mt-1">{item.labelBn}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
