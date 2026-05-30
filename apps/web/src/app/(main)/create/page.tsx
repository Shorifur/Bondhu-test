'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Camera, Film, Radio, BarChart3, HeartHandshake, ArrowLeft, ImageIcon, Send, X, Bold, Italic, AtSign, Hash, Type, Palette, Sticker, Pen, Music, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const createOptions = [
  { id: 'post', label: 'Standard Post', labelBn: 'স্ট্যান্ডার্ড পোস্ট', icon: FileText, color: 'bg-blue-500' },
  { id: 'story', label: 'Add Story', labelBn: 'স্টোরি যোগ করুন', icon: Camera, color: 'bg-purple-500' },
  { id: 'reel', label: 'Record Reel', labelBn: 'রিল রেকর্ড করুন', icon: Film, color: 'bg-pink-500' },
  { id: 'live', label: 'Go Live', labelBn: 'লাইভ যান', icon: Radio, color: 'bg-red-500' },
  { id: 'poll', label: 'Public Poll', labelBn: 'পাবলিক পোল', icon: BarChart3, color: 'bg-green-500' },
  { id: 'fundraiser', label: 'Fundraiser', labelBn: 'তহবিল সংগ্রহ', icon: HeartHandshake, color: 'bg-orange-500' },
];

export default function CreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('quote');
  const { user } = useAuthStore();
  const [mode, setMode] = useState<string | null>(quoteId ? 'post' : null);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(24);

  // Fundraiser fields
  const [fundraiserTitle, setFundraiserTitle] = useState('');
  const [fundraiserDesc, setFundraiserDesc] = useState('');
  const [fundraiserGoal, setFundraiserGoal] = useState('');
  const [fundraiserEndDate, setFundraiserEndDate] = useState('');
  const [fundraiserBeneficiary, setFundraiserBeneficiary] = useState('');

  // Story fields
  const [storyBg, setStoryBg] = useState('bg-gradient-to-br from-purple-500 to-pink-500');
  const [storyText, setStoryText] = useState('');
  const [storyTextColor, setStoryTextColor] = useState('#ffffff');
  const [storyFontSize, setStoryFontSize] = useState(24);
  const [storyMusic, setStoryMusic] = useState('');
  const [storyImage, setStoryImage] = useState<string | null>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quoteId) {
      // Load quoted post preview if needed
    }
  }, [quoteId]);

  const uploadMedia = async (files: File[]): Promise<string[]> => {
    const ids: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      const token = api.getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }
      const data = await res.json();
      const payload = data?.data ?? data;
      if (data?.success !== false && payload?.id) {
        ids.push(payload.id);
      } else {
        throw new Error(`Failed to upload ${file.name}`);
      }
    }
    if (files.length > 0 && ids.length === 0) {
      throw new Error('Media upload failed');
    }
    return ids;
  };

  const handleSubmit = async () => {
    if (mode === 'live') {
      alert('Coming Soon - Live streaming will be available in the next update!');
      return;
    }

    setLoading(true);
    try {
      let mediaAssetIds: string[] = [];
      if (mediaFiles.length > 0) {
        mediaAssetIds = await uploadMedia(mediaFiles);
      }

      if (mode === 'post' || mode === 'reel') {
        await api.post('posts', {
          content,
          locationName: location,
          visibility,
          mediaAssetIds,
          sharedPostId: quoteId || undefined,
        });
      } else if (mode === 'story') {
        const storyImageFile = (window as any).__storyImageFile as File | undefined;
        let storyMediaIds: string[] = [];
        if (storyImageFile) {
          const ids = await uploadMedia([storyImageFile]);
          storyMediaIds = ids;
        }
        await api.post('stories', {
          locationName: location,
          mediaAssetIds: storyMediaIds.length > 0 ? storyMediaIds : undefined,
          stickers: storyText ? [{ type: 'TEXT', payload: { text: storyText }, positionX: 50, positionY: 50, scale: 1.0 }] : undefined,
        });
      } else if (mode === 'poll') {
        const validOptions = pollOptions.filter((o) => o.trim());
        if (validOptions.length < 2) {
          alert('Please add at least 2 poll options');
          setLoading(false);
          return;
        }
        await api.post('posts', {
          content,
          locationName: location,
          visibility,
          mediaAssetIds,
          poll: { options: validOptions, expiresAt: new Date(Date.now() + pollDuration * 60 * 60 * 1000).toISOString() },
        });
      } else if (mode === 'fundraiser') {
        await api.post('posts', {
          content: fundraiserDesc,
          locationName: location,
          visibility,
          mediaAssetIds,
          type: 'FUNDRAISER',
          fundraiser: {
            title: fundraiserTitle,
            goal: Number(fundraiserGoal),
            endDate: fundraiserEndDate,
            beneficiary: fundraiserBeneficiary,
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: ['user-posts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      router.push('/');
    } catch (err: any) {
      alert(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const selected = content.slice(start, end);
    const after = content.slice(end);
    setContent(before + prefix + selected + suffix + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  if (!mode) {
    return (
      <div className="py-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Create</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {createOptions.map((opt, i) => (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setMode(opt.id)}
              className="flex flex-col items-center gap-3 p-6 bg-card border rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white', opt.color)}>
                <opt.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground font-bangla">{opt.labelBn}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const isStory = mode === 'story';
  const isReel = mode === 'reel';
  const isLive = mode === 'live';
  const isPoll = mode === 'poll';
  const isFundraiser = mode === 'fundraiser';

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setMode(null)} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || (!isStory && !content.trim() && !mediaFiles.length && !isFundraiser && !isLive)}
          className={cn(
            'px-6 py-2 rounded-xl font-semibold text-sm transition-colors',
            (isStory || isLive || content.trim() || mediaFiles.length > 0 || isFundraiser) ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
          )}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {quoteId && (
        <div className="p-3 bg-muted rounded-xl text-sm text-muted-foreground">
          Quoting post: <span className="font-medium text-foreground">{quoteId}</span>
        </div>
      )}

      {isStory && (
        <div className="space-y-4">
          <div className={cn('w-full aspect-[9/16] rounded-2xl flex items-center justify-center relative overflow-hidden', !storyImage && storyBg)}>
            {storyImage && (
              <img src={storyImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <input
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Type something..."
              className="absolute bg-transparent text-center resize-none border-none outline-none focus:ring-0 z-10"
              style={{
                color: storyTextColor,
                fontSize: storyFontSize,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                textShadow: storyImage ? '0 2px 8px rgba(0,0,0,0.6)' : 'none',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={storyFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setStoryImage(url);
                  // Store file for upload
                  (window as any).__storyImageFile = file;
                }
              }}
            />
            <button
              onClick={() => storyFileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm hover:bg-muted/80 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              {storyImage ? 'Change Photo' : 'Add Photo'}
            </button>
            {storyImage && (
              <button
                onClick={() => {
                  setStoryImage(null);
                  (window as any).__storyImageFile = null;
                }}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['bg-gradient-to-br from-purple-500 to-pink-500', 'bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-orange-500 to-red-500', 'bg-gradient-to-br from-green-500 to-emerald-500', 'bg-black', 'bg-white'].map((bg) => (
              <button key={bg} onClick={() => { setStoryBg(bg); setStoryImage(null); }} className={cn('w-10 h-10 rounded-full border-2', bg, !storyImage && storyBg === bg ? 'border-bondhu-green' : 'border-transparent')} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <input type="range" min={14} max={48} value={storyFontSize} onChange={(e) => setStoryFontSize(Number(e.target.value))} className="flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <input type="color" value={storyTextColor} onChange={(e) => setStoryTextColor(e.target.value)} className="w-10 h-8 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-muted-foreground" />
            <input value={storyMusic} onChange={(e) => setStoryMusic(e.target.value)} placeholder="Music tag" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
          </div>
        </div>
      )}

      {isReel && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-2xl p-8 text-center">
            <Film className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Upload video (max 60 seconds)</p>
          </div>
          <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Caption..." className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
          <input value={storyMusic} onChange={(e) => setStoryMusic(e.target.value)} placeholder="Music tag" className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
        </div>
      )}

      {isLive && (
        <div className="space-y-4">
          <div className="bg-card border rounded-2xl p-6 text-center space-y-3">
            <Radio className="w-12 h-12 mx-auto text-red-500" />
            <h3 className="font-semibold">Schedule a Live</h3>
            <p className="text-sm text-muted-foreground">Live streaming is coming soon!</p>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">Coming Soon</span>
          </div>
          <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Stream title..." className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
          <textarea value={fundraiserDesc} onChange={(e) => setFundraiserDesc(e.target.value)} placeholder="Description..." rows={3} className="w-full px-4 py-2 bg-muted rounded-xl text-sm resize-none" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input type="datetime-local" className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
          </div>
        </div>
      )}

      {isFundraiser && (
        <div className="space-y-4">
          <input value={fundraiserTitle} onChange={(e) => setFundraiserTitle(e.target.value)} placeholder="Fundraiser Title" className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
          <textarea value={fundraiserDesc} onChange={(e) => setFundraiserDesc(e.target.value)} placeholder="Describe your cause..." rows={3} className="w-full px-4 py-2 bg-muted rounded-xl text-sm resize-none" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">৳</span>
            <input type="number" value={fundraiserGoal} onChange={(e) => setFundraiserGoal(e.target.value)} placeholder="Goal amount in BDT" className="flex-1 px-4 py-2 bg-muted rounded-xl text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input type="date" value={fundraiserEndDate} onChange={(e) => setFundraiserEndDate(e.target.value)} className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm" />
          </div>
          <input value={fundraiserBeneficiary} onChange={(e) => setFundraiserBeneficiary(e.target.value)} placeholder="Beneficiary name/info" className="w-full px-4 py-2 bg-muted rounded-xl text-sm" />
        </div>
      )}

      {!isStory && !isReel && !isLive && !isFundraiser && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              id="content-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isPoll ? 'Ask a question...' : "What's on your mind?"}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-card border rounded-2xl resize-none focus:outline-none focus:border-bondhu-green text-lg"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{content.length}/500</div>
          </div>

          {!isPoll && (
            <div className="flex items-center gap-2">
              <button onClick={() => insertFormat('**', '**')} className="p-2 hover:bg-muted rounded-lg" title="Bold"><Bold className="w-4 h-4" /></button>
              <button onClick={() => insertFormat('*', '*')} className="p-2 hover:bg-muted rounded-lg" title="Italic"><Italic className="w-4 h-4" /></button>
              <button onClick={() => insertFormat('@')} className="p-2 hover:bg-muted rounded-lg" title="Mention"><AtSign className="w-4 h-4" /></button>
              <button onClick={() => insertFormat('#')} className="p-2 hover:bg-muted rounded-lg" title="Hashtag"><Hash className="w-4 h-4" /></button>
            </div>
          )}

          {isPoll && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Poll Options</p>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[i] = e.target.value;
                      setPollOptions(next);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 px-3 py-2 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => setPollOptions((prev) => prev.filter((_, idx) => idx !== i))}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 5 && (
                <button
                  onClick={() => setPollOptions((prev) => [...prev, ''])}
                  className="text-sm text-bondhu-green font-medium hover:underline"
                >
                  + Add option
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <select
                  value={pollDuration}
                  onChange={(e) => setPollDuration(Number(e.target.value))}
                  className="px-2 py-1 bg-card border rounded-lg text-sm"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={72}>3 days</option>
                  <option value={168}>7 days</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {mediaFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mediaFiles.map((file, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setMediaFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 p-0.5 bg-black/50 text-white rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!isStory && (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={isReel ? 'video/*' : 'image/*,video/*'}
            multiple={!isReel}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setMediaFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl text-sm hover:bg-muted/80 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            {isReel ? 'Add Video' : 'Add Media'}
          </button>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
            className="flex-1 px-4 py-2 bg-muted rounded-xl text-sm focus:outline-none"
          />
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="px-3 py-2 bg-muted rounded-xl text-sm">
            <option value="PUBLIC">Public</option>
            <option value="FOLLOWERS">Followers</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
      )}
    </div>
  );
}
