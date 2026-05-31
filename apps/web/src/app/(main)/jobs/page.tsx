'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  X,
  Plus,
  Users,
  Languages,
  ArrowRight,
} from 'lucide-react';

// ── Enhanced Industries and Types ──
const INDUSTRIES = ['All', 'Technology', 'Healthcare', 'Education', 'Agriculture', 'Garments', 'Construction', 'Banking', 'Restaurant', 'Retail', 'NGO'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote'];

const INITIAL_JOBS = [
  { id: '1', title: 'সফটওয়্যার ইঞ্জিনিয়ার', titleEn: 'Software Engineer', company: 'TechBD Solutions', verified: true, location: 'Dhaka', type: 'Full-time', salaryMin: 45000, salaryMax: 75000, deadline: '2026-06-15', applicants: 47, industry: 'Technology', experience: '2-3 years', description: 'আমরা একটি দ্রুত বর্ধনশীল টেক স্টার্টআপের জন্য দক্ষ সফটওয়্যার ইঞ্জিনিয়ার খুঁজছি। আপনাকে রিঅ্যাক্ট এবং নেক্সটজেএস ইকোসিস্টেমে কাজ করতে হবে।' },
  { id: '2', title: 'নার্স', titleEn: 'Staff Nurse', company: 'Square Hospital', verified: true, location: 'Dhaka', type: 'Full-time', salaryMin: 25000, salaryMax: 40000, deadline: '2026-06-10', applicants: 23, industry: 'Healthcare', experience: '1-2 years', description: 'আমাদের ইন-পেশেন্ট কেয়ার ইউনিটের জন্য অভিজ্ঞ নার্স আবশ্যক। রোগীদের সেবা ও ঔষধ প্রদানের কাজে পারদর্শী হতে হবে।' },
  { id: '3', title: 'শিক্ষক (গণিত)', titleEn: 'Math Teacher', company: 'Sunrise School', verified: false, location: 'Chattogram', type: 'Full-time', salaryMin: 18000, salaryMax: 30000, deadline: '2026-06-20', applicants: 12, industry: 'Education', experience: 'Fresh', description: 'মাধ্যমিক শ্রেণির শিক্ষার্থীদের গণিত পাঠদানের জন্য উদ্যমী শিক্ষক প্রয়োজন। শিক্ষকতায় পূর্ব অভিজ্ঞতা থাকলে অগ্রাধিকার দেওয়া হবে।' },
  { id: '4', title: 'গার্মেন্টস সুপারভাইজার', titleEn: 'Garments Supervisor', company: 'Beximco Apparels', verified: true, location: 'Gazipur', type: 'Full-time', salaryMin: 35000, salaryMax: 50000, deadline: '2026-06-08', applicants: 89, industry: 'Garments', experience: '3-5 years', description: 'গার্মেন্টস প্রোডাকশন লাইনের তদারকি এবং লক্ষ্যমাত্রা অর্জনের জন্য অভিজ্ঞ সুপারভাইজার খুঁজছি।' },
  { id: '5', title: 'ডিজিটাল মার্কেটার', titleEn: 'Digital Marketer', company: 'BrandStory BD', verified: false, location: 'Dhaka', type: 'Remote', salaryMin: 20000, salaryMax: 40000, deadline: '2026-06-25', applicants: 34, industry: 'Technology', experience: '1-2 years', description: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট এবং ফেসবুক অ্যাড ক্যাম্পেইনে দক্ষ ডিজিটাল মার্কেটার প্রয়োজন।' },
];

// ── Translation Dictionary ──
const DICTIONARY = {
  bn: {
    findJobs: 'চাকরি খুঁজুন',
    searchPlaceholder: 'পদবী বা কোম্পানি দিয়ে খুঁজুন...',
    seekerMode: '🔍 চাকরি খুঁজছি',
    employerMode: '📋 নিয়োগ দিচ্ছি',
    seekerSubtitle: 'আপনার স্বপ্নের ক্যারিয়ার গড়ুন',
    employerSubtitle: 'সেরা প্রতিভা খুঁজে নিন',
    all: 'সবগুলো',
    salaryUnit: '/মাস',
    applicantsCount: 'জন আবেদন করেছেন',
    applyNow: 'আবেদন করুন',
    applied: 'আবেদন সফল হয়েছে!',
    noJobs: 'কোনো চাকরি পাওয়া যায়নি',
    postJobCTA: 'চাকরি পোস্ট করতে নিচের ফর্মটি পূরণ করুন',
    postJobBtn: '+ চাকরি পোস্ট করুন',
    formTitle: 'নতুন চাকরির সার্কুলার তৈরি করুন',
    formJobTitle: 'চাকরির পদবী (বাংলা)',
    formJobTitleEn: 'চাকরির পদবী (English)',
    formCompany: 'কোম্পানির নাম',
    formLocation: 'অবস্থান / জেলা',
    formSalaryMin: 'সর্বনিম্ন বেতন',
    formSalaryMax: 'সর্বোচ্চ বেতন',
    formDeadline: 'আবেদনের শেষ তারিখ',
    formIndustry: 'শিল্প খাত',
    formType: 'কাজের ধরণ',
    formExp: 'অভিজ্ঞতা',
    formDesc: 'চাকরির বিবরণ',
    submit: 'সাবমিট করুন',
    verifiedCompany: 'যাচাইকৃত কোম্পানি',
    cancel: 'বাতিল করুন',
    details: 'চাকরির বিস্তারিত বিবরণ',
    requirements: 'যোগ্যতা ও দায়িত্বসমূহ',
  },
  en: {
    findJobs: 'Find Jobs',
    searchPlaceholder: 'Search jobs, companies...',
    seekerMode: '🔍 Job Seeker',
    employerMode: '📋 Post a Job',
    seekerSubtitle: 'Build your dream career',
    employerSubtitle: 'Recruit top talent',
    all: 'All',
    salaryUnit: '/month',
    applicantsCount: 'applicants',
    applyNow: 'Apply Now',
    applied: 'Successfully Applied!',
    noJobs: 'No jobs found matching filters',
    postJobCTA: 'Fill the details below to post a mock job',
    postJobBtn: '+ Post a New Job',
    formTitle: 'Create New Job Post',
    formJobTitle: 'Job Title (Bangla)',
    formJobTitleEn: 'Job Title (English)',
    formCompany: 'Company Name',
    formLocation: 'Location',
    formSalaryMin: 'Minimum Salary',
    formSalaryMax: 'Maximum Salary',
    formDeadline: 'Application Deadline',
    formIndustry: 'Industry Group',
    formType: 'Job Type',
    formExp: 'Experience Required',
    formDesc: 'Job Description',
    submit: 'Post Job',
    verifiedCompany: 'Verified Recruiter',
    cancel: 'Cancel',
    details: 'Job Details Overview',
    requirements: 'Requirements & Responsibilities',
  }
};

export default function JobsPage() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [mode, setMode] = useState<'seeker' | 'employer'>('seeker');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<typeof INITIAL_JOBS[0] | null>(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [hasAppliedList, setHasAppliedList] = useState<string[]>([]);

  const [newJob, setNewJob] = useState({
    title: '', titleEn: '', company: '', location: '',
    type: 'Full-time', salaryMin: '', salaryMax: '',
    deadline: '2026-07-31', industry: 'Technology',
    experience: '1-2 years', description: '',
  });

  const t = (key: keyof typeof DICTIONARY['bn']) => DICTIONARY[lang][key];

  const fmt = (amount: number) =>
    lang === 'bn' ? amount.toLocaleString('bn-BD') : amount.toLocaleString('en-US');

  const filteredJobs = jobs.filter((j) => {
    const matchIndustry = selectedIndustry === 'All' || j.industry === selectedIndustry;
    const matchType = selectedType === 'All' || j.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      j.title.includes(searchQuery) ||
      j.titleEn.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q);
    return matchIndustry && matchType && matchSearch;
  });

  const handleApply = (id: string) => {
    if (!hasAppliedList.includes(id)) {
      setHasAppliedList((prev) => [...prev, id]);
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, applicants: j.applicants + 1 } : j));
      if (selectedJob?.id === id) {
        setSelectedJob((prev) => prev ? { ...prev, applicants: prev.applicants + 1 } : null);
      }
    }
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.titleEn || !newJob.company) return;

    setJobs((prev) => [{
      id: String(Date.now()),
      title: newJob.title,
      titleEn: newJob.titleEn,
      company: newJob.company,
      verified: true,
      location: newJob.location || 'Dhaka',
      type: newJob.type,
      salaryMin: Number(newJob.salaryMin) || 15000,
      salaryMax: Number(newJob.salaryMax) || 30000,
      deadline: newJob.deadline,
      applicants: 0,
      industry: newJob.industry,
      experience: newJob.experience,
      description: newJob.description || 'চাকরি সম্পর্কিত যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন।',
    }, ...prev]);

    setShowAddJobModal(false);
    setNewJob({
      title: '', titleEn: '', company: '', location: '',
      type: 'Full-time', salaryMin: '', salaryMax: '',
      deadline: '2026-07-31', industry: 'Technology',
      experience: '1-2 years', description: '',
    });
  };

  return (
    <div className="min-h-screen pb-24 antialiased">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DDD6F3] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B21B6] to-[#0D9488] flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-[#0F0A1E] font-bangla">
                  {lang === 'bn' ? 'কর্মসংস্থান পোর্টাল' : 'Job Portal'}
                </h1>
                <p className="text-[11px] text-[#6B5E8A] font-medium tracking-wide uppercase -mt-0.5">
                  {lang === 'bn' ? 'চাকরি খুঁজুন' : 'Connect & Grow'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5F2FF] hover:bg-[#EDE9FF] transition-colors text-[#5B21B6]"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>

          {/* Seeker / Employer tabs */}
          <div className="mt-3 flex gap-1 p-1 bg-[#F5F2FF] rounded-xl">
            {(['seeker', 'employer'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  mode === m
                    ? 'bg-white text-[#5B21B6] shadow-sm'
                    : 'text-[#6B5E8A] hover:text-[#0F0A1E] hover:bg-white/50'
                }`}
              >
                {m === 'seeker' ? <Search className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {t(m === 'seeker' ? 'seekerMode' : 'employerMode')}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-3">
            <div className="flex items-center gap-2 bg-[#F5F2FF] border border-[#DDD6F3] rounded-xl px-3 py-2.5 focus-within:border-[#5B21B6] focus-within:ring-2 focus-within:ring-[#5B21B6]/20 transition-all">
              <Search className="text-[#9B8FC0] shrink-0 w-4 h-4" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#0F0A1E] placeholder:text-[#9B8FC0] outline-none w-full font-bangla"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-full hover:bg-[#DDD6F3]">
                  <X className="w-3.5 h-3.5 text-[#9B8FC0]" />
                </button>
              )}
            </div>
          </div>

          {/* Industry filters */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedIndustry === ind
                    ? 'bg-gradient-to-r from-[#5B21B6] to-[#0D9488] border-transparent text-white shadow-sm'
                    : 'bg-white border-[#DDD6F3] text-[#3D2B6B] hover:bg-[#F5F2FF]'
                }`}
              >
                {ind === 'All' ? t('all') : ind}
              </button>
            ))}
          </div>

          {/* Job type filters */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1 border-t border-[#F5F2FF] pt-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-[#0F0A1E] text-white'
                    : 'bg-[#F5F2FF] hover:bg-[#DDD6F3] text-[#4C3A8A]'
                }`}
              >
                {type === 'All' ? t('all') : type}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-4xl mx-auto px-4 mt-4">

        {/* Employer CTA banner */}
        {mode === 'employer' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-5 bg-gradient-to-r from-[#EDE9FF] to-[#E0F7FA] rounded-2xl border border-[#DDD6F3] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5B21B6]" />
                <p className="text-sm font-bold text-[#0F0A1E] font-bangla">
                  {lang === 'bn' ? 'সহজে দক্ষ কর্মী খুঁজছেন?' : 'Looking for talented minds?'}
                </p>
              </div>
              <p className="text-xs text-[#6B5E8A] mt-1 font-bangla">
                {lang === 'bn'
                  ? 'নিমেষেই তৈরি করুন নিয়োগ সার্কুলার এবং সঠিক কর্মী বাছাই করুন।'
                  : 'Instantly create free dynamic job listings and attract the best candidates.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="px-5 py-2.5 rounded-xl text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 bondhu-gradient"
            >
              {t('postJobBtn')}
            </button>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-3 text-xs text-[#6B5E8A] px-1 font-semibold">
          <span>
            {lang === 'bn' ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে` : `Found ${filteredJobs.length} jobs`}
          </span>
          {selectedIndustry !== 'All' && (
            <span className="bg-[#F5F2FF] text-[#5B21B6] px-2 py-0.5 rounded font-bold">{selectedIndustry}</span>
          )}
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredJobs.map((job, i) => {
              const hasApplied = hasAppliedList.includes(job.id);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() => setSelectedJob(job)}
                  className="bg-white rounded-2xl p-5 border border-[#DDD6F3] hover:border-[#B8A9E3] hover:shadow-md transition-all duration-200 cursor-pointer group relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F5F2FF] to-[#EDE9FF] flex items-center justify-center text-[#5B21B6] font-bold text-base border border-[#DDD6F3] shrink-0 group-hover:scale-105 transition-transform">
                      {job.company[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#0F0A1E] group-hover:text-[#5B21B6] transition-colors font-bangla leading-snug">
                          {lang === 'bn' ? job.title : job.titleEn}
                        </h3>
                        {job.verified && <CheckCircle2 className="w-4 h-4 text-[#5B21B6] shrink-0" />}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#3D2B6B] font-semibold font-bangla">{job.company}</span>
                        <span className="text-[#B8A9E3] text-xs">&middot;</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#5B21B6]">
                          {job.type}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-lg font-extrabold tracking-tight text-[#0F0A1E]">
                          &#2547;{fmt(job.salaryMin)}
                        </span>
                        <span className="text-[#9B8FC0] text-xs">&mdash;</span>
                        <span className="text-lg font-extrabold tracking-tight text-[#0F0A1E]">
                          &#2547;{fmt(job.salaryMax)}
                        </span>
                        <span className="text-[11px] text-[#6B5E8A] font-medium ml-1">{t('salaryUnit')}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 mt-3 pt-2.5 border-t border-[#F5F2FF]">
                        <span className="flex items-center gap-1 text-[11px] text-[#6B5E8A] font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#9B8FC0]" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#6B5E8A] font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-[#9B8FC0]" /> {job.experience}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#0D9488] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {lang === 'bn' ? `শেষ সময়: ${job.deadline}` : `Deadline: ${job.deadline}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex md:flex-col justify-between md:justify-end items-center md:items-end gap-2 shrink-0 border-t border-[#F5F2FF] md:border-t-0 pt-3 md:pt-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#6B5E8A] font-bold">
                      <Users className="w-3.5 h-3.5 text-[#9B8FC0]" />
                      <span>{job.applicants} {t('applicantsCount')}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                      disabled={hasApplied}
                      className={`px-5 py-2 rounded-full text-xs font-bold w-full md:w-28 transition-all ${
                        hasApplied
                          ? 'bg-[#F5F2FF] text-[#9B8FC0] cursor-default'
                          : 'bondhu-gradient text-white shadow-md hover:shadow-lg active:scale-95'
                      }`}
                    >
                      {hasApplied ? t('applied') : t('applyNow')}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#DDD6F3]">
              <div className="w-16 h-16 rounded-full bg-[#F5F2FF] flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-8 h-8 text-[#B8A9E3]" />
              </div>
              <p className="text-[#6B5E8A] text-sm font-bold font-bangla">{t('noJobs')}</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Drawer ── */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)} className="fixed inset-0 bg-[#0F0A1E] z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[#DDD6F3]"
            >
              <div className="p-5 border-b border-[#DDD6F3] flex items-center justify-between bg-[#F5F2FF]">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#5B21B6]">{t('details')}</span>
                <button onClick={() => setSelectedJob(null)} className="w-8 h-8 rounded-full bg-white hover:bg-[#F5F2FF] flex items-center justify-center border border-[#DDD6F3] text-[#6B5E8A] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5 scrollbar-thin">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#F5F2FF] text-[#5B21B6]">{selectedJob.industry}</span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#F5F2FF] text-[#6B5E8A]">{selectedJob.type}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#0F0A1E] mt-3 font-bangla leading-tight">
                    {lang === 'bn' ? selectedJob.title : selectedJob.titleEn}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Building2 className="w-4 h-4 text-[#9B8FC0]" />
                    <span className="text-sm text-[#3D2B6B] font-bold font-bangla">{selectedJob.company}</span>
                    {selectedJob.verified && (
                      <span className="text-[10px] bg-[#F5F2FF] text-[#5B21B6] px-1.5 py-0.5 rounded font-bold uppercase">{t('verifiedCompany')}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#F5F2FF] p-4 rounded-xl border border-[#DDD6F3]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-[#9B8FC0] font-bold block">
                      {lang === 'bn' ? 'বেতন পরিসীমা' : 'Salary Range'}
                    </span>
                    <span className="text-sm font-bold text-[#0F0A1E]">
                      &#2547;{fmt(selectedJob.salaryMin)} &mdash; &#2547;{fmt(selectedJob.salaryMax)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-[#9B8FC0] font-bold block">{lang === 'bn' ? 'অবস্থান' : 'Location'}</span>
                    <span className="text-sm font-bold text-[#0F0A1E]">{selectedJob.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-[#9B8FC0] font-bold block">{lang === 'bn' ? 'অভিজ্ঞতা' : 'Experience'}</span>
                    <span className="text-sm font-bold text-[#0F0A1E]">{selectedJob.experience}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-[#9B8FC0] font-bold block">{lang === 'bn' ? 'আবেদনের শেষ সময়' : 'Deadline'}</span>
                    <span className="text-sm font-bold text-[#0D9488]">{selectedJob.deadline}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#9B8FC0]">
                    {lang === 'bn' ? 'কাজের বিবরণ' : 'Description'}
                  </h4>
                  <p className="text-sm text-[#3D2B6B] leading-relaxed font-bangla">{selectedJob.description}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#9B8FC0]">{t('requirements')}</h4>
                  <ul className="space-y-2 text-sm text-[#3D2B6B]">
                    {[
                      lang === 'bn' ? 'চাকরির দায়িত্ব পালনে সৎ ও নিষ্ঠাবান হতে হবে।' : 'Must be reliable, proactive and committed.',
                      lang === 'bn' ? 'দলগতভাবে কাজ করার মানসিকতা থাকতে হবে।' : 'Should collaborate efficiently across teams.',
                      lang === 'bn' ? 'নির্দিষ্ট সময়ের মধ্যে দায়িত্ব সম্পন্ন করতে হবে।' : 'Ability to deliver results within strict deadlines.',
                    ].map((txt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6] mt-1.5 shrink-0" />
                        <span>{txt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 border-t border-[#DDD6F3] bg-[#F5F2FF] flex items-center justify-between gap-4">
                <div className="text-xs text-[#6B5E8A] font-bold flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#9B8FC0]" />
                  <span>{selectedJob.applicants} {t('applicantsCount')}</span>
                </div>
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={hasAppliedList.includes(selectedJob.id)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    hasAppliedList.includes(selectedJob.id)
                      ? 'bg-[#DDD6F3] text-[#9B8FC0] cursor-default'
                      : 'bondhu-gradient text-white shadow-lg hover:scale-105'
                  }`}
                >
                  <span>{hasAppliedList.includes(selectedJob.id) ? t('applied') : t('applyNow')}</span>
                  {!hasAppliedList.includes(selectedJob.id) && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Post Job Modal ── */}
      <AnimatePresence>
        {showAddJobModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddJobModal(false)} className="fixed inset-0 bg-[#0F0A1E] z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-10 md:top-20 bottom-10 md:bottom-20 max-w-xl md:mx-auto bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-[#DDD6F3] overflow-hidden"
            >
              <div className="p-5 border-b border-[#DDD6F3] flex items-center justify-between bg-[#F5F2FF]">
                <div>
                  <h3 className="text-base font-bold text-[#0F0A1E]">{t('formTitle')}</h3>
                  <p className="text-[11px] text-[#6B5E8A] font-semibold">{t('postJobCTA')}</p>
                </div>
                <button onClick={() => setShowAddJobModal(false)} className="w-8 h-8 rounded-full hover:bg-[#DDD6F3] flex items-center justify-center border border-[#DDD6F3] text-[#6B5E8A] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePostJob} className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formJobTitle')}</label>
                    <input type="text" required placeholder="যেমন: ওয়ার্ডপ্রেস ডেভেলপার"
                      value={newJob.title} onChange={(e) => setNewJob((p) => ({ ...p, title: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formJobTitleEn')}</label>
                    <input type="text" required placeholder="e.g. WordPress Developer"
                      value={newJob.titleEn} onChange={(e) => setNewJob((p) => ({ ...p, titleEn: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formCompany')}</label>
                    <input type="text" required placeholder="e.g. Acme Tech Corp"
                      value={newJob.company} onChange={(e) => setNewJob((p) => ({ ...p, company: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formLocation')}</label>
                    <input type="text" placeholder="e.g. Dhaka, Bangladesh"
                      value={newJob.location} onChange={(e) => setNewJob((p) => ({ ...p, location: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formIndustry')}</label>
                    <select value={newJob.industry} onChange={(e) => setNewJob((p) => ({ ...p, industry: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]">
                      {INDUSTRIES.filter((i) => i !== 'All').map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formType')}</label>
                    <select value={newJob.type} onChange={(e) => setNewJob((p) => ({ ...p, type: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]">
                      {JOB_TYPES.filter((t) => t !== 'All').map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formSalaryMin')}</label>
                    <input type="number" placeholder="15000"
                      value={newJob.salaryMin} onChange={(e) => setNewJob((p) => ({ ...p, salaryMin: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formSalaryMax')}</label>
                    <input type="number" placeholder="45000"
                      value={newJob.salaryMax} onChange={(e) => setNewJob((p) => ({ ...p, salaryMax: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formExp')}</label>
                    <input type="text" placeholder="e.g. 1-2 years"
                      value={newJob.experience} onChange={(e) => setNewJob((p) => ({ ...p, experience: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2B6B] block">{t('formDeadline')}</label>
                    <input type="date"
                      value={newJob.deadline} onChange={(e) => setNewJob((p) => ({ ...p, deadline: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3D2B6B] block">{t('formDesc')}</label>
                  <textarea rows={4} placeholder="নিয়োগ সম্পর্কিত দায়িত্ব এবং সুযোগ-সুবিধা বিস্তারিতভাবে লিখুন..."
                    value={newJob.description} onChange={(e) => setNewJob((p) => ({ ...p, description: e.target.value }))}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#DDD6F3] focus:border-[#5B21B6] outline-none text-[#0F0A1E] bg-[#F5F2FF] resize-none" />
                </div>

                <div className="pt-4 border-t border-[#DDD6F3] flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setShowAddJobModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#6B5E8A] hover:bg-[#F5F2FF] rounded-lg transition-colors border border-[#DDD6F3]">
                    {t('cancel')}
                  </button>
                  <button type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bondhu-gradient rounded-lg transition-all shadow-md hover:shadow-lg">
                    {t('submit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
