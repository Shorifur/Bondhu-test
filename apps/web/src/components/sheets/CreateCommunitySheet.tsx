'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Users, Upload, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { districts } from '@/lib/districts';

const CATEGORIES = [
  'Education',
  'Business',
  'Sports',
  'Entertainment',
  'Technology',
  'Religion',
  'Health',
  'Food',
  'Travel',
  'Gaming',
  'Art',
  'Music',
  'Other',
];

export function CreateCommunitySheet() {
  const router = useRouter();
  const { sheets, closeSheet, addToast } = useUIStore();
  const sheet = sheets['createCommunity'];
  const isOpen = sheet?.isOpen;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [joinType, setJoinType] = useState<'OPEN' | 'APPROVAL_REQUIRED'>('OPEN');
  const [districtId, setDistrictId] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = api.getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    const payload = data?.data ?? data;
    return payload?.id || payload?.url;
  };

  const handleSubmit = async () => {
    if (!name.trim() || !category) return;
    setLoading(true);
    try {
      let coverUrl: string | undefined;
      let avatarUrl: string | undefined;

      const coverFile = coverInputRef.current?.files?.[0];
      const avatarFile = avatarInputRef.current?.files?.[0];

      if (coverFile) {
        const id = await uploadFile(coverFile);
        if (id) coverUrl = id;
      }
      if (avatarFile) {
        const id = await uploadFile(avatarFile);
        if (id) avatarUrl = id;
      }

      const res = await api.post<{ id: string; slug: string }>('communities', {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        visibility,
        joinType,
        districtId: districtId ? Number(districtId) : undefined,
        coverUrl,
        avatarUrl,
      });
      const data = (res.data as any)?.data ?? res.data;
      addToast('Community created successfully', 'success');
      setName('');
      setDescription('');
      setCategory('');
      setVisibility('PUBLIC');
      setJoinType('OPEN');
      setDistrictId('');
      setCoverPreview(null);
      setAvatarPreview(null);
      closeSheet('createCommunity');
      if (data?.slug) {
        router.push(`/communities/${data.slug}`);
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to create community', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeSheet('createCommunity')}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-w-2xl mx-auto h-[85vh] flex flex-col"
          >
            <div className="p-4 border-b">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Create Community
                </h3>
                <button onClick={() => closeSheet('createCommunity')} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Cover Photo */}
              <div>
                <label className="text-sm font-medium mb-1 block">Cover Photo</label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCoverPreview(URL.createObjectURL(file));
                  }}
                />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className={cn(
                    'w-full h-24 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-colors',
                    coverPreview ? 'border-transparent' : 'border-muted hover:border-bondhu-green/50'
                  )}
                  style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!coverPreview && (
                    <>
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Cover</span>
                    </>
                  )}
                </button>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="text-sm font-medium mb-1 block">Profile Picture</label>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className={cn(
                    'w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center transition-colors',
                    avatarPreview ? 'border-transparent' : 'border-muted hover:border-bondhu-green/50'
                  )}
                  style={avatarPreview ? { backgroundImage: `url(${avatarPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {!avatarPreview && <Upload className="w-5 h-5 text-muted-foreground" />}
                </button>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Community name"
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this community about?"
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2.5 bg-background border rounded-xl text-sm resize-none focus:outline-none focus:border-bondhu-green"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                        category === cat
                          ? 'border-bondhu-green bg-bondhu-green/5 text-bondhu-green'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">District</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                >
                  <option value="">Select District (optional)</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.nameBn} ({d.nameEn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Visibility</label>
                <div className="flex gap-2">
                  {(['PUBLIC', 'PRIVATE'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-medium border transition-colors',
                        visibility === v
                          ? 'border-bondhu-green bg-bondhu-green/5 text-bondhu-green'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Join Type</label>
                <div className="flex gap-2">
                  {(['OPEN', 'APPROVAL_REQUIRED'] as const).map((j) => (
                    <button
                      key={j}
                      onClick={() => setJoinType(j)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-medium border transition-colors',
                        joinType === j
                          ? 'border-bondhu-green bg-bondhu-green/5 text-bondhu-green'
                          : 'border-border hover:bg-muted/50',
                      )}
                    >
                      {j.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !category || loading}
                className={cn(
                  'w-full py-3 rounded-xl font-medium text-sm transition-colors',
                  name.trim() && category && !loading
                    ? 'bg-bondhu-green text-white'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Community'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
