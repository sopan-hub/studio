
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { translateText, TranslatorInput, TranslatorOutput } from '@/ai/flows/translator-flow';
import { Textarea } from './ui/textarea';
import { chat } from '@/ai/flows/chat-flow';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AiTruckLoadingAnimation } from '@/components/ui/ai-truck-loading-animation';

interface AiTranslatorToolProps {
    onBack: () => void;
}

export const AiTranslatorTool = ({ onBack }: AiTranslatorToolProps) => {
    const [translation, setTranslation] = useState<TranslatorOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [originalText, setOriginalText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("Spanish");
    const [file, setFile] = useState<{ name: string, dataUri: string, content: string } | null>(null);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        import("jspdf/dist/polyfills.es.js");
    }, []);

    useEffect(() => {
        if (file) {
            setOriginalText(file.content);
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
                     const extractedText = await chat({ question: "Extract all text content from the file.", fileDataUri: dataUri });
                     setFile({ name: selectedFile.name, dataUri, content: extractedText });
                     toast({ title: "File Uploaded", description: `Extracted text from ${selectedFile.name}` });
                } catch(error) {
                    toast({ variant: 'destructive', title: 'File Error', description: 'Could not read file content.' });
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
        setOriginalText("");
        if(fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleGenerate = async () => {
        if (!originalText.trim() || !targetLanguage.trim()) {
            toast({ variant: "destructive", title: "Input Required", description: "Please provide text and a target language." });
            return;
        }
        
        setLoading(true);
        setTranslation(null);
        try {
            const input: TranslatorInput = { text: originalText, targetLanguage };
            const result = await translateText(input);
            setTranslation(result);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to translate." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadPdf = () => {
        if (!translation) return;
        
        const doc = new jsPDF();
        doc.addFont('Helvetica', 'normal', 'normal');
        doc.setFont('Helvetica');

        const margin = 15;
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let y = 20;
        
        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        doc.text(`Translation to ${targetLanguage}`, margin, y);
        y += 15;

        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');
        const textLines = doc.splitTextToSize(translation.translatedText, usableWidth);
        doc.text(textLines, margin, y);

        doc.save(`translation_${targetLanguage.toLowerCase()}.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary"><ArrowLeft /></Button>
                        <CardTitle className="text-2xl font-bold text-foreground">Document Translator</CardTitle>
                    </div>
                     <Button variant="outline" onClick={handleDownloadPdf} disabled={!translation || loading}>
                        <Download className="mr-2" /> Download PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-4">
                        <Label htmlFor="target-lang" className="text-nowrap">Translate to:</Label>
                         <Input
                            id="target-lang"
                            placeholder="e.g., Spanish, Japanese, French..."
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input Side */}
                        <div className="flex flex-col gap-4">
                             <Label>Original Text</Label>
                            <Textarea
                                placeholder="Paste text here or upload a document..."
                                className="min-h-[300px] flex-grow"
                                value={originalText}
                                onChange={(e) => setOriginalText(e.target.value)}
                                disabled={loading}
                            />
                            {file && (
                                <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                   <div className="flex items-center gap-2 text-sm text-muted-foreground"><Paperclip className="h-4 w-4" /><span>{file.name}</span></div>
                                   <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={loading}><XCircle className="h-4 w-4" /></Button>
                                </div>
                            )}
                        </div>

                        {/* Output Side */}
                         <div className="flex flex-col gap-4">
                            <Label>Translated Text</Label>
                            <div className="p-4 border rounded-lg bg-background/50 h-[300px] overflow-y-auto markdown-content">
                               {loading ? (
                                    <AiTruckLoadingAnimation />
                                ) : translation ? (
                                    <ReactMarkdown>{translation.translatedText}</ReactMarkdown>
                                ) : (
                                    <p className="text-muted-foreground">Translation will appear here.</p>
                                )}
                            </div>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={handleGenerate} disabled={loading} className="self-start neon-glow-button">
                            {loading ? <><Loader2 className="animate-spin" /> Translating...</> : <><Languages /> Translate</>}
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={loading} />
                        <Button variant="outline" onClick={handleUploadClick} disabled={loading} className="self-start">
                            <Upload /> {file ? 'Change Document' : 'Upload Document'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
