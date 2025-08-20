
"use client";

import { useEffect } from 'react';
import { neonCursor } from 'threejs-toys';

const NeonCursor = () => {
  useEffect(() => {
    // Check if the animation has already been initialized to avoid duplicates
    const canvas = document.querySelector('#app-container > canvas');
    if (canvas) {
      return;
    }

    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        neonCursor({
          el: appContainer,
          shaderPoints: 16,
          curvePoints: 80,
          curveLerp: 0.5,
          radius1: 5,
          radius2: 30,
          velocityTreshold: 10,
          sleepRadiusX: 100,
          sleepRadiusY: 100,
          sleepTimeCoefX: 0.0025,
          sleepTimeCoefY: 0.0025
        });
    }
  }, []);

  return null; // This component doesn't render anything itself
};

export default NeonCursor;
