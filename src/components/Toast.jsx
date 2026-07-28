import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ toasts = [], onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md font-mono text-xs ${
              toast.type === 'error'
                ? 'bg-slate-950/90 border-cyber-danger/50 text-cyber-danger shadow-[0_0_15px_rgba(255,51,102,0.2)]'
                : 'bg-slate-950/90 border-cyber-safe/50 text-cyber-safe shadow-[0_0_15px_rgba(0,255,136,0.2)]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-cyber-danger" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyber-safe" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
