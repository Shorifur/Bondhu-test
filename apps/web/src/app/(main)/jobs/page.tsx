'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { JobsIcon, SearchIcon, MapPinIcon, ClockIcon } from '@/components/ui/CulturalIcons';

const industries = ['All', 'Technology', 'Healthcare', 'Education', 'Agriculture', 'Garments', 'Construction', 'Banking', 'Restaurant', 'Retail', 'NGO'];
const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

const MOCK_JOBS = [
  { id: '1', title: 'সফটওয়্যার ইঞ্জিনিয়ার', titleEn: 'Software Engineer', company: 'TechBD Solutions', verified: true, location: 'Dhaka', type: 'Full-time', salaryMin: 45000, salaryMax: 75000, deadline: '2026-06-15', applicants: 47, industry: 'Technology', experience: '2-3 years' },
  { id: '2', title: 'নার্স', titleEn: 'Staff Nurse', company: 'Square Hospital', verified: true, location: 'Dhaka', type: 'Full-time', salaryMin: 25000, salaryMax: 40000, deadline: '2026-06-10', applicants: 23, industry: 'Healthcare', experience: '1-2 years' },
  { id: '3', title: 'শিক্ষক (গণিত)', titleEn: 'Math Teacher', company: 'Sunrise School', verified: false, location: 'Chattogram', type: 'Full-time', salaryMin: 18000, salaryMax: 30000, deadline: '2026-06-20', applicants: 12, industry: 'Education', experience: 'Fresh' },
  { id: '4', title: 'গার্মেন্টস সুপারভাইজার', titleEn: 'Garments Supervisor', company: 'Beximco Apparels', verified: true, location: 'Gazipur', type: 'Full-time', salaryMin: 35000, salaryMax: 50000, deadline: '2026-06-08', applicants: 89, industry: 'Garments', experience: '3-5 years' },
  { id: '5', title: 'ডিজিটাল মার্কেটার', titleEn: 'Digital Marketer', company: 'BrandStory BD', verified: false, location: 'Dhaka', type: 'Remote', salaryMin: 20000, salaryMax: 40000, deadline: '2026-06-25', applicants: 34, industry: 'Technology', experience: '1-2 years' },
];

export default function JobsPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'seeker' | 'employer' | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_JOBS.filter((j) => {
    const matchIndustry = selectedIndustry === 'All' || j.industry === selectedIndustry;
    const matchType = selectedType === 'All' || j.type === selectedType;
    const matchSearch = !searchQuery || j.title.includes(searchQuery) || j.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchIndustry && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <JobsIcon size={24} className="text-[#2563EB]" />
          <div>
            <h1 className="font-bold text-[15px] text-[#2D1B69] font-bangla leading-tight">চাকরি খুঁজুন</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Find Jobs</p>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="px-4 pb-2 flex gap-2">
          <button
            onClick={() => setMode('seeker')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${mode === 'seeker' ? 'text-white' : 'bg-blue-50 text-blue-600'}`}
            style={mode === 'seeker' ? { background: 'linear-gradient(135deg, #2563EB, #60A5FA)' } : {}}
          >
            🔍 চাকরি খুঁজছি
          </button>
          <button
            onClick={() => setMode('employer')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${mode === 'employer' ? 'text-white' : 'bg-green-50 text-green-600'}`}
            style={mode === 'employer' ? { background: 'linear-gradient(135deg, #059669, #34D399)' } : {}}
          >
            📋 নিয়োগ দিচ্ছি
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-[#F5F3FF] rounded-xl px-3 py-2">
            <SearchIcon size={16} className="text-[#9B8FC0] shrink-0" />
            <input type="text" placeholder="চাকরি খুঁজুন..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#1a1a2e] placeholder:text-[#B8A9D9] outline-none w-full font-bangla" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {industries.slice(0, 5).map((ind) => (
            <button key={ind} onClick={() => setSelectedIndustry(ind)}
              className={selectedIndustry === ind ? 'gradient-chip-active whitespace-nowrap' : 'gradient-chip-inactive whitespace-nowrap'}>{ind}</button>
          ))}
        </div>
      </header>

      {/* Employer CTA */}
      {mode === 'employer' && (
        <div className="mx-4 mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
          <p className="text-sm font-medium text-green-800 font-bangla">চাকরি পোস্ট করতে প্রথমে একটি কোম্পানি পেজ তৈরি করুন</p>
          <p className="text-xs text-green-600 mt-0.5">Create a company page to post jobs</p>
          <button
            onClick={() => router.push('/jobs/create-company')}
            className="mt-2 px-4 py-2 rounded-xl text-white text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}
          >
            + কোম্পানি পেজ তৈরি করুন
          </button>
        </div>
      )}

      {/* Job Cards */}
      <div className="space-y-2.5 px-3 pt-3">
        {filtered.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
            style={{ boxShadow: '0 2px 12px rgba(167,139,250,0.06)' }}
          >
            <div className="flex items-start gap-3">
              {/* Company Logo Placeholder */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F0EEF8] to-[#E8E4F5] flex items-center justify-center shrink-0 text-[#7C3AED] font-bold text-sm">
                {job.company[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-[#1a1a2e] font-bangla leading-tight">{job.title}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] text-[#7C3AED] font-medium">{job.company}</span>
                  {job.verified && <span className="text-blue-500 text-[10px]">✓</span>}
                </div>

                {/* Salary */}
                <div className="mt-1.5">
                  <span className="text-base font-bold" style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ৳{job.salaryMin.toLocaleString('bn-BD')} — ৳{job.salaryMax.toLocaleString('bn-BD')}
                  </span>
                  <span className="text-[10px] text-[#9B8FC0] ml-1">/month</span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="flex items-center gap-0.5 text-[10px] text-[#9B8FC0]"><MapPinIcon size={10} />{job.location}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED]">{job.type}</span>
                  <span className="text-[10px] text-[#9B8FC0]">{job.experience}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-600"><ClockIcon size={10} />{job.deadline}</span>
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[10px] text-[#9B8FC0]">{job.applicants} applicants</span>
                  <button
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="px-4 py-1.5 rounded-full text-white text-[11px] font-semibold"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <JobsIcon size={40} className="text-[#E8E4F5] mx-auto mb-2" />
          <p className="text-sm text-[#9B8FC0] font-bangla">কোনো চাকরি পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}
