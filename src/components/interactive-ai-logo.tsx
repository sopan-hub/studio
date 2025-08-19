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
        
        {/* Central Brain/Chip */}
        <path className="brain-path" d="M90 90h20v20H90z" />
        <circle cx="100" cy="100" r="5" className="node node-1" />

        {/* Pathways */}
        <path className="brain-path" d="M100 90V70" />
        <path className="brain-path" d="M100 110v20" />
        <path className="brain-path" d="M90 100H70" />
        <path className="brain-path" d="M110 100h20" />

        <path className="brain-path" d="M90 90L75 75" />
        <path className="brain-path" d="M110 90l15-15" />
        <path className="brain-path" d="M90 110L75 125" />
        <path className="brain-path" d="M110 110l15 15" />

        {/* Outer Nodes */}
        <circle cx="100" cy="70" r="3" className="node node-2" />
        <circle cx="100" cy="130" r="3" className="node node-3" />
        <circle cx="70" cy="100" r="3" className="node node-4" />
        <circle cx="130" cy="100" r="3" className="node node-5" />

        <circle cx="75" cy="75" r="3" className="node node-6" />
        <circle cx="125" cy="75" r="3" className="node node-2" />
        <circle cx="75" cy="125" r="3" className="node node-3" />
        <circle cx="125" cy="125" r="3" className="node node-4" />
      </svg>
    </div>
  );
};
