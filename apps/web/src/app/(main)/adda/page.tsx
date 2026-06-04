// @ts-nocheck
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Sparkles, MessageSquare, X, Plus, Compass,
  TrendingUp, Coffee, Check, Search, ArrowLeft,
  Flame, Award, Send, Flag, MapPin,
} from 'lucide-react';
import { BondhuLogo } from '@/components/ui/CulturalIcons';

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
interface Comment {
  id: string;
  author: string;
  authorTitle: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  authorTitle: string;
  avatar: string;
  content: string;
  teaCount: number;
  kosomCount: number;
  hasTeaGiven: boolean;
  hasKosomGiven: boolean;
  comments: Comment[];
}

interface Community {
  id: string;
  name: string;
  description: string;
  typeId: string;
  bazaarName: string;
  memberCount: number;
  posts: Post[];
  bannerGradient: string;
}

// ═══════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════
const COMMUNITY_TYPES = [
  { id: 'tong', labelBn: '☕ মোড়ের মাথার টং', labelEn: 'Tea Stall Gossip', desc: 'খাঁটি আড্ডা, পরচর্চা ও চা-গসিপ', icon: '☕', color: '#5B21B6' },
  { id: 'dordam', labelBn: '⚔️ দরদাম স্কোয়াড', labelEn: 'Bargaining Experts', desc: 'বাজারের লস বাঁচানোর গোপন ট্রিকস', icon: '⚔️', color: '#0D9488' },
  { id: 'khaddok', labelBn: '🍗 খাদক বাহিনী', labelEn: 'Foodie Squad', desc: 'সেরা বিরিয়ানি ও স্ট্রিট ফুডের সন্ধান', icon: '🍗', color: '#E85D75' },
  { id: 'miking', labelBn: '📢 এলাকার মাইকিং', labelEn: 'Local News Alerts', desc: 'জরুরি বাজার আপডেট ও সতর্কতা', icon: '📢', color: '#F59E0B' },
];

const DESHI_TITLES = [
  { id: 'boss', label: 'বাজারের আসল বস', emoji: '👑' },
  { id: 'mama', label: 'টংয়ের আড্ডাবাজ মামা', emoji: '☕' },
  { id: 'expert', label: 'দরদাম বিশেষজ্ঞ', emoji: '⚔️' },
  { id: 'foodie', label: 'খাবারের সন্ধানকারী', emoji: '🍗' },
];

const DESHI_AVATARS = ['🧔', '👨‍🦱', '👵', '👨‍🦳', '👳‍♂️', '👩‍🦰', '🕶️', '🦁'];

const BANNER_GRADIENTS = [
  'from-[#5B21B6] to-[#7C3AED]',
  'from-[#0D9488] to-[#14B8A6]',
  'from-[#E85D75] to-[#F472B6]',
  'from-[#F59E0B] to-[#FBBF24]',
];

