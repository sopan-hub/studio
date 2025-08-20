
"use client";

import React from 'react';

export const AiLoadingAnimation = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-muted-foreground p-8">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Pulsating circles */}
        <div className="absolute w-full h-full rounded-full bg-primary/20 animate-pulse delay-300"></div>
        <div className="absolute w-2/3 h-2/3 rounded-full bg-primary/30 animate-pulse delay-150"></div>
        <div className="absolute w-1/3 h-1/3 rounded-full bg-primary/50 animate-pulse"></div>

        {/* Orbiting dots */}
        <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-primary"></div>
        </div>
         <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
          <div className="absolute bottom-0 right-1/2 w-2 h-2 -mr-1 rounded-full bg-primary/80"></div>
        </div>
      </div>
      <p className="text-lg font-medium text-primary neon-glow">{text}</p>
    </div>
  );
};
