'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: { id: string; message: string; type: 'success' | 'error' | 'info' }; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border bg-card text-sm font-medium"
    >
      {toast.type === 'success' ? (
        <CheckCircle className="w-4 h-4 text-bondhu-green" />
      ) : toast.type === 'info' ? (
        <Info className="w-4 h-4 text-blue-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-destructive" />
      )}
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-1 p-0.5 hover:bg-muted rounded-full">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
