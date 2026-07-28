import React from 'react';

export function SkeletonLoader({ viewMode = 'grid' }) {
  if (viewMode === 'table') {
    return (
      <div className="bg-cyber-surface/90 border border-cyber-border rounded-xl p-4 shadow-card-glow space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg shimmer-box border border-cyber-border/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-cyber-surface/90 border border-cyber-border/80 rounded-xl p-4.5 space-y-4 shadow-card-glow"
        >
          <div className="flex justify-between items-center">
            <div className="h-7 w-20 rounded shimmer-box" />
            <div className="h-5 w-16 rounded-full shimmer-box" />
          </div>
          <div className="h-12 rounded-lg shimmer-box" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-6 rounded shimmer-box" />
            <div className="h-6 rounded shimmer-box" />
          </div>
          <div className="h-8 rounded-lg shimmer-box" />
        </div>
      ))}
    </div>
  );
}
