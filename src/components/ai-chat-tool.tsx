
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { chat } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';

export const AiChatTool = ({ onBack }: { onBack: () => void }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!question.trim()) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please enter a question before generating an answer.",
            });
            return;
        }
        setLoading(true);
        setAnswer("");
        try {
            const result = await chat(question);
            setAnswer(result);
        } catch (error) {
            console.error("AI chat error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to get an answer. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full bg-card border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl font-bold text-primary neon-glow">Ask Any Question (AI Chat)</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Textarea
                        placeholder="Ask your AI tutor anything..."
                        className="min-h-[150px]"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                    />
                    <Button onClick={handleGenerate} disabled={loading} className="self-start neon-glow-button">
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles /> Generate Answer
                            </>
                        )}
                    </Button>
                    <div className="mt-4 p-4 border border-dashed border-primary/40 rounded-lg min-h-[150px] bg-background/50">
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Thinking...
                            </div>
                        ) : answer ? (
                            <p className="whitespace-pre-wrap">{answer}</p>
                        ) : (
                           <p className="text-muted-foreground">AI output will appear here...</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
