import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Terminal, Cpu, HardDrive, ShieldCheck, AlertTriangle, ShieldAlert, Trash2, Globe, User, Clock } from 'lucide-react';
import { getProcessIcon } from '../utils/iconMap';
import { formatPort, formatMemory } from '../utils/formatters';

export function InspectModal({ portData, onClose, onKill }) {
  const [copied, setCopied] = useState(false);

  if (!portData) return null;

  const {
    port,
    pid,
    processName,
    command,
    user,
    cpu,
    memoryMB,
    status,
    category,
    reasoning,
    address,
    protocol,
    startedAt
  } = portData;

  const handleCopy = () => {
    navigator.clipboard.writeText(command || processName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusIcons = {
    safe: <ShieldCheck className="w-5 h-5 text-cyber-safe" />,
    caution: <AlertTriangle className="w-5 h-5 text-cyber-caution" />,
    danger: <ShieldAlert className="w-5 h-5 text-cyber-danger" />
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Glass Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl glass-modal rounded-2xl p-6 shadow-2xl border border-cyber-border z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-cyber-border/80">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-cyber-border">
                {getProcessIcon(processName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-mono text-white">
                    {formatPort(port)}
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyber-safe px-2 py-0.5 rounded bg-cyber-safe/10 border border-cyber-safe/30">
                    {processName}
                  </span>
                </div>
                <p className="text-xs font-mono text-cyber-muted mt-0.5">
                  Process ID (PID): <span className="text-white font-semibold">{pid}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyber-border text-cyber-muted hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telemetry Body */}
          <div className="py-5 space-y-4">
            
            {/* Command Line String */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-cyber-muted font-semibold">
                  FULL COMMAND STRING
                </label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyber-cyan hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-cyber-border font-mono text-xs text-emerald-400 break-all select-all shadow-inner">
                {command || processName}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyber-border/60">
                <span className="text-[10px] text-cyber-muted uppercase block mb-1">CPU LOAD</span>
                <span className="text-base font-bold text-purple-400">{cpu}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyber-border/60">
                <span className="text-[10px] text-cyber-muted uppercase block mb-1">RAM USAGE</span>
                <span className="text-base font-bold text-cyan-400">{formatMemory(memoryMB)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyber-border/60">
                <span className="text-[10px] text-cyber-muted uppercase block mb-1">PROTOCOL</span>
                <span className="text-base font-bold text-slate-200">{protocol}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyber-border/60">
                <span className="text-[10px] text-cyber-muted uppercase block mb-1">BOUND IP</span>
                <span className="text-xs font-bold text-slate-200 truncate block">{address}</span>
              </div>
            </div>

            {/* Security Assessment Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyber-border flex items-start gap-3">
              {statusIcons[status] || statusIcons.safe}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    SECURITY STATUS: <span className="text-cyber-safe">{status}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {category}
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-300 mt-1">
                  {reasoning}
                </p>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-cyber-border/80 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyber-border text-slate-300 text-xs font-mono transition-all"
            >
              CLOSE
            </button>

            <button
              onClick={() => {
                onClose();
                onKill(portData);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-danger text-black font-mono font-bold text-xs hover:bg-rose-500 transition-all shadow-glow-danger"
            >
              <Trash2 className="w-4 h-4" />
              <span>FREE PORT (KILL PID {pid})</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
