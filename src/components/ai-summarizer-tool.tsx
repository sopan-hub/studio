
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Upload, XCircle, Paperclip, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateSummary, SummaryInput, SummaryOutput } from '@/ai/flows/summarizer-flow';
import { Textarea } from './ui/textarea';
import { chat } from '@/ai/flows/chat-flow';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';


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
        setSummary(null);
        try {
            const input: SummaryInput = { material: inputText };
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
        doc.setFont('Helvetica', 'normal');

        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let currentY = 20;

        const addFormattedText = (text: string) => {
            const lines = text.split('\n');

            lines.forEach(line => {
                if (currentY > pageHeight - margin) {
                    doc.addPage();
                    currentY = margin;
                }
                
                let currentX = margin;

                if (line.startsWith('# ')) {
                    doc.setFont('Helvetica', 'bold');
                    doc.setFontSize(18);
                    const textLines = doc.splitTextToSize(line.substring(2), usableWidth);
                    doc.text(textLines, currentX, currentY);
                    currentY += (textLines.length * 7) + 2;
                } else if (line.startsWith('## ')) {
                    doc.setFont('Helvetica', 'bold');
                    doc.setFontSize(16);
                    const textLines = doc.splitTextToSize(line.substring(3), usableWidth);
                    doc.text(textLines, currentX, currentY);
                    currentY += (textLines.length * 6) + 2;
                } else if (line.startsWith('### ')) {
                    doc.setFont('Helvetica', 'bold');
                    doc.setFontSize(14);
                    const textLines = doc.splitTextToSize(line.substring(4), usableWidth);
                    doc.text(textLines, currentX, currentY);
                    currentY += (textLines.length * 5) + 2;
                } else if (line.startsWith('* ') || line.startsWith('- ')) {
                    doc.setFont('Helvetica', 'normal');
                    doc.setFontSize(11);
                    const bulletPoint = `• ${line.substring(2)}`;
                    const textLines = doc.splitTextToSize(bulletPoint, usableWidth - 5);
                    doc.text(textLines, currentX + 5, currentY);
                    currentY += textLines.length * 5;
                } else {
                    doc.setFont('Helvetica', 'normal');
                    doc.setFontSize(11);
                    const textLines = doc.splitTextToSize(line, usableWidth);
                    doc.text(textLines, currentX, currentY);
                    currentY += textLines.length * 5;
                }
                currentY += 4;
            });
        };

        // --- PDF Content ---
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        const titleLines = doc.splitTextToSize(summary.title, usableWidth);
        doc.text(titleLines, margin, currentY);
        currentY += titleLines.length * 10 + 5;
        
        addFormattedText(summary.summary);
        
        doc.save(`${summary.title.replace(/\s+/g, '_').toLowerCase()}_summary.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                            <ArrowLeft />
                        </Button>
                        <CardTitle className="text-2xl font-bold text-foreground">Generate Notes & Summaries</CardTitle>
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
                                {loading ? <><Loader2 className="animate-spin" /> Generating...</> : <><Sparkles /> Generate Summary</>}
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
                            <div className="p-4 border rounded-lg bg-background/50 h-full overflow-y-auto markdown-content">
                                <h3 className="text-xl font-bold text-secondary mb-4">{summary.title}</h3>
                                <ReactMarkdown>{summary.summary}</ReactMarkdown>
                            </div>
                        )}
                        {!loading && !summary && (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg bg-background/50">
                                <p className="text-muted-foreground">Your generated summary will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
