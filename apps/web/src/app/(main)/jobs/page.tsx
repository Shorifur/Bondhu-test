'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, MapPin, Plus, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const categories = ['GARMENTS', 'IT', 'TEACHING', 'HEALTHCARE', 'AGRICULTURE', 'BUSINESS'];

export default function JobsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [districtId, setDistrictId] = useState('');

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [category, setCategory] = useState('IT');
  const [contactInfo, setContactInfo] = useState('');

  const { data } = useQuery<{ data: any[] }>({
    queryKey: ['jobs', filterCategory, districtId],
    queryFn: async () => {
      const res = await api.get(`jobs?category=${filterCategory}&districtId=${districtId}&page=1&limit=50`);
      return (res as any).data || { data: [] };
    },
  });

  const createJob = useMutation({
    mutationFn: async () => {
      await api.post('jobs', {
        title,
        company,
        description,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        category,
        contactInfo,
        districtId: districtId ? Number(districtId) : undefined,
      });
    },
    onSuccess: () => {
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">চাকরি খুঁজুন</h1>
            <p className="text-xs text-muted-foreground">Job Board</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="p-2 bg-bondhu-green text-white rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-muted rounded-xl text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input value={districtId} onChange={(e) => setDistrictId(e.target.value)} placeholder="District ID" className="px-3 py-2 bg-muted rounded-xl text-sm w-28" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border rounded-2xl p-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title" className="w-full px-3 py-2 bg-muted rounded-xl text-sm" />
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="w-full px-3 py-2 bg-muted rounded-xl text-sm" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className="w-full px-3 py-2 bg-muted rounded-xl text-sm resize-none" />
          <div className="flex gap-2">
            <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="Min Salary" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
            <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="Max Salary" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-muted rounded-xl text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Contact Info" className="w-full px-3 py-2 bg-muted rounded-xl text-sm" />
          <button onClick={() => createJob.mutate()} disabled={!title || !description} className="w-full py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium">Post Job</button>
        </motion.div>
      )}

      <div className="space-y-3">
        {data?.data?.map((job: any) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-2xl p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <Briefcase className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm line-clamp-2">{job.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.district?.nameEn || 'Anywhere'}</span>
              {job.salaryMin && <span>৳{Number(job.salaryMin).toLocaleString()} - ৳{Number(job.salaryMax).toLocaleString()}</span>}
            </div>
            <button onClick={() => router.push(`/chat?user=${job.posterId}`)} className="text-xs text-bondhu-green font-medium">Apply via Message</button>
          </motion.div>
        ))}
        {(!data?.data || data.data.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No jobs posted yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
