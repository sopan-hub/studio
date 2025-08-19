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

        {/* Robot Head */}
        <path className="brain-path" d="M 60,90 A 40,40 0 0,1 140,90 V 150 H 60 Z" />

        {/* Eyes */}
        <circle cx="85" cy="115" r="8" className="brain-path" />
        <circle cx="115" cy="115" r="8" className="brain-path" />
        <circle cx="85" cy="115" r="3" className="node node-1" />
        <circle cx="115" cy="115" r="3" className="node node-2" />

        {/* Graduation Cap */}
        {/* Cap Top */}
        <path className="brain-path" d="M 50 80 L 100 60 L 150 80 L 100 100 Z" />
        {/* Cap Base */}
        <path className="brain-path" d="M 60 90 Q 100 110 140 90" />

        {/* Tassel */}
        <path className="brain-path" d="M100,60 V 85" />
        <path className="brain-path" d="M100,85 L 115 80" />
        <circle cx="100" cy="60" r="4" className="node node-3" />
        <circle cx="115" cy="80" r="4" className="node node-4" />

         {/* Lightbulb for 'idea' */}
        <g transform="translate(90, 30)">
          <path className="brain-path" d="M10 18 A 6 6 0 1 1 10 6 A 4 4 0 0 1 10 18 Z" />
          <path className="brain-path" d="M10 18 L 10 22" />
          <path className="brain-path" d="M 7 22 H 13" />
          <circle cx="10" cy="12" r="2" className="node node-5" />
        </g>
      </svg>
    </div>
  );
};
