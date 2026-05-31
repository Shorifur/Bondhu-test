'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Store, Languages, ShoppingBag, Phone,
  CheckCircle2, ArrowRight, MapPinned, X, Plus, Tag, ArrowLeft,
} from 'lucide-react';
import { BondhuLogo } from '@/components/ui/CulturalIcons';

// ── Types ──
interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
}

interface Bazaar {
  id: string;
  name: string;
  nameEn: string;
  location: string;
}

interface Shop {
  id: string;
  bazaarId: string;
  name: string;
  nameEn: string;
  owner: string;
  phone: string;
  category: string;
  verified: boolean;
  products: Product[];
}

// ── Initial Data ──
const INITIAL_BAZAARS: Bazaar[] = [
  { id: 'b1', name: 'মিরপুর শাহ আলী বাজার', nameEn: 'Mirpur Shah Ali Bazar', location: 'Section-10, Mirpur, Dhaka' },
  { id: 'b2', name: 'কাওরান বাজার পাইকারি আড়ৎ', nameEn: 'Karwan Bazar Hub', location: 'Tejgaon, Dhaka' },
  { id: 'b3', name: 'মোহাম্মদপুর টাউন হল বাজার', nameEn: 'Mohammadpur Town Hall Market', location: 'Asad Gate, Mohammadpur' },
  { id: 'b4', name: 'নিউ মার্কেট', nameEn: 'New Market', location: 'Nilkhet, Dhaka' },
  { id: 'b5', name: 'গাউসিয়া মার্কেট', nameEn: 'Gausia Market', location: 'Gulistan, Dhaka' },
];

const INITIAL_SHOPS: Shop[] = [
  {
    id: 's1', bazaarId: 'b1', name: 'ভাই ভাই ব্রয়লার হাউজ', nameEn: 'Bhai Bhai Broiler House',
    owner: 'মোঃ রফিক', phone: '01712345678', category: 'মাছ-মাংস (Fish & Meat)', verified: true,
    products: [
      { id: 'p1', name: 'দেশি মুরগি', price: '৩২০', unit: 'কেজি' },
      { id: 'p2', name: 'ব্রয়লার মুরগি', price: '১৮৫', unit: 'কেজি' },
      { id: 'p3', name: 'হাঁস', price: '৪৫০', unit: 'কেজি' },
      { id: 'p4', name: 'দেশি ডিম', price: '১৬০', unit: 'হালি (১২ পিস)' },
    ],
  },
  {
    id: 's2', bazaarId: 'b1', name: 'সততা জেনারেল স্টোর', nameEn: 'Sotota General Store',
    owner: 'আলহাজ্ব আব্দুর রহমান', phone: '01811223344', category: 'মুদি দোকান (Grocery)', verified: true,
    products: [
      { id: 'p5', name: 'চিনি গুড়া', price: '১১০', unit: 'কেজি' },
      { id: 'p6', name: 'সয়াবিন তেল', price: '১৬৫', unit: 'লিটার' },
      { id: 'p7', name: 'সিদ্ধ চাল (মিনিকেট)', price: '৭২', unit: 'কেজি' },
      { id: 'p8', name: 'মসুর ডাল', price: '১৪৫', unit: 'কেজি' },
    ],
  },
  {
    id: 's3', bazaarId: 'b2', name: 'করিম ফিশ সাপ্লাই', nameEn: 'Karim Fish Supply',
    owner: 'করিম উদ্দিন', phone: '01619876543', category: 'মাছ-মাংস (Fish & Meat)', verified: false,
    products: [
      { id: 'p9', name: 'ইলিশ মাছ', price: '১২০০', unit: 'কেজি' },
      { id: 'p10', name: 'রুই মাছ', price: '৩৫০', unit: 'কেজি' },
      { id: 'p11', name: 'কাতল মাছ', price: '৪০০', unit: 'কেজি' },
    ],
  },
];

