"use client";

import { generateQuizzes } from "@/ai/flows/generate-quizzes";
import type { Quiz } from "@/lib/types";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuizView } from "./quiz-view";

const formSchema = z.object({
  notes: z.string().min(50, {
    message: "Please enter at least 50 characters to generate a quiz.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function QuizGenerator() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
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
    setQuiz(null);
    try {
      const result = await generateQuizzes(data);
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
                    placeholder="Paste your study notes here to create a quiz..."
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
            Generate Quiz
          </Button>
        </form>
      </Form>
      
      {isLoading && (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {quiz && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold font-headline mb-4">Your Quiz</h2>
          <QuizView multipleChoice={quiz.multipleChoice} shortAnswer={quiz.shortAnswer} />
        </div>
      )}
    </div>
  );
}