// ═══════════════════════════════════════════════════════════
//  DICTIONARY
// ═══════════════════════════════════════════════════════════
const DICT = {
  bn: {
    title: 'ডিজিটাল আড্ডাঘর', subtitle: 'Where Local Neighbors Vibe',
    tabAll: '🎯 সব আড্ডা',
    searchPlaceholder: 'নাম অথবা এলাকা দিয়ে আড্ডা খুঁজুন (উদা: মিরপুর, রামপুরা)...',
    squadCount: 'সচল স্কোয়াড সমূহ',
    createSquadBtn: 'নতুন আড্ডা খোলেন',
    noSquadTitle: 'কোনো আড্ডাঘর খুঁজে পাওয়া যায়নি!',
    noSquadDesc: 'আপনার এলাকার প্রথম খাঁটি আড্ডাটি শুরু করুন এখনই। আপনার মনের মতো ক্যাটাগরি বেছে নিয়ে একটি গ্রুপ খুলে ফেলুন!',
    createFirstBtn: 'আজই প্রথম আড্ডা শুরু করুন',
    bannerTag: 'খাঁটি বাঙালি আড্ডা',
    bannerTitle: 'পাড়ার মোড়ের টং এবার আপনার মোবাইলে!',
    bannerDesc: 'বাজারের কোন দোকানে সেরা অফার চলছে বা কার সাথে কত কমে দরদাম করলেন—সব শেয়ার করুন এলাকার মানুষের সাথে মজা করে!',
    // Create modal
    createModalTitle: '🚀 নতুন লোকাল স্কোয়াড তৈরি করুন',
    nameLabel: 'স্কোয়াডের সুন্দর একটা নাম দিন *',
    namePlaceholder: 'উদা: মিরপুর ১১-র সস্তা বাজার টিম 🛒',
    descLabel: 'এই আড্ডায় কী হবে? (বিবরণ)',
    descPlaceholder: 'উদা: আমাদের এলাকার কাঁচাবাজারের কোন দোকানে আজকে কম দামে আলু-পটল দিচ্ছে তার খোঁজখবর।',
    typeLabel: 'আড্ডার ভাইব কেমন হবে?',
    bazaarLabel: 'কোন বাজার এলাকা? *',
    bazaarPlaceholder: 'যেমন: মিরপুর, ঢাকা',
    submitBtn: '🎉 স্কোয়াড চালু করে দিন',
    // Profile
    profileTitle: '👤 প্রোফাইল ও উপাধি কাস্টমাইজ',
    nameFieldLabel: 'আপনার নাম',
    titleFieldLabel: 'আপনার আড্ডাবাজ উপাধি (Vibe Title)',
    saveBtn: 'সংরক্ষণ করুন',
    // Community detail
    backToList: 'আড্ডার তালিকা',
    memberLabel: 'আড্ডাবাজ',
    postSectionLabel: 'পোস্টিং অ্যাজ',
    postPlaceholder: 'টংয়ে কোনো নতুন কথা ছড়াতে চান, মামা? বাজারে কি পেঁয়াজের দাম বাড়লো? লিখুন এখানে...',
    postBtn: 'ছড়াও!',
    discussionBoard: 'আলোচনা বোর্ড',
    commentPlaceholder: 'আলোচনায় অংশ নিন...',
    noPostsTitle: 'এই আড্ডায় এখনো কোনো পোস্ট ছড়ানো হয়নি!',
    noPostsDesc: 'প্রথম আড্ডাবাজ হিসেবে উপরে আপনার চমৎকার একটি বাজার আপডেট বা কোনো মজার দরদামের গল্প শেয়ার করুন।',
    // Reactions
    teaReaction: '☕ চা খাওয়ানো',
    kosomReaction: '🎯 মামা কসম খাঁটি কথা',
    // Toast
    profileUpdated: '👤 প্রোফাইল আপডেট সাকসেসফুল!',
    fillAllFields: 'সবগুলো ঘর ঠিকঠাক পূরণ করুন, মামা! ⚠️',
    squadCreated: '🎉 নতুন লোকাল স্কোয়াড খোলা সাকসেসফুল!',
    postCreated: '☕ আড্ডায় নতুন পোস্ট ছড়ানো হলো!',
    commentAdded: '💬 কমেন্ট জমা দেওয়া হয়েছে!',
  },
  en: {
    title: 'Digital Adda House', subtitle: 'Where Local Neighbors Vibe',
    tabAll: '🎯 All Squads',
    searchPlaceholder: 'Search adda by name or area (e.g. Mirpur, Rampura)...',
    squadCount: 'Active Squads',
    createSquadBtn: 'Create New Adda',
    noSquadTitle: 'No adda houses found!',
    noSquadDesc: 'Start the first authentic adda in your area. Pick a category and open a group!',
    createFirstBtn: 'Start First Adda Today',
    bannerTag: 'Authentic Bengali Adda',
    bannerTitle: 'Your neighborhood tea stall, now on mobile!',
    bannerDesc: 'Share deals, bargaining tips, and local gossip with your neighbors in a fun way!',
    // Create modal
    createModalTitle: '🚀 Create New Local Squad',
    nameLabel: 'Give your squad a nice name *',
    namePlaceholder: 'e.g. Mirpur 11 Cheap Bazaar Team 🛒',
    descLabel: 'What will this adda be about?',
    descPlaceholder: 'e.g. Finding the best vegetable prices in our local market today.',
    typeLabel: 'What vibe will this adda have?',
    bazaarLabel: 'Which bazaar area? *',
    bazaarPlaceholder: 'e.g. Mirpur, Dhaka',
    submitBtn: '🎉 Launch Squad',
    // Profile
    profileTitle: '👤 Profile & Title Customization',
    nameFieldLabel: 'Your Name',
    titleFieldLabel: 'Your Adda Title (Vibe)',
    saveBtn: 'Save',
    // Community detail
    backToList: 'Back to Adda List',
    memberLabel: 'Adda Members',
    postSectionLabel: 'Posting as',
    postPlaceholder: 'Got market gossip? Share an update or a fun bargaining story...',
    postBtn: 'Post!',
    discussionBoard: 'Discussion Board',
    commentPlaceholder: 'Join the discussion...',
    noPostsTitle: 'No posts in this adda yet!',
    noPostsDesc: 'Be the first adda master to share a market update or a fun story.',
    // Reactions
    teaReaction: '☕ Give Tea',
    kosomReaction: '🎯 Swear Truth',
    // Toast
    profileUpdated: '👤 Profile updated successfully!',
    fillAllFields: 'Please fill all fields! ⚠️',
    squadCreated: '🎉 New local squad created successfully!',
    postCreated: '☕ New post shared in adda!',
    commentAdded: '💬 Comment added!',
  }
};

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function AddaPage() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  // User profile — starts empty, user sets via profile modal
  const [userProfile, setUserProfile] = useState({
    name: '',
    title: `👑 ${DICT.bn.title}`,
    avatar: '🕶️',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tong' | 'dordam' | 'khaddok' | 'miking'>('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newComm, setNewComm] = useState({ name: '', description: '', typeId: 'tong', bazaarName: '' });
  const [newPostText, setNewPostText] = useState('');
  const [newCommentTexts, setNewCommentTexts] = useState<{ [postId: string]: string }>({});

  const t = (key: keyof typeof DICT['bn']) => DICT[lang][key];

  // ── Toast ──
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Create Community ──
  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComm.name.trim() || !newComm.bazaarName.trim()) {
      triggerToast(t('fillAllFields'));
      return;
    }

    const randomGradient = BANNER_GRADIENTS[Math.floor(Math.random() * BANNER_GRADIENTS.length)];

    const created: Community = {
      id: `comm-${Date.now()}`,
      name: newComm.name,
      description: newComm.description || (lang === 'bn' ? 'আড্ডাখানা জমে ক্ষীর হবে!' : 'The adda will be lit!'),
      typeId: newComm.typeId,
      bazaarName: newComm.bazaarName,
      memberCount: 1,
      posts: [],
      bannerGradient: randomGradient,
    };

    setCommunities((prev) => [created, ...prev]);
    setShowCreateModal(false);
    setNewComm({ name: '', description: '', typeId: 'tong', bazaarName: '' });
    setSelectedCommunity(created);
    triggerToast(t('squadCreated'));
  };

  // ── Add Post ──
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !selectedCommunity) return;
    if (!userProfile.name.trim()) {
      triggerToast(lang === 'bn' ? 'প্রথমে প্রোফাইলে আপনার নাম দিন! ⚠️' : 'Please set your name in profile first! ⚠️');
      setShowProfileModal(true);
      return;
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: userProfile.name,
      authorTitle: userProfile.title,
      avatar: userProfile.avatar,
      content: newPostText,
      teaCount: 0,
      kosomCount: 0,
      hasTeaGiven: false,
      hasKosomGiven: false,
      comments: [],
    };

    const updated = { ...selectedCommunity, posts: [newPost, ...selectedCommunity.posts] };
    setCommunities((prev) => prev.map((c) => c.id === selectedCommunity.id ? updated : c));
    setSelectedCommunity(updated);
    setNewPostText('');
    triggerToast(t('postCreated'));
  };

  // ── Reactions ──
  const handlePostReaction = (postId: string, reactionType: 'tea' | 'kosom') => {
    if (!selectedCommunity) return;

    const updatedPosts = selectedCommunity.posts.map((post) => {
      if (post.id !== postId) return post;
      if (reactionType === 'tea') {
        const toggled = !post.hasTeaGiven;
        return { ...post, teaCount: toggled ? post.teaCount + 1 : post.teaCount - 1, hasTeaGiven: toggled };
      }
      const toggled = !post.hasKosomGiven;
      return { ...post, kosomCount: toggled ? post.kosomCount + 1 : post.kosomCount - 1, hasKosomGiven: toggled };
    });

    const updated = { ...selectedCommunity, posts: updatedPosts };
    setCommunities((prev) => prev.map((c) => c.id === selectedCommunity.id ? updated : c));
    setSelectedCommunity(updated);
  };

  // ── Add Comment ──
  const handleAddComment = (postId: string) => {
    const text = newCommentTexts[postId];
    if (!text?.trim() || !selectedCommunity) return;
    if (!userProfile.name.trim()) {
      triggerToast(lang === 'bn' ? 'প্রথমে প্রোফাইলে আপনার নাম দিন! ⚠️' : 'Please set your name in profile first! ⚠️');
      setShowProfileModal(true);
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: userProfile.name,
      authorTitle: userProfile.title,
      text,
      time: lang === 'bn' ? 'এইমাত্র' : 'Just now',
    };

    const updatedPosts = selectedCommunity.posts.map((post) =>
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    );

    const updated = { ...selectedCommunity, posts: updatedPosts };
    setCommunities((prev) => prev.map((c) => c.id === selectedCommunity.id ? updated : c));
    setSelectedCommunity(updated);
    setNewCommentTexts((prev) => ({ ...prev, [postId]: '' }));
    triggerToast(t('commentAdded'));
  };

  // ── Filtered communities ──
  const filteredCommunities = communities.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || c.bazaarName.toLowerCase().includes(q);
    const matchesTab = activeTab === 'all' || c.typeId === activeTab;
    return matchesSearch && matchesTab;
  });

  // ── Get type info ──
  const getTypeInfo = (typeId: string) => COMMUNITY_TYPES.find((t) => t.id === typeId);

  return (
    <div className="min-h-screen pb-24 antialiased">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#E8D5F5]/15 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#D4F1E0]/15 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[30%] w-[35%] h-[35%] rounded-full bg-[#FDE1D0]/15 blur-[90px]" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-5 left-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #5B21B6, #0D9488)', color: 'white' }}
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5F2FF] text-[#5B21B6] border border-[#DDD6F3] hover:bg-[#EDE9FF] transition-colors"
            >
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 bg-[#F5F2FF] hover:bg-[#EDE9FF] border border-[#DDD6F3] rounded-xl px-3 py-1.5 transition-all"
            >
              <span className="text-xl">{userProfile.avatar}</span>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-extrabold text-[#0F0A1E] leading-none">{userProfile.name}</div>
                <div className="text-[9px] font-bold text-[#5B21B6] mt-0.5 font-bangla">{userProfile.title}</div>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 relative z-10">
        <AnimatePresence mode="wait">
          {!selectedCommunity ? (
            // ═══════════════════════════════════════════════════════════
            //  VIEW 1: EXPLORER
            // ═══════════════════════════════════════════════════════════
            <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-md"
                style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #0D9488 100%)' }}>
                <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 text-[140px] opacity-10 select-none">☕</div>
                <div className="max-w-md space-y-2 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-[#0F0A1E] rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" /> {t('bannerTag')}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white font-bangla">{t('bannerTitle')}</h2>
                  <p className="text-xs text-white/80 font-medium leading-relaxed font-bangla">{t('bannerDesc')}</p>
                </div>
              </div>

              {/* Search & Tabs */}
              <div className="glass-card p-4 space-y-4">
                <div className="glass-input flex items-center gap-2 px-3 py-2.5 rounded-xl focus-within:ring-2 focus-within:ring-[#5B21B6]/20">
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

                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-hide">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      activeTab === 'all' ? 'bondhu-gradient text-white border-transparent' : 'bg-white/60 text-[#3D2B6B] border-[#DDD6F3] hover:bg-white'
                    }`}
                  >
                    {t('tabAll')}
                  </button>
                  {COMMUNITY_TYPES.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 flex items-center gap-1 ${
                        activeTab === tab.id ? 'bondhu-gradient text-white border-transparent' : 'bg-white/60 text-[#3D2B6B] border-[#DDD6F3] hover:bg-white'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="font-bangla">{lang === 'bn' ? tab.labelBn.split(' ').slice(1).join(' ') : tab.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#9B8FC0] flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> {t('squadCount')} ({filteredCommunities.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-3 py-1.5 bondhu-gradient text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span className="font-bangla">{t('createSquadBtn')}</span>
                  </motion.button>
                </div>

                {filteredCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredCommunities.map((comm) => {
                      const typeInfo = getTypeInfo(comm.typeId);
                      return (
                        <motion.div
                          key={comm.id}
                          whileHover={{ y: -2 }}
                          onClick={() => setSelectedCommunity(comm)}
                          className="glass-card-hover overflow-hidden cursor-pointer group flex flex-col justify-between"
                        >
                          <div className={`p-4 bg-gradient-to-r ${comm.bannerGradient} text-white relative`}>
                            <span className="absolute top-3 right-3 text-2xl opacity-20">{typeInfo?.icon}</span>
                            <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                              {lang === 'bn' ? typeInfo?.labelBn.split(' ').slice(1).join(' ') : typeInfo?.labelEn}
                            </span>
                            <h4 className="font-extrabold text-sm mt-2 leading-snug font-bangla group-hover:underline">{comm.name}</h4>
                            <span className="text-[10px] text-white/80 font-bold block mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {comm.bazaarName}
                            </span>
                          </div>

                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <p className="text-[11px] text-[#6B5E8A] font-medium line-clamp-2 leading-relaxed font-bangla">
                              {comm.description}
                            </p>
                            <div className="border-t border-[#DDD6F3]/50 pt-3 mt-4 flex items-center justify-between text-[10px] font-bold">
                              <span className="text-[#5B21B6] bg-[#F5F2FF] px-2 py-0.5 rounded-md">
                                {comm.posts.length} {lang === 'bn' ? 'আড্ডার পোস্ট' : 'Posts'}
                              </span>
                              <span className="text-[#6B5E8A] flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-[#9B8FC0]" /> {comm.memberCount} {lang === 'bn' ? 'জন আড্ডাবাজ' : 'Members'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-6 glass-card">
                    <div className="w-16 h-16 rounded-full bg-[#F5F2FF] text-[#B8A9E3] flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="font-black text-[#0F0A1E] text-sm font-bangla">{t('noSquadTitle')}</h4>
                    <p className="text-xs text-[#6B5E8A] font-medium max-w-sm mx-auto mt-1 mb-6 font-bangla leading-relaxed">{t('noSquadDesc')}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateModal(true)}
                      className="px-5 py-2.5 bondhu-gradient text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> <span className="font-bangla">{t('createFirstBtn')}</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            // ═══════════════════════════════════════════════════════════
            //  VIEW 2: COMMUNITY DETAIL
            // ═══════════════════════════════════════════════════════════
            <motion.div
              key="squad-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Back button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCommunity(null)}
                className="text-xs font-bold text-[#6B5E8A] hover:text-[#0F0A1E] flex items-center gap-1.5 bg-[#F5F2FF] hover:bg-[#EDE9FF] px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> <span className="font-bangla">{t('backToList')}</span>
              </motion.button>

              {/* Community Header */}
              <div className={`p-5 rounded-2xl bg-gradient-to-r ${selectedCommunity.bannerGradient} text-white shadow-sm`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                        {lang === 'bn' ? getTypeInfo(selectedCommunity.typeId)?.labelBn : getTypeInfo(selectedCommunity.typeId)?.labelEn}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-400 text-[#0F0A1E] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {selectedCommunity.bazaarName}
                      </span>
                    </div>
                    <h2 className="text-lg font-black mt-2 leading-tight font-bangla">{selectedCommunity.name}</h2>
                    <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed font-bangla">{selectedCommunity.description}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center shrink-0">
                    <span className="text-sm font-black block leading-none">{selectedCommunity.memberCount}</span>
                    <span className="text-[8px] font-bold block mt-1 uppercase text-white/80 font-bangla">{t('memberLabel')}</span>
                  </div>
                </div>
              </div>

              {/* Post Creator */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl mt-0.5">{userProfile.avatar}</span>
                  <div className="flex-grow">
                    <textarea
                      rows={2}
                      placeholder={t('postPlaceholder')}
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      className="w-full text-xs font-medium border-0 outline-none text-[#0F0A1E] placeholder:text-[#9B8FC0] resize-none pt-1 bg-transparent font-bangla"
                    />
                  </div>
                </div>
                <div className="border-t border-[#DDD6F3]/50 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#6B5E8A] font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#F59E0B]" /> {t('postSectionLabel')} <span className="text-[#0F0A1E]">{userProfile.name}</span>
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddPost}
                    disabled={!newPostText.trim()}
                    className="px-4 py-1.5 bondhu-gradient text-white disabled:bg-[#DDD6F3] disabled:text-[#9B8FC0] rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-md disabled:shadow-none"
                  >
                    <Send className="w-3.5 h-3.5" /> <span className="font-bangla">{t('postBtn')}</span>
                  </motion.button>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {selectedCommunity.posts.length > 0 ? (
                  selectedCommunity.posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-5 space-y-4"
                    >
                      {/* Author */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl bg-[#F5F2FF] p-1.5 rounded-xl border border-[#DDD6F3]/50">{post.avatar}</span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-xs text-[#0F0A1E] font-bangla">{post.author}</h4>
                              <span className="text-[9px] bg-[#F5F2FF] text-[#5B21B6] font-extrabold px-1.5 py-0.5 rounded-sm font-bangla">
                                {post.authorTitle}
                              </span>
                            </div>
                            <span className="text-[9px] text-[#6B5E8A] font-semibold block mt-0.5 font-bangla">{lang === 'bn' ? 'লোকাল টংয়ে আড্ডারত' : 'Hanging at local tong'}</span>
                          </div>
                        </div>
                        <button className="text-[#DDD6F3] hover:text-[#6B5E8A] transition-all">
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <p className="text-xs sm:text-sm font-semibold text-[#0F0A1E] leading-relaxed whitespace-pre-line font-bangla">
                        {post.content}
                      </p>

                      {/* Reactions */}
                      <div className="flex items-center gap-3 border-y border-[#DDD6F3]/50 py-2.5">
                        <button
                          onClick={() => handlePostReaction(post.id, 'tea')}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                            post.hasTeaGiven
                              ? 'bg-[#F5F2FF] text-[#5B21B6] border-[#5B21B6]/30'
                              : 'bg-white/60 text-[#6B5E8A] border-[#DDD6F3] hover:bg-[#F5F2FF]'
                          }`}
                        >
                          <Coffee className="w-4 h-4" />
                          <span className="font-bangla">{t('teaReaction')} ({post.teaCount})</span>
                        </button>

                        <button
                          onClick={() => handlePostReaction(post.id, 'kosom')}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                            post.hasKosomGiven
                              ? 'bg-[#FFF7ED] text-[#F59E0B] border-[#F59E0B]/30'
                              : 'bg-white/60 text-[#6B5E8A] border-[#DDD6F3] hover:bg-[#FFF7ED]'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span className="font-bangla">{t('kosomReaction')} ({post.kosomCount})</span>
                        </button>
                      </div>

                      {/* Comments */}
                      <div className="space-y-3 pt-1">
                        <h5 className="text-[10px] font-black uppercase text-[#9B8FC0] flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> {t('discussionBoard')} ({post.comments.length})
                        </h5>

                        {post.comments.length > 0 && (
                          <div className="space-y-2 bg-[#F5F2FF]/50 p-3 rounded-xl border border-[#DDD6F3]/50">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="text-xs border-b border-[#DDD6F3]/30 last:border-0 pb-2 last:pb-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-extrabold text-[#0F0A1E] text-[11px] font-bangla">{comment.author}</span>
                                  <span className="text-[8px] font-bold bg-[#DDD6F3]/50 text-[#6B5E8A] px-1 rounded-sm">
                                    {comment.authorTitle}
                                  </span>
                                  <span className="text-[8px] text-[#9B8FC0]">{comment.time}</span>
                                </div>
                                <p className="text-[#6B5E8A] font-medium mt-1 pl-1 leading-normal font-bangla">{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={t('commentPlaceholder')}
                            value={newCommentTexts[post.id] || ''}
                            onChange={(e) => setNewCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-grow text-xs px-3 py-2 rounded-xl border border-[#DDD6F3] outline-none focus:border-[#5B21B6] font-medium bg-white/60 font-bangla"
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddComment(post.id)}
                            className="px-3 bg-[#F5F2FF] hover:bg-[#EDE9FF] text-[#5B21B6] border border-[#DDD6F3] rounded-xl transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 px-6 glass-card">
                    <Coffee className="w-10 h-10 text-[#B8A9E3] mx-auto mb-2" />
                    <h4 className="font-bold text-[#0F0A1E] text-xs font-bangla">{t('noPostsTitle')}</h4>
                    <p className="text-[11px] text-[#6B5E8A] font-medium max-w-xs mx-auto mt-0.5 font-bangla leading-relaxed">{t('noPostsDesc')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: Create Community
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="fixed inset-0 bg-[#0F0A1E] z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-x-4 top-16 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#DDD6F3]"
            >
              <div className="p-4 bg-[#F5F2FF] border-b border-[#DDD6F3] flex justify-between items-center">
                <span className="font-bold text-sm text-[#0F0A1E] font-bangla">{t('createModalTitle')}</span>
                <button onClick={() => setShowCreateModal(false)} className="w-7 h-7 rounded-full hover:bg-[#DDD6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#6B5E8A]" /></button>
              </div>
              <form onSubmit={handleCreateCommunity} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block font-bangla">{t('nameLabel')}</label>
                  <input type="text" required placeholder={t('namePlaceholder')} value={newComm.name} onChange={(e) => setNewComm((p) => ({ ...p, name: e.target.value }))} className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] font-bangla" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block font-bangla">{t('descLabel')}</label>
                  <textarea rows={2} placeholder={t('descPlaceholder')} value={newComm.description} onChange={(e) => setNewComm((p) => ({ ...p, description: e.target.value }))} className="w-full text-xs px-3 py-2 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] font-medium resize-none bg-[#F5F2FF] font-bangla" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#3D2B6B] block font-bangla">{t('typeLabel')}</label>
                    <select value={newComm.typeId} onChange={(e) => setNewComm((p) => ({ ...p, typeId: e.target.value }))} className="w-full text-xs px-3 py-2.5 bg-white rounded-lg border border-[#DDD6F3] outline-none text-[#0F0A1E] font-bold">
                      {COMMUNITY_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>{type.icon} {lang === 'bn' ? type.labelBn : type.labelEn}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#3D2B6B] block font-bangla">{t('bazaarLabel')}</label>
                    <input type="text" required placeholder={t('bazaarPlaceholder')} value={newComm.bazaarName} onChange={(e) => setNewComm((p) => ({ ...p, bazaarName: e.target.value }))} className="w-full text-xs px-3 py-2 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] font-bold bg-[#F5F2FF] font-bangla" />
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 bondhu-gradient text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2">
                  <Sparkles className="w-3.5 h-3.5" /> <span className="font-bangla">{t('submitBtn')}</span>
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: Profile
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setShowProfileModal(false)} className="fixed inset-0 bg-[#0F0A1E] z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-x-4 top-24 max-w-sm mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#DDD6F3]"
            >
              <div className="p-4 bg-[#F5F2FF] border-b border-[#DDD6F3] font-bold text-sm text-[#0F0A1E] flex justify-between items-center font-bangla">
                <span>{t('profileTitle')}</span>
                <button onClick={() => setShowProfileModal(false)} className="w-7 h-7 rounded-full hover:bg-[#DDD6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#6B5E8A]" /></button>
              </div>
              <div className="p-5 space-y-4">
                {/* Avatar selector */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl bg-[#F5F2FF] p-4 rounded-full border border-[#DDD6F3]/50">{userProfile.avatar}</span>
                  <div className="flex gap-1.5 flex-wrap justify-center mt-2">
                    {DESHI_AVATARS.map((av) => (
                      <button
                        key={av}
                        onClick={() => setUserProfile((p) => ({ ...p, avatar: av }))}
                        className={`text-xl p-1.5 rounded-lg border transition-all ${userProfile.avatar === av ? 'border-[#5B21B6] bg-[#EDE9FF]' : 'border-[#DDD6F3] bg-white hover:bg-[#F5F2FF]'}`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block font-bangla">{t('nameFieldLabel')}</label>
                  <input type="text" value={userProfile.name} onChange={(e) => setUserProfile((p) => ({ ...p, name: e.target.value }))} className="w-full text-xs px-3 py-2 rounded-lg border border-[#DDD6F3] outline-none focus:border-[#5B21B6] text-[#0F0A1E] font-bold bg-[#F5F2FF] font-bangla" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#3D2B6B] block font-bangla">{t('titleFieldLabel')}</label>
                  <select value={userProfile.title} onChange={(e) => setUserProfile((p) => ({ ...p, title: e.target.value }))} className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#DDD6F3] outline-none text-[#0F0A1E] font-bold">
                    {DESHI_TITLES.map((title) => (
                      <option key={title.id} value={`${title.emoji} ${title.label}`}>{title.emoji} {title.label}</option>
                    ))}
                  </select>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowProfileModal(false); triggerToast(t('profileUpdated')); }}
                  className="w-full py-2.5 bondhu-gradient text-white rounded-xl text-xs font-bold shadow-md mt-2 transition-all font-bangla"
                >
                  {t('saveBtn')}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
