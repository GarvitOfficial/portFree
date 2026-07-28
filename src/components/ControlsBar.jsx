import React from 'react';
import { Search, LayoutGrid, Table, SlidersHorizontal, Filter, X } from 'lucide-react';
import { RadarSweep } from './RadarSweep';

export function ControlsBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
  refreshInterval,
  setRefreshInterval,
  isScanning,
  countdown
}) {
  const filterOptions = [
    { id: 'all', label: 'ALL PORTS' },
    { id: 'safe', label: 'SAFE' },
    { id: 'caution', label: 'CAUTION' },
    { id: 'danger', label: 'DANGER' },
    { id: 'dev', label: 'DEV SERVERS' },
    { id: 'db', label: 'DATABASES' }
  ];

  return (
    <div className="bg-cyber-surface/80 border border-cyber-border rounded-xl p-4 mb-6 backdrop-blur-md shadow-card-glow flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      
      {/* Search Input & Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
        
        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by port (:3000), PID, process name..."
            className="w-full bg-slate-900/90 border border-cyber-border rounded-lg pl-9 pr-8 py-2 text-xs font-mono text-white placeholder:text-cyber-muted focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-slate-900/50 border border-transparent text-slate-400 hover:text-slate-200 hover:border-cyber-border'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Auto Refresh & View Controls */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-cyber-border">
        
        {/* Radar Sweep Timer Widget */}
        <RadarSweep isScanning={isScanning} countdown={countdown} />

        {/* Auto Refresh Interval Select */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-cyber-border rounded-lg px-2.5 py-1 text-xs font-mono">
          <span className="text-cyber-muted text-[10px] uppercase">REFRESH:</span>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
          >
            <option value={0} className="bg-slate-900">OFF</option>
            <option value={2} className="bg-slate-900">2s</option>
            <option value={5} className="bg-slate-900">5s</option>
            <option value={10} className="bg-slate-900">10s</option>
          </select>
        </div>

        {/* Grid / Table View Mode Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-cyber-border rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-cyber-surfaceHover text-cyber-cyan shadow-sm border border-cyber-cyan/30'
                : 'text-cyber-muted hover:text-slate-300'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-cyber-surfaceHover text-cyber-cyan shadow-sm border border-cyber-cyan/30'
                : 'text-cyber-muted hover:text-slate-300'
            }`}
            title="Table View"
          >
            <Table className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
