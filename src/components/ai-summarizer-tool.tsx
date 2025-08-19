
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateSummary, SummaryInput, SummaryOutput } from '@/ai/flows/summarizer-flow';
import { jsPDF } from 'jspdf';
import "jspdf/dist/polyfills.es.js";
import { Textarea } from './ui/textarea';

interface AiSummarizerToolProps {
    onBack: () => void;
}

export const AiSummarizerTool = ({ onBack }: AiSummarizerToolProps) => {
    const [summary, setSummary] = useState<SummaryOutput | null>(null);
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
        setMaterial(""); // Also clear the text area if the file is removed
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleGenerate = async () => {
        const inputText = material.trim();

        if (!inputText && !file?.content) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please paste your study material or upload a text file.",
            });
            return;
        }

        const contentToUse = inputText || file!.content;
        
        setLoading(true);
        setSummary(null);
        try {
            const input: SummaryInput = { material: contentToUse };
            const result = await generateSummary(input);
            setSummary(result);
        } catch (error) {
            console.error("AI summarizer error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate summary. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadPdf = () => {
        if (!summary) {
            toast({
                variant: "destructive",
                title: "Nothing to Download",
                description: "Please generate a summary first.",
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
        doc.text(summary.title, margin, currentY);
        currentY += 15;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        const summaryLines = doc.splitTextToSize(summary.summary, usableWidth);
        doc.text(summaryLines, margin, currentY);
        
        doc.save(`${summary.title.replace(/\s+/g, '_').toLowerCase()}_summary.pdf`);
    };

    return (
        <Card className="w-full bg-card border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                            <ArrowLeft />
                        </Button>
                        <CardTitle className="text-2xl font-bold text-primary neon-glow">Generate Notes & Summaries</CardTitle>
                    </div>
                     <Button variant="outline" onClick={handleDownloadPdf} disabled={!summary || loading}>
                        <Download className="mr-2" />
                        Download PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="flex flex-col gap-4">
                        <Textarea
                            placeholder="Paste your study material here, or upload a file below."
                            className="min-h-[300px] flex-grow"
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
                                {loading ? <><Loader2 className="animate-spin" /> Generating...</> : <><Sparkles /> Generate Summary</>}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="text/*"
                                disabled={loading}
                            />
                            <Button variant="outline" onClick={handleUploadClick} disabled={loading} className="self-start">
                                <Upload />
                                {file ? 'Change File' : 'Upload File'}
                            </Button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="mt-0 min-h-[400px]">
                        {loading && (
                             <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                <p>Summarizing your material...</p>
                            </div>
                        )}
                        {summary && (
                            <div className="p-4 border border-primary/40 rounded-lg bg-background/50 h-full overflow-y-auto">
                                <h3 className="text-xl font-bold text-primary neon-glow mb-4">{summary.title}</h3>
                                <p className="whitespace-pre-wrap text-card-foreground">{summary.summary}</p>
                            </div>
                        )}
                        {!loading && !summary && (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg border-primary/40 bg-background/50">
                                <p className="text-muted-foreground">Your generated summary will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
