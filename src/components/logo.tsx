import * as React from 'react';

const AiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 8a4 4 0 1 1-4 4" />
    <path d="M12 12h.01" />
    <path d="M16 16l-1.5-1.5" />
    <path d="M8 16l1.5-1.5" />
    <path d="M12 6V4" />
    <path d="M12 20v-2" />
    <path d="M18 12h2" />
    <path d="M4 12H2" />
  </svg>
);


export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <AiLogo className="h-8 w-8 text-primary neon-glow" />
      <h1 className="text-xl font-headline font-bold text-primary neon-glow">
        Study Buddy AI
      </h1>
    </div>
  );
}
