'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BazaarIcon, MapPinIcon, SearchIcon, ShopIcon } from '@/components/ui/CulturalIcons';

const divisions = ['All', 'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'];

const BAZAARS = [
  { id: '1', nameBn: 'কারওয়ান বাজার', nameEn: 'Karwan Bazar', district: 'Dhaka', upazila: 'Tejgaon', sellers: 1240, products: 8500, days: 'Daily', type: 'daily', lat: 23.757, lng: 90.39 },
  { id: '2', nameBn: 'নিউ মার্কেট', nameEn: 'New Market', district: 'Dhaka', upazila: 'Dhanmondi', sellers: 2100, products: 15200, days: 'Daily', type: 'daily', lat: 23.73, lng: 90.39 },
  { id: '3', nameBn: 'শ্যামবাজার', nameEn: 'Shyambazar', district: 'Dhaka', upazila: 'Sutrapur', sellers: 890, products: 5600, days: 'Daily', type: 'daily', lat: 23.71, lng: 90.41 },
  { id: '4', nameBn: 'খাতুঞ্জি', nameEn: 'Khatunganj', district: 'Chattogram', upazila: 'Chawkbazar', sellers: 1560, products: 9800, days: 'Daily', type: 'daily', lat: 22.34, lng: 91.83 },
  { id: '5', nameBn: 'বিশ্ব রোড বাজার', nameEn: 'Bissho Road Bazar', district: 'Sylhet', upazila: 'Sylhet Sadar', sellers: 670, products: 4200, days: 'Daily', type: 'daily', lat: 24.89, lng: 91.87 },
  { id: '6', nameBn: 'বুড়িমারী বাজার', nameEn: 'Burimari Bazar', district: 'Lalmonirhat', upazila: 'Patgram', sellers: 340, products: 2100, days: 'Sun, Wed', type: 'bi-weekly', lat: 26.48, lng: 89.03 },
  { id: '7', nameBn: 'বালু বাজার', nameEn: 'Balu Bazar', district: 'Gazipur', upazila: 'Sreepur', sellers: 450, products: 3100, days: 'Fri', type: 'weekly', lat: 24.2, lng: 90.47 },
  { id: '8', nameBn: 'টুঙ্গী বাজার', nameEn: 'Tongi Bazar', district: 'Gazipur', upazila: 'Tongi', sellers: 780, products: 5400, days: 'Daily', type: 'daily', lat: 23.9, lng: 90.41 },
  { id: '9', nameBn: 'রাণীশংকৈল বাজার', nameEn: 'Ranishankail Bazar', district: 'Thakurgaon', upazila: 'Ranishankail', sellers: 280, products: 1800, days: 'Mon, Thu', type: 'bi-weekly', lat: 25.88, lng: 88.25 },
  { id: '10', nameBn: 'চকবাজার', nameEn: 'Chawk Bazar', district: 'Chattogram', upazila: 'Chattogram Sadar', sellers: 1890, products: 11200, days: 'Daily', type: 'daily', lat: 22.34, lng: 91.84 },
  { id: '11', nameBn: 'পাবনা বাজার', nameEn: 'Pabna Bazar', district: 'Pabna', upazila: 'Pabna Sadar', sellers: 560, products: 3800, days: 'Daily', type: 'daily', lat: 24.01, lng: 89.24 },
  { id: '12', nameBn: 'কুষ্টিয়া বাজার', nameEn: 'Kushtia Bazar', district: 'Kushtia', upazila: 'Kushtia Sadar', sellers: 720, products: 4500, days: 'Daily', type: 'daily', lat: 23.91, lng: 89.12 },
];

export default function BazaarPage() {
  const router = useRouter();
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = BAZAARS.filter((b) => {
    const matchDivision = selectedDivision === 'All' || b.district === selectedDivision || (selectedDivision === 'Dhaka' && ['Dhaka', 'Gazipur'].includes(b.district));
    const matchSearch = !searchQuery || b.nameBn.includes(searchQuery) || b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || b.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDivision && matchSearch;
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <BazaarIcon size={24} className="text-[#059669]" />
          <div>
            <h1 className="font-bold text-[15px] font-bold font-bangla leading-tight">বাজার খুঁজুন</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Find Your Local Bazaar</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-[#F5F3FF] rounded-xl px-3 py-2">
            <SearchIcon size={16} className="text-[#9B8FC0] shrink-0" />
            <input type="text" placeholder="বাজারের নাম খুঁজুন..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#1a1a2e] placeholder:text-[#B8A9D9] outline-none w-full font-bangla" />
          </div>
        </div>

        {/* Division Tabs */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {divisions.map((d) => (
            <button key={d} onClick={() => setSelectedDivision(d)}
              className={selectedDivision === d ? 'gradient-chip-active whitespace-nowrap' : 'gradient-chip-inactive whitespace-nowrap'}>
              {d}
            </button>
          ))}
        </div>
      </header>

      {/* Stats */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-[#9B8FC0]">{filtered.length} bazaars found</span>
        <button className="text-xs font-medium text-[#7C3AED] font-bangla flex items-center gap-1">
          <MapPinIcon size={12} /> আমার কাছের বাজার
        </button>
      </div>

      {/* Bazaar Cards */}
      <div className="space-y-2.5 px-3">
        {filtered.map((bazaar, i) => (
          <motion.div
            key={bazaar.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
            style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-[#1a1a2e] font-bangla">{bazaar.nameBn}</h3>
                <p className="text-[11px] text-[#9B8FC0]">{bazaar.nameEn}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPinIcon size={12} className="text-[#9B8FC0]" />
                  <span className="text-[11px] text-[#9B8FC0]">{bazaar.district}, {bazaar.upazila}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED] font-medium">
                    <ShopIcon size={10} className="inline mr-1" />{bazaar.sellers} sellers
                  </span>
                  <span className="text-[11px] text-[#9B8FC0]">{bazaar.products} products</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-600">{bazaar.days}</span>
                </div>
              </div>
              <button
                onClick={() => router.push(`/bazaar/${bazaar.id}`)}
                className="px-3 py-1.5 rounded-full text-white text-[11px] font-medium shrink-0"
                style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}
              >
                Visit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BazaarIcon size={40} className="text-[#E8E4F5] mx-auto mb-2" />
          <p className="text-sm text-[#9B8FC0] font-bangla">কোনো বাজার পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}
