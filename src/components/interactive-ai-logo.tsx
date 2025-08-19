
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const InteractiveAiLogo = () => {
  const [isBlasting, setIsBlasting] = useState(false);

  const handleClick = () => {
    setIsBlasting(true);
  };
  
  useEffect(() => {
    if (isBlasting) {
      const timer = setTimeout(() => {
        setIsBlasting(false);
      }, 500); // Must match the animation duration
      return () => clearTimeout(timer);
    }
  }, [isBlasting]);

  return (
    <div className="interactive-logo-container" onClick={handleClick}>
      <svg viewBox="0 0 400 400" className={cn("interactive-logo", { "blasting": isBlasting })}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g className="logo-geometry">
          {/* Main Chip */}
          <rect x="100" y="100" width="200" height="200" rx="20" className="circuit-path" style={{animationDelay: '0s'}} />
          <rect x="120" y="120" width="160" height="160" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="4" className="circuit-path" style={{animationDelay: '0.2s'}} />
          
          {/* Circuit Lines */}
          {/* Top */}
          <path d="M160 100V60" className="circuit-path" style={{animationDelay: '0.4s'}}/>
          <path d="M200 100V40" className="circuit-path" style={{animationDelay: '0.5s'}}/>
          <path d="M240 100V60" className="circuit-path" style={{animationDelay: '0.6s'}}/>
          <circle cx="160" cy="60" r="10" className="node node-1" />
          <circle cx="200" cy="40" r="10" className="node node-2" />
          <circle cx="240" cy="60" r="10" className="node node-3" />

          {/* Bottom */}
          <path d="M160 300v40" className="circuit-path" style={{animationDelay: '0.4s'}}/>
          <path d="M200 300v60" className="circuit-path" style={{animationDelay: '0.5s'}}/>
          <path d="M240 300v40" className="circuit-path" style={{animationDelay: '0.6s'}}/>
          <circle cx="160" cy="340" r="10" className="node node-4" />
          <circle cx="200" cy="360" r="10" className="node node-5" />
          <circle cx="240" cy="340" r="10" className="node node-6" />

          {/* Left */}
          <path d="M100 160H60" className="circuit-path" style={{animationDelay: '0.7s'}}/>
          <path d="M100 200H40" className="circuit-path" style={{animationDelay: '0.8s'}}/>
          <path d="M100 240H60" className="circuit-path" style={{animationDelay: '0.9s'}}/>
          <circle cx="60" cy="160" r="10" className="node node-7" />
          <circle cx="40" cy="200" r="10" className="node node-8" />
          <circle cx="60" cy="240" r="10" className="node node-9" />

          {/* Right */}
          <path d="M300 160h40" className="circuit-path" style={{animationDelay: '0.7s'}}/>
          <path d="M300 200h60" className="circuit-path" style={{animationDelay: '0.8s'}}/>
          <path d="M300 240h40" className="circuit-path" style={{animationDelay: '0.9s'}}/>
          <circle cx="340" cy="160" r="10" className="node node-10" />
          <circle cx="360" cy="200" r="10" className="node node-1" />
          <circle cx="340" cy="240" r="10" className="node node-2" />
        </g>
        
        <text x="200" y="215" textAnchor="middle" className="ai-text">AI</text>
      </svg>
    </div>
  );
};
