
"use client";

import React, { useEffect, useState } from 'react';

const NUM_PARTICLES = 30; // Fewer particles for cards

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
}

export const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: Math.random() * 2 + 1, // 1px to 3px
          delay: Math.random() * 15, // 0s to 15s
          duration: Math.random() * 10 + 5, // 5s to 15s
          driftX: (Math.random() - 0.5) * 30, // -15px to 15px
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="card-particle-background">
      {particles.map((p) => (
        <div
          key={p.id}
          className="card-particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
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

    