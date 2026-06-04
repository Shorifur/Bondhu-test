// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Search, MapPin, Clock, CheckCircle2, Building2, X, Plus,
  Users, Languages, ArrowRight, Trash2, Edit3, AlertTriangle, ChevronDown,
  Upload, FileText,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { districts } from '@/lib/districts';
import { cn } from '@/lib/utils';

// ── Maps: frontend labels → backend enum values ──
const CATEGORY_MAP: Record<string, string> = {
  'All': '', 'Technology': 'IT', 'Healthcare': 'HEALTHCARE', 'Education': 'TEACHING',
  'Agriculture': 'AGRICULTURE', 'Garments': 'GARMENTS', 'Construction': 'BUSINESS',
  'Banking': 'BUSINESS', 'Restaurant': 'BUSINESS', 'Retail': 'BUSINESS', 'NGO': 'BUSINESS',
};

const TYPE_MAP: Record<string, string> = {
  'All': '', 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', 'Contract': 'CONTRACT',
  'Internship': 'INTERNSHIP', 'Freelance': 'FREELANCE', 'Remote': 'REMOTE',
};

const REVERSE_CATEGORY: Record<string, string> = {
  'IT': 'Technology', 'HEALTHCARE': 'Healthcare', 'TEACHING': 'Education',
  'AGRICULTURE': 'Agriculture', 'GARMENTS': 'Garments', 'BUSINESS': 'Business',
};

const REVERSE_TYPE: Record<string, string> = {
  'FULL_TIME': 'Full-time', 'PART_TIME': 'Part-time', 'CONTRACT': 'Contract',
  'INTERNSHIP': 'Internship', 'FREELANCE': 'Freelance', 'REMOTE': 'Remote',
};

const INDUSTRIES = ['All', 'Technology', 'Healthcare', 'Education', 'Agriculture', 'Garments', 'Business'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote'];

// ── Delete Confirmation Modal ──
function DeleteModal({ open, onClose, onConfirm, isDeleting }: {
  open: boolean; onClose: () => void; onConfirm: () => void; isDeleting?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F0A1E] font-bangla">চাকরি মুছে ফেলবেন?</h3>
                <p className="text-xs text-[#6B5E8A] font-bangla">এই সার্কুলারটি স্থায়ীভাবে মুছে ফেলা হবে।</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={onClose} className="flex-1 py-2.5 bg-[#F5F2FF] text-[#5B21B6] rounded-xl text-sm font-bold font-bangla">বাতিল</button>
              <button onClick={onConfirm} disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-40 font-bangla">
                {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'মুছে ফেলুন'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Translation ──
const DICT = {
  bn: {
    title: 'কর্মসংস্থান পোর্টাল', subtitle: 'চাকরি খুঁজুন', all: 'সব',
    searchPlaceholder: 'পদবী বা কোম্পানি দিয়ে খুঁজুন...',
    seekerTab: '🔍 চাকরি খুঁজছি', employerTab: '📋 আমার পোস্ট',
    salaryUnit: '/মাস', applicants: 'জন আবেদন', applyNow: 'আবেদন করুন',
    applied: 'আবেদন হয়েছে!', noJobs: 'কোনো চাকরি পাওয়া যায়নি',
    postJobBtn: '+ চাকরি পোস্ট করুন', formTitle: 'নতুন চাকরির সার্কুলার',
    editTitle: 'চাকরি সম্পাদনা', jobTitle: 'পদবী (English) *',
    jobTitleBn: 'পদবী (বাংলা)', company: 'কোম্পানি *', location: 'অবস্থান / জেলা',
    salaryMin: 'সর্বনিম্ন বেতন', salaryMax: 'সর্বোচ্চ বেতন', deadline: 'আবেদনের শেষ তারিখ',
    industry: 'শিল্প খাত', jobType: 'কাজের ধরণ', experience: 'অভিজ্ঞতা',
    description: 'বিবরণ *', requirements: 'যোগ্যতা ও দায়িত্ব', contactInfo: 'যোগাযোগের তথ্য',
    submit: 'সাবমিট করুন', save: 'সেভ করুন', cancel: 'বাতিল', delete: 'মুছে ফেলুন',
    verified: 'যাচাইকৃত', details: 'বিস্তারিত', postedOn: 'পোস্টের তারিখ',
    foundJobs: 'টি চাকরি পাওয়া গেছে', myPostsEmpty: 'আপনি এখনো কোনো চাকরি পোস্ট করেননি',
    noJobsDesc: 'নতুন চাকরি পোস্ট করতে নিচের বাটনে চাপুন।',
    postFirstBtn: 'প্রথম চাকরি পোস্ট করুন',
  },
  en: {
    title: 'Job Portal', subtitle: 'Find Jobs', all: 'All',
    searchPlaceholder: 'Search jobs, companies...',
    seekerTab: '🔍 Find Jobs', employerTab: '📋 My Posts',
    salaryUnit: '/month', applicants: 'applicants', applyNow: 'Apply Now',
    applied: 'Applied!', noJobs: 'No jobs found',
    postJobBtn: '+ Post a Job', formTitle: 'New Job Circular',
    editTitle: 'Edit Job', jobTitle: 'Job Title (English) *',
    jobTitleBn: 'Job Title (Bangla)', company: 'Company *', location: 'Location / District',
    salaryMin: 'Min Salary', salaryMax: 'Max Salary', deadline: 'Application Deadline',
    industry: 'Industry', jobType: 'Job Type', experience: 'Experience Required',
    description: 'Description *', requirements: 'Requirements', contactInfo: 'Contact Info',
    submit: 'Submit', save: 'Save', cancel: 'Cancel', delete: 'Delete',
    verified: 'Verified', details: 'Details', postedOn: 'Posted on',
    foundJobs: 'jobs found', myPostsEmpty: 'You have not posted any jobs yet',
    noJobsDesc: 'Post your first job by tapping the button below.',
    postFirstBtn: 'Post First Job',
  },
};

export default function JobsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [mode, setMode] = useState<'seeker' | 'employer'>('seeker');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [appliedList, setAppliedList] = useState<string[]>([]);

  // CV Upload state
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState('');
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [cvError, setCvError] = useState('');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDistrictId, setFormDistrictId] = useState('');
  const [formSalaryMin, setFormSalaryMin] = useState('');
  const [formSalaryMax, setFormSalaryMax] = useState('');
  const [formIndustry, setFormIndustry] = useState('Technology');
  const [formType, setFormType] = useState('Full-time');
  const [formExp, setFormExp] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formReqs, setFormReqs] = useState('');
  const [formContact, setFormContact] = useState('');

  const t = (k: keyof typeof DICT['bn']) => DICT[lang][k];
  const fmt = (n: number) => lang === 'bn' ? n.toLocaleString('bn-BD') : n.toLocaleString('en-US');

  // ── Data fetching ──
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', selectedIndustry, selectedType],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        const cat = CATEGORY_MAP[selectedIndustry];
        const typ = TYPE_MAP[selectedType];
        if (cat) params.set('category', cat);
        if (typ) params.set('type', typ);
        const res = await api.get(`jobs?${params}`, { silent: true });
        return (res as unknown as { data: { data: unknown[] } })?.data?.data || [];
      } catch { return []; }
    },
  });

  const { data: myJobsData, isLoading: myJobsLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      try {
        const res = await api.get('jobs/my-posts', { silent: true });
        return (res as unknown as { data: { data: unknown[] } })?.data?.data || [];
      } catch { return []; }
    },
    enabled: mode === 'employer',
  });

  const jobs = jobsData || [];
  const myJobs = myJobsData || [];

  // Client-side search filter
  const filteredJobs = jobs.filter((j: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q));
  });

  // ── Mutations ──
  const createJob = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formTitle,
        titleBn: formTitleBn || undefined,
        company: formCompany,
        location: formLocation || undefined,
        districtId: formDistrictId ? Number(formDistrictId) : undefined,
        salaryMin: formSalaryMin ? Number(formSalaryMin) : undefined,
        salaryMax: formSalaryMax ? Number(formSalaryMax) : undefined,
        description: formDesc,
        requirements: formReqs || undefined,
        type: TYPE_MAP[formType] || 'FULL_TIME',
        category: CATEGORY_MAP[formIndustry] || 'BUSINESS',
        contactInfo: formContact || undefined,
        applicationDeadline: formDeadline || undefined,
      };
      await api.post('jobs', payload);
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });

  const updateJob = useMutation({
    mutationFn: async () => {
      const payload: any = {
        title: formTitle,
        titleBn: formTitleBn || undefined,
        company: formCompany,
        location: formLocation || undefined,
        districtId: formDistrictId ? Number(formDistrictId) : undefined,
        salaryMin: formSalaryMin ? Number(formSalaryMin) : undefined,
        salaryMax: formSalaryMax ? Number(formSalaryMax) : undefined,
        description: formDesc,
        requirements: formReqs || undefined,
        type: TYPE_MAP[formType] || 'FULL_TIME',
        category: CATEGORY_MAP[formIndustry] || 'BUSINESS',
        contactInfo: formContact || undefined,
        applicationDeadline: formDeadline || undefined,
      };
      await api.patch(`jobs/${editingJob.id}`, payload);
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`jobs/${id}`);
    },
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });

  // ── Helpers ──
  const resetForm = () => {
    setShowForm(false);
    setEditingJob(null);
    setFormTitle(''); setFormTitleBn(''); setFormCompany(''); setFormLocation('');
    setFormDistrictId(''); setFormSalaryMin(''); setFormSalaryMax('');
    setFormIndustry('Technology'); setFormType('Full-time'); setFormExp('');
    setFormDeadline(''); setFormDesc(''); setFormReqs(''); setFormContact('');
  };

  const startEdit = (job: any) => {
    setEditingJob(job);
    setFormTitle(job.title || '');
    setFormTitleBn(job.titleBn || '');
    setFormCompany(job.company || '');
    setFormLocation(job.location || '');
    setFormDistrictId(job.districtId ? String(job.districtId) : '');
    setFormSalaryMin(job.salaryMin ? String(job.salaryMin) : '');
    setFormSalaryMax(job.salaryMax ? String(job.salaryMax) : '');
    setFormIndustry(REVERSE_CATEGORY[job.category] || 'Business');
    setFormType(REVERSE_TYPE[job.type] || 'Full-time');
    setFormExp(job.experience || '');
    setFormDeadline(job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '');
    setFormDesc(job.description || '');
    setFormReqs(job.requirements || '');
    setFormContact(job.contactInfo || '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApply = (id: string) => {
    if (!cvUrl) {
      setCvError(lang === 'bn' ? 'আবেদনের জন্য সিভি আপলোড করুন' : 'Please upload your CV to apply');
      return;
    }
    setCvError('');
    if (!appliedList.includes(id)) {
      setAppliedList((prev) => [...prev, id]);
      // Send application with CV to backend
      api.post(`jobs/${id}/apply`, { cvUrl, cvFileName }).catch(() => {});
    }
  };

  const handleCvSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setCvError(lang === 'bn' ? 'শুধুমাত্র PDF বা Word ফাইল আপলোড করা যাবে' : 'Only PDF or Word files allowed');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCvError(lang === 'bn' ? 'ফাইলের সাইজ সর্বোচ্চ ৫ MB হতে হবে' : 'File size must be under 5MB');
      return;
    }

    setCvError('');
    setCvFile(file);
    setCvFileName(file.name);
    setCvUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = api.getToken?.() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url = data?.data?.url || data?.url;
      if (!url) throw new Error('No URL in response');
      setCvUrl(url);
    } catch {
      setCvError(lang === 'bn' ? 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Upload failed. Please try again.');
      setCvFile(null);
      setCvFileName('');
    } finally {
      setCvUploading(false);
    }
  };

  const clearCv = () => {
    setCvFile(null);
    setCvFileName('');
    setCvUrl('');
    setCvError('');
    if (cvInputRef.current) cvInputRef.current.value = '';
  };

  const canSubmit = formTitle.trim().length >= 2 && formCompany.trim().length >= 1 && formDesc.trim().length >= 5;

  // ── Loading skeleton ──
  const JobSkeleton = () => (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-[#DDD6F3]">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F5F2FF] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#F5F2FF] rounded w-2/3" />
              <div className="h-3 bg-[#F5F2FF] rounded w-1/3" />
              <div className="h-3 bg-[#F5F2FF] rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F8F7FF' }}>
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bondhu-gradient flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base text-[#0F0A1E] font-bangla leading-tight">{t('title')}</h1>
                <p className="text-[10px] text-[#9B8FC0] -mt-0.5">{t('subtitle')}</p>
              </div>
            </div>
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5F2FF] text-[#5B21B6] border border-[#DDD6F3]">
              <Languages className="w-3.5 h-3.5" /><span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex gap-1 p-1 bg-[#F5F2FF] rounded-xl">
            {(['seeker', 'employer'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setShowForm(false); setEditingJob(null); }}
                className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all',
                  mode === m ? 'bg-white text-[#5B21B6] shadow-sm' : 'text-[#6B5E8A] hover:bg-white/50')}>
                {m === 'seeker' ? <Search className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                <span className="font-bangla">{t(m === 'seeker' ? 'seekerTab' : 'employerTab')}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-3">
            <div className="flex items-center gap-2 bg-[#F5F3FF] rounded-xl px-3 py-2.5 border border-[#DDD6F3]">
              <Search className="w-4 h-4 text-[#9B8FC0] shrink-0" />
              <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#0F0A1E] placeholder:text-[#B8A9D9] outline-none w-full font-bangla" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-0.5 rounded-full hover:bg-[#DDD6F3]">
                  <X className="w-3.5 h-3.5 text-[#9B8FC0]" />
                </button>
              )}
            </div>
          </div>

          {/* Industry filters */}
          {mode === 'seeker' && (
            <>
              <div className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
                {INDUSTRIES.map((ind) => (
                  <button key={ind} onClick={() => setSelectedIndustry(ind)}
                    className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border',
                      selectedIndustry === ind ? 'bondhu-gradient border-transparent text-white shadow-sm' : 'bg-white border-[#DDD6F3] text-[#3D2B6B]')}>
                    {ind === 'All' ? t('all') : ind}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5">
                {JOB_TYPES.map((type) => (
                  <button key={type} onClick={() => setSelectedType(type)}
                    className={cn('px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all',
                      selectedType === type ? 'bg-[#0F0A1E] text-white' : 'bg-[#F5F2FF] text-[#6B5E8A] border border-[#DDD6F3]')}>
                    {type === 'All' ? t('all') : type}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <main className="px-4 pt-4 space-y-3">
        {/* ── SEEKER MODE ── */}
        {mode === 'seeker' && (
          <>
            {jobsLoading ? <JobSkeleton /> : (
              <>
                <p className="text-xs text-[#6B5E8A] font-medium px-1">
                  {filteredJobs.length} {t('foundJobs')}
                </p>
                {filteredJobs.map((job: any, i: number) => {
                  const hasApplied = appliedList.includes(job.id);
                  return (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedJob(job)}
                      className="bg-white rounded-2xl p-4 border border-[#DDD6F3] hover:border-[#B8A9E3] hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#F5F2FF] to-[#EDE9FF] flex items-center justify-center text-[#5B21B6] font-bold text-sm border border-[#DDD6F3] shrink-0">
                          {job.company?.[0] || 'J'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla truncate">{job.title}</h3>
                            {job.poster?.profile?.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#3D2B6B] font-semibold font-bangla">{job.company}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#5B21B6] font-bold">{REVERSE_TYPE[job.type] || job.type}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#6B5E8A] font-medium">{REVERSE_CATEGORY[job.category] || job.category}</span>
                          </div>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-sm font-extrabondhu text-[#0F0A1E] font-bangla" style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                              &#2547;{fmt(job.salaryMin || 0)} &mdash; &#2547;{fmt(job.salaryMax || 0)}
                            </span>
                            <span className="text-[10px] text-[#6B5E8A]">{t('salaryUnit')}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 pt-2 border-t border-[#F5F2FF]">
                            <span className="flex items-center gap-1 text-[10px] text-[#6B5E8A] font-medium">
                              <MapPin className="w-3 h-3" />{job.location || job.district?.nameBn || ''}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-[#0D9488] font-medium">
                              <Clock className="w-3 h-3" />{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US') : ''}
                            </span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                          disabled={hasApplied}
                          className={cn('shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all mt-1',
                            hasApplied ? 'bg-[#F5F2FF] text-[#9B8FC0]' : 'bondhu-gradient text-white shadow-sm')}>
                          {hasApplied ? t('applied') : t('applyNow')}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
                {filteredJobs.length === 0 && (
                  <div className="text-center py-16">
                    <Briefcase className="w-12 h-12 text-[#C4B5FD] mx-auto mb-3" />
                    <p className="text-sm text-[#6B5E8A] font-bangla font-medium">{t('noJobs')}</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── EMPLOYER MODE ── */}
        {mode === 'employer' && (
          <>
            {!showForm && (
              <button onClick={() => setShowForm(true)}
                className="w-full py-3 border-2 border-dashed border-[#DDD6F3] rounded-2xl text-sm text-[#5B21B6] font-bold hover:bg-[#F5F2FF] transition-colors font-bangla">
                {t('postJobBtn')}
              </button>
            )}

            {/* Post/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="glass-card p-4 space-y-3">
                  <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">
                    {editingJob ? t('editTitle') : t('formTitle')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('jobTitle')}</label>
                      <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Software Engineer"
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('jobTitleBn')}</label>
                      <input value={formTitleBn} onChange={(e) => setFormTitleBn(e.target.value)} placeholder="সফটওয়্যার ইঞ্জিনিয়ার"
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-bangla" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('company')}</label>
                      <input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="ABC Technologies"
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('location')}</label>
                      <select value={formDistrictId} onChange={(e) => { setFormDistrictId(e.target.value); setFormLocation(districts.find(d => String(d.id) === e.target.value)?.nameBn || ''); }}
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none font-bangla text-[#0F0A1E]">
                        <option value="">জেলা নির্বাচন করুন</option>
                        {districts.map((d) => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#9B8FC0] absolute right-3 top-[34px] pointer-events-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('industry')}</label>
                      <select value={formIndustry} onChange={(e) => setFormIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none text-[#0F0A1E]">
                        {INDUSTRIES.filter(i => i !== 'All').map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('jobType')}</label>
                      <select value={formType} onChange={(e) => setFormType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] appearance-none text-[#0F0A1E]">
                        {JOB_TYPES.filter(t => t !== 'All').map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('salaryMin')} (&#2547;)</label>
                      <input type="number" value={formSalaryMin} onChange={(e) => setFormSalaryMin(e.target.value)} placeholder="15000"
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('salaryMax')} (&#2547;)</label>
                      <input type="number" value={formSalaryMax} onChange={(e) => setFormSalaryMax(e.target.value)} placeholder="45000"
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('experience')}</label>
                      <input value={formExp} onChange={(e) => setFormExp(e.target.value)} placeholder="1-2 years"
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('deadline')}</label>
                      <input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('contactInfo')}</label>
                    <input value={formContact} onChange={(e) => setFormContact(e.target.value)} placeholder="Phone / Email"
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('description')}</label>
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} placeholder="Job description..."
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] resize-none font-bangla" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#3D2B6B] font-bangla">{t('requirements')}</label>
                    <textarea value={formReqs} onChange={(e) => setFormReqs(e.target.value)} rows={2} placeholder="Requirements..."
                      className="w-full px-3 py-2.5 bg-white border border-[#DDD6F3] rounded-xl text-sm outline-none focus:border-[#5B21B6] resize-none" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={resetForm} className="flex-1 py-2.5 bg-[#F5F2FF] text-[#5B21B6] rounded-xl text-sm font-bold font-bangla">{t('cancel')}</button>
                    <button onClick={() => editingJob ? updateJob.mutate() : createJob.mutate()} disabled={!canSubmit || createJob.isPending || updateJob.isPending}
                      className="flex-1 py-2.5 bg-[#5B21B6] text-white rounded-xl text-sm font-bold disabled:opacity-40 font-bangla shadow-sm">
                      {createJob.isPending || updateJob.isPending ? 'প্রসেসিং...' : editingJob ? t('save') : t('submit')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* My posted jobs list */}
            {myJobsLoading ? <JobSkeleton /> : (
              <>
                {myJobs.length > 0 ? myJobs.map((job: any, i: number) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl p-4 border border-[#DDD6F3]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla truncate">{job.title}</h3>
                        <p className="text-[11px] text-[#3D2B6B] font-semibold">{job.company}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#5B21B6] font-bold">{REVERSE_TYPE[job.type]}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2FF] text-[#6B5E8A]">{REVERSE_CATEGORY[job.category]}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] font-bold">{job.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                        </div>
                        <p className="text-[10px] text-[#9B8FC0] mt-1 font-bangla">{t('postedOn')}: {new Date(job.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0 ml-2">
                        <button onClick={() => startEdit(job)} className="p-1.5 hover:bg-[#F5F2FF] rounded-lg">
                          <Edit3 className="w-3.5 h-3.5 text-[#6B5E8A]" />
                        </button>
                        <button onClick={() => setDeleteId(job.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  !showForm && (
                    <div className="text-center py-16">
                      <Briefcase className="w-12 h-12 text-[#C4B5FD] mx-auto mb-3" />
                      <p className="text-sm text-[#6B5E8A] font-bangla font-medium">{t('myPostsEmpty')}</p>
                      <p className="text-xs text-[#9B8FC0] font-bangla mt-1">{t('noJobsDesc')}</p>
                      <button onClick={() => setShowForm(true)}
                        className="mt-4 px-5 py-2.5 bondhu-gradient text-white text-xs font-bold rounded-2xl shadow-md font-bangla">
                        {t('postFirstBtn')}
                      </button>
                    </div>
                  )
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* ── Job Detail Drawer ── */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)} className="fixed inset-0 bg-[#0F0A1E] z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[#DDD6F3]">
              <div className="p-4 border-b border-[#DDD6F3] flex items-center justify-between bg-[#F5F2FF]">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#5B21B6] font-bangla">{t('details')}</span>
                <button onClick={() => setSelectedJob(null)} className="w-8 h-8 rounded-full bg-white border border-[#DDD6F3] flex items-center justify-center text-[#6B5E8A]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                <div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-[#F5F2FF] text-[#5B21B6]">{REVERSE_CATEGORY[selectedJob.category] || selectedJob.category}</span>
                    <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-[#F5F2FF] text-[#6B5E8A]">{REVERSE_TYPE[selectedJob.type] || selectedJob.type}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0F0A1E] mt-2 font-bangla leading-tight">{selectedJob.title}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-[#9B8FC0]" />
                    <span className="text-xs text-[#3D2B6B] font-bold font-bangla">{selectedJob.company}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 glass-card p-3">
                  <div>
                    <span className="text-[10px] text-[#9B8FC0] font-bold uppercase">{lang === 'bn' ? 'বেতন' : 'Salary'}</span>
                    <p className="text-xs font-bold text-[#0F0A1E] font-bangla">&#2547;{fmt(selectedJob.salaryMin || 0)} &mdash; &#2547;{fmt(selectedJob.salaryMax || 0)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9B8FC0] font-bold uppercase">{lang === 'bn' ? 'অবস্থান' : 'Location'}</span>
                    <p className="text-xs font-bold text-[#0F0A1E]">{selectedJob.location || selectedJob.district?.nameBn || ''}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9B8FC0] font-bold uppercase">{lang === 'bn' ? 'অভিজ্ঞতা' : 'Experience'}</span>
                    <p className="text-xs font-bold text-[#0F0A1E]">{selectedJob.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9B8FC0] font-bold uppercase">{lang === 'bn' ? 'ডেডলাইন' : 'Deadline'}</span>
                    <p className="text-xs font-bold text-[#0D9488]">{selectedJob.applicationDeadline ? new Date(selectedJob.applicationDeadline).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US') : ''}</p>
                  </div>
                </div>
                {selectedJob.contactInfo && (
                  <div className="glass-card p-3">
                    <span className="text-[10px] text-[#9B8FC0] font-bold uppercase">{t('contactInfo')}</span>
                    <p className="text-xs font-bold text-[#0F0A1E] font-mono">{selectedJob.contactInfo}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#9B8FC0]">{lang === 'bn' ? 'বিবরণ' : 'Description'}</h4>
                  <p className="text-xs text-[#3D2B6B] leading-relaxed font-bangla">{selectedJob.description}</p>
                </div>
                {selectedJob.requirements && (
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-[#9B8FC0]">{t('requirements')}</h4>
                    <p className="text-xs text-[#3D2B6B] leading-relaxed font-bangla">{selectedJob.requirements}</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[#DDD6F3] bg-[#F5F2FF] space-y-3">
                {/* CV Upload Section */}
                {!appliedList.includes(selectedJob.id) && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#3D2B6B] font-bangla flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {lang === 'bn' ? 'সিভি / রেজুমে' : 'CV / Resume'}
                      <span className="text-red-500">*</span>
                    </label>

                    {/* CV Upload Area */}
                    <div
                      onClick={() => cvInputRef.current?.click()}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all',
                        cvFile || cvUrl
                          ? 'border-[#7C3AED] bg-[#F5F2FF]'
                          : 'border-[#DDD6F3] bg-white hover:border-[#7C3AED] hover:bg-[#F5F2FF]'
                      )}
                    >
                      {cvUploading ? (
                        <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className={cn('w-5 h-5', cvFile || cvUrl ? 'text-[#7C3AED]' : 'text-[#9B8FC0]')} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0F0A1E] font-bangla truncate">
                          {cvFileName || (lang === 'bn' ? 'সিভি আপলোড করুন' : 'Upload CV')}
                        </p>
                        <p className="text-[10px] text-[#9B8FC0]">
                          {cvFile || cvUrl
                            ? (lang === 'bn' ? 'পরিবর্তন করতে ক্লিক করুন' : 'Click to change')
                            : 'PDF or Word · Max 5MB'}
                        </p>
                      </div>
                      {(cvFile || cvUrl) && !cvUploading && (
                        <button
                          onClick={(e) => { e.stopPropagation(); clearCv(); }}
                          className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleCvSelect}
                    />

                    {/* Error message */}
                    {cvError && (
                      <p className="text-[11px] text-red-500 font-bangla">{cvError}</p>
                    )}

                    {/* Tip */}
                    {!cvError && (
                      <p className="text-[10px] text-[#9B8FC0] font-bangla">
                        💡 {lang === 'bn' ? 'আপনার সিভি একবার আপলোড করলে পরের আবেদনে স্বয়ংক্রিয়ভাবে ব্যবহার হবে।' : 'Upload once — your CV will be saved for future applications.'}
                      </p>
                    )}
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={appliedList.includes(selectedJob.id) || cvUploading || (!cvUrl && !appliedList.includes(selectedJob.id))}
                  className={cn(
                    'w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                    appliedList.includes(selectedJob.id)
                      ? 'bg-[#DDD6F3] text-[#9B8FC0]'
                      : cvUrl && !cvUploading
                        ? 'bondhu-gradient text-white shadow-lg'
                        : 'bg-[#DDD6F3] text-[#9B8FC0] opacity-60'
                  )}
                >
                  <span>{appliedList.includes(selectedJob.id) ? t('applied') : t('applyNow')}</span>
                  {!appliedList.includes(selectedJob.id) && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Modal ── */}
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteJob.mutate(deleteId)} isDeleting={deleteJob.isPending} />
    </div>
  );
}
