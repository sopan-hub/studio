
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const InteractiveAiLogo = () => {
  const [isBlasting, setIsBlasting] = useState(false);

  const handleClick = () => {
    if (isBlasting) return; // Prevent re-triggering while animation is running
    setIsBlasting(true);
  };
  
  useEffect(() => {
    if (isBlasting) {
      // The total animation duration is roughly 1.5s, we'll wait 3s to reform.
      const timer = setTimeout(() => {
        setIsBlasting(false);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isBlasting]);

  // Create an array for the circuit pieces to apply staggered animations
  const circuitPieces = [
    { type: 'rect', props: { x: "100", y: "100", width: "200", height: "200", rx: "20" }, className: 'logo-main-chip' },
    { type: 'path', props: { d: "M160 100V60" } },
    { type: 'path', props: { d: "M200 100V40" } },
    { type: 'path', props: { d: "M240 100V60" } },
    { type: 'path', props: { d: "M160 300v40" } },
    { type: 'path', props: { d: "M200 300v60" } },
    { type: 'path', props: { d: "M240 300v40" } },
    { type: 'path', props: { d: "M100 160H60" } },
    { type: 'path', props: { d: "M100 200H40" } },
    { type: 'path', props: { d: "M100 240H60" } },
    { type: 'path', props: { d: "M300 160h40" } },
    { type: 'path', props: { d: "M300 200h60" } },
    { type: 'path', props: { d: "M300 240h40" } },
  ];

  const nodes = [
    { cx: "160", cy: "60" }, { cx: "200", cy: "40" }, { cx: "240", cy: "60" },
    { cx: "160", cy: "340" }, { cx: "200", cy: "360" }, { cx: "240", cy: "340" },
    { cx: "60", cy: "160" }, { cx: "40", cy: "200" }, { cx: "60", cy: "240" },
    { cx: "340", cy: "160" }, { cx: "360", cy: "200" }, { cx: "340", cy: "240" },
  ];


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
        </defs>

        <g className="logo-geometry">
           {/* Inner square */}
          <rect x="120" y="120" width="160" height="160" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="4" className={cn('circuit-path logo-inner-chip', {'blast-piece-center': isBlasting})} style={{animationDelay: '0.2s'}} />

          {/* Render circuit pieces and apply blast animations */}
          {circuitPieces.map((piece, i) => {
            const CustomTag = piece.type as keyof JSX.IntrinsicElements;
            return (
              <CustomTag
                key={i}
                {...piece.props}
                className={cn('circuit-path', piece.className, { 'blast-piece': isBlasting })}
                style={{ '--piece-index': i } as React.CSSProperties}
              />
            );
          })}

          {/* Render nodes and apply blast animations */}
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r="10"
              className={cn('node', `node-${i % 10 + 1}`, { 'blast-piece': isBlasting })}
              style={{ '--piece-index': i + circuitPieces.length } as React.CSSProperties}
            />
          ))}

        </g>
        
        <text x="200" y="215" textAnchor="middle" className={cn("ai-text", {'blast-piece-center': isBlasting})}>AI</text>
      </svg>
    </div>
  );
};
