
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const InteractiveAiLogo = () => {
  const [blasting, setBlasting] = useState(false);

  const handleClick = () => {
    if (blasting) return;
    setBlasting(true);
  };

  useEffect(() => {
    if (!blasting) return;

    // Set random CSS variables for each element to use in the animation
    document.querySelectorAll('.interactive-logo.blasting .circuit-path, .interactive-logo.blasting .node, .interactive-logo.blasting .ai-text').forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty('--randX', `${(Math.random() - 0.5) * 2}`);
        htmlEl.style.setProperty('--randY', `${(Math.random() - 0.5) * 2}`);
        htmlEl.style.setProperty('--randR', `${(Math.random() - 0.5) * 2}`);
    });


    const timer = setTimeout(() => {
      setBlasting(false);
    }, 3000); // Duration of the blast animation

    return () => clearTimeout(timer);
  }, [blasting]);

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
    <div className="interactive-logo-container">
      <svg viewBox="0 0 400 400" className={cn("interactive-logo", blasting && 'blasting')} onClick={handleClick}>
        <g className="logo-geometry">
           {/* Inner square */}
          <rect x="120" y="120" width="160" height="160" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="4" className={'circuit-path logo-inner-chip'} />

          {/* Render circuit pieces */}
          {circuitPieces.map((piece, i) => {
            const CustomTag = piece.type as keyof JSX.IntrinsicElements;
            return (
              <CustomTag
                key={i}
                {...piece.props}
                className={cn('circuit-path', piece.className)}
              />
            );
          })}

          {/* Render nodes */}
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r="10"
              className={cn('node', `node-${i % 3 + 1}`)}
            />
          ))}

        </g>
        
        <text x="200" y="215" textAnchor="middle" className={"ai-text"}>AI</text>
      </svg>
    </div>
  );
};
