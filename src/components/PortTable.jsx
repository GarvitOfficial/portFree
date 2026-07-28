import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Trash2, ShieldCheck, AlertTriangle, ShieldAlert, Pin } from 'lucide-react';
import { getProcessIcon } from '../utils/iconMap';
import { formatPort, formatMemory, formatCommand } from '../utils/formatters';

export function PortTable({ ports = [], onInspect, onKill, pinnedPorts = new Set(), onTogglePin }) {
  const statusStyles = {
    safe: 'text-cyber-safe bg-cyber-safe/10 border-cyber-safe/30',
    caution: 'text-cyber-caution bg-cyber-caution/10 border-cyber-caution/30',
    danger: 'text-cyber-danger bg-cyber-danger/10 border-cyber-danger/30'
  };

  return (
    <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl overflow-hidden shadow-card-glow">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          
          {/* Table Header */}
          <thead className="bg-slate-900/90 border-b border-cyber-border text-cyber-muted uppercase text-[10px] tracking-wider select-none">
            <tr>
              <th className="py-3 px-4 w-8"></th>
              <th className="py-3 px-4">PORT</th>
              <th className="py-3 px-4">PROCESS</th>
              <th className="py-3 px-4">PID</th>
              <th className="py-3 px-4">ADDRESS</th>
              <th className="py-3 px-4">CPU</th>
              <th className="py-3 px-4">RAM</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-cyber-border/40">
            <AnimatePresence>
              {ports.map((item) => {
                const isPinned = pinnedPorts.has(item.port);
                const badgeClass = statusStyles[item.status] || statusStyles.safe;

                return (
                  <motion.tr
                    key={`${item.port}-${item.pid}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-900/80 transition-colors group"
                  >
                    {/* Pin button */}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => onTogglePin(item.port)}
                        className={`p-1 rounded transition-colors ${
                          isPinned ? 'text-cyber-cyan' : 'text-cyber-muted opacity-0 group-hover:opacity-100 hover:text-white'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Monospace Port */}
                    <td className="py-3 px-4 font-bold text-sm text-cyber-safe font-mono">
                      {formatPort(item.port)}
                    </td>

                    {/* Process Name & Icon */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getProcessIcon(item.processName)}
                        <span className="font-semibold text-white truncate max-w-[140px]" title={item.processName}>
                          {item.processName}
                        </span>
                      </div>
                    </td>

                    {/* PID */}
                    <td className="py-3 px-4 text-slate-300">
                      {item.pid}
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {item.address}:{item.port}
                    </td>

                    {/* CPU */}
                    <td className="py-3 px-4 text-purple-400 font-semibold">
                      {item.cpu}%
                    </td>

                    {/* Memory */}
                    <td className="py-3 px-4 text-cyan-400 font-semibold">
                      {formatMemory(item.memoryMB)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeClass}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onInspect(item)}
                          className="p-1.5 rounded-lg bg-cyber-surfaceHover hover:bg-slate-800 border border-cyber-border text-slate-300 hover:text-cyber-cyan transition-all"
                          title="Inspect process telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onKill(item)}
                          className="p-1.5 rounded-lg bg-cyber-danger/10 hover:bg-cyber-danger/20 border border-cyber-danger/40 text-cyber-danger transition-all hover:shadow-[0_0_8px_rgba(255,51,102,0.3)]"
                          title="Free Port (Kill Process)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>

        </table>
      </div>
    </div>
  );
}
