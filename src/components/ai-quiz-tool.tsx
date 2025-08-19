
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, QuizInput, QuizOutput } from '@/ai/flows/quiz-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { jsPDF } from 'jspdf';
import "jspdf/dist/polyfills.es.js";
import { Textarea } from './ui/textarea';
import { chat } from '@/ai/flows/chat-flow'; // We need a way to extract text

interface AiQuizToolProps {
    onBack: () => void;
}

export const AiQuizTool = ({ onBack }: AiQuizToolProps) => {
    const [quiz, setQuiz] = useState<QuizOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [material, setMaterial] = useState("");
    const [file, setFile] = useState<{ name: string, dataUri: string, content: string } | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (file) {
            setMaterial(file.content);
        }
    }, [file]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUri = e.target?.result as string;
                try {
                     // Use the chat flow to extract text from any file type
                    const extractedText = await chat({
                        question: "Extract all the text content from the provided file. Only return the text, with no additional commentary.",
                        fileDataUri: dataUri,
                    });
                     setFile({ name: selectedFile.name, dataUri, content: extractedText });
                     toast({ title: "File Uploaded", description: `Extracted text from ${selectedFile.name}` });
                } catch(error) {
                    console.error("File processing error", error);
                    toast({
                        variant: 'destructive',
                        title: 'File Processing Error',
                        description: 'Could not read the content from the uploaded file. Please try a different file.',
                    });
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        setFile(null);
        setMaterial(""); // Also clear the text area if the file is removed
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleGenerate = async () => {
        const inputText = material.trim();

        if (!inputText) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please paste your study material or upload a file.",
            });
            return;
        }
        
        setLoading(true);
        setQuiz(null);
        try {
            const input: QuizInput = { material: inputText };
            const result = await generateQuiz(input);
            setQuiz(result);
        } catch (error) {
            console.error("AI quiz error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate quiz. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadPdf = () => {
        if (!quiz) {
            toast({
                variant: "destructive",
                title: "Nothing to Download",
                description: "Please generate a quiz first.",
            });
            return;
        }

        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let currentY = 20;

        const addText = (text: string, options: { fontSize?: number; isBold?: boolean; color?: [number, number, number]; } = {}) => {
            const { fontSize = 11, isBold = false, color = [10, 20, 40] } = options;
            doc.setFont('Helvetica', isBold ? 'bold' : 'normal');
            doc.setFontSize(fontSize);
            doc.setTextColor(color[0], color[1], color[2]);
            
            const lines = doc.splitTextToSize(text, usableWidth);
            lines.forEach((line: string) => {
                 if (currentY > pageHeight - margin) {
                    doc.addPage();
                    currentY = margin;
                 }
                 doc.text(line, margin, currentY);
                 currentY += (fontSize / 2) + 2; // Adjust line height based on font size
            });
        }

        // Set Title
        addText(quiz.title, { fontSize: 18, isBold: true, color: [45, 100, 245] });
        currentY += 10;


        quiz.questions.forEach((q, index) => {
            if (currentY > pageHeight - margin - 40) { // check for space before adding a new question
                doc.addPage();
                currentY = margin;
            }

            // Question
            addText(`${index + 1}. ${q.question}`, { fontSize: 12, isBold: true });
            currentY += 2;

            // Options
            q.options.forEach(opt => {
                 if (currentY > pageHeight - margin - 10) {
                    doc.addPage();
                    currentY = margin;
                }
                const isCorrect = opt === q.answer;
                const optionText = `- ${opt}`;
                addText(optionText, {
                    fontSize: 10,
                    isBold: isCorrect,
                    color: isCorrect ? [34, 139, 34] : [100, 100, 100]
                });
            });
            
            // Answer
             if (currentY > pageHeight - margin - 10) {
                doc.addPage();
                currentY = margin;
            }
            addText(`Correct Answer: ${q.answer}`, { fontSize: 10, isBold: true, color: [34, 139, 34] });
            currentY += 10; // Extra space between questions
        });

        doc.save(`${quiz.title.replace(/\s+/g, '_').toLowerCase()}_quiz.pdf`);
    };

    return (
        <Card className="w-full bg-card border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                            <ArrowLeft />
                        </Button>
                        <CardTitle className="text-2xl font-bold text-primary neon-glow">Smart Quiz Maker</CardTitle>
                    </div>
                     <Button variant="outline" onClick={handleDownloadPdf} disabled={!quiz || loading}>
                        <Download className="mr-2" />
                        Download PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Textarea
                        placeholder="Paste your study material here, or upload a file below."
                        className="min-h-[150px]"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
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
                            {loading ? <><Loader2 className="animate-spin" /> Generating Quiz...</> : <><Sparkles /> Generate Quiz</>}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".txt,.pdf,.md,.doc,.docx"
                            disabled={loading}
                        />
                        <Button variant="outline" onClick={handleUploadClick} disabled={loading} className="self-start">
                            <Upload />
                            {file ? 'Change File' : 'Upload File'}
                        </Button>
                    </div>
                    
                    <div className="mt-4 min-h-[150px]">
                        {loading && (
                             <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-5 w-5" />
                                <p>Brewing your quiz...</p>
                            </div>
                        )}
                        {quiz && (
                            <Accordion type="single" collapsible className="w-full">
                                <h3 className="text-xl font-bold text-primary neon-glow mb-4">{quiz.title}</h3>
                                {quiz.questions.map((q, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>{index + 1}. {q.question}</AccordionTrigger>
                                        <AccordionContent>
                                           <div className="flex flex-col gap-2 pl-4">
                                                {q.options.map((option, i) => (
                                                     <p key={i} className={`p-2 rounded-md ${option === q.answer ? 'bg-green-500/20 text-green-300' : 'bg-muted/30'}`}>
                                                        {option}
                                                     </p>
                                                ))}
                                           </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                        {!loading && !quiz && (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg border-primary/40 bg-background/50">
                                <p className="text-muted-foreground">Your generated quiz will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
