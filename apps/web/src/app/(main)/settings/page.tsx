// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, User, Shield, Bell, Eye, Moon, Type, Palette,
  Globe, Lock, HelpCircle, LogOut, ChevronRight, Fingerprint,
  X, Check, Plus, Trash2, AlertTriangle, Phone, MapPin,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useTheme } from 'next-themes';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const { logout, user, setUser } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { fontScale, setFontScale, language, setLanguage, highContrast, setHighContrast, reducedMotion, setReducedMotion, addToast } = useUIStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [blockedHashtags, setBlockedHashtags] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newHashtag, setNewHashtag] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingDisplay, setSavingDisplay] = useState(false);
  const [sendingSOS, setSendingSOS] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<{contactName: string; contactPhone: string; relationship?: string}[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');

  useEffect(() => {
    // Apply high contrast class to document
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    // Apply font scale to document
    const scaleMap: Record<string, string> = {
      XS: '0.75rem',
      SMALL: '0.875rem',
      MEDIUM: '1rem',
      LARGE: '1.125rem',
      XL: '1.25rem',
    };
    document.documentElement.style.fontSize = scaleMap[fontScale] || '1rem';
  }, [fontScale]);

  const saveDisplaySettings = async (updates: Record<string, any>) => {
    setSavingDisplay(true);
    try {
      await api.patch('users/me', updates);
      addToast('Settings saved', 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed to save settings', 'error');
    } finally {
      setSavingDisplay(false);
    }
  };

  const handleFontScaleChange = (scale: typeof fontScale) => {
    setFontScale(scale);
    saveDisplaySettings({ fontScale: scale });
  };

  const langMap: Record<string, string> = { bn: 'BANGLA', en: 'ENGLISH', bng: 'BANGLISH' };

  const handleLanguageChange = (lang: typeof language) => {
    setLanguage(lang);
    // Set HTML lang attribute immediately
    document.documentElement.lang = lang === 'en' ? 'en' : 'bn';
    saveDisplaySettings({ language: langMap[lang] });
  };

  const handleHighContrastChange = (v: boolean) => {
    setHighContrast(v);
    saveDisplaySettings({ highContrast: v });
  };

  const handleReducedMotionChange = (v: boolean) => {
    setReducedMotion(v);
    saveDisplaySettings({ reducedMotion: v });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/onboarding');
  };

  const addBlockedWord = async () => {
    if (!newWord.trim()) return;
    setLoading(true);
    try {
      await api.post('users/me/blocked-words', { word: newWord.trim() });
      setBlockedWords((prev) => [...prev, newWord.trim()]);
      setNewWord('');
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const addBlockedHashtag = async () => {
    if (!newHashtag.trim()) return;
    setLoading(true);
    try {
      await api.post('users/me/blocked-hashtags', { hashtag: newHashtag.trim() });
      setBlockedHashtags((prev) => [...prev, newHashtag.trim()]);
      setNewHashtag('');
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSendSOS = async () => {
    setSendingSOS(true);
    try {
      // Get GPS location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;
      await api.post('sos', {
        latitude,
        longitude,
        locationName: '',
      });
      addToast('SOS alert sent! Your trusted contacts have been notified.', 'success');
    } catch (err: any) {
      // Send without location if GPS fails
      try {
        await api.post('sos', {});
        addToast('SOS alert sent! (Location unavailable)', 'success');
      } catch {
        addToast('Failed to send SOS alert', 'error');
      }
    } finally {
      setSendingSOS(false);
    }
  };

  const addTrustedContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setLoading(true);
    try {
      await api.post('users/me/trusted-contacts', {
        contactName: newContactName.trim(),
        contactPhone: newContactPhone.trim(),
        relationship: newContactRelation.trim() || undefined,
      });
      setTrustedContacts((prev) => [...prev, {
        contactName: newContactName.trim(),
        contactPhone: newContactPhone.trim(),
        relationship: newContactRelation.trim(),
      }]);
      setNewContactName('');
      setNewContactPhone('');
      setNewContactRelation('');
      addToast('Trusted contact added', 'success');
    } catch {
      addToast('Failed to add contact', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [websiteUrl, setWebsiteUrl] = useState(user?.profile?.websiteUrl || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.profile?.whatsappNumber || '');

  const saveProfileField = async (field: string, value: string) => {
    try {
      await api.patch('users/me', { [field]: value });
      addToast('সংরক্ষণ করা হয়েছে', 'success');
    } catch {
      addToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const sections = [
    {
      id: 'profile',
      title: 'Profile Info',
      icon: User,
      items: [
        { label: 'Edit Bio', labelBn: 'বায়ো সম্পাদনা', action: () => router.push('/profile') },
        { label: 'Change Avatar', labelBn: 'অবতার পরিবর্তন', action: () => router.push('/profile') },
        { label: 'Update Handle', labelBn: 'হ্যান্ডেল আপডেট', action: () => alert('Handle changes are locked for 30 days after creation') },
        {
          label: 'Website URL',
          labelBn: 'ওয়েবসাইট',
          control: (
            <div className="flex gap-2 w-full max-w-xs">
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onBlur={() => saveProfileField('websiteUrl', websiteUrl)}
                className="flex-1 px-3 py-1.5 bg-card border rounded-lg text-xs focus:outline-none focus:border-bondhu-green"
              />
            </div>
          ),
        },
        {
          label: 'WhatsApp Number',
          labelBn: 'হোয়াটসঅ্যাপ নম্বর',
          control: (
            <div className="flex gap-2 w-full max-w-xs">
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                onBlur={() => saveProfileField('whatsappNumber', whatsappNumber)}
                className="flex-1 px-3 py-1.5 bg-card border rounded-lg text-xs focus:outline-none focus:border-bondhu-green"
              />
            </div>
          ),
        },
      ],
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      icon: Shield,
      items: [
        { label: 'NID Verification', labelBn: 'জাতীয় পরিচয়পত্র যাচাই', icon: Fingerprint, action: () => alert('NID verification requires document upload (coming soon)') },
        { label: 'Passport', labelBn: 'পাসপোর্ট', action: () => alert('Passport verification requires document upload (coming soon)') },
        { label: 'SME Trade License', labelBn: 'ব্যবসায়িক লাইসেন্স', action: () => alert('SME verification requires document upload (coming soon)') },
      ],
    },
    {
      id: 'safety',
      title: 'Safety & Emergency',
      icon: AlertTriangle,
      items: [
        {
          label: 'Send SOS Alert',
          labelBn: 'জরুরী সাহায্য',
          icon: Phone,
          action: () => setActiveModal('sos'),
          danger: true,
        },
        {
          label: 'Trusted Contacts',
          labelBn: 'বিশ্বস্ত পরিচিতজন',
          icon: MapPin,
          action: () => setActiveModal('trusted-contacts'),
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences & Filters',
      icon: Bell,
      items: [
        { label: 'Topic Categories', labelBn: 'বিষয়শ্রেণী', action: () => alert('Topic category selection coming soon') },
        { label: 'Notification Rates', labelBn: 'বিজ্ঞপ্তির হার', action: () => alert('Notification rate controls coming soon') },
        { label: 'Blocked Words', labelBn: 'ব্লক করা শব্দ', action: () => setActiveModal('blocked-words') },
        { label: 'Blocked Hashtags', labelBn: 'ব্লক করা হ্যাশট্যাগ', action: () => setActiveModal('blocked-hashtags') },
      ],
    },
    {
      id: 'display',
      title: 'Display & Accessibility',
      icon: Eye,
      items: [
        {
          label: 'Theme',
          labelBn: 'থিম',
          control: (
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors',
                    theme === t ? 'bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          ),
        },
        {
          label: 'Font Size',
          labelBn: 'ফন্ট সাইজ',
          control: (
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(['XS', 'SMALL', 'MEDIUM', 'LARGE', 'XL'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleFontScaleChange(s)}
                  className={cn(
                    'px-2 py-1 rounded-md text-xs font-medium transition-colors',
                    fontScale === s ? 'bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  {s[0]}
                </button>
              ))}
            </div>
          ),
        },
        {
          label: 'Language',
          labelBn: 'ভাষা',
          control: (
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {([
                { code: 'bn', label: 'বাংলা' },
                { code: 'en', label: 'English' },
                { code: 'bng', label: 'Banglish' },
              ] as const).map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  className={cn(
                    'px-2 py-1 rounded-md text-xs font-medium transition-colors',
                    language === l.code ? 'bg-card shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          ),
        },
        {
          label: 'High Contrast',
          labelBn: 'উচ্চ কনট্রাস্ট',
          control: (
            <button
              onClick={() => handleHighContrastChange(!highContrast)}
              className={cn(
                'w-10 h-6 rounded-full transition-colors relative',
                highContrast ? 'bg-bondhu-green' : 'bg-muted',
              )}
            >
              <motion.div
                animate={{ x: highContrast ? 16 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          ),
        },
        {
          label: 'Reduced Motion',
          labelBn: 'কমানো মোশন',
          control: (
            <button
              onClick={() => handleReducedMotionChange(!reducedMotion)}
              className={cn(
                'w-10 h-6 rounded-full transition-colors relative',
                reducedMotion ? 'bg-bondhu-green' : 'bg-muted',
              )}
            >
              <motion.div
                animate={{ x: reducedMotion ? 16 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="py-4 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <section.icon className="w-4 h-4 text-bondhu-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h2>
          </div>

          <div className="bg-card rounded-2xl border divide-y divide-border overflow-hidden">
            {section.items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {'control' in item ? (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground font-bangla">{item.labelBn}</p>
                    </div>
                    {item.control}
                  </div>
                ) : (
                  <button
                    onClick={item.action}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left",
                      (item as any).danger && "hover:bg-red-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className={cn("w-4 h-4", (item as any).danger ? "text-red-500" : "text-muted-foreground")} />}
                      <div>
                        <p className={cn("font-medium text-sm", (item as any).danger && "text-red-600")}>{item.label}</p>
                        <p className="text-xs text-muted-foreground font-bangla">{item.labelBn}</p>
                      </div>
                    </div>
                    <ChevronRight className={cn("w-4 h-4", (item as any).danger ? "text-red-400" : "text-muted-foreground")} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background w-full max-w-md rounded-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* SOS Alert Modal */}
              {activeModal === 'sos' && (
                <>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-red-600">Emergency SOS</h3>
                    <p className="text-sm text-muted-foreground font-bangla">
                      জরুরী সাহায্যের প্রয়োজন? আপনার বিশ্বস্ত পরিচিতজনদের আপনার অবস্থান জানানো হবে।
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This will send your GPS location to your trusted contacts for 1 hour.
                    </p>
                  </div>
                  <button
                    onClick={handleSendSOS}
                    disabled={sendingSOS}
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {sendingSOS ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Phone className="w-5 h-5" />
                        SEND SOS ALERT
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 bg-muted rounded-xl text-sm font-medium"
                  >
                    Cancel
                  </button>
                </>
              )}

              {/* Trusted Contacts Modal */}
              {activeModal === 'trusted-contacts' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Trusted Contacts</h3>
                    <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-muted rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-bangla">
                    বিশ্বস্ত পরিচিতজন যোগ করুন - তারা SOS অ্যালার্ট পাবেন
                  </p>
                  <div className="space-y-2">
                    <input
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="Contact Name"
                      className="w-full px-3 py-2 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                    />
                    <input
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                    />
                    <input
                      value={newContactRelation}
                      onChange={(e) => setNewContactRelation(e.target.value)}
                      placeholder="Relationship (optional)"
                      className="w-full px-3 py-2 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                    />
                    <button
                      onClick={addTrustedContact}
                      disabled={!newContactName.trim() || !newContactPhone.trim() || loading}
                      className="w-full py-2 bg-bondhu-green text-white rounded-xl text-sm font-medium disabled:bg-muted disabled:text-muted-foreground"
                    >
                      {loading ? 'Adding...' : 'Add Contact'}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {trustedContacts.map((contact, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-card rounded-xl">
                        <div>
                          <p className="text-sm font-medium">{contact.contactName}</p>
                          <p className="text-xs text-muted-foreground">{contact.contactPhone}</p>
                          {contact.relationship && (
                            <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setTrustedContacts((prev) => prev.filter((_, idx) => idx !== i))}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {trustedContacts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No trusted contacts yet
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Blocked Words / Hashtags Modal */}
              {(activeModal === 'blocked-words' || activeModal === 'blocked-hashtags') && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">
                      {activeModal === 'blocked-words' ? 'Blocked Words' : 'Blocked Hashtags'}
                    </h3>
                    <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-muted rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={activeModal === 'blocked-words' ? newWord : newHashtag}
                      onChange={(e) => activeModal === 'blocked-words' ? setNewWord(e.target.value) : setNewHashtag(e.target.value)}
                      placeholder={activeModal === 'blocked-words' ? 'Add a word...' : 'Add a hashtag...'}
                      className="flex-1 px-3 py-2 bg-card border rounded-xl text-sm focus:outline-none focus:border-bondhu-green"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          activeModal === 'blocked-words' ? addBlockedWord() : addBlockedHashtag();
                        }
                      }}
                    />
                    <button
                      onClick={activeModal === 'blocked-words' ? addBlockedWord : addBlockedHashtag}
                      disabled={loading}
                      className="px-3 py-2 bg-bondhu-green text-white rounded-xl hover:bg-bondhu-green-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(activeModal === 'blocked-words' ? blockedWords : blockedHashtags).map((item) => (
                      <div key={item} className="flex items-center justify-between px-3 py-2 bg-card rounded-xl">
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() => {
                            if (activeModal === 'blocked-words') {
                              setBlockedWords((prev) => prev.filter((w) => w !== item));
                            } else {
                              setBlockedHashtags((prev) => prev.filter((h) => h !== item));
                            }
                          }}
                          className="p-1 hover:bg-destructive/10 text-destructive rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {(activeModal === 'blocked-words' ? blockedWords : blockedHashtags).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No {activeModal === 'blocked-words' ? 'blocked words' : 'blocked hashtags'} yet
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

      <p className="text-center text-xs text-muted-foreground pb-4">
        Bondhu v1.0.0 · Made with ❤️ for Bangladesh
      </p>
    </div>
  );
}
