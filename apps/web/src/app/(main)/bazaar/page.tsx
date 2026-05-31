'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Store, Languages, ShoppingBag, Phone,
  CheckCircle2, ArrowRight, MapPinned, X, Plus, Tag, ArrowLeft,
  Compass, TrendingUp, Users, Sparkles, MessageSquare, Filter,
  Leaf, Fish, Apple, Milk, Shirt, Droplets, Utensils,
} from 'lucide-react';
import { BondhuLogo } from '@/components/ui/CulturalIcons';

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
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

interface Community {
  id: string;
  name: string;
  description: string;
  type: 'gossip' | 'bargain' | 'foodie' | 'news';
  bazaarId?: string;
  memberCount: number;
}

// ═══════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════
const CATEGORIES = [
  { key: 'all',      labelBn: 'সব',         labelEn: 'All',           icon: Filter },
  { key: 'veg',      labelBn: 'সবজি',       labelEn: 'Vegetables',    icon: Leaf },
  { key: 'fish',     labelBn: 'মাছ-মাংস',   labelEn: 'Fish & Meat',   icon: Fish },
  { key: 'grocery',  labelBn: 'মুদি',       labelEn: 'Grocery',       icon: Milk },
  { key: 'fruits',   labelBn: 'ফলমূল',      labelEn: 'Fruits',        icon: Apple },
  { key: 'clothes',  labelBn: 'কাপড়',      labelEn: 'Clothing',      icon: Shirt },
];

const COMMUNITY_TYPES: { key: Community['type']; labelBn: string; labelEn: string; icon: typeof MessageSquare; color: string }[] = [
  { key: 'gossip',   labelBn: 'চায়ের দোকান আড্ডা',  labelEn: 'Tea Stall Gossip',   icon: MessageSquare, color: '#5B21B6' },
  { key: 'bargain',  labelBn: 'দরদামের মাস্টার',     labelEn: 'Bargaining Experts', icon: TrendingUp,    color: '#0D9488' },
  { key: 'foodie',   labelBn: 'খাদ্যরসিক দল',        labelEn: 'Foodie Squad',       icon: Utensils,      color: '#E85D75' },
  { key: 'news',     labelBn: 'এলাকার খবর',          labelEn: 'Local News Alerts',  icon: Sparkles,      color: '#F59E0B' },
];

// ═══════════════════════════════════════════════════════════
//  INITIAL DATA — NO BAZAARS OR SHOPS (user creates all)
// ═══════════════════════════════════════════════════════════
const INITIAL_BAZAARS: Bazaar[] = [];
const INITIAL_SHOPS: Shop[] = [];

// Only 2 demo communities so user sees how Adda works
const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'c1', name: 'মিরপুর বাজার আড্ডা',
    description: 'মিরপুরের সব খবর, দরদাম আর গল্পের আড্ডা। আজ কোন জিনিস কতো?',
    type: 'gossip', memberCount: 128,
  },
  {
    id: 'c2', name: 'ঢাকার ফুডি গ্যাং',
    description: 'কোথায় কী খাওয়া যায়, কোন দোকানে ফ্রেশ মাছ, সব শেয়ার করুন!',
    type: 'foodie', memberCount: 256,
  },
];

