import React from 'react';

export const InteractiveAiLogo = () => {
  return (
    <div className="interactive-logo-container">
      <svg viewBox="0 0 200 200" className="interactive-logo">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="95" className="base-circle" />
        {/* Symmetrical Brain-like structure */}
        <path
          className="brain-path"
          d="M100 30 C 60 30, 40 70, 40 100 C 40 130, 60 170, 100 170"
        />
        <path
          className="brain-path"
          d="M100 30 C 140 30, 160 70, 160 100 C 160 130, 140 170, 100 170"
        />

        {/* Central Vertical line */}
        <path
          className="brain-path"
          d="M100 30 V 170"
        />

        {/* Horizontal connections */}
        <path className="brain-path" d="M70 60 H 130" />
        <path className="brain-path" d="M60 80 H 140" />
        <path className="brain-path" d="M50 100 H 150" />
        <path className="brain-path" d="M60 120 H 140" />
        <path className="brain-path" d="M70 140 H 130" />

        {/* Nodes */}
        <circle cx="100" cy="30" className="node node-1" />
        <circle cx="100" cy="170" className="node node-2" />

        <circle cx="70" cy="60" className="node node-3" />
        <circle cx="130" cy="60" className="node node-4" />
        <circle cx="60" cy="80" className="node node-5" />
        <circle cx="140" cy="80" className="node node-6" />

        <circle cx="50" cy="100" className="node node-1" />
        <circle cx="150" cy="100" className="node node-2" />

        <circle cx="60" cy="120" className="node node-3" />
        <circle cx="140" cy="120" className="node node-4" />
        <circle cx="70" cy="140" className="node node-5" />
        <circle cx="130" cy="140" className="node node-6" />

      </svg>
    </div>
  );
};
