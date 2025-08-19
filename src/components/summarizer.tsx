"use client";

import { summarizeNotes, SummarizeNotesOutput } from "@/ai/flows/summarize-notes";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  notes: z.string().min(50, {
    message: "Please enter at least 50 characters to generate a summary.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function Summarizer() {
  const [summary, setSummary] = useState<SummarizeNotesOutput | null>(null);
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
    setSummary(null);
    try {
      const result = await summarizeNotes(data);
      setSummary(result);
    } catch (error) {
      console.error("Summarization error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the summary. Please try again.",
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
                    placeholder="Paste your study notes here..."
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
            Generate Summaries
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {summary && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Short Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{summary.shortSummary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Medium Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{summary.mediumSummary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Detailed Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{summary.detailedSummary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
