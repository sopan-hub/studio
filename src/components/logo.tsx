
import * as React from 'react';
import { BrainCircuit } from 'lucide-react';


export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <BrainCircuit className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-headline font-bold text-foreground">
        Study Buddy AI
      </h1>
    </div>
  );
}
