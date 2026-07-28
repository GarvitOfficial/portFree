import React from 'react';
import {
  Server,
  Database,
  Terminal,
  Cpu,
  Globe,
  Box,
  Layers,
  Code2,
  HardDrive
} from 'lucide-react';

/**
 * Custom SVG icons and Lucide mapping for process icons
 */
export function getProcessIcon(processName = '') {
  const name = processName.toLowerCase();

  // Node.js Icon
  if (name.includes('node') || name.includes('npm') || name.includes('npx')) {
    return (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    );
  }

  // Python Icon
  if (name.includes('python') || name.includes('pytest') || name.includes('django') || name.includes('flask')) {
    return (
      <svg className="w-5 h-5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2c-4 0-4 2-4 4v2h8V6c0-2 0-4-4-4zM6 8v4c0 2 2 4 4 4h2v-2h-2c-1 0-2-1-2-2V8H6z" />
        <path d="M18 16v-4c0-2-2-4-4-4h-2v2h2c1 0 2 1 2 2v4h4zM12 22c4 0 4-2 4-4v-2H8v2c0 2 0 4 4 4z" />
      </svg>
    );
  }

  // Docker Icon
  if (name.includes('docker') || name.includes('containerd')) {
    return <Box className="w-5 h-5 text-cyan-400 shrink-0" />;
  }

  // Postgres / MySQL / Redis / Database Icon
  if (name.includes('postgres') || name.includes('pg') || name.includes('mysql') || name.includes('redis') || name.includes('mongo')) {
    return <Database className="w-5 h-5 text-purple-400 shrink-0" />;
  }

  // Vite / Next.js / React / Front-End
  if (name.includes('vite') || name.includes('next') || name.includes('react') || name.includes('webpack')) {
    return <Code2 className="w-5 h-5 text-yellow-400 shrink-0" />;
  }

  // Java Icon
  if (name.includes('java') || name.includes('spring')) {
    return <Server className="w-5 h-5 text-orange-400 shrink-0" />;
  }

  // Go / Rust
  if (name.includes('go') || name.includes('rust') || name.includes('cargo')) {
    return <Cpu className="w-5 h-5 text-blue-400 shrink-0" />;
  }

  // System Services (macOS/Linux)
  if (name.includes('controlcenter') || name.includes('rapportd') || name.includes('airplay') || name.includes('system')) {
    return <HardDrive className="w-5 h-5 text-slate-400 shrink-0" />;
  }

  // Default Terminal / Gear
  return <Terminal className="w-5 h-5 text-slate-400 shrink-0" />;
}
