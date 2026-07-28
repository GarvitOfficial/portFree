import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Activity, Wifi, RefreshCw } from 'lucide-react';

export function Header({ isOnline = true, onManualRefresh, isRefreshing }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-cyber-border/80 bg-cyber-surface/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-slate-900/90 border border-cyber-safe/30 shadow-[0_0_15px_rgba(0,255,136,0.15)] group">
            <Terminal className="w-6 h-6 text-cyber-safe transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-safe opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-safe"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-1.5">
                port<span className="text-cyber-safe font-black">Free</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-safe/10 border border-cyber-safe/30 text-cyber-safe font-semibold tracking-wider uppercase">
                v1.0
              </span>
            </div>
            <p className="text-xs text-cyber-muted font-sans">
              Dev-Ops Port & Process Control Panel
            </p>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="flex items-center gap-4">
          {/* Live Online Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-cyber-border text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-cyber-safe shadow-[0_0_8px_#00ff88]' : 'bg-cyber-danger'}`} />
            <span className="text-slate-300 uppercase tracking-wide text-[11px]">
              {isOnline ? 'SYS_ONLINE' : 'SYS_DISCONNECTED'}
            </span>
          </div>

          {/* Live System Time */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-cyber-border text-xs font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-cyber-cyan font-bold">{timeStr}</span>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyber-surfaceHover hover:bg-cyber-border border border-cyber-border text-slate-200 text-xs font-mono font-medium transition-all active:scale-95 disabled:opacity-50 hover:shadow-glow-cyan"
            title="Refresh open port telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyber-cyan ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'SCANNING...' : 'SCAN NOW'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