// ── Dictionary ──
const DICT = {
  bn: {
    title: 'বাজার খুঁজুন', subtitle: 'Find Your Local Bazaar',
    buyerTab: '🔍 বাজার ও দোকান খুঁজুন', sellerTab: '🏪 আমি বিক্রেতা',
    searchPlaceholder: 'দোকানের নাম দিয়ে খুঁজুন...',
    emptyBazaarTitle: 'এই বাজারে এখনো কোনো দোকান যুক্ত হয়নি!',
    emptyBazaarDesc: 'আপনি কি এই বাজারের একজন বিক্রেতা? প্রথম দোকানদার হিসেবে আজই আপনার ডিজিটাল দোকানটি চালু করুন!',
    registerShopBtn: '➕ দোকান রেজিস্টার করুন', addBazaarBtn: '➕ নতুন বাজার যুক্ত করুন',
    formTitleShop: 'নতুন দোকান যোগ করুন', formTitleBazaar: 'নতুন বাজার যোগ করুন',
    formShopName: 'দোকানের নাম', formBazaarName: 'বাজারের নাম', formBazaarLocation: 'অবস্থান ও জেলা',
    formOwner: 'মালিকের নাম', formPhone: 'মোবাইল নম্বর',
    formSelectBazaar: 'বাজার নির্বাচন করুন', formCategory: 'ব্যবসার ধরণ',
    formSubmitShop: 'ডিজিটাল দোকান চালু করুন', formSubmitBazaar: 'বাজার যোগ করুন',
    callVendor: 'কল করুন', selectBazaarHeading: 'বাজার নির্বাচন করুন',
    noBazaarsYet: 'কোনো বাজার যোগ করা হয়নি!', backToShops: '← দোকানে ফিরে যান',
    productCatalog: 'পণ্যের মূল্য তালিকা', noProductsYet: 'এই দোকানে এখনো কোনো পণ্য যোগ করা হয়নি।',
    addProductBtn: '➕ নতুন পণ্য যোগ করুন', productNameLabel: 'পণ্যের নাম',
    productPriceLabel: 'মূল্য (৳)', productUnitLabel: 'ইউনিট',
    submitProduct: 'পণ্য যুক্ত করুন', perUnit: 'প্রতি',
    itemsListed: 'টি পণ্য', shopDetail: 'দোকানের বিবরণ', category: 'ক্যাটাগরি',
    owner: 'মালিক', verified: 'যাচাইকৃত',
  },
  en: {
    title: 'Local Bazaar Tracker', subtitle: 'বাজার খুঁজুন',
    buyerTab: '🔍 Find Shops', sellerTab: '🏪 Store Owner',
    searchPlaceholder: 'Search shop name...',
    emptyBazaarTitle: 'No stores registered yet!',
    emptyBazaarDesc: 'Are you a merchant here? Be the first to register your shop!',
    registerShopBtn: '➕ Register Shop', addBazaarBtn: '➕ Suggest Bazaar',
    formTitleShop: 'Create Digital Storefront', formTitleBazaar: 'Add New Bazaar',
    formShopName: 'Shop Name', formBazaarName: 'Bazaar Name', formBazaarLocation: 'Location & District',
    formOwner: 'Owner Name', formPhone: 'Mobile Number',
    formSelectBazaar: 'Select Bazaar', formCategory: 'Category',
    formSubmitShop: 'Launch Shop', formSubmitBazaar: 'Add Bazaar',
    callVendor: 'Call', selectBazaarHeading: 'Select Bazaar',
    noBazaarsYet: 'No bazaars added yet!', backToShops: '← Back to Shops',
    productCatalog: 'Product Catalog', noProductsYet: 'No products listed yet.',
    addProductBtn: '➕ Add New Product', productNameLabel: 'Item Name',
    productPriceLabel: 'Price (৳)', productUnitLabel: 'Unit',
    submitProduct: 'Add Item', perUnit: 'per', itemsListed: 'items',
    shopDetail: 'Shop Details', category: 'Category', owner: 'Owner', verified: 'Verified',
  }
};

