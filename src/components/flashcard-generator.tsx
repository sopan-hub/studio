"use client";

import { generateFlashcards } from "@/ai/flows/generate-flashcards";
import type { Flashcard as FlashcardType } from "@/lib/types";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Flashcard } from "./flashcard";
import { Card, CardContent } from "./ui/card";

const formSchema = z.object({
  notes: z.string().min(50, {
    message: "Please enter at least 50 characters to generate flashcards.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function FlashcardGenerator() {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setFlashcards([]);
    try {
      const result = await generateFlashcards(data);
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Your Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your study notes here to create flashcards..."
                    className="min-h-[200px] bg-card"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Flashcards
          </Button>
        </form>
      </Form>
      
      {isLoading && (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold font-headline mb-4">Your Flashcards</h2>
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
