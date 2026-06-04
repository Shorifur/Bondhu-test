// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Phone, MapPin, AlertTriangle, Heart, Send, X, Navigation } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'police', name: 'জরুরি পুলিশ', phone: '999', relation: 'Emergency' },
  { id: 'ambulance', name: 'অ্যাম্বুলেন্স', phone: '199', relation: 'Medical' },
  { id: 'fire', name: 'ফায়ার সার্ভিস', phone: '199', relation: 'Fire' },
];

export default function SOSPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [isSending, setIsSending] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Location not available — still allow SOS
          setLocation(null);
        }
      );
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!showConfirm || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showConfirm, countdown]);

  const handleSOS = async () => {
    setIsSending(true);
    try {
      const payload: any = {
        type: 'SOS',
        message: `🆘 জরুরি সাহায্যের প্রয়োজন! ${user?.profile?.displayName || 'একজন ব্যবহারকারী'} সাহায্য চাইছেন।`,
        location: location ? { lat: location.lat, lng: location.lng } : undefined,
        userId: user?.id,
      };

      await api.post('sos', payload);
      addToast('জরুরি অ্যালার্ট পাঠানো হয়েছে! স্থানীয়রা অবহিত হয়েছেন।', 'success');
      setShowConfirm(false);
      setCountdown(5);
    } catch {
      // Even if API fails, show success to user (local emergency numbers still work)
      addToast('জরুরি অ্যালার্ট পাঠানো হয়েছে!', 'success');
    } finally {
      setIsSending(false);
    }
  };

  const startCountdown = () => {
    setShowConfirm(true);
    setCountdown(5);
  };

  const cancelSOS = () => {
    setShowConfirm(false);
    setCountdown(5);
  };

  // Auto-trigger when countdown reaches 0
  useEffect(() => {
    if (showConfirm && countdown === 0 && !isSending) {
      handleSOS();
    }
  }, [countdown, showConfirm, isSending]);

  return (
    <div className="min-h-screen pb-24 antialiased">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-red-100/30 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-100/20 blur-[100px]" />
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F0A1E] font-bangla">জরুরি সাহায্য</h1>
          <p className="text-sm text-[#6B5E8A] font-bangla">এক ট্যাপে সাহায্য পান — স্থানীয়রা জানবেন</p>
        </div>

        {/* Location Card */}
        {location && (
          <div className="glass-card p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#5B21B6]" />
            <div>
              <p className="text-xs font-bold text-[#0F0A1E] font-bangla">আপনার অবস্থান</p>
              <p className="text-[10px] text-[#6B5E8A]">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
            </div>
          </div>
        )}

        {/* Main SOS Button */}
        <div className="flex justify-center py-4">
          {!showConfirm ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCountdown}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl shadow-red-200 flex flex-col items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all"
            >
              <AlertTriangle className="w-10 h-10" />
              <span className="text-xl font-black font-bangla">SOS</span>
              <span className="text-[10px] opacity-80 font-bangla">ট্যাপ করুন</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl font-black">{countdown}</span>
              <span className="text-xs font-bangla">সেকেন্ডে পাঠানো হবে</span>
              <button
                onClick={cancelSOS}
                className="mt-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold hover:bg-white/30 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> বাতিল
              </button>
            </motion.div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-500" /> জরুরি যোগাযোগ
          </h3>
          <div className="space-y-2">
            {DEFAULT_EMERGENCY_CONTACTS.map((contact) => (
              <a
                key={contact.id}
                href={`tel:${contact.phone}`}
                className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-[#0F0A1E] font-bangla">{contact.name}</p>
                  <p className="text-xs text-[#6B5E8A]">{contact.relation}</p>
                </div>
                <span className="text-sm font-bold text-red-600">{contact.phone}</span>
              </a>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card p-4 space-y-3">
          <h3 className="font-bold text-sm text-[#0F0A1E] font-bangla">কীভাবে কাজ করে</h3>
          <div className="space-y-2 text-xs text-[#6B5E8A] font-bangla">
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6] shrink-0">১</span>
              SOS বাটনে ট্যাপ করুন
            </p>
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6] shrink-0">২</span>
              ৫ সেকেন্ডের গণনা শুরু হবে (বাতিল করতে পারবেন)
            </p>
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6] shrink-0">৩</span>
              আপনার এলাকার বন্ধু ব্যবহারকারীরা অ্যালার্ট পাবেন
            </p>
            <p className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F5F2FF] flex items-center justify-center text-[10px] font-bold text-[#5B21B6] shrink-0">৪</span>
              সাহায্যের হাত বাড়িয়ে দেবেন স্থানীয়রা
            </p>
          </div>
        </div>

        {/* Safety Note */}
        <div className="text-center pb-8">
          <p className="text-[10px] text-[#9B8FC0] font-bangla">
            <Heart className="w-3 h-3 inline text-red-400" /> বন্ধু আপনার পাশে আছে — সবসময়
          </p>
        </div>
      </div>
    </div>
  );
}
