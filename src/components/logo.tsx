import { GraduationCap } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <GraduationCap className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-headline font-semibold text-foreground">
        Study Buddy AI
      </h1>
    </div>
  );
}
