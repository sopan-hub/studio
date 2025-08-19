
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
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2" />
    <path d="M12 12c-1.1 0-2 .9-2 2s.9 2 2 2" />
    <path d="M12 8h-1a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" />
    <path d="M15 8h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1" />
    <path d="M8 12h2" />
    <path d="M14 12h2" />
    <path d="M8 16h2" />
    <path d="M14 16h2" />
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

    