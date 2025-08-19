
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TILE_SIZE = 20; // px

export const InteractiveGridFooter = () => {
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);

  useEffect(() => {
    const calculateGridSize = () => {
      const { innerWidth, innerHeight } = window;
      // We only need a few rows for the footer area
      const footerHeight = 200; // Approximate height of the footer
      setNumCols(Math.ceil(innerWidth / TILE_SIZE));
      setNumRows(Math.ceil(footerHeight / TILE_SIZE));
    };

    calculateGridSize();
    window.addEventListener('resize', calculateGridSize);

    return () => window.removeEventListener('resize', calculateGridSize);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const tile = e.target as HTMLDivElement;
    if (tile.classList.contains('grid-tile')) {
      tile.classList.add('active');
      setTimeout(() => {
        tile.classList.remove('active');
      }, 1000); // fade out after 1s
    }
  };

  if (numCols === 0 || numRows === 0) {
    return null; // Don't render until we know the size
  }

  return (
    <div
      className="interactive-grid-footer"
      onMouseEnter={handleMouseEnter}
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
