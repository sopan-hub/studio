
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2, RefreshCw } from 'lucide-react';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const flashcardsData = [
    { q: "What is the powerhouse of the cell?", a: "The Mitochondria" },
    { q: "What year did the Titanic sink?", a: "1912" },
    { q: "Who wrote 'To Kill a Mockingbird'?", a: "Harper Lee" },
    { q: "What is the capital of Japan?", a: "Tokyo" },
];

const Flashcard = ({ question, answer }: { question: string, answer: string }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    return (
        <div className="w-full h-64 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={
                `relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`
            }>
                {/* Front of card */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-card border rounded-lg">
                    <p className="text-xl font-semibold text-center">{question}</p>
                </div>
                {/* Back of card */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-primary text-primary-foreground border rounded-lg rotate-y-180">
                     <p className="text-xl font-bold text-center">{answer}</p>
                </div>
            </div>
        </div>
    );
};


export default function FlashcardsPage() {
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setFlashcards(flashcardsData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-blast-in">
        <Card>
             <CardHeader>
                <div className="flex items-center gap-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>AI Flashcards</CardTitle>
                        <CardDescription>Turn your notes into interactive flashcards for effective learning.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a note to generate flashcards from..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="note1">Psychology 101 - Lecture 3</SelectItem>
                        <SelectItem value="note2">History of Ancient Rome - Chapter 1</SelectItem>
                        <SelectItem value="note3">Biology - Cell Structures</SelectItem>
                    </SelectContent>
                </Select>
                 <Button onClick={handleGenerate} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Generate Flashcards"}
                </Button>
            </CardContent>
        </Card>
        
        {loading && (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {flashcards.length > 0 && (
             <Carousel className="w-full max-w-xl mx-auto">
                <CarouselContent>
                    {flashcards.map((card, index) => (
                        <CarouselItem key={index}>
                           <Flashcard question={card.q} answer={card.a} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        )}
    </div>
  );
}
