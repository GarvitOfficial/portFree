import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { PortCard } from './PortCard';

export function PortGrid({ ports = [], onInspect, onKill, pinnedPorts = new Set(), onTogglePin }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {ports.map((portData) => (
          <PortCard
            key={`${portData.port}-${portData.pid}`}
            portData={portData}
            onInspect={onInspect}
            onKill={onKill}
            isPinned={pinnedPorts.has(portData.port)}
            onTogglePin={onTogglePin}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
