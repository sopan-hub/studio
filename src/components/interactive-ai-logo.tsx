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
        <path
          className="brain-path"
          d="M100 20 C 70 20, 50 40, 50 70 S 70 120, 100 120 S 130 100, 150 70 S 130 20, 100 20"
        />
        <path
          className="brain-path"
          d="M100 120 Q 80 140, 70 160 T 60 180"
        />
         <path
          className="brain-path"
          d="M100 120 Q 120 140, 130 160 T 140 180"
        />
        <path
          className="brain-path"
          d="M75 50 C 65 60, 65 80, 75 90"
        />
        <path
          className="brain-path"
          d="M125 50 C 135 60, 135 80, 125 90"
        />
         <path
          className="brain-path"
          d="M90 70 L 110 70"
        />

        <circle cx="100" cy="20" className="node node-1" />
        <circle cx="50" cy="70" className="node node-2" />
        <circle cx="150" cy="70" className="node node-3" />
        <circle cx="100" cy="120" className="node node-4" />
        <circle cx="60" cy="180" className="node node-5" />
        <circle cx="140" cy="180" className="node node-6" />
        <circle cx="75" cy="50" className="node node-1" />
        <circle cx="75" cy="90" className="node node-2" />
        <circle cx="125" cy="50" className="node node-3" />
        <circle cx="125" cy="90" className="node node-4" />

      </svg>
    </div>
  );
};
