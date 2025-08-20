
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { chat, ChatInput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';


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
    
    // This effect ensures the jspdf polyfill is loaded only on the client-side
    useEffect(() => {
        import("jspdf/dist/polyfills.es.js");
    }, []);

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
            handleGenerate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // Add a more robust font that supports more characters
        doc.addFont('Helvetica', 'normal', 'normal');
        doc.setFont('Helvetica');


        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let currentY = 20;

        const addFormattedText = (text: string, isAnswer: boolean) => {
            // A simple regex to split markdown elements but keep delimiters
            const parts = text.split(/(\n|# |\*\*|### |\* |- |## )/g);
            let isBold = false;
            let listType: 'ul' | 'ol' | null = null;
            let listCounter = 1;

            const processLine = (line: string) => {
                 if (currentY > pageHeight - margin - 10) { // Add new page if not enough space
                    doc.addPage();
                    currentY = margin;
                 }
                let fontSize = 11;
                let fontStyle = isBold ? 'bold' : 'normal';

                if (line.startsWith('# ')) {
                    fontSize = 18;
                    fontStyle = 'bold';
                    line = line.substring(2);
                } else if (line.startsWith('## ')) {
                    fontSize = 16;
                    fontStyle = 'bold';
                    line = line.substring(3);
                } else if (line.startsWith('### ')) {
                    fontSize = 14;
                    fontStyle = 'bold';
                    line = line.substring(4);
                } else if (line.startsWith('* ') || line.startsWith('- ')) {
                    line = `• ${line.substring(2)}`;
                }
                
                doc.setFontSize(fontSize);
                doc.setFont('Helvetica', fontStyle);
                const textLines = doc.splitTextToSize(line, usableWidth - ( (line.startsWith('•')) ? 5 : 0) );
                doc.text(textLines, margin + ( (line.startsWith('•')) ? 5 : 0), currentY);
                currentY += (textLines.length * (fontSize / 2)) + 2;
            }

            const cleanText = answer.replace(/\*\*(.*?)\*\*/g, '$1'); // Basic bold removal for now
            const lines = cleanText.split('\n');

            lines.forEach(line => {
                 if (line.trim() === "") {
                    currentY += 5; // Add space for empty lines
                } else {
                    processLine(line);
                }
            });
        };

        // Title
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        const titleLines = doc.splitTextToSize(`Study Buddy AI - ${title}`, usableWidth);
        doc.text(titleLines, margin, currentY);
        currentY += (titleLines.length * 10) + 10;
        

        // Question
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.text("Your Question:", margin, currentY);
        currentY += 8;

        const questionToDisplay = question.trim() || (file ? `Content of ${file.name}` : 'No question text provided.');
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        const questionLines = doc.splitTextToSize(questionToDisplay, usableWidth);
        doc.text(questionLines, margin, currentY);
        currentY += (questionLines.length * 5) + 10;
        doc.setTextColor(0, 0, 0);

        // Answer
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.text("AI Answer:", margin, currentY);
        currentY += 8;
        
        addFormattedText(answer, true);

        doc.save(`study-buddy-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    };


    return (
        <div className="p-4 md:p-8">
            <Card className="w-full bg-card shadow-lg animate-blast-in">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                                <ArrowLeft />
                            </Button>
                            <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
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
                            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
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

                        <div className="mt-4 p-4 border border-dashed rounded-lg min-h-[250px] bg-background/50 relative overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Thinking...
                                </div>
                            ) : answer ? (
                                <div className="markdown-content">
                                    <ReactMarkdown>{answer}</ReactMarkdown>
                                </div>
                            ) : (
                            <p className="text-muted-foreground">AI output will appear here...</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

    