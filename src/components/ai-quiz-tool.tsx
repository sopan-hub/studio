
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, QuizInput, QuizOutput } from '@/ai/flows/quiz-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Textarea } from './ui/textarea';
import { chat } from '@/ai/flows/chat-flow'; // We need a way to extract text
import { jsPDF } from 'jspdf';


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
        // This effect ensures the jspdf polyfill is loaded only on the client-side
        import("jspdf/dist/polyfills.es.js");
    }, []);

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
        doc.setFont('Helvetica', 'normal');

        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let currentY = 20;

        const addWrappedText = (text: string, x: number, y: number, options?: { maxWidth?: number, fontStyle?: string, fontSize?: number }) => {
            const { fontStyle = 'normal', fontSize = 11 } = options || {};
            doc.setFont('Helvetica', fontStyle);
            doc.setFontSize(fontSize);
            
            const lines = doc.splitTextToSize(text, options?.maxWidth || usableWidth);

            if (y + (lines.length * (fontSize / 2)) > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
                y = margin;
            }
            doc.text(lines, x, y);
            return y + (lines.length * (fontSize / 2.5)); // Adjust line height based on font size
        };


        // Set Title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        currentY = addWrappedText(quiz.title, margin, currentY, { fontSize: 18, fontStyle: 'bold' });
        currentY += 10;


        quiz.questions.forEach((q, index) => {
             if (currentY > pageHeight - margin - 40) { // check for space before adding a new question
                doc.addPage();
                currentY = margin;
            }
            doc.setTextColor(0, 0, 0);

            // Question
            const questionText = `${index + 1}. ${q.question}`;
            currentY = addWrappedText(questionText, margin, currentY, { fontSize: 12, fontStyle: 'bold' });
            currentY += 5;

            // Options
            doc.setTextColor(80, 80, 80);
            q.options.forEach(opt => {
                 if (currentY > pageHeight - margin - 10) {
                    doc.addPage();
                    currentY = margin;
                }
                const isCorrect = opt === q.answer;
                const optionText = `- ${opt}`;
                
                doc.setFont("Helvetica", isCorrect ? 'bold' : 'normal');
                if (isCorrect) doc.setTextColor(0, 100, 0); // Green for correct answer

                currentY = addWrappedText(optionText, margin + 5, currentY, { maxWidth: usableWidth - 5 });

                if (isCorrect) doc.setTextColor(80, 80, 80); // Reset color
            });
            
            // Answer Reveal
            doc.setFont("Helvetica", 'bold');
            doc.setTextColor(0, 100, 0);
            currentY = addWrappedText(`Correct Answer: ${q.answer}`, margin, currentY, {fontStyle: 'bold'});
            currentY += 10; // Extra space between questions
        });

        doc.save(`${quiz.title.replace(/\s+/g, '_').toLowerCase()}_quiz.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                            <ArrowLeft />
                        </Button>
                        <CardTitle className="text-2xl font-bold text-foreground">Smart Quiz Maker</CardTitle>
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
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted">
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
                                <h3 className="text-xl font-bold text-secondary mb-4">{quiz.title}</h3>
                                {quiz.questions.map((q, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>{index + 1}. {q.question}</AccordionTrigger>
                                        <AccordionContent>
                                           <div className="flex flex-col gap-2 pl-4">
                                                {q.options.map((option, i) => (
                                                     <p key={i} className={`p-2 rounded-md ${option === q.answer ? 'bg-green-100/20 text-green-500' : 'bg-muted'}`}>
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
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg bg-background/50">
                                <p className="text-muted-foreground">Your generated quiz will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
