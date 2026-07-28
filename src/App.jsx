import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ControlsBar } from './components/ControlsBar';
import { QuickActions } from './components/QuickActions';
import { PortGrid } from './components/PortGrid';
import { PortTable } from './components/PortTable';
import { InspectModal } from './components/InspectModal';
import { KillModal } from './components/KillModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { Toast } from './components/Toast';
import { ShieldAlert, RefreshCw, Terminal, SearchX } from 'lucide-react';

export function App() {
  // Telemetry Data State
  const [ports, setPorts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, safe: 0, caution: 0, danger: 0 });
  const [system, setSystem] = useState({ uptimeSeconds: 0, cpuLoadPercent: 0, memPercent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Auto Refresh & Scanner State
  const [refreshInterval, setRefreshInterval] = useState(5); // 5s default
  const [countdown, setCountdown] = useState(5);
  const [isScanning, setIsScanning] = useState(false);

  // Modal & Interactivity State
  const [inspectingPort, setInspectingPort] = useState(null);
  const [killingPort, setKillingPort] = useState(null);
  const [isKilling, setIsKilling] = useState(false);

  // Pinned Ports State (Persisted in localStorage)
  const [pinnedPorts, setPinnedPorts] = useState(() => {
    try {
      const saved = localStorage.getItem('portfree_pinned');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePinPort = (portNum) => {
    setPinnedPorts((prev) => {
      const next = new Set(prev);
      if (next.has(portNum)) {
        next.delete(portNum);
      } else {
        next.add(portNum);
      }
      localStorage.setItem('portfree_pinned', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Main Telemetry Fetch Function
  const fetchTelemetry = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setIsScanning(true);

    try {
      const [portsRes, sysRes] = await Promise.all([
        fetch('/api/ports'),
        fetch('/api/system')
      ]);

      if (portsRes.ok && sysRes.ok) {
        const portsData = await portsRes.json();
        const sysData = await sysRes.json();

        if (portsData.success) {
          setPorts(portsData.ports || []);
          setSummary(portsData.summary || { total: 0, safe: 0, caution: 0, danger: 0 });
        }

        if (sysData.success) {
          setSystem(sysData.system || {});
        }

        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (err) {
      console.error('Failed to fetch port telemetry:', err);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsScanning(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Auto-refresh Timer Loop
  useEffect(() => {
    if (refreshInterval === 0) return;

    setCountdown(refreshInterval);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchTelemetry();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchTelemetry]);

  // Handle Process Kill Action
  const handleKillConfirm = async (portData, signal = 'SIGTERM') => {
    setIsKilling(true);
    try {
      const res = await fetch('/api/kill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid: portData.pid, port: portData.port, signal })
      });

      const data = await res.json();
      if (data.success) {
        addToast(`Process PID ${portData.pid} terminated! Port :${portData.port} freed.`, 'success');
        setKillingPort(null);
        fetchTelemetry(true);
      } else {
        addToast(data.error || 'Failed to kill process', 'error');
      }
    } catch (err) {
      addToast(`Error killing process: ${err.message}`, 'error');
    } finally {
      setIsKilling(false);
    }
  };

  // Filter & Search Logic
  const filteredPorts = ports.filter((item) => {
    // Search query matching
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchPort = item.port.toString().includes(query.replace(':', ''));
      const matchPid = item.pid.toString().includes(query);
      const matchName = (item.processName || '').toLowerCase().includes(query);
      const matchCmd = (item.command || '').toLowerCase().includes(query);
      if (!matchPort && !matchPid && !matchName && !matchCmd) return false;
    }

    // Status / Category Filter
    if (activeFilter === 'safe') return item.status === 'safe';
    if (activeFilter === 'caution') return item.status === 'caution';
    if (activeFilter === 'danger') return item.status === 'danger';
    if (activeFilter === 'dev') return item.category === 'Dev Server' || [3000, 5173, 8080, 4000, 8000].includes(item.port);
    if (activeFilter === 'db') return item.category === 'Database' || [5432, 6379, 27017, 3306].includes(item.port);

    return true;
  });

  // Sort pinned ports first
  const sortedPorts = [...filteredPorts].sort((a, b) => {
    const aPin = pinnedPorts.has(a.port) ? 1 : 0;
    const bPin = pinnedPorts.has(b.port) ? 1 : 0;
    if (aPin !== bPin) return bPin - aPin;
    return a.port - b.port;
  });

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text font-sans">
      
      {/* Top Fixed Control Panel Header */}
      <Header
        isOnline={isOnline}
        onManualRefresh={() => fetchTelemetry(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Top Glanceable Metric Cards */}
        <StatsBar summary={summary} system={system} />

        {/* Controls, Filters & Radar Scanner */}
        <ControlsBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          isScanning={isScanning}
          countdown={countdown}
        />

        {/* Quick Emergency Presets */}
        <QuickActions
          ports={ports}
          onKillPort={(p) => setKillingPort(p)}
        />

        {/* Main Content Area: Shimmer Skeleton vs Active Grid/Table */}
        {isLoading ? (
          <SkeletonLoader viewMode={viewMode} />
        ) : sortedPorts.length === 0 ? (
          /* Empty State */
          <div className="bg-cyber-surface/60 border border-cyber-border rounded-xl p-12 text-center my-8 shadow-card-glow flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-slate-900 border border-cyber-border mb-4">
              <SearchX className="w-8 h-8 text-cyber-muted" />
            </div>
            <h3 className="text-lg font-mono font-bold text-white mb-1">
              NO ACTIVE PORTS MATCHED
            </h3>
            <p className="text-xs font-sans text-cyber-muted max-w-md mb-4">
              No listening network ports found matching search query <code className="text-cyber-cyan">"{searchQuery}"</code> or current filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 rounded-lg bg-cyber-surfaceHover border border-cyber-border text-xs font-mono text-cyber-safe hover:bg-slate-800 transition-all"
            >
              CLEAR SEARCH & FILTERS
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <PortGrid
            ports={sortedPorts}
            onInspect={(p) => setInspectingPort(p)}
            onKill={(p) => setKillingPort(p)}
            pinnedPorts={pinnedPorts}
            onTogglePin={togglePinPort}
          />
        ) : (
          <PortTable
            ports={sortedPorts}
            onInspect={(p) => setInspectingPort(p)}
            onKill={(p) => setKillingPort(p)}
            pinnedPorts={pinnedPorts}
            onTogglePin={togglePinPort}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border/60 py-4 px-4 text-center text-xs font-mono text-cyber-muted bg-cyber-surface/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>portFree Control Panel v1.0 — Local Port Telemetry & Process Protection</span>
          <span className="text-[11px] text-slate-500">Cross-Platform (macOS / Linux / Windows)</span>
        </div>
      </footer>

      {/* Modals & Toasts */}
      {inspectingPort && (
        <InspectModal
          portData={inspectingPort}
          onClose={() => setInspectingPort(null)}
          onKill={(p) => setKillingPort(p)}
        />
      )}

      {killingPort && (
        <KillModal
          portData={killingPort}
          onClose={() => setKillingPort(null)}
          onConfirmKill={handleKillConfirm}
          isKilling={isKilling}
        />
      )}

      <Toast toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
