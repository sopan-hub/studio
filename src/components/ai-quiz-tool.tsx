
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, QuizInput, QuizOutput } from '@/ai/flows/quiz-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { jsPDF } from 'jspdf';
import "jspdf/dist/polyfills.es.js";

interface AiQuizToolProps {
    onBack: () => void;
}

export const AiQuizTool = ({ onBack }: AiQuizToolProps) => {
    const [quiz, setQuiz] = useState<QuizOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<{ name: string, dataUri: string, content: string } | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                if (selectedFile.type.startsWith('text/')) {
                    const textContentReader = new FileReader();
                    textContentReader.onload = (e) => {
                         setFile({ name: selectedFile.name, dataUri, content: e.target?.result as string });
                    }
                    textContentReader.readAsText(selectedFile);
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'File Type Not Supported',
                        description: 'For now, please upload a text-based file (e.g., .txt, .md).',
                    });
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
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleGenerate = async () => {
        if (!file?.content) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please upload a text file with your study material.",
            });
            return;
        }
        setLoading(true);
        setQuiz(null);
        try {
            const input: QuizInput = { material: file.content };
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
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let currentY = 20;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(45, 100, 245);
        doc.text(quiz.title, margin, currentY);
        currentY += 15;

        quiz.questions.forEach((q, index) => {
            if (currentY > 260) { // New page if content overflows
                doc.addPage();
                currentY = 20;
            }

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(10, 20, 40);
            const questionLines = doc.splitTextToSize(`${index + 1}. ${q.question}`, usableWidth);
            doc.text(questionLines, margin, currentY);
            currentY += questionLines.length * 5 + 5;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            q.options.forEach(opt => {
                doc.text(`- ${opt}`, margin + 5, currentY);
                currentY += 5;
            });
            
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(34, 139, 34); // Green for the answer
            doc.text(`Answer: ${q.answer}`, margin + 5, currentY);
            currentY += 10;
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
                     <div className="p-4 border border-dashed border-primary/40 rounded-lg bg-background/50">
                        {file ? (
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Paperclip className="h-4 w-4" />
                                    <span>{file.name}</span>
                               </div>
                               <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={loading}>
                                    <XCircle className="h-4 w-4" />
                               </Button>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center py-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">Upload your study material (e.g., .txt file)</p>
                                <Button variant="outline" onClick={handleUploadClick} disabled={loading}>
                                    Choose File
                                </Button>
                             </div>
                        )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="text/*,.pdf"
                            disabled={loading}
                        />
                     </div>
                    
                    <Button onClick={handleGenerate} disabled={loading || !file} className="self-start neon-glow-button">
                        {loading ? <><Loader2 className="animate-spin" /> Generating Quiz...</> : <><Sparkles /> Generate Quiz</>}
                    </Button>
                    
                    <div className="mt-4 min-h-[150px]">
                        {loading && (
                             <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-5 w-5" />
                                <p>Brewing your quiz...</p>
                            </div>
                        )}
                        {quiz && (
                            <Accordion type="single" collapsible className="w-full">
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
