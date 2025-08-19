
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const TILE_SIZE = 25; // px

export const InteractiveGridFooter = () => {
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const activeTimeouts = useRef(new Map<Element, NodeJS.Timeout>());

  useEffect(() => {
    const calculateGridSize = () => {
      if (gridRef.current?.parentElement) {
        const { offsetWidth, offsetHeight } = gridRef.current.parentElement;
        setNumCols(Math.ceil(offsetWidth / TILE_SIZE));
        setNumRows(Math.ceil(offsetHeight / TILE_SIZE));
      }
    };

    calculateGridSize();
    const handle = setTimeout(calculateGridSize, 100);

    window.addEventListener('resize', calculateGridSize);

    return () => {
      clearTimeout(handle);
      window.removeEventListener('resize', calculateGridSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      activeTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    }
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
        if (!gridRef.current) return;
        
        const rect = gridRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);

        const applyGlow = (r: number, c: number) => {
          const index = r * numCols + c;
          if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
            const tile = gridRef.current?.children[index] as HTMLDivElement;
            if (tile) {
              if (activeTimeouts.current.has(tile)) {
                clearTimeout(activeTimeouts.current.get(tile)!);
              }
              tile.classList.add('active');
              const timeoutId = setTimeout(() => {
                tile.classList.remove('active');
                activeTimeouts.current.delete(tile);
              }, 800); 
              activeTimeouts.current.set(tile, timeoutId);
            }
          }
        };
        
        applyGlow(row, col);
    });
  };

  if (numCols === 0 || numRows === 0) {
    return (
        <div ref={gridRef} className="interactive-grid-footer" style={{opacity: 0}}></div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="interactive-grid-footer"
      onMouseMove={handleMouseMove}
      style={{
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
      }}
    >
      {Array.from({ length: numCols * numRows }).map((_, i) => (
        <div key={i} className="grid-tile"></div>
      ))}
    </div>
  );
};
