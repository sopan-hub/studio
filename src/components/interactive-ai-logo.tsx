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

        {/* Robot Head Shape */}
        <path className="brain-path" d="M 60 40 C 50 40 40 50 40 60 V 140 C 40 150 50 160 60 160 H 140 C 150 160 160 150 160 140 V 60 C 160 50 150 40 140 40 H 60 Z" />

        {/* Eyes */}
        <circle cx="80" cy="90" r="12" className="brain-path" />
        <circle cx="120" cy="90" r="12" className="brain-path" />
        <circle cx="80" cy="90" r="4" className="node node-1" />
        <circle cx="120" cy="90" r="4" className="node node-2" />

        {/* Mouth */}
        <path className="brain-path" d="M80 130 H 120" />

        {/* Antennae */}
        <path className="brain-path" d="M100 40 V 25" />
        <circle cx="100" cy="20" className="node node-3" />
        
        {/* Ear-like details */}
        <path className="brain-path" d="M40 80 H 30" />
        <path className="brain-path" d="M160 80 H 170" />
        <path className="brain-path" d="M40 120 H 30" />
        <path className="brain-path" d="M160 120 H 170" />
        <circle cx="25" cy="80" r="3" className="node node-4" />
        <circle cx="175" cy="80" r="3" className="node node-5" />
        <circle cx="25" cy="120" r="3" className="node node-6" />
        <circle cx="175" cy="120" r="3" className="node node-1" />

        {/* Chin detail */}
        <path className="brain-path" d="M90 160 V 170 H 110 V 160" />

      </svg>
    </div>
  );
};
