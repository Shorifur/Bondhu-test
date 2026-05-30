'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, HandCoins, ShieldCheck, Fingerprint, Lock } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const mfsProviders = [
  { id: 'BKASH', name: 'bKash', color: 'bg-pink-600' },
  { id: 'NAGAD', name: 'Nagad', color: 'bg-orange-600' },
  { id: 'ROCKET', name: 'Rocket', color: 'bg-purple-600' },
  { id: 'UPAY', name: 'Upay', color: 'bg-blue-600' },
];

export function FintechDrawer() {
  const { sheets, closeSheet } = useUIStore();
  const [mode, setMode] = useState<'send' | 'request' | 'escrow'>('send');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('BKASH');
  const [description, setDescription] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const sheet = sheets['fintech'];
  const isOpen = sheet?.isOpen;
  const data = sheet?.data as { conversationId?: string; receiverId?: string } | undefined;

  const handleVerify = async () => {
    setVerifying(true);
    // Simulate biometric/2FA
    await new Promise((r) => setTimeout(r, 1500));
    setVerifying(false);
    setVerified(true);
  };

  const handleSubmit = async () => {
    if (!verified) return;
    try {
      if (mode === 'send') {
        await api.post('payments/send', {
          receiverId: data?.receiverId,
          type: 'P2P_TRANSFER',
          amount: Number(amount),
          provider,
          description,
        });
      } else if (mode === 'request') {
        await api.post('payments/request', {
          receiverId: data?.receiverId,
          type: 'FUND_REQUEST',
          amount: Number(amount),
          provider,
          description,
        });
      }
    } catch {
      // handle error
    }
    closeSheet('fintech');
    setAmount('');
    setVerified(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeSheet('fintech')}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-w-2xl mx-auto"
          >
            <div className="p-4 space-y-4">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto" />

              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-bondhu-green">৳</span> Financial Services
              </h3>

              {/* Mode Tabs */}
              <div className="flex gap-2">
                {([
                  { id: 'send', label: 'Send', icon: ArrowRightLeft },
                  { id: 'request', label: 'Request', icon: HandCoins },
                  { id: 'escrow', label: 'Escrow', icon: ShieldCheck },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMode(m.id); setVerified(false); }}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      mode === m.id ? 'bg-bondhu-green text-white' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <m.icon className="w-4 h-4" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Amount (৳)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">৳</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
                  />
                </div>
              </div>

              {/* Provider */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Select Provider</label>
                <div className="grid grid-cols-4 gap-2">
                  {mfsProviders.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={cn(
                        'py-2 px-3 rounded-xl text-xs font-bold text-white transition-all',
                        p.color,
                        provider === p.id ? 'ring-2 ring-offset-2 ring-bondhu-green scale-105' : 'opacity-70 hover:opacity-100',
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bondhu-green/20"
                />
              </div>

              {/* Verification Gate */}
              {!verified ? (
                <button
                  onClick={handleVerify}
                  disabled={verifying || !amount}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all',
                    !amount ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-bondhu-green text-white hover:bg-bondhu-green-dark',
                  )}
                >
                  {verifying ? (
                    <>
                      <Fingerprint className="w-5 h-5 animate-pulse" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Authenticate to Proceed
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3.5 rounded-xl font-semibold bg-bondhu-green text-white hover:bg-bondhu-green-dark transition-colors"
                >
                  Confirm {mode === 'send' ? 'Transfer' : mode === 'request' ? 'Request' : 'Escrow'}
                </button>
              )}

              <button
                onClick={() => closeSheet('fintech')}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
