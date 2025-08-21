
"use client";

import { useEffect } from 'react';
import { neonCursor } from 'threejs-toys';

export const NeonCursor = () => {
  useEffect(() => {
    
    // Check if we are in a browser environment
    if (typeof window === 'undefined') {
        return;
    }

    neonCursor({
      el: document.getElementById('app-container'),
      shaderPoints: 16,
      curvePoints: 80,
      curveLerp: 0.5,
      radius1: 5,
      radius2: 30,
      velocityTreshold: 10,
      sleepRadiusX: 100,
      sleepRadiusY: 100,
      sleepTimeCoefX: 0.0025,
      sleepTimeCoefY: 0.0025,
    });
    
    // Add class to canvas for styling
     const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.classList.add('neon-cursor-canvas');
        }

  }, []);

  return null; 
};
