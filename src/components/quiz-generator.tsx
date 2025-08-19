"use client";

import { generateQuizzes } from "@/ai/flows/generate-quizzes";
import type { Quiz } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuizView } from "./quiz-view";

export function QuizGenerator({ notes }: { notes: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setQuiz(null);
  }, [notes]);
  
  const handleSubmit = async () => {
    if (notes.length < 50) {
        toast({
            variant: "destructive",
            title: "Notes are too short",
            description: "Please provide at least 50 characters to generate a quiz.",
        });
        return;
    }
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuizzes({ notes });
      setQuiz(result);
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the quiz. Please try again.",
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
          Generate Quiz
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {quiz && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold font-headline mb-4 text-center">Your Quiz</h2>
          <QuizView multipleChoice={quiz.multipleChoice} shortAnswer={quiz.shortAnswer} />
        </div>
      )}
    </div>
  );
}
