import React from 'react';
import { Zap, Terminal, Code2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function QuickActions({ ports = [], onKillPort }) {
  // Find node processes
  const nodePorts = ports.filter(p => (p.processName || '').toLowerCase().includes('node'));
  const devPorts = ports.filter(p => [3000, 5173, 8080, 4000, 8000].includes(p.port));

  return (
    <div className="bg-cyber-surface/60 border border-cyber-border rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-cyber-safe animate-pulse" />
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          QUICK DEV SHORTCUTS & EMERGENCY PRESETS
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5">
        
        {/* Preset 1: Kill Node Processes */}
        <button
          onClick={() => {
            if (nodePorts.length === 0) return;
            nodePorts.forEach(p => onKillPort(p));
          }}
          disabled={nodePorts.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyber-border hover:border-cyber-safe text-slate-200 text-xs font-mono transition-all disabled:opacity-40 disabled:hover:border-cyber-border active:scale-95"
        >
          <Terminal className="w-3.5 h-3.5 text-cyber-safe" />
          <span>FREE NODE.JS PROCESSES ({nodePorts.length})</span>
        </button>

        {/* Preset 2: Release Dev Servers (3000, 5173, 8080) */}
        <button
          onClick={() => {
            if (devPorts.length === 0) return;
            devPorts.forEach(p => onKillPort(p));
          }}
          disabled={devPorts.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyber-border hover:border-cyber-cyan text-slate-200 text-xs font-mono transition-all disabled:opacity-40 disabled:hover:border-cyber-border active:scale-95"
        >
          <Code2 className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>RELEASE DEV SERVERS ({devPorts.length})</span>
        </button>

        {/* Preset 3: System Status Clean Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-safe/10 border border-cyber-safe/30 text-cyber-safe text-xs font-mono ml-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PORT PROTECTION ACTIVE</span>
        </div>

      </div>
    </div>
  );
}
