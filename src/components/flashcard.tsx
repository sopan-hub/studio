"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface FlashcardProps {
  question: string;
  answer: string;
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-full w-full [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative h-full w-full rounded-xl shadow-md transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <Card className="absolute h-full w-full [backface-visibility:hidden]">
          <CardContent className="flex flex-col items-center justify-center p-6 h-full">
            <p className="text-center text-lg md:text-xl font-semibold">{question}</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="flex flex-col items-center justify-center p-6 h-full">
            <p className="text-center text-md md:text-lg text-muted-foreground">{answer}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
