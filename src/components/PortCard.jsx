import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldAlert, Cpu, HardDrive, Terminal, Trash2, Eye, Pin } from 'lucide-react';
import { getProcessIcon } from '../utils/iconMap';
import { formatPort, formatCommand, formatMemory } from '../utils/formatters';

export function PortCard({ portData, onInspect, onKill, isPinned, onTogglePin }) {
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
    protocol
  } = portData;

  // Status Styling Configuration
  const statusStyles = {
    safe: {
      borderGlow: 'glow-border-safe',
      cardHover: 'glow-card-safe',
      badgeBg: 'bg-cyber-safe/10 border-cyber-safe/40 text-cyber-safe',
      portColor: 'text-cyber-safe',
      glowShadow: 'shadow-[0_0_15px_rgba(0,255,136,0.1)]',
      badgeIcon: <ShieldCheck className="w-3 h-3" />
    },
    caution: {
      borderGlow: 'glow-border-caution',
      cardHover: 'glow-card-caution',
      badgeBg: 'bg-cyber-caution/10 border-cyber-caution/40 text-cyber-caution',
      portColor: 'text-cyber-caution',
      glowShadow: 'shadow-[0_0_15px_rgba(255,170,0,0.1)]',
      badgeIcon: <AlertTriangle className="w-3 h-3" />
    },
    danger: {
      borderGlow: 'glow-border-danger',
      cardHover: 'glow-card-danger',
      badgeBg: 'bg-cyber-danger/10 border-cyber-danger/40 text-cyber-danger',
      portColor: 'text-cyber-danger',
      glowShadow: 'shadow-[0_0_15px_rgba(255,51,102,0.1)]',
      badgeIcon: <ShieldAlert className="w-3 h-3" />
    }
  };

  const style = statusStyles[status] || statusStyles.safe;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`bg-cyber-surface/90 border border-cyber-border rounded-xl p-4.5 transition-all duration-300 relative group flex flex-col justify-between ${style.borderGlow} ${style.cardHover} ${style.glowShadow}`}
    >
      {/* Top Bar: Monospace Port Number & Category Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className={`text-2xl font-bold font-mono tracking-tight ${style.portColor}`}>
              {formatPort(port)}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyber-border text-slate-400 uppercase">
              {protocol}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pin Button */}
            <button
              onClick={() => onTogglePin(port)}
              className={`p-1 rounded transition-colors ${
                isPinned ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-cyber-muted opacity-0 group-hover:opacity-100 hover:text-slate-200'
              }`}
              title={isPinned ? 'Unpin Port' : 'Pin Port to Top'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>

            {/* Status Badge */}
            <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${style.badgeBg} uppercase tracking-wider`}>
              {style.badgeIcon}
              <span>{status}</span>
            </div>
          </div>
        </div>

        {/* Process Info Header */}
        <div className="flex items-center gap-2.5 mb-3 p-2.5 rounded-lg bg-slate-900/80 border border-cyber-border/60">
          {getProcessIcon(processName)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold font-mono text-white truncate" title={processName}>
                {processName}
              </h4>
              <span className="text-[10px] font-mono text-cyber-muted px-1.5 py-0.5 bg-slate-800 rounded">
                PID: {pid}
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyber-muted truncate mt-0.5" title={command}>
              {formatCommand(command, 35)}
            </p>
          </div>
        </div>

        {/* System Resource Usage & Address Pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4">
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-900/50 border border-cyber-border/40 text-slate-300">
            <Cpu className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="text-cyber-muted">CPU:</span>
            <span className="font-semibold text-slate-200">{cpu}%</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-900/50 border border-cyber-border/40 text-slate-300">
            <HardDrive className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="text-cyber-muted">RAM:</span>
            <span className="font-semibold text-slate-200">{formatMemory(memoryMB)}</span>
          </div>
        </div>

        {/* Reasoning Note */}
        <div className="text-[10px] font-sans text-slate-400 mb-4 flex items-center gap-1.5 bg-slate-950/60 p-2 rounded border border-cyber-border/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shrink-0" />
          <span className="truncate">{reasoning}</span>
        </div>
      </div>

      {/* Action Buttons: INSPECT & FREE PORT */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyber-border/60">
        <button
          onClick={() => onInspect(portData)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surfaceHover hover:bg-slate-800 border border-cyber-border text-slate-200 text-xs font-mono font-medium transition-all active:scale-95 hover:text-cyber-cyan"
        >
          <Eye className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>INSPECT</span>
        </button>

        <button
          onClick={() => onKill(portData)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-danger/10 hover:bg-cyber-danger/25 border border-cyber-danger/40 text-cyber-danger text-xs font-mono font-bold transition-all active:scale-95 shadow-sm hover:shadow-[0_0_12px_rgba(255,51,102,0.3)]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>FREE PORT</span>
        </button>
      </div>

    </motion.div>
  );
}
