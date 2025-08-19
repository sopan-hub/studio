"use client";

import { generateFlashcards } from "@/ai/flows/generate-flashcards";
import type { Flashcard as FlashcardType } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Flashcard } from "./flashcard";

export function FlashcardGenerator({ notes }: { notes: string }) {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFlashcards([]);
  }, [notes]);

  const handleSubmit = async () => {
    if (notes.length < 50) {
      toast({
        variant: "destructive",
        title: "Notes are too short",
        description: "Please provide at least 50 characters to generate flashcards.",
      });
      return;
    }
    setIsLoading(true);
    setFlashcards([]);
    try {
      const result = await generateFlashcards({ notes });
      setFlashcards(result.flashcards);
    } catch (error) {
      console.error("Flashcard generation error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating flashcards. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Button onClick={handleSubmit} disabled={isLoading || !notes}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Flashcards
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold font-headline mb-4 text-center">Your Flashcards</h2>
          <Carousel className="w-full" opts={{align: "start"}}>
            <CarouselContent>
              {flashcards.map((card, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-[250px] md:h-[300px]">
                    <Flashcard question={card.question} answer={card.answer} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
