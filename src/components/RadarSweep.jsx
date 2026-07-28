import React from 'react';

export function RadarSweep({ isScanning = false, countdown = 0 }) {
  return (
    <div className="flex items-center gap-2.5 bg-cyber-surface/90 border border-cyber-border rounded-lg px-3 py-1.5 shadow-inner select-none">
      {/* Animated Radar Circle */}
      <div className="relative w-5 h-5 rounded-full bg-slate-900 border border-cyber-safe/40 flex items-center justify-center overflow-hidden shrink-0">
        {/* Crosshair lines */}
        <div className="absolute inset-0 border-t border-b border-cyber-border opacity-30" />
        <div className="absolute inset-0 border-l border-r border-cyber-border opacity-30" />
        
        {/* Radar Sweep Arc */}
        <div className="absolute inset-0 rounded-full animate-radar-sweep origin-center" style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 255, 136, 0.4) 360deg)'
        }} />
        
        {/* Center Pulsing Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-safe animate-pulse shadow-[0_0_8px_#00ff88]" />
      </div>

      {/* Label & Countdown */}
      <div className="flex items-center gap-1.5 text-xs font-mono">
        <span className="text-cyber-muted uppercase tracking-wider text-[10px]">RADAR:</span>
        {isScanning ? (
          <span className="text-cyber-safe font-semibold animate-pulse">SCANNING...</span>
        ) : (
          <span className="text-slate-300 font-medium">AUTO SCAN <span className="text-cyber-cyan">{countdown}s</span></span>
        )}
      </div>
    </div>
  );
}
