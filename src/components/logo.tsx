import { BookOpenCheck } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <BookOpenCheck className="h-8 w-8 text-primary neon-glow" />
      <h1 className="text-xl font-headline font-bold text-primary neon-glow">
        Study Buddy AI
      </h1>
    </div>
  );
}