// ═══════════════════════════════════════════════════════════
//  DICTIONARY
// ═══════════════════════════════════════════════════════════
const DICT = {
  bn: {
    title: 'বাজার', subtitle: 'Bazaar Hub',
    buyerTab: '🔍 দোকান খুঁজুন', sellerTab: '🏪 আমি বিক্রেতা',
    searchPlaceholder: 'দোকানের নাম দিয়ে খুঁজুন...',
    exploreSearchPlaceholder: 'পণ্য খুঁজুন — সব বাজার থেকে...',
    emptyBazaarTitle: 'এই বাজারে এখনো কোনো দোকান যুক্ত হয়নি!',
    emptyBazaarDesc: 'আপনি কি এই বাজারের একজন বিক্রেতা? প্রথম দোকানদার হিসেবে আজই আপনার ডিজিটাল দোকানটি চালু করুন!',
    registerShopBtn: '➕ দোকান রেজিস্টার করুন', addBazaarBtn: '➕ নতুন বাজার যুক্ত করুন',
    formTitleShop: 'নতুন দোকান যোগ করুন', formTitleBazaar: 'নতুন বাজার যোগ করুন',
    formShopName: 'দোকানের নাম', formBazaarName: 'বাজারের নাম', formBazaarLocation: 'অবস্থান ও জেলা',
    formOwner: 'মালিকের নাম', formPhone: 'মোবাইল নম্বর',
    formSelectBazaar: 'বাজার নির্বাচন করুন', formCategory: 'ব্যবসার ধরণ',
    formSubmitShop: 'ডিজিটাল দোকান চালু করুন', formSubmitBazaar: 'বাজার যোগ করুন',
    callVendor: 'কল করুন', selectBazaarHeading: 'আপনার বাজার',
    noBazaarsYet: 'কোনো বাজার যোগ করা হয়নি — নিচে "নতুন বাজার যুক্ত করুন" বাটনে চাপুন!',
    backToShops: '← দোকানে ফিরে যান',
    productCatalog: 'পণ্যের মূল্য তালিকা', noProductsYet: 'এই দোকানে এখনো কোনো পণ্য যোগ করা হয়নি।',
    addProductBtn: '➕ নতুন পণ্য যোগ করুন', productNameLabel: 'পণ্যের নাম',
    productPriceLabel: 'মূল্য (৳)', productUnitLabel: 'ইউনিট',
    submitProduct: 'পণ্য যুক্ত করুন', perUnit: 'প্রতি',
    itemsListed: 'টি পণ্য', shopDetail: 'দোকানের বিবরণ', category: 'ক্যাটাগরি',
    owner: 'মালিক', verified: 'যাচাইকৃত',
    // Explore Hub
    exploreTitle: 'বাজার এক্সপ্লোর করুন',
    exploreSubtitle: 'আপনার এলাকার সব পণ্য ও দোকান এক জায়গায়',
    globalSearchLabel: 'গ্লোবাল পণ্য সার্চ',
    globalSearchHint: 'যেকোনো বাজারের যেকোনো পণ্য খুঁজুন...',
    categoryFilterLabel: 'ক্যাটাগরি অনুযায়ী ফিল্টার',
    trendingPrices: 'আজকের ট্রেন্ডিং দর',
    noSearchResults: 'কোনো পণ্য পাওয়া যায়নি। নতুন বাজার বা দোকান যোগ করুন!',
    allShopsEmpty: 'এখনো কোনো দোকান যোগ করা হয়নি। আপনার দোকানটি প্রথম দোকান হতে পারে!',
    // Adda (Communities)
    addaTitle: 'স্থানীয় আড্ডা',
    addaSubtitle: 'আপনার এলাকার কমিউনিটি — গল্প, দরদাম, খবর',
    createAddaBtn: 'আড্ডা তৈরি করুন',
    addaFormTitle: 'নতুন আড্ডা তৈরি করুন',
    addaNameLabel: 'আড্ডার নাম',
    addaDescLabel: 'বিবরণ',
    addaTypeLabel: 'ধরণ',
    addaLinkBazaarLabel: 'বাজারের সাথে লিঙ্ক করুন (ঐচ্ছিক)',
    addaSubmit: 'আড্ডা তৈরি করুন',
    addaMembers: 'জন মেম্বার',
    joinAdda: 'যোগ দিন',
    noAddaYet: 'এখনো কোনো আড্ডা নেই — প্রথম আড্ডাটি আপনিই তৈরি করুন!',
    // Stats
    totalProducts: 'পণ্য',
    totalShops: 'দোকান',
    totalBazaars: 'বাজার',
    totalAddas: 'আড্ডা',
  },
  en: {
    title: 'Bazaar', subtitle: 'Bazaar Hub',
    buyerTab: '🔍 Find Shops', sellerTab: '🏪 Store Owner',
    searchPlaceholder: 'Search shop name...',
    exploreSearchPlaceholder: 'Search products across all bazaars...',
    emptyBazaarTitle: 'No stores registered yet!',
    emptyBazaarDesc: 'Are you a merchant here? Be the first to register your shop!',
    registerShopBtn: '➕ Register Shop', addBazaarBtn: '➕ Suggest Bazaar',
    formTitleShop: 'Create Digital Storefront', formTitleBazaar: 'Add New Bazaar',
    formShopName: 'Shop Name', formBazaarName: 'Bazaar Name', formBazaarLocation: 'Location & District',
    formOwner: 'Owner Name', formPhone: 'Mobile Number',
    formSelectBazaar: 'Select Bazaar', formCategory: 'Category',
    formSubmitShop: 'Launch Shop', formSubmitBazaar: 'Add Bazaar',
    callVendor: 'Call', selectBazaarHeading: 'Your Bazaar',
    noBazaarsYet: 'No bazaars yet — tap "Suggest Bazaar" below!',
    backToShops: '← Back to Shops',
    productCatalog: 'Product Catalog', noProductsYet: 'No products listed yet.',
    addProductBtn: '➕ Add New Product', productNameLabel: 'Item Name',
    productPriceLabel: 'Price (৳)', productUnitLabel: 'Unit',
    submitProduct: 'Add Item', perUnit: 'per', itemsListed: 'items',
    shopDetail: 'Shop Details', category: 'Category', owner: 'Owner', verified: 'Verified',
    // Explore Hub
    exploreTitle: 'Explore Bazaar',
    exploreSubtitle: 'All products & shops in your area, in one place',
    globalSearchLabel: 'Global Product Search',
    globalSearchHint: 'Search any product from any bazaar...',
    categoryFilterLabel: 'Filter by Category',
    trendingPrices: "Today's Trending Prices",
    noSearchResults: 'No products found. Add a new bazaar or shop!',
    allShopsEmpty: 'No shops yet. Your shop could be the first!',
    // Adda (Communities)
    addaTitle: 'Local Adda',
    addaSubtitle: 'Your local community — gossip, prices, news',
    createAddaBtn: 'Create Adda',
    addaFormTitle: 'Create New Adda',
    addaNameLabel: 'Adda Name',
    addaDescLabel: 'Description',
    addaTypeLabel: 'Type',
    addaLinkBazaarLabel: 'Link to Bazaar (optional)',
    addaSubmit: 'Create Adda',
    addaMembers: 'members',
    joinAdda: 'Join',
    noAddaYet: 'No addas yet — be the first to create one!',
    // Stats
    totalProducts: 'Products',
    totalShops: 'Shops',
    totalBazaars: 'Bazaars',
    totalAddas: 'Addas',
  }
};

