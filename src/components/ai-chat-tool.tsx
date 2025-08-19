
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
    title: string;
    initialQuestion?: string;
    onSearchPerformed?: () => void;
}

export const AiChatTool = ({ onBack, title, initialQuestion = "", onSearchPerformed }: AiChatToolProps) => {
    const [question, setQuestion] = useState(initialQuestion);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<{ name: string, dataUri: string } | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleGenerate = async () => {
        if (!question.trim() && !file) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please enter a question or upload a file.",
            });
            return;
        }
        
        setLoading(true);
        setAnswer("");
        try {
            const questionToSend = question.trim() || (file ? `Summarize the content of the attached file: ${file.name}` : '');

            const input: ChatInput = {
                question: questionToSend,
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
            if (onSearchPerformed) {
                onSearchPerformed();
            }
        }
    };
    
    // Effect to auto-trigger generation when initialQuestion is set by global search
    useEffect(() => {
        if (initialQuestion && !loading) {
            setQuestion(initialQuestion);
             // Only auto-submit for the main global search
            if (title === "Ask Any Question (AI Chat)") {
                 handleGenerate();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuestion, title]);


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
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let currentY = 20;

        const addText = (text: string, isBold = false, isTitle = false, isQuestion = false) => {
            doc.setFont('Helvetica', isBold || isTitle ? 'bold' : 'normal');
            doc.setFontSize(isTitle ? 18 : (isBold ? 12 : 11));
            
            // For the main answer, split by paragraphs to preserve them
            const paragraphs = text.split('\n');

            paragraphs.forEach(paragraph => {
                const lines = doc.splitTextToSize(paragraph, usableWidth);
                
                lines.forEach((line: string) => {
                     if (currentY > pageHeight - margin) {
                        doc.addPage();
                        currentY = margin;
                     }
                     doc.text(line, margin, currentY);
                     currentY += isTitle ? 8 : (isBold ? 7 : 6);
                });

                // Add a small gap between paragraphs, but not for titles/headings
                if (!isTitle && !isBold) {
                    currentY += 4;
                }
            });

             currentY += 4; 
        }

        doc.setTextColor(45, 100, 245);
        addText(`Study Buddy AI - ${title}`, true, true);
        
        doc.setTextColor(10, 20, 40);
        addText("Question:", true);

        const questionToDisplay = question.trim() || (file ? `Content of ${file.name}` : '');
        addText(questionToDisplay, false, false, true);

        addText("Answer:", true);
        
        addText(answer);

        doc.save(`study-buddy-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    };


    return (
        <Card className="w-full bg-card border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                            <ArrowLeft />
                        </Button>
                        <CardTitle className="text-2xl font-bold text-primary neon-glow">{title}</CardTitle>
                    </div>
                     <Button
                        variant="outline"
                        onClick={handleDownloadPdf}
                        disabled={!answer || loading}
                     >
                        <Download className="mr-2" />
                        Download PDF
                    </Button>
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
                                    <Sparkles /> Generate
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
                            {file ? "Change File" : "Upload File"}
                        </Button>
                    </div>

                    <div className="mt-4 p-4 border border-dashed border-primary/40 rounded-lg min-h-[150px] bg-background/50 relative overflow-y-auto">
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
