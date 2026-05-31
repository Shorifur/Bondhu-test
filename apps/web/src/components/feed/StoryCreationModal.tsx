'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Image, Type, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface StoryCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type StoryType = 'text' | 'image' | null;

const BG_GRADIENTS = [
  { id: 'purple',   style: 'linear-gradient(135deg, #5B21B6, #7C3AED)', label: 'Purple' },
  { id: 'teal',     style: 'linear-gradient(135deg, #0D9488, #14B8A6)', label: 'Teal' },
  { id: 'rose',     style: 'linear-gradient(135deg, #E85D75, #F472B6)', label: 'Rose' },
  { id: 'amber',    style: 'linear-gradient(135deg, #F59E0B, #FBBF24)', label: 'Amber' },
  { id: 'indigo',   style: 'linear-gradient(135deg, #4338CA, #6366F1)', label: 'Indigo' },
  { id: 'emerald',  style: 'linear-gradient(135deg, #059669, #10B981)', label: 'Emerald' },
  { id: 'sunset',   style: 'linear-gradient(135deg, #DC2626, #F97316)', label: 'Sunset' },
  { id: 'ocean',    style: 'linear-gradient(135deg, #0369A1, #38BDF8)', label: 'Ocean' },
];

const TEXT_COLORS = ['#FFFFFF', '#FFE4E6', '#FEF3C7', '#D1FAE5', '#E0E7FF', '#FCE7F3'];

export function StoryCreationModal({ isOpen, onClose, onSuccess }: StoryCreationModalProps) {
  const { user } = useAuthStore();
  const [storyType, setStoryType] = useState<StoryType>(null);
  const [textContent, setTextContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(BG_GRADIENTS[0].style);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = api.getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.url || data?.url || null;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let mediaUrl: string | undefined;

      if (storyType === 'image' && imagePreview) {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const file = new File([blob], 'story.jpg', { type: 'image/jpeg' });
        mediaUrl = await uploadImage(file) || undefined;
      }

      // Build payload matching backend DTO exactly — only include expected fields
      let payload: Record<string, any>;
      if (storyType === 'text') {
        payload = {
          type: 'TEXT',
          content: textContent.trim(),
          gradient: selectedGradient,
          textColor: selectedTextColor,
        };
      } else {
        payload = {
          type: 'IMAGE',
          mediaUrl,
          // Do NOT include content, gradient, textColor for IMAGE type
        };
      }

      await api.post('stories', payload);
      onSuccess?.();
      handleReset();
      onClose();
    } catch (err: any) {
      console.warn('[StoryCreation] Submit failed:', err?.message || err);
      // Show error to user via toast
      alert(err?.message || 'স্টোরি আপলোড ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStoryType(null);
    setTextContent('');
    setImagePreview(null);
    setSelectedGradient(BG_GRADIENTS[0].style);
    setSelectedTextColor(TEXT_COLORS[0]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const canSubmit = storyType === 'text' ? textContent.trim().length > 0 : storyType === 'image' ? !!imagePreview : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0F0A1E]/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DDD6F3]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#DDD6F3]/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5B21B6]" />
                <h2 className="font-bold text-base text-[#0F0A1E] font-bangla">স্টোরি তৈরি করুন</h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F2FF] transition-colors"
              >
                <X className="w-4 h-4 text-[#6B5E8A]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Step 1: Choose type */}
              {!storyType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-[#6B5E8A] font-medium font-bangla text-center">কী ধরনের স্টোরি তৈরি করতে চান?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStoryType('text')}
                      className="p-6 rounded-2xl border-2 border-[#DDD6F3] hover:border-[#5B21B6] hover:bg-[#F5F2FF] transition-all flex flex-col items-center gap-3 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#F5F2FF] group-hover:bg-[#EDE9FF] flex items-center justify-center">
                        <Type className="w-7 h-7 text-[#5B21B6]" />
                      </div>
                      <span className="text-sm font-bold text-[#0F0A1E] font-bangla">টেক্সট</span>
                    </button>
                    <button
                      onClick={() => { setStoryType('image'); setTimeout(() => fileInputRef.current?.click(), 100); }}
                      className="p-6 rounded-2xl border-2 border-[#DDD6F3] hover:border-[#5B21B6] hover:bg-[#F5F2FF] transition-all flex flex-col items-center gap-3 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#F5F2FF] group-hover:bg-[#EDE9FF] flex items-center justify-center">
                        <Camera className="w-7 h-7 text-[#5B21B6]" />
                      </div>
                      <span className="text-sm font-bold text-[#0F0A1E] font-bangla">ছবি</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2a: Text Story */}
              {storyType === 'text' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Preview */}
                  <div
                    className="aspect-[9/16] max-h-[300px] rounded-2xl flex items-center justify-center p-6 transition-all"
                    style={{ background: selectedGradient }}
                  >
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="আপনার গল্প লিখুন..."
                      className="w-full h-full bg-transparent text-center text-lg font-bold font-bangla resize-none outline-none placeholder:text-white/50"
                      style={{ color: selectedTextColor }}
                      maxLength={200}
                    />
                  </div>

                  {/* Gradient picker */}
                  <div>
                    <p className="text-[10px] font-bold text-[#6B5E8A] uppercase tracking-wider mb-2">ব্যাকগ্রাউন্ড</p>
                    <div className="flex gap-2 flex-wrap">
                      {BG_GRADIENTS.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGradient(g.style)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            selectedGradient === g.style ? 'border-[#5B21B6] scale-110' : 'border-transparent'
                          )}
                          style={{ background: g.style }}
                          title={g.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Text color picker */}
                  <div>
                    <p className="text-[10px] font-bold text-[#6B5E8A] uppercase tracking-wider mb-2">টেক্সট রং</p>
                    <div className="flex gap-2 flex-wrap">
                      {TEXT_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedTextColor(c)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            selectedTextColor === c ? 'border-[#5B21B6] scale-110' : 'border-gray-200'
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleReset}
                      className="text-xs font-bold text-[#6B5E8A] hover:text-[#5B21B6] transition-colors font-bangla"
                    >
                      ← ফিরে যান
                    </button>
                    <span className="text-[10px] text-[#9B8FC0]">{textContent.length}/200</span>
                  </div>
                </motion.div>
              )}

              {/* Step 2b: Image Story */}
              {storyType === 'image' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {/* Image preview or upload area */}
                  {imagePreview ? (
                    <div className="relative aspect-[9/16] max-h-[300px] rounded-2xl overflow-hidden">
                      <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setImagePreview(null); fileInputRef.current?.click(); }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                      >
                        পরিবর্তন
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-[9/16] max-h-[300px] rounded-2xl border-2 border-dashed border-[#DDD6F3] flex flex-col items-center justify-center gap-3 hover:border-[#5B21B6] hover:bg-[#F5F2FF] transition-all"
                    >
                      <Image className="w-10 h-10 text-[#B8A9E3]" />
                      <span className="text-sm font-bold text-[#6B5E8A] font-bangla">ছবি নির্বাচন করুন</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleReset}
                      className="text-xs font-bold text-[#6B5E8A] hover:text-[#5B21B6] transition-colors font-bangla"
                    >
                      ← ফিরে যান
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer — Submit */}
            {storyType && (
              <div className="px-5 pb-5 pt-2">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className={cn(
                    'w-full py-3 rounded-xl text-sm font-bold text-white bondhu-gradient shadow-md transition-all flex items-center justify-center gap-2',
                    (!canSubmit || isSubmitting) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      আপলোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bangla">স্টোরি শেয়ার করুন</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
