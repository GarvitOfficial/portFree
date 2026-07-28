import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Cpu, Clock, Layers } from 'lucide-react';
import { formatUptime } from '../utils/formatters';

export function StatsBar({ summary = {}, system = {} }) {
  const { total = 0, safe = 0, caution = 0, danger = 0 } = summary;
  const { uptimeSeconds = 0, cpuLoadPercent = 0, memPercent = 0 } = system;

  // Pulse effect state for value updates
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    setPulsing(true);
    const timeout = setTimeout(() => setPulsing(false), 800);
    return () => clearTimeout(timeout);
  }, [total, safe, caution, danger]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      
      {/* Tile 1: Active Ports */}
      <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl p-4 shadow-card-glow hover:border-cyber-cyan/50 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold text-cyber-muted uppercase tracking-widest">
            ACTIVE PORTS
          </span>
          <div className="p-1.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono text-white transition-all ${pulsing ? 'scale-105 text-cyber-cyan' : ''}`}>
            {total}
          </span>
          <span className="text-xs font-mono text-cyber-muted">LISTENING</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Tile 2: Safe Ports */}
      <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl p-4 shadow-card-glow hover:border-cyber-safe/50 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold text-cyber-muted uppercase tracking-widest">
            SAFE PORTS
          </span>
          <div className="p-1.5 rounded-lg bg-cyber-safe/10 border border-cyber-safe/30 text-cyber-safe">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono text-cyber-safe transition-all ${pulsing ? 'scale-105' : ''}`}>
            {safe}
          </span>
          <span className="text-xs font-mono text-cyber-safe/70 font-medium">VERIFIED</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-safe to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Tile 3: Caution Ports */}
      <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl p-4 shadow-card-glow hover:border-cyber-caution/50 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold text-cyber-muted uppercase tracking-widest">
            CAUTION
          </span>
          <div className="p-1.5 rounded-lg bg-cyber-caution/10 border border-cyber-caution/30 text-cyber-caution">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono text-cyber-caution transition-all ${pulsing ? 'scale-105' : ''}`}>
            {caution}
          </span>
          <span className="text-xs font-mono text-cyber-caution/70">REVIEW</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-caution to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Tile 4: Danger Ports */}
      <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl p-4 shadow-card-glow hover:border-cyber-danger/50 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold text-cyber-muted uppercase tracking-widest">
            DANGER
          </span>
          <div className="p-1.5 rounded-lg bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono text-cyber-danger transition-all ${pulsing ? 'scale-105' : ''}`}>
            {danger}
          </span>
          <span className="text-xs font-mono text-cyber-danger/70">ACTION REQ</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-danger to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Tile 5: System Metrics & Uptime */}
      <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl p-4 shadow-card-glow col-span-2 sm:col-span-1 hover:border-cyber-accent/50 transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-semibold text-cyber-muted uppercase tracking-widest">
            SYS TELEMETRY
          </span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-mono mt-1">
          <span className="text-slate-400">CPU LOAD</span>
          <span className="text-purple-400 font-bold">{cpuLoadPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5 mb-2">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(cpuLoadPercent, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyber-muted" /> UPTIME:
          </span>
          <span className="text-slate-200 font-medium">{formatUptime(uptimeSeconds)}</span>
        </div>
      </div>

    </div>
  );
}
