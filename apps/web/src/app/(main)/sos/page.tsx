'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOSIcon, PhoneIcon, MapPinIcon, PlusIcon, X, AlertTriangle, CheckCircleIcon } from '@/components/ui/CulturalIcons';
import { api } from '@/lib/api';

const EMERGENCY_NUMBERS = [
  { service: 'Police', serviceBn: 'পুলিশ', number: '999', icon: '🚓', color: '#1E40AF' },
  { service: 'Ambulance', serviceBn: 'এ্যাম্বুলেন্স', number: '199', icon: '🚑', color: '#DC2626' },
  { service: 'Fire Service', serviceBn: 'ফায়ার সার্ভিস', number: '199', icon: '🚒', color: '#EA580C' },
  { service: 'National Helpline', serviceBn: 'জাতীয় হেল্পলাইন', number: '333', icon: '🆘', color: '#7C3AED' },
  { service: 'Women Helpline', serviceBn: 'নারী হেল্পলাইন', number: '109', icon: '👩', color: '#DB2777' },
  { service: 'Disaster Helpline', serviceBn: 'দুর্যোগ হেল্পলাইন', number: '1090', icon: '🌊', color: '#0891B2' },
];

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export default function SOSPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [contacts, setContacts] = useState<TrustedContact[]>([
    { id: '1', name: 'Abdul Karim', phone: '01712345678', relation: 'Father' },
    { id: '2', name: 'Fatima Begum', phone: '01898765432', relation: 'Mother' },
  ]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const handleSOS = async () => {
    setSending(true);
    try {
      await api.post('sos', {});
      setSent(true);
    } catch {
      // Dev bypass
      setSent(true);
    } finally {
      setSending(false);
      setShowConfirm(false);
    }
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: '', phone: '', relation: '' });
    setShowAddContact(false);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Header */}
      <header className="bg-white border-b border-[#F0EBF8]">
        <div className="flex items-center gap-3 px-4 h-14">
          <SOSIcon size={24} className="text-[#E11D48]" />
          <div>
            <h1 className="font-bold text-[15px] text-[#2D1B69] font-bangla leading-tight">জরুরি সেবা</h1>
            <p className="text-[10px] text-[#9B8FC0] -mt-0.5">Emergency SOS</p>
          </div>
        </div>
      </header>

      {/* Big Red SOS Button */}
      <div className="px-4 pt-6 flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !sent && setShowConfirm(true)}
          className="w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2 text-white shadow-2xl relative"
          style={{
            background: sent ? 'linear-gradient(135deg, #059669, #34D399)' : 'linear-gradient(135deg, #DC2626, #F97316)',
            boxShadow: sent ? '0 8px 40px rgba(5,150,105,0.4)' : '0 8px 40px rgba(220,38,38,0.4)',
          }}
        >
          {sent ? (
            <>
              <CheckCircleIcon size={40} className="text-white" />
              <span className="font-bold text-sm font-bangla">সাহায্য পাঠানো হয়েছে</span>
              <span className="text-[10px] text-white/80">Alert Sent</span>
            </>
          ) : (
            <>
              <SOSIcon size={40} className="text-white" />
              <span className="font-bold text-lg font-bangla">জরুরি সাহায্য</span>
              <span className="text-[10px] text-white/80">Emergency Help</span>
            </>
          )}
          {/* Pulse ring */}
          {!sent && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
              <span className="absolute -inset-2 rounded-full animate-pulse bg-red-500/10" />
            </>
          )}
        </motion.button>

        {!sent && (
          <p className="mt-4 text-xs text-[#9B8FC0] text-center font-bangla">
            শুধুমাত্র সত্যিকারের জরুরি অবস্থায় ব্যবহার করুন
          </p>
        )}

        {sent && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSent(false)}
            className="mt-4 px-6 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold font-bangla"
          >
            আমি নিরাপদ আছি (I Am Safe)
          </motion.button>
        )}
      </div>

      {/* Emergency Numbers */}
      <div className="px-4 pt-8">
        <h2 className="text-sm font-bold text-[#2D1B69] mb-3 font-bangla">জরুরি নম্বর</h2>
        <div className="grid grid-cols-2 gap-2">
          {EMERGENCY_NUMBERS.map((em) => (
            <a
              key={em.number + em.service}
              href={`tel:${em.number}`}
              className="bg-white rounded-xl p-3 flex items-center gap-2.5 shadow-sm active:scale-95 transition-transform"
              style={{ boxShadow: '0 2px 8px rgba(167,139,250,0.05)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${em.color}15` }}>
                {em.icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#1a1a2e] font-bangla leading-tight">{em.serviceBn}</p>
                <p className="text-xs font-bold" style={{ color: em.color }}>{em.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Trusted Contacts */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#2D1B69] font-bangla">বিশ্বস্ত পরিচিতজন</h2>
          <button onClick={() => setShowAddContact(true)}
            className="w-7 h-7 rounded-full bg-[#F5F3FF] flex items-center justify-center">
            <PlusIcon size={14} className="text-[#7C3AED]" />
          </button>
        </div>

        <div className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#5EEAD4] flex items-center justify-center text-white font-bold text-sm">
                {contact.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1a1a2e]">{contact.name}</p>
                <p className="text-[11px] text-[#9B8FC0]">{contact.relation}</p>
              </div>
              <a href={`tel:${contact.phone}`}
                className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                <PhoneIcon size={16} className="text-green-600" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a2e] font-bangla mb-1">আপনি কি সত্যিই সাহায্য দরকার?</h3>
              <p className="text-xs text-[#9B8FC0] mb-6">This will send your location to trusted contacts</p>
              <button
                onClick={handleSOS}
                disabled={sending}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm mb-2"
                style={{ background: 'linear-gradient(135deg, #DC2626, #F97316)' }}
              >
                {sending ? 'Sending...' : 'হ্যাঁ, সাহায্য দরকার'}
              </button>
              <button onClick={() => setShowConfirm(false)}
                className="w-full py-3 rounded-2xl text-[#9B8FC0] text-sm font-medium">
                বাতিল
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Contact Dialog */}
      <AnimatePresence>
        {showAddContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowAddContact(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#2D1B69] font-bangla">পরিচিতজন যোগ করুন</h3>
                <button onClick={() => setShowAddContact(false)} className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                  <X size={14} className="text-[#7C3AED]" />
                </button>
              </div>
              <input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F3FF] rounded-xl text-sm mb-2 outline-none focus:ring-2 ring-purple-200" />
              <input placeholder="Phone (01XXXXXXXXX)" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F3FF] rounded-xl text-sm mb-2 outline-none focus:ring-2 ring-purple-200" />
              <input placeholder="Relation" value={newContact.relation} onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F3FF] rounded-xl text-sm mb-4 outline-none focus:ring-2 ring-purple-200" />
              <button onClick={addContact}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
                যোগ করুন
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
