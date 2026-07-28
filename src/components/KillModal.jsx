import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';
import { formatPort } from '../utils/formatters';

export function KillModal({ portData, onClose, onConfirmKill, isKilling }) {
  const [useForce, setUseForce] = useState(false);

  if (!portData) return null;

  const { port, pid, processName, command } = portData;

  const handleConfirm = () => {
    onConfirmKill(portData, useForce ? 'SIGKILL' : 'SIGTERM');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md glass-modal rounded-2xl p-6 shadow-glow-danger border border-cyber-danger/40 z-10 overflow-hidden"
        >
          {/* Danger Glow Header Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyber-danger shadow-[0_0_15px_#ff3366]" />

          {/* Modal Header */}
          <div className="flex items-start justify-between pb-3 mb-4 border-b border-cyber-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white">
                  CONFIRM PORT TERMINATION
                </h3>
                <p className="text-xs font-mono text-cyber-danger">
                  Target Port: <span className="font-bold text-white">{formatPort(port)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-cyber-muted hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning Content */}
          <div className="space-y-4 mb-6">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyber-border font-mono text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between text-cyber-muted text-[10px]">
                <span>PROCESS:</span>
                <span className="text-cyber-safe font-semibold">{processName}</span>
              </div>
              <div className="flex justify-between text-cyber-muted text-[10px]">
                <span>PROCESS ID (PID):</span>
                <span className="text-white font-semibold">{pid}</span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 truncate" title={command}>
                Cmd: {command || processName}
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Are you sure you want to terminate <strong className="text-white">{processName}</strong> (PID {pid})? This will immediately free port <strong className="text-cyber-safe">{formatPort(port)}</strong>.
            </p>

            {/* SIGKILL Force Toggle */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-cyber-border cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useForce}
                onChange={(e) => setUseForce(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-slate-950 text-cyber-danger focus:ring-cyber-danger cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300">
                Force kill process (<span className="text-cyber-danger font-semibold">SIGKILL -9</span>)
              </span>
            </label>
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyber-border">
            <button
              onClick={onClose}
              disabled={isKilling}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyber-border text-slate-300 text-xs font-mono font-medium transition-all active:scale-95 disabled:opacity-50"
            >
              CANCEL
            </button>

            <button
              onClick={handleConfirm}
              disabled={isKilling}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyber-danger hover:bg-rose-600 text-black font-mono font-bold text-xs transition-all shadow-glow-danger active:scale-95 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isKilling ? 'KILLING...' : 'TERMINATE NOW'}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
