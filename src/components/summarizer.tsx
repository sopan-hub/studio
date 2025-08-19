"use client";

import { summarizeNotes, SummarizeNotesOutput } from "@/ai/flows/summarize-notes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Summarizer({ notes }: { notes: string }) {
  const [summary, setSummary] = useState<SummarizeNotesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSummary(null);
  }, [notes]);

  const handleSubmit = async () => {
    if (notes.length < 50) {
      toast({
        variant: "destructive",
        title: "Notes are too short",
        description: "Please provide at least 50 characters to generate a summary.",
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeNotes({ notes });
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
      <div className="text-center">
        <Button onClick={handleSubmit} disabled={isLoading || !notes}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Summaries
        </Button>
      </div>

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
