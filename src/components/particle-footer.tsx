
"use client";

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes'; // Assuming you might use a theme provider

// --- Helper Functions ---
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

interface CanvasProps {
  className?: string;
  particleCount?: number;
  maxDistance?: number;
}

// --- Main Component ---
export const ParticleFooter = ({
  className = 'particle-footer',
  particleCount = 70,
  maxDistance = 120,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  
  // A simple way to get the primary color from CSS variables
  const [particleColor, setParticleColor] = React.useState('hsl(217, 91%, 60%)');

  useEffect(() => {
     if (typeof window !== 'undefined') {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (color) {
            const [h, s, l] = color.split(' ').map(parseFloat);
            setParticleColor(`hsl(${h}, ${s}%, ${l}%)`);
        }
     }
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const setCanvasSize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle particles
      particles.forEach(p => {
        // Movement
        p.x += p.speedX;
        p.y += p.speedY;

        // Wall collision
        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
        
        // Draw particle
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Handle lines between particles and mouse
      connect();

      animationFrameId = requestAnimationFrame(animate);
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                         + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

          if (distance < (maxDistance * maxDistance)) {
            opacityValue = 1 - (distance / (maxDistance*maxDistance));
            ctx.strokeStyle = `hsla(${particleColor.match(/\d+/g)?.[0]}, 91%, 60%, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      
       // Connect to mouse
       if (mouse.current.x !== null && mouse.current.y !== null) {
            particles.forEach(p => {
                 const distance = ((p.x - mouse.current.x!) * (p.x - mouse.current.x!))
                         + ((p.y - mouse.current.y!) * (p.y - mouse.current.y!));
                 if (distance < (maxDistance * maxDistance)) {
                    opacityValue = 1 - (distance / (maxDistance*maxDistance));
                    ctx.strokeStyle = `hsla(${particleColor.match(/\d+/g)?.[0]}, 91%, 70%, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.current.x!, mouse.current.y!);
                    ctx.stroke();
                 }
            });
       }
    };
    
    // Event Listeners
    const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = event.clientX - rect.left;
        mouse.current.y = event.clientY - rect.top;
    };
    
    const handleMouseOut = () => {
        mouse.current.x = null;
        mouse.current.y = null;
    }
    
    const handleResize = () => {
        setCanvasSize();
        init();
    };

    // Setup
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    setCanvasSize();
    init();
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [particleColor, particleCount, maxDistance]);

  return <canvas ref={canvasRef} className={className}></canvas>;
};
