
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download, ArrowRight, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateFlashcards, FlashcardInput, FlashcardOutput } from '@/ai/flows/flashcard-flow';
import { Textarea } from './ui/textarea';
import { chat } from '@/ai/flows/chat-flow';
import { jsPDF } from 'jspdf';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { cn } from '@/lib/utils';
import { AiLoadingAnimation } from './ui/ai-loading-animation';


interface AiFlashcardToolProps {
    onBack: () => void;
}

export const AiFlashcardTool = ({ onBack }: AiFlashcardToolProps) => {
    const [deck, setDeck] = useState<FlashcardOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [material, setMaterial] = useState("");
    const [file, setFile] = useState<{ name: string, dataUri: string, content: string } | null>(null);
    const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        import("jspdf/dist/polyfills.es.js");
    }, []);

    useEffect(() => {
        if (file) {
            setMaterial(file.content);
        }
    }, [file]);

     useEffect(() => {
        if (deck) {
            setFlippedStates(new Array(deck.flashcards.length).fill(false));
        }
    }, [deck]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
             setLoading(true);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUri = e.target?.result as string;
                try {
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
                        description: 'Could not read content. Please try a different file.',
                    });
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleRemoveFile = () => {
        setFile(null);
        setMaterial("");
        if(fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleGenerate = async () => {
        const inputText = material.trim();
        if (!inputText) {
            toast({ variant: "destructive", title: "Input Required", description: "Please paste material or upload a file." });
            return;
        }
        
        setLoading(true);
        setDeck(null);
        try {
            const input: FlashcardInput = { material: inputText };
            const result = await generateFlashcards(input);
            setDeck(result);
        } catch (error) {
            console.error("AI flashcard error:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to generate flashcards." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleFlip = (index: number) => {
        setFlippedStates(prev => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };
    
    const handleDownloadPdf = () => {
        if (!deck) {
            toast({ variant: "destructive", title: "Nothing to Download" });
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        doc.setFont('Helvetica', 'normal');
        
        const cardWidth = 85;
        const cardHeight = 55;
        const marginX = 15;
        const marginY = 15;
        let x = marginX, y = marginY;

        deck.flashcards.forEach((card, index) => {
            if (index > 0 && index % 6 === 0) { // New page after 6 cards
                doc.addPage();
                x = marginX;
                y = marginY;
            } else if (index > 0 && index % 2 === 0) { // New row
                x = marginX;
                y += cardHeight + 5;
            } else if (index > 0) { // Next card in row
                x += cardWidth + 5;
            }

            // Draw card outlines
            doc.setDrawColor(200, 200, 200);
            doc.rect(x, y, cardWidth, cardHeight); // Question
            doc.rect(x + cardWidth + 5, y, cardWidth, cardHeight); // Answer

             // Add separator line
            doc.setDrawColor(150, 150, 150);
            doc.line(x + cardWidth + 2.5, y, x + cardWidth + 2.5, y + cardHeight);


            // Add content
            doc.setTextColor(0,0,0);
            doc.setFontSize(10);
            const questionLines = doc.splitTextToSize(card.question, cardWidth - 10);
            doc.text(questionLines, x + 5, y + 10);
            
            doc.setFontSize(9);
            const answerLines = doc.splitTextToSize(card.answer, cardWidth - 10);
            doc.text(answerLines, x + cardWidth + 10, y + 10);

        });

        doc.save(`${deck.title.replace(/\s+/g, '_').toLowerCase()}_flashcards.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary"><ArrowLeft /></Button>
                        <CardTitle className="text-2xl font-bold text-foreground">AI Flashcard Maker</CardTitle>
                    </div>
                     <Button variant="outline" onClick={handleDownloadPdf} disabled={!deck || loading}>
                        <Download className="mr-2" /> Download PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="flex flex-col gap-4">
                        <Textarea
                            placeholder="Paste your study material here..."
                            className="min-h-[300px] flex-grow"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            disabled={loading}
                        />

                        {file && (
                            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Paperclip className="h-4 w-4" /><span>{file.name}</span>
                               </div>
                               <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={loading}><XCircle className="h-4 w-4" /></Button>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                            <Button onClick={handleGenerate} disabled={loading} className="self-start neon-glow-button">
                                {loading ? <><Loader2 className="animate-spin" /> Generating...</> : <><Sparkles /> Generate Flashcards</>}
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={loading} />
                            <Button variant="outline" onClick={handleUploadClick} disabled={loading} className="self-start">
                                <Upload /> {file ? 'Change File' : 'Upload File'}
                            </Button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="mt-0 min-h-[400px]">
                        {loading ? (
                            <AiLoadingAnimation text="Creating your flashcards..." />
                        ) : deck ? (
                           <div className="flex flex-col gap-4">
                             <h3 className="text-xl font-bold text-primary text-center">{deck.title}</h3>
                             <Carousel className="w-full max-w-xs mx-auto">
                               <CarouselContent>
                                {deck.flashcards.map((card, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1 perspective-1000">
                                           <div className={cn("relative w-full h-64 transform-style-preserve-3d transition-transform duration-700", { 'rotate-y-180': flippedStates[index] })}>
                                                {/* Front */}
                                                <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 rounded-lg border bg-card text-card-foreground shadow-lg cursor-pointer" onClick={() => handleFlip(index)}>
                                                    <p className="text-lg text-center">{card.question}</p>
                                                     <ArrowLeftRight className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground" />
                                                </div>
                                                {/* Back */}
                                                <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 rounded-lg border bg-secondary text-secondary-foreground shadow-lg cursor-pointer rotate-y-180" onClick={() => handleFlip(index)}>
                                                     <p className="text-md text-center">{card.answer}</p>
                                                     <ArrowLeftRight className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground" />
                                                </div>
                                           </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                               </CarouselContent>
                               <CarouselPrevious />
                               <CarouselNext />
                             </Carousel>
                           </div>
                        ) : (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg bg-background/50">
                                <p className="text-muted-foreground">Your generated flashcards will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