// ═══════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════
export default function BazaarPage() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer');

  // Data states — start EMPTY (user creates all)
  const [bazaars, setBazaars] = useState<Bazaar[]>(INITIAL_BAZAARS);
  const [selectedBazaar, setSelectedBazaar] = useState<Bazaar | null>(null);
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);

  // Navigation states
  const [activeShopId, setActiveShopId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shops' | 'explore' | 'adda'>('explore');

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreQuery, setExploreQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBazaarModal, setShowBazaarModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  // Form states
  const [newShop, setNewShop] = useState({ name: '', owner: '', phone: '', bazaarId: '', category: 'কাঁচাবাজার (Vegetables)' });
  const [newBazaar, setNewBazaar] = useState({ name: '', nameEn: '', location: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', unit: 'কেজি (kg)' });
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', type: 'gossip' as Community['type'], bazaarId: '' });

  const t = (key: keyof typeof DICT['bn']) => DICT[lang][key];

  // ── Derived data ──
  const activeShop = shops.find((s) => s.id === activeShopId);

  const currentShops = shops.filter((s) => {
    const matchBazaar = s.bazaarId === selectedBazaar?.id;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.name.includes(searchQuery) || s.nameEn.toLowerCase().includes(q);
    return matchBazaar && matchSearch;
  });

  // Global product search across ALL shops
  const allProducts = useMemo(() => {
    const results: { product: Product; shop: Shop; bazaar: Bazaar | undefined }[] = [];
    shops.forEach((shop) => {
      const bazaar = bazaars.find((b) => b.id === shop.bazaarId);
      shop.products.forEach((product) => {
        const q = exploreQuery.toLowerCase();
        const catMatch = activeCategory === 'all' ||
          (activeCategory === 'veg' && shop.category.includes('Vegetables')) ||
          (activeCategory === 'fish' && shop.category.includes('Fish')) ||
          (activeCategory === 'grocery' && shop.category.includes('Grocery')) ||
          (activeCategory === 'fruits' && shop.category.includes('Fruits')) ||
          (activeCategory === 'clothes' && shop.category.includes('Clothing'));
        const nameMatch = !q || product.name.toLowerCase().includes(q) || product.name.includes(exploreQuery);
        if (catMatch && nameMatch) {
          results.push({ product, shop, bazaar });
        }
      });
    });
    return results;
  }, [shops, bazaars, exploreQuery, activeCategory]);

  // Trending prices: cheapest product in each category
  const trendingPrices = useMemo(() => {
    const trends: { label: string; price: string; trend: 'up' | 'down' | 'stable' }[] = [];
    const allProds = shops.flatMap((s) => s.products.map((p) => ({ ...p, category: s.category })));
    const veggies = allProds.filter((p) => p.category.includes('Vegetables'));
    const fish = allProds.filter((p) => p.category.includes('Fish'));
    const grocery = allProds.filter((p) => p.category.includes('Grocery'));
    if (veggies.length) trends.push({ label: lang === 'bn' ? 'সবজি' : 'Vegetables', price: veggies[0].price, trend: 'stable' });
    if (fish.length) trends.push({ label: lang === 'bn' ? 'মাছ' : 'Fish', price: fish[0].price, trend: 'up' });
    if (grocery.length) trends.push({ label: lang === 'bn' ? 'চাল' : 'Rice', price: grocery[0].price, trend: 'down' });
    // Default demo data if no shops exist yet
    if (trends.length === 0) {
      return [
        { label: lang === 'bn' ? 'সবজি' : 'Vegetables', price: '৪০', trend: 'stable' as const },
        { label: lang === 'bn' ? 'মাছ' : 'Fish', price: '৩৫০', trend: 'up' as const },
        { label: lang === 'bn' ? 'চাল' : 'Rice', price: '৭২', trend: 'down' as const },
        { label: lang === 'bn' ? 'ডিম' : 'Eggs', price: '১৪০', trend: 'up' as const },
        { label: lang === 'bn' ? 'তেল' : 'Oil', price: '১৬৫', trend: 'stable' as const },
      ];
    }
    return trends;
  }, [shops, lang]);

  const totalProducts = shops.reduce((sum, s) => sum + s.products.length, 0);

  // ── Handlers ──
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
    setActiveTab('shops');
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

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name) return;
    const comm: Community = {
      id: `c-${Date.now()}`,
      name: newCommunity.name,
      description: newCommunity.description || (lang === 'bn' ? 'নতুন আড্ডা' : 'New adda'),
      type: newCommunity.type,
      bazaarId: newCommunity.bazaarId || undefined,
      memberCount: 1,
    };
    setCommunities((p) => [...p, comm]);
    setShowCommunityModal(false);
    setNewCommunity({ name: '', description: '', type: 'gossip', bazaarId: '' });
  };

  // ── Sub-components ──
  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-red-500" />;
    if (trend === 'down') return <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />;
    return <Droplets className="w-3 h-3 text-[#9B8FC0]" />;
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDER: EXPLORE HUB (when activeTab === 'explore')
  // ═══════════════════════════════════════════════════════════
  const renderExploreHub = () => (
    <motion.div
      key="explore"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      {/* Hero banner */}
      <div className="glass-card p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] rounded-full blur-2xl opacity-30 -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-5 h-5 text-[#5B21B6]" />
            <h2 className="font-extrabold text-base text-[#0F0A1E] font-bangla">{t('exploreTitle')}</h2>
          </div>
          <p className="text-xs text-[#6B5E8A] font-medium">{t('exploreSubtitle')}</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-[#3D2B6B] flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" /> {t('globalSearchLabel')}
        </label>
        <div className="glass-input flex items-center gap-2 px-3 py-2.5 rounded-xl">
          <Search className="w-4 h-4 text-[#9B8FC0] shrink-0" />
          <input
            type="text"
            placeholder={t('globalSearchHint')}
            value={exploreQuery}
            onChange={(e) => setExploreQuery(e.target.value)}
            className="bg-transparent text-xs text-[#0F0A1E] placeholder:text-[#9B8FC0] outline-none w-full font-bangla"
          />
          {exploreQuery && (
            <button onClick={() => setExploreQuery('')} className="p-0.5 rounded-full hover:bg-[#DDD6F3]">
              <X className="w-3.5 h-3.5 text-[#9B8FC0]" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-[#3D2B6B] flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> {t('categoryFilterLabel')}
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <motion.button
                key={cat.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#5B21B6] text-white shadow-md'
                    : 'bg-white/60 border border-[#DDD6F3] text-[#3D2B6B] hover:bg-white hover:border-[#B8A9E3]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-bangla">{lang === 'bn' ? cat.labelBn : cat.labelEn}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Trending Prices Ticker */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#0D9488]" />
          <h3 className="text-xs font-extrabold text-[#3D2B6B] uppercase tracking-wider">{t('trendingPrices')}</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {trendingPrices.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="shrink-0 px-3 py-2 bg-white/70 rounded-xl border border-[#DDD6F3]/60 flex items-center gap-2"
            >
              <TrendIcon trend={item.trend} />
              <div>
                <p className="text-[10px] font-bold text-[#6B5E8A]">{item.label}</p>
                <p className="text-sm font-extrabold text-[#0F0A1E] font-bangla">৳{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Global Product Search Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#9B8FC0] uppercase tracking-wider">
            {exploreQuery ? `"${exploreQuery}" — ${allProducts.length} ${t('totalProducts')}` : t('totalProducts')}
          </h3>
          {exploreQuery && (
            <button onClick={() => { setExploreQuery(''); setActiveCategory('all'); }} className="text-[10px] text-[#5B21B6] font-bold">
              {lang === 'bn' ? 'ক্লিয়ার' : 'Clear'}
            </button>
          )}
        </div>

        {shops.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 glass-card">
            <Compass className="w-12 h-12 text-[#B8A9E3] mx-auto mb-3" />
            <h4 className="font-extrabold text-sm text-[#0F0A1E] font-bangla">
              {lang === 'bn' ? 'এখনো কোনো বাজার যোগ করা হয়নি!' : 'No bazaars added yet!'}
            </h4>
            <p className="text-xs text-[#6B5E8A] font-medium max-w-sm mx-auto mt-1 mb-4">
              {lang === 'bn' ? 'আপনার এলাকার বাজার যোগ করুন, দোকান তৈরি করুন, এবং পণ্যের তালিকা শুরু করুন।' : 'Add your local bazaar, create a shop, and start listing products.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowBazaarModal(true)}
              className="px-4 py-2 bondhu-gradient text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> {t('addBazaarBtn')}
            </motion.button>
          </motion.div>
        ) : allProducts.length === 0 && (exploreQuery || activeCategory !== 'all') ? (
          <div className="text-center py-8 glass-card">
            <p className="text-xs text-[#6B5E8A] font-medium font-bangla">{t('noSearchResults')}</p>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-8 glass-card">
            <ShoppingBag className="w-10 h-10 text-[#B8A9E3] mx-auto mb-2" />
            <p className="text-xs text-[#6B5E8A] font-medium font-bangla">
              {lang === 'bn' ? 'এখনো কোনো পণ্য যোগ করা হয়নি। দোকানে গিয়ে পণ্য তালিকা তৈরি করুন!' : 'No products yet. Go to a shop and add products!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {allProducts.map(({ product, shop, bazaar }) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-hover p-3 flex items-center justify-between cursor-pointer"
                onClick={() => { setSelectedBazaar(bazaar || null); setActiveShopId(shop.id); setActiveTab('shops'); }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-[#5B21B6]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F0A1E] font-bangla truncate">{product.name}</p>
                    <p className="text-[10px] text-[#6B5E8A] font-medium truncate">
                      {shop.name} {bazaar && <>· <span className="text-[#5B21B6]">{bazaar.name}</span></>}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-[#0D9488] font-bangla">৳{product.price}</p>
                  <p className="text-[10px] text-[#6B5E8A] font-medium">{t('perUnit')} {product.unit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  // ═══════════════════════════════════════════════════════════
  //  RENDER: SHOPS VIEW (when activeTab === 'shops')
  // ═══════════════════════════════════════════════════════════
  const renderShopsView = () => (
    <motion.div
      key="shops"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {!activeShopId ? (
        /* VIEW A: Shop List for selected bazaar */
        <div className="space-y-4">
          <div className="glass-input flex items-center gap-2 px-3 py-2.5 rounded-xl">
            <Search className="w-4 h-4 text-[#9B8FC0]" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#0F0A1E] placeholder:text-[#9B8FC0] outline-none w-full font-bangla"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-full hover:bg-[#DDD6F3]">
                <X className="w-3.5 h-3.5 text-[#9B8FC0]" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {currentShops.map((shop) => (
              <motion.div
                key={shop.id}
                whileHover={{ y: -1 }}
                onClick={() => setActiveShopId(shop.id)}
                className="glass-card-hover p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] text-[#5B21B6] flex items-center justify-center border border-[#DDD6F3] shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
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
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#9B8FC0] block">{t('owner')}</span>
                    <span className="text-xs font-bold text-[#0F0A1E] font-bangla">{shop.owner}</span>
                  </div>
                  <a href={`tel:${shop.phone}`} className="px-3 py-2 bg-[#F5F2FF] hover:bg-[#EDE9FF] text-[#5B21B6] border border-[#DDD6F3] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Phone className="w-3.5 h-3.5" /><span>{t('callVendor')}</span>
                  </a>
                </div>
              </motion.div>
            ))}

            {currentShops.length === 0 && selectedBazaar && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 glass-card">
                <Store className="w-12 h-12 text-[#B8A9E3] mx-auto mb-3" />
                <h4 className="font-extrabold text-sm text-[#0F0A1E] font-bangla">{t('emptyBazaarTitle')}</h4>
                <p className="text-xs text-[#6B5E8A] font-medium max-w-sm mx-auto mt-1 mb-4">{t('emptyBazaarDesc')}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setNewShop((p) => ({ ...p, bazaarId: selectedBazaar.id })); setShowRegisterModal(true); }}
                  className="px-4 py-2 bondhu-gradient text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto shadow-md"
                >
                  <span>{t('registerShopBtn')}</span><ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW B: Shop Detail with Product Catalog */
        <motion.div
          key="shop-detail"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveShopId(null)}
            className="text-xs font-bold text-[#6B5E8A] hover:text-[#0F0A1E] flex items-center gap-1.5 bg-[#F5F2FF] hover:bg-[#EDE9FF] px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('backToShops')}
          </motion.button>

          <div className="glass-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6F3]/50 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8D5F5] to-[#D4F1E0] text-[#5B21B6] flex items-center justify-center border border-[#DDD6F3] shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
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
    </motion.div>
  );

  // ═══════════════════════════════════════════════════════════
  //  RENDER: ADDA (COMMUNITIES) VIEW
  // ═══════════════════════════════════════════════════════════
  const renderAddaView = () => (
    <motion.div
      key="adda"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="glass-card p-5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#FDE1D0] to-[#F5D0D8] rounded-full blur-2xl opacity-30 -ml-8 -mb-8" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#E85D75]" />
              <h2 className="font-extrabold text-base text-[#0F0A1E] font-bangla">{t('addaTitle')}</h2>
            </div>
            <p className="text-xs text-[#6B5E8A] font-medium">{t('addaSubtitle')}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowCommunityModal(true)}
            className="px-3 py-2 bondhu-gradient text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> {t('createAddaBtn')}
          </motion.button>
        </div>
      </div>

      {/* Community Type Legend */}
      <div className="flex flex-wrap gap-2">
        {COMMUNITY_TYPES.map((ct) => {
          const Icon = ct.icon;
          return (
            <div key={ct.key} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 border border-[#DDD6F3]/50">
              <Icon className="w-3 h-3" style={{ color: ct.color }} />
              <span className="text-[10px] font-bold text-[#6B5E8A]">{lang === 'bn' ? ct.labelBn : ct.labelEn}</span>
            </div>
          );
        })}
      </div>

      {/* Community List */}
      {communities.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 glass-card">
          <Users className="w-12 h-12 text-[#B8A9E3] mx-auto mb-3" />
          <h4 className="font-extrabold text-sm text-[#0F0A1E] font-bangla">
            {lang === 'bn' ? 'এখনো কোনো আড্ডা নেই!' : 'No addas yet!'}
          </h4>
          <p className="text-xs text-[#6B5E8A] font-medium max-w-sm mx-auto mt-1 mb-4">{t('noAddaYet')}</p>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowCommunityModal(true)}
            className="px-4 py-2 bondhu-gradient text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> {t('createAddaBtn')}
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {communities.map((comm, idx) => {
            const typeInfo = COMMUNITY_TYPES.find((ct) => ct.key === comm.type);
            const Icon = typeInfo?.icon || MessageSquare;
            const color = typeInfo?.color || '#5B21B6';
            return (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card-hover p-4 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15`, border: `1.5px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-[#0F0A1E] font-bangla truncate">{comm.name}</h4>
                    <p className="text-[11px] text-[#6B5E8A] font-medium line-clamp-2 mt-0.5">{comm.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#DDD6F3]/30">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#9B8FC0]" />
                    <span className="text-[10px] font-bold text-[#6B5E8A]">{comm.memberCount} {t('addaMembers')}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                  >
                    {t('joinAdda')}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  // ═══════════════════════════════════════════════════════════
  //  MAIN RENDER
  // ═══════════════════════════════════════════════════════════
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
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5F2FF] text-[#5B21B6] border border-[#DDD6F3] hover:bg-[#EDE9FF] transition-colors"
          >
            <Languages className="w-3.5 h-3.5" /><span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-5 relative z-10">
        {/* ── Top Navigation Tabs ── */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F5F2FF] rounded-xl border border-[#DDD6F3]/50 mb-5">
          <button
            onClick={() => { setActiveTab('explore'); setActiveShopId(null); }}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'explore' ? 'bg-white text-[#5B21B6] shadow-sm' : 'text-[#6B5E8A] hover:bg-white/50'}`}
          >
            <Compass className="w-3.5 h-3.5" /> {lang === 'bn' ? 'এক্সপ্লোর' : 'Explore'}
          </button>
          <button
            onClick={() => { setActiveTab('shops'); setActiveShopId(null); }}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'shops' ? 'bg-white text-[#5B21B6] shadow-sm' : 'text-[#6B5E8A] hover:bg-white/50'}`}
          >
            <Store className="w-3.5 h-3.5" /> {lang === 'bn' ? 'দোকান' : 'Shops'}
          </button>
          <button
            onClick={() => { setActiveTab('adda'); setActiveShopId(null); }}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'adda' ? 'bg-white text-[#5B21B6] shadow-sm' : 'text-[#6B5E8A] hover:bg-white/50'}`}
          >
            <Users className="w-3.5 h-3.5" /> {lang === 'bn' ? 'আড্ডা' : 'Adda'}
          </button>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: t('totalBazaars'), value: bazaars.length, color: '#5B21B6' },
            { label: t('totalShops'), value: shops.length, color: '#0D9488' },
            { label: t('totalProducts'), value: totalProducts, color: '#E85D75' },
            { label: t('totalAddas'), value: communities.length, color: '#F59E0B' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="glass-card p-2.5 text-center"
            >
              <p className="text-lg font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-[#6B5E8A] font-medium font-bangla truncate">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Add Bazaar CTA (always visible) ── */}
        <div className="glass-card p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapPinned className="w-5 h-5 text-[#5B21B6] shrink-0" />
            <p className="text-xs text-[#6B5E8A] font-medium font-bangla">
              {lang === 'bn' ? 'আপনার এলাকার বাজারটি খুঁজে পাচ্ছেন না? নিজেই যুক্ত করুন।' : "Can't find your local market? Add it now!"}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowBazaarModal(true)}
            className="px-4 py-2 border-2 border-[#5B21B6] text-[#5B21B6] rounded-xl text-xs font-bold hover:bg-[#EDE9FF] transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> {t('addBazaarBtn')}
          </motion.button>
        </div>

        {/* ── Main Content Area ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* LEFT: Bazaar Selector (visible on Shops tab, or when bazaars exist) */}
          <div className={`md:col-span-4 space-y-2 ${activeTab !== 'shops' ? 'hidden md:block' : ''}`}>
            <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#9B8FC0] px-1 mb-2">{t('selectBazaarHeading')}</h3>
            {bazaars.length === 0 ? (
              <div className="glass-card p-4 text-center">
                <p className="text-[11px] text-[#6B5E8A] font-medium font-bangla leading-relaxed">{t('noBazaarsYet')}</p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBazaarModal(true)}
                  className="mt-2 text-[11px] text-[#5B21B6] font-bold underline"
                >
                  {t('addBazaarBtn')}
                </motion.button>
              </div>
            ) : (
              <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {bazaars.map((b) => (
                  <motion.button
                    key={b.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedBazaar(b); setActiveShopId(null); setActiveTab('shops'); }}
                    className={`p-3 rounded-xl border text-left transition-all shrink-0 w-56 md:w-full ${selectedBazaar?.id === b.id ? 'bg-white border-[#5B21B6] shadow-sm ring-1 ring-[#5B21B6]/20' : 'bg-white/60 border-[#DDD6F3] hover:bg-white hover:border-[#B8A9E3]'}`}
                  >
                    <div className="font-bold text-xs text-[#0F0A1E] font-bangla">{lang === 'bn' ? b.name : b.nameEn}</div>
                    <div className="text-[10px] text-[#6B5E8A] font-semibold mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#B8A9E3] shrink-0" /> {b.location}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Buyer/Seller Toggle */}
            <div className="glass-card p-3 mt-3">
              <p className="text-[10px] font-bold text-[#9B8FC0] uppercase tracking-wider mb-2">{lang === 'bn' ? 'আমি ক্রেতা নাকি বিক্রেতা?' : 'Buyer or Seller?'}</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { setUserMode('buyer'); setActiveShopId(null); }}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all ${userMode === 'buyer' ? 'bg-[#5B21B6] text-white' : 'bg-[#F5F2FF] text-[#6B5E8A] hover:bg-[#EDE9FF]'}`}
                >
                  {t('buyerTab')}
                </button>
                <button
                  onClick={() => setUserMode('seller')}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all ${userMode === 'seller' ? 'bg-[#5B21B6] text-white' : 'bg-[#F5F2FF] text-[#6B5E8A] hover:bg-[#EDE9FF]'}`}
                >
                  {t('sellerTab')}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Content */}
          <div className="md:col-span-8 space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'explore' && renderExploreHub()}
              {activeTab === 'shops' && renderShopsView()}
              {activeTab === 'adda' && renderAddaView()}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          MODALS
          ═══════════════════════════════════════════════════════════ */}

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

      {/* MODAL: Create Adda (Community) */}
      <AnimatePresence>
        {showCommunityModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setShowCommunityModal(false)} className="fixed inset-0 bg-[#0F0A1E] z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-x-4 top-16 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#DDD6F3]">
              <div className="p-4 bg-[#F5F2FF] border-b border-[#DDD6F3] flex justify-between items-center">
                <span className="font-bold text-sm text-[#0F0A1E] font-bangla">{t('addaFormTitle')}</span>
                <button onClick={() => setShowCommunityModal(false)} className="w-7 h-7 rounded-full hover:bg-[#DDD6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#6B5E8A]" /></button>
              </div>
              <form onSubmit={handleAddCommunity} className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('addaNameLabel')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'যেমন: মিরপুর বাজার আড্ডা' : 'e.g. Mirpur Bazaar Gossip'}
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity((p) => ({ ...p, name: e.target.value }))}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('addaDescLabel')}</label>
                  <textarea
                    rows={3}
                    placeholder={lang === 'bn' ? 'এই আড্ডা কী নিয়ে? গল্প, দরদাম, খবর...' : 'What is this adda about? Gossip, prices, news...'}
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity((p) => ({ ...p, description: e.target.value }))}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla resize-none"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('addaTypeLabel')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COMMUNITY_TYPES.map((ct) => {
                      const Icon = ct.icon;
                      const isSelected = newCommunity.type === ct.key;
                      return (
                        <button
                          key={ct.key}
                          type="button"
                          onClick={() => setNewCommunity((p) => ({ ...p, type: ct.key }))}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#5B21B6] bg-[#EDE9FF] shadow-sm'
                              : 'border-[#DDD6F3] bg-white/60 hover:bg-white hover:border-[#B8A9E3]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5" style={{ color: ct.color }} />
                            <span className="text-[11px] font-bold text-[#0F0A1E] font-bangla">{lang === 'bn' ? ct.labelBn : ct.labelEn}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Link to Bazaar */}
                {bazaars.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#3D2B6B] block">{t('addaLinkBazaarLabel')}</label>
                    <select
                      value={newCommunity.bazaarId}
                      onChange={(e) => setNewCommunity((p) => ({ ...p, bazaarId: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] outline-none text-[#0F0A1E] bg-[#F5F2FF]"
                    >
                      <option value="">{lang === 'bn' ? '--- কোনো বাজার নয় ---' : '--- No bazaar ---'}</option>
                      {bazaars.map((b) => <option key={b.id} value={b.id}>{lang === 'bn' ? b.name : b.nameEn}</option>)}
                    </select>
                  </div>
                )}

                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-2.5 bondhu-gradient text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {t('addaSubmit')}
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
