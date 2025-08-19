
"use client";

import React, { useEffect, useState } from 'react';

const NUM_PARTICLES = 50;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
}

export const ParticleFooter = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: Math.random() * 3 + 1, // 1px to 4px
          delay: Math.random() * 10, // 0s to 10s
          duration: Math.random() * 5 + 5, // 5s to 10s
          driftX: (Math.random() - 0.5) * 50, // -25px to 25px
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="particle-footer">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={
            {
              left: `${p.x}%`,
              bottom: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift-x': `${p.driftX}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

    