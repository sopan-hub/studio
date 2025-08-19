
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { chat, ChatInput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import "jspdf/dist/polyfills.es.js"; // Required for jsPDF in some environments

interface AiChatToolProps {
    onBack: () => void;
    initialQuestion?: string;
    onSearchPerformed?: () => void;
}

export const AiChatTool = ({ onBack, initialQuestion = "", onSearchPerformed }: AiChatToolProps) => {
    const [question, setQuestion] = useState(initialQuestion);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<{ name: string, dataUri: string } | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            const input: ChatInput = {
                question: question,
                fileDataUri: file?.dataUri,
            }
            const result = await chat(input);
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
    
    // Effect to auto-trigger generation when initialQuestion is set by global search
    useEffect(() => {
        if (initialQuestion && !loading) { // also check loading status
            setQuestion(initialQuestion);
            handleGenerate().then(() => {
                 if (onSearchPerformed) {
                    onSearchPerformed();
                }
            });
        }
    }, [initialQuestion]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                setFile({ name: selectedFile.name, dataUri });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleDownloadPdf = () => {
        if (!answer) {
            toast({
                variant: "destructive",
                title: "Nothing to Download",
                description: "Please generate an answer first.",
            });
            return;
        }

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - (margin * 2);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(45, 100, 245); // Primary color
        doc.text("Study Buddy AI - Your Answer", margin, 20);
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(10, 20, 40); // Darker text
        doc.text("Question:", margin, 35);
        
        doc.setFont('Helvetica', 'normal');
        const questionLines = doc.splitTextToSize(question, usableWidth);
        doc.text(questionLines, margin, 42);
        
        const lastQuestionY = 42 + (questionLines.length * 5); // Approximate height

        doc.setFont('Helvetica', 'bold');
        doc.text("Answer:", margin, lastQuestionY + 10);
        
        doc.setFont('Helvetica', 'normal');
        const answerLines = doc.splitTextToSize(answer, usableWidth);
        doc.text(answerLines, margin, lastQuestionY + 17);

        doc.save("study-buddy-answer.pdf");
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
                        placeholder="Ask your AI tutor anything... (Optionally, upload a file for context)"
                        className="min-h-[150px]"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                    />

                    {file && (
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-primary/20">
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Paperclip className="h-4 w-4" />
                                <span>{file.name}</span>
                           </div>
                           <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={loading}>
                                <XCircle className="h-4 w-4" />
                           </Button>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2">
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
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={loading}
                        />
                        <Button variant="outline" onClick={handleUploadClick} disabled={loading} className="self-start">
                            <Upload />
                            Upload File
                        </Button>
                    </div>

                    <div className="mt-4 p-4 border border-dashed border-primary/40 rounded-lg min-h-[150px] bg-background/50 relative">
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Thinking...
                            </div>
                        ) : answer ? (
                            <>
                                <p className="whitespace-pre-wrap">{answer}</p>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Download as PDF"
                                    onClick={handleDownloadPdf}
                                    className="absolute top-2 right-2"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                           <p className="text-muted-foreground">AI output will appear here...</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