export default function BazaarPage() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer');
  const [bazaars, setBazaars] = useState<Bazaar[]>(INITIAL_BAZAARS);
  const [selectedBazaar, setSelectedBazaar] = useState<Bazaar>(INITIAL_BAZAARS[0]);
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [activeShopId, setActiveShopId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBazaarModal, setShowBazaarModal] = useState(false);

  const [newShop, setNewShop] = useState({ name: '', owner: '', phone: '', bazaarId: '', category: 'কাঁচাবাজার (Vegetables)' });
  const [newBazaar, setNewBazaar] = useState({ name: '', nameEn: '', location: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', unit: 'কেজি (kg)' });

  const t = (key: keyof typeof DICT['bn']) => DICT[lang][key];

  const currentShops = shops.filter((s) => {
    const matchBazaar = s.bazaarId === selectedBazaar?.id;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.includes(searchQuery) || s.nameEn.toLowerCase().includes(q);
    return matchBazaar && matchSearch;
  });

  const activeShop = shops.find((s) => s.id === activeShopId);

  const handleRegisterShop = (e: React.FormEvent) => {
    e.preventDefault();
    const bid = newShop.bazaarId || selectedBazaar?.id;
    if (!newShop.name || !newShop.phone || !bid) return;
    const shop: Shop = {
      id: `s-${Date.now()}`, bazaarId: bid, name: newShop.name, nameEn: newShop.name,
      owner: newShop.owner || 'Local Merchant', phone: newShop.phone,
      category: newShop.category, verified: true, products: [],
    };
    setShops((p) => [...p, shop]);
    setShowRegisterModal(false);
    setActiveShopId(shop.id);
    setUserMode('seller');
    setNewShop({ name: '', owner: '', phone: '', bazaarId: '', category: 'কাঁচাবাজার (Vegetables)' });
  };

  const handleAddBazaar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBazaar.name || !newBazaar.location) return;
    const b: Bazaar = { id: `b-${Date.now()}`, name: newBazaar.name, nameEn: newBazaar.nameEn || newBazaar.name, location: newBazaar.location };
    setBazaars((p) => [...p, b]);
    setSelectedBazaar(b);
    setActiveShopId(null);
    setShowBazaarModal(false);
    setNewBazaar({ name: '', nameEn: '', location: '' });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShopId || !newProduct.name || !newProduct.price) return;
    const prod: Product = { id: `p-${Date.now()}`, name: newProduct.name, price: newProduct.price, unit: newProduct.unit };
    setShops((p) => p.map((s) => s.id === activeShopId ? { ...s, products: [...s.products, prod] } : s));
    setNewProduct({ name: '', price: '', unit: 'কেজি (kg)' });
  };

  return (
    <div className="min-h-screen pb-24 antialiased">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#E8D5F5]/15 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#D4F1E0]/15 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#DDD6F3]/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BondhuLogo size={32} />
            <div>
              <h1 className="font-bold text-base text-[#0F0A1E] font-bangla leading-tight">{t('title')}</h1>
              <p className="text-[11px] text-[#5B21B6] font-bold uppercase tracking-wider -mt-0.5">{t('subtitle')}</p>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5F2FF] text-[#5B21B6] border border-[#DDD6F3] hover:bg-[#EDE9FF] transition-colors">
            <Languages className="w-3.5 h-3.5" /><span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-5 relative z-10">
        {/* Buyer/Seller Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#F5F2FF] rounded-xl border border-[#DDD6F3]/50 mb-5">
          <button onClick={() => { setUserMode('buyer'); setActiveShopId(null); }} className={`py-2.5 rounded-lg text-xs font-bold transition-all ${userMode === 'buyer' ? 'bg-white text-[#5B21B6] shadow-sm' : 'text-[#6B5E8A] hover:bg-white/50'}`}>{t('buyerTab')}</button>
          <button onClick={() => setUserMode('seller')} className={`py-2.5 rounded-lg text-xs font-bold transition-all ${userMode === 'seller' ? 'bg-white text-[#5B21B6] shadow-sm' : 'text-[#6B5E8A] hover:bg-white/50'}`}>{t('sellerTab')}</button>
        </div>

        {/* Add Bazaar CTA */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapPinned className="w-5 h-5 text-[#5B21B6] shrink-0" />
            <p className="text-xs text-[#6B5E8A] font-medium font-bangla">{lang === 'bn' ? 'আপনার এলাকার বাজারটি খুঁজে পাচ্ছেন না? নিজেই যুক্ত করুন।' : "Can't find your local market? Add it now!"}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowBazaarModal(true)} className="px-4 py-2 border-2 border-[#5B21B6] text-[#5B21B6] rounded-xl text-xs font-bold hover:bg-[#EDE9FF] transition-colors whitespace-nowrap flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> {t('addBazaarBtn')}
          </motion.button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">

          {/* LEFT: Bazaar Selector */}
          <div className="md:col-span-4 space-y-2">
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#9B8FC0] px-1 mb-2">{t('selectBazaarHeading')}</h3>
            {bazaars.length === 0 ? (
              <div className="glass-card p-4 text-center">
                <p className="text-[11px] text-[#6B5E8A] font-medium">{t('noBazaarsYet')}</p>
                <button onClick={() => setShowBazaarModal(true)} className="mt-2 text-[11px] text-[#5B21B6] font-bold underline">{t('addBazaarBtn')}</button>
              </div>
            ) : (
              <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {bazaars.map((b) => (
                  <motion.button key={b.id} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedBazaar(b); setActiveShopId(null); }}
                    className={`p-3 rounded-xl border text-left transition-all shrink-0 w-56 md:w-full ${selectedBazaar?.id === b.id ? 'bg-white border-[#5B21B6] shadow-sm ring-1 ring-[#5B21B6]/20' : 'bg-white/60 border-[#DDD6F3] hover:bg-white hover:border-[#B8A9E3]'}`}>
                    <div className="font-bold text-xs text-[#0F0A1E] font-bangla">{lang === 'bn' ? b.name : b.nameEn}</div>
                    <div className="text-[10px] text-[#6B5E8A] font-semibold mt-1 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-[#B8A9E3] shrink-0" /> {b.location}</div>
                  </motion.button>
                ))}
              </div>
            )}
            {/* Stats */}
            <div className="glass-card p-4 mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-[#F5F2FF] rounded-lg"><p className="text-lg font-extrabold text-[#5B21B6]">{bazaars.length}</p><p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">বাজার</p></div>
                <div className="text-center p-2 bg-[#F5F2FF] rounded-lg"><p className="text-lg font-extrabold text-[#0D9488]">{shops.length}</p><p className="text-[10px] text-[#6B5E8A] font-medium font-bangla">দোকান</p></div>
              </div>
            </div>
          </div>

          {/* RIGHT: Shops or Shop Detail */}
          <div className="md:col-span-8 space-y-4">
            <AnimatePresence mode="wait">
              {!activeShopId ? (
                /* VIEW A: Shop List */
                <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="glass-input flex items-center gap-2 px-3 py-2.5 rounded-xl">
                    <Search className="w-4 h-4 text-[#9B8FC0]" />
                    <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-[#0F0A1E] placeholder:text-[#9B8FC0] outline-none w-full font-bangla" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-full hover:bg-[#DDD6F3]"><X className="w-3.5 h-3.5 text-[#9B8FC0]" /></button>}
                  </div>

                  <div className="space-y-3">
                    {currentShops.map((shop) => (
                      <motion.div key={shop.id} whileHover={{ y: -1 }} onClick={() => setActiveShopId(shop.id)}
                        className="glass-card-hover p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] text-[#5B21B6] flex items-center justify-center border border-[#DDD6F3] shrink-0"><ShoppingBag className="w-5 h-5" /></div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-[#0F0A1E] font-bangla">{shop.name}</h4>
                              {shop.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6]" />}
                            </div>
                            <p className="text-[11px] text-[#6B5E8A] font-medium mt-0.5">{t('category')}: <span className="font-bold text-[#3D2B6B]">{shop.category}</span></p>
                            <span className="inline-block mt-2 text-[10px] bg-[#F5F2FF] text-[#5B21B6] px-2 py-0.5 rounded-full font-bold">{shop.products.length} {t('itemsListed')}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-[#DDD6F3]/30 sm:border-0 pt-3 sm:pt-0" onClick={(e) => e.stopPropagation()}>
                          <div className="text-left sm:text-right"><span className="text-[9px] uppercase tracking-wider font-extrabold text-[#9B8FC0] block">{t('owner')}</span><span className="text-xs font-bold text-[#0F0A1E] font-bangla">{shop.owner}</span></div>
                          <a href={`tel:${shop.phone}`} className="px-3 py-2 bg-[#F5F2FF] hover:bg-[#EDE9FF] text-[#5B21B6] border border-[#DDD6F3] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"><Phone className="w-3.5 h-3.5" /><span>{t('callVendor')}</span></a>
                        </div>
                      </motion.div>
                    ))}

                    {currentShops.length === 0 && selectedBazaar && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 glass-card">
                        <Store className="w-12 h-12 text-[#B8A9E3] mx-auto mb-3" />
                        <h4 className="font-extrabold text-sm text-[#0F0A1E] font-bangla">{t('emptyBazaarTitle')}</h4>
                        <p className="text-xs text-[#6B5E8A] font-medium max-w-sm mx-auto mt-1 mb-4">{t('emptyBazaarDesc')}</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setNewShop((p) => ({ ...p, bazaarId: selectedBazaar.id })); setShowRegisterModal(true); }} className="px-4 py-2 bondhu-gradient text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto shadow-md">
                          <span>{t('registerShopBtn')}</span><ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* VIEW B: Shop Detail with Product Catalog */
                <motion.div key="shop-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {/* Back button */}
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => setActiveShopId(null)} className="text-xs font-bold text-[#6B5E8A] hover:text-[#0F0A1E] flex items-center gap-1.5 bg-[#F5F2FF] hover:bg-[#EDE9FF] px-3 py-1.5 rounded-lg transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> {t('backToShops')}
                  </motion.button>

                  {/* Shop Info Card */}
                  <div className="glass-card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6F3]/50 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] text-[#5B21B6] flex items-center justify-center border border-[#DDD6F3] shrink-0"><ShoppingBag className="w-6 h-6" /></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-extrabold text-[#0F0A1E] font-bangla">{activeShop?.name}</h2>
                            {activeShop?.verified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE9FF] text-[#5B21B6] font-bold">{t('verified')}</span>}
                          </div>
                          <p className="text-xs text-[#6B5E8A] font-medium mt-0.5">{t('category')}: <span className="font-bold text-[#3D2B6B]">{activeShop?.category}</span></p>
                          <p className="text-xs text-[#6B5E8A] font-medium">{t('owner')}: <span className="font-bold text-[#0F0A1E]">{activeShop?.owner}</span></p>
                        </div>
                      </div>
                      <a href={`tel:${activeShop?.phone}`} className="self-start sm:self-center px-4 py-2.5 bondhu-gradient text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                        <Phone className="w-4 h-4" /> {t('callVendor')}
                      </a>
                    </div>

                    {/* Seller: Add Product Form */}
                    {userMode === 'seller' && (
                      <div className="mt-5 bg-[#F5F2FF]/60 border border-[#DDD6F3] rounded-xl p-4">
                        <h4 className="text-xs font-extrabold text-[#5B21B6] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> {t('addProductBtn')}
                        </h4>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                          <div className="sm:col-span-5 space-y-1">
                            <label className="text-[10px] font-bold text-[#6B5E8A] block">{t('productNameLabel')}</label>
                            <input type="text" required placeholder="যেমন: দেশি আলু" value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-[#DDD6F3] outline-none focus:border-[#5B21B6] font-bangla" />
                          </div>
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-[#6B5E8A] block">{t('productPriceLabel')}</label>
                            <input type="text" required placeholder="৬০" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-[#DDD6F3] outline-none focus:border-[#5B21B6] font-bangla" />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-[#6B5E8A] block">{t('productUnitLabel')}</label>
                            <select value={newProduct.unit} onChange={(e) => setNewProduct((p) => ({ ...p, unit: e.target.value }))} className="w-full text-xs bg-white px-2 py-2 rounded-lg border border-[#DDD6F3] outline-none text-[#0F0A1E]">
                              <option value="কেজি">কেজি</option>
                              <option value="পিস">পিস</option>
                              <option value="হালি">হালি (৪ পিস)</option>
                              <option value="লিটার">লিটার</option>
                              <option value="গ্রাম">গ্রাম</option>
                            </select>
                          </div>
                          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="sm:col-span-2 py-2 bg-[#5B21B6] hover:bg-[#4C1D9A] text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                            <Plus className="w-3.5 h-3.5" /><span>{t('submitProduct')}</span>
                          </motion.button>
                        </form>
                      </div>
                    )}

                    {/* Product Catalog Table */}
                    <div className="mt-6">
                      <h3 className="text-xs font-extrabold text-[#9B8FC0] uppercase tracking-wider mb-3">{t('productCatalog')}</h3>
                      {activeShop?.products.length === 0 ? (
                        <div className="text-center py-8 text-[#6B5E8A] font-medium text-xs border border-dashed border-[#DDD6F3] rounded-xl bg-[#F5F2FF]/30">
                          {t('noProductsYet')} {userMode === 'buyer' && <span className="block mt-1">দোকানদারকে পণ্য তালিকা সাজাতে বলুন।</span>}
                        </div>
                      ) : (
                        <div className="divide-y divide-[#DDD6F3]/30 border border-[#DDD6F3]/50 rounded-xl overflow-hidden">
                          {activeShop?.products.map((prod) => (
                            <div key={prod.id} className="p-3 bg-white/40 flex items-center justify-between hover:bg-white/70 transition-colors">
                              <span className="text-xs font-bold text-[#0F0A1E] font-bangla">{prod.name}</span>
                              <div className="text-right">
                                <span className="text-xs font-extrabold text-[#0D9488] font-bangla">৳{prod.price}</span>
                                <span className="text-[10px] text-[#6B5E8A] block font-medium">{t('perUnit')} {prod.unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* MODAL: Add Bazaar */}
      <AnimatePresence>
        {showBazaarModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setShowBazaarModal(false)} className="fixed inset-0 bg-[#0F0A1E] z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-x-4 top-20 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#DDD6F3]">
              <div className="p-4 bg-[#F5F2FF] border-b border-[#DDD6F3] flex justify-between items-center">
                <span className="font-bold text-sm text-[#0F0A1E] font-bangla">{t('formTitleBazaar')}</span>
                <button onClick={() => setShowBazaarModal(false)} className="w-7 h-7 rounded-full hover:bg-[#DDD6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#6B5E8A]" /></button>
              </div>
              <form onSubmit={handleAddBazaar} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formBazaarName')} *</label>
                  <input type="text" required placeholder="যেমন: ধামরাই সদর বাজার" value={newBazaar.name} onChange={(e) => setNewBazaar((p) => ({ ...p, name: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">English Name</label>
                  <input type="text" placeholder="e.g. Dhamrai Bazar" value={newBazaar.nameEn} onChange={(e) => setNewBazaar((p) => ({ ...p, nameEn: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formBazaarLocation')} *</label>
                  <input type="text" required placeholder="যেমন: ধামরাই, ঢাকা" value={newBazaar.location} onChange={(e) => setNewBazaar((p) => ({ ...p, location: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla" />
                </div>
                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-2.5 bondhu-gradient text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all">{t('formSubmitBazaar')}</motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL: Register Shop */}
      <AnimatePresence>
        {showRegisterModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setShowRegisterModal(false)} className="fixed inset-0 bg-[#0F0A1E] z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-x-4 top-16 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#DDD6F3]">
              <div className="p-4 bg-[#F5F2FF] border-b border-[#DDD6F3] flex justify-between items-center">
                <span className="font-bold text-sm text-[#0F0A1E] font-bangla">{t('formTitleShop')}</span>
                <button onClick={() => setShowRegisterModal(false)} className="w-7 h-7 rounded-full hover:bg-[#DDD6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#6B5E8A]" /></button>
              </div>
              <form onSubmit={handleRegisterShop} className="p-5 space-y-3 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formShopName')} *</label>
                  <input type="text" required placeholder="যেমন: সততা জেনারেল স্টোর" value={newShop.name} onChange={(e) => setNewShop((p) => ({ ...p, name: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formOwner')}</label>
                  <input type="text" placeholder="যেমন: আলহাজ্ব আব্দুর রহমান" value={newShop.owner} onChange={(e) => setNewShop((p) => ({ ...p, owner: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formPhone')} *</label>
                  <input type="tel" required placeholder="01XXXXXXXXX" value={newShop.phone} onChange={(e) => setNewShop((p) => ({ ...p, phone: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formSelectBazaar')}</label>
                  <select value={newShop.bazaarId || selectedBazaar?.id || ''} onChange={(e) => setNewShop((p) => ({ ...p, bazaarId: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] outline-none text-[#0F0A1E] bg-[#F5F2FF]">
                    <option value="" disabled>--- বাজার সিলেক্ট করুন ---</option>
                    {bazaars.map((b) => <option key={b.id} value={b.id}>{lang === 'bn' ? b.name : b.nameEn}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('formCategory')}</label>
                  <select value={newShop.category} onChange={(e) => setNewShop((p) => ({ ...p, category: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] outline-none text-[#0F0A1E] bg-[#F5F2FF]">
                    <option value="কাঁচাবাজার (Vegetables)">কাঁচাবাজার (Vegetables)</option>
                    <option value="মাছ-মাংস (Fish & Meat)">মাছ-মাংস (Fish & Meat)</option>
                    <option value="মুদি দোকান (Grocery)">মুদি দোকান (Grocery)</option>
                    <option value="ফলমূল (Fruits)">ফলমূল (Fruits)</option>
                    <option value="পশুপাখি (Livestock)">পশুপাখি (Livestock)</option>
                    <option value="কাপড় ও বস্ত্র (Clothing)">কাপড় ও বস্ত্র (Clothing)</option>
                  </select>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-2.5 bondhu-gradient text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all mt-2">{t('formSubmitShop')}</motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
