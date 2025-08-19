
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BotMessageSquare, Loader2 } from 'lucide-react';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SummarizerPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleGenerate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSummary("This is a generated summary of your notes. It's concise and highlights the key points, making it easier to review and understand the material quickly. The AI has identified the main topics and related concepts to provide a clear overview.");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 h-full animate-blast-in">
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <BotMessageSquare className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>AI Summarizer</CardTitle>
                    <CardDescription>Select a note from your collection to generate a summary.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a note..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="note1">Psychology 101 - Lecture 3</SelectItem>
                    <SelectItem value="note2">History of Ancient Rome - Chapter 1</SelectItem>
                    <SelectItem value="note3">Biology - Cell Structures</SelectItem>
                </SelectContent>
            </Select>

            <div className="p-4 bg-muted/50 rounded-lg border h-64 overflow-y-auto">
                <p className="text-sm text-muted-foreground">Select a note to see its content here...</p>
            </div>
            
            <Button onClick={handleGenerate} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Generate Summary"}
            </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generated Summary</CardTitle>
          <CardDescription>Your AI-generated summary will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg border h-[20rem] overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <p className="text-sm">{summary || "The summary will be displayed here once generated."}</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
