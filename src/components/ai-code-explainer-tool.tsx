
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { explainCode, CodeExplainerInput, CodeExplainerOutput } from '@/ai/flows/code-explainer-flow';
import { Textarea } from './ui/textarea';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AiLoadingAnimation } from './ui/ai-loading-animation';

interface AiCodeExplainerToolProps {
    onBack: () => void;
}

export const AiCodeExplainerTool = ({ onBack }: AiCodeExplainerToolProps) => {
    const [explanation, setExplanation] = useState<CodeExplainerOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const { toast } = useToast();
    
    useEffect(() => {
        import("jspdf/dist/polyfills.es.js");
    }, []);

    const handleGenerate = async () => {
        if (!code.trim()) {
            toast({ variant: "destructive", title: "Input Required", description: "Please paste a code snippet." });
            return;
        }
        
        setLoading(true);
        setExplanation(null);
        try {
            const input: CodeExplainerInput = { code, language };
            const result = await explainCode(input);
            setExplanation(result);
        } catch (error) {
            console.error("AI code explainer error:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to explain the code." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadPdf = () => {
        if (!explanation) return;
        
        const doc = new jsPDF();
        doc.addFont('Helvetica', 'normal', 'normal');
        doc.setFont('Helvetica');

        const margin = 15;
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let y = 20;

        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        doc.text("Code Explanation", margin, y);
        y += 10;
        
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        doc.text(`Language: ${explanation.language}`, margin, y);
        y += 10;

        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text("Summary:", margin, y);
        y += 6;
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(explanation.summary, usableWidth);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 5 + 10;
        
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text("Line-by-Line Explanation:", margin, y);
        y += 8;
        
        const addFormattedText = (text: string) => {
            const lines = text.split('\\n');
            lines.forEach(line => {
                if (y > 280) { doc.addPage(); y = margin; }
                const isCode = line.startsWith('`') && line.endsWith('`');
                doc.setFont('Helvetica', isCode ? 'Courier' : 'normal');
                doc.setFontSize(isCode ? 10 : 11);
                const textLines = doc.splitTextToSize(line, usableWidth);
                doc.text(textLines, margin, y);
                y += textLines.length * 5 + 2;
            });
        };
        addFormattedText(explanation.lineByLineExplanation);

        doc.save(`code_explanation_${explanation.language}.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary"><ArrowLeft /></Button>
                        <CardTitle className="text-2xl font-bold text-foreground">Code Explainer</CardTitle>
                    </div>
                     <Button variant="outline" onClick={handleDownloadPdf} disabled={!explanation || loading}>
                        <Download className="mr-2" /> Download PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="code">Paste Code Snippet</Label>
                        <Textarea
                            id="code"
                            placeholder={`function helloWorld() {\n  console.log("Hello, World!");\n}`}
                            className="min-h-[250px] flex-grow font-mono"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={loading}
                        />

                        <Label htmlFor="language">Language (optional)</Label>
                         <Input
                            id="language"
                            placeholder="e.g., 'JavaScript', 'Python' (or leave blank to auto-detect)"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            disabled={loading}
                        />
                        
                        <div className="flex items-center gap-2">
                            <Button onClick={handleGenerate} disabled={loading} className="self-start neon-glow-button">
                                {loading ? <><Loader2 className="animate-spin" /> Explaining...</> : <><Sparkles /> Explain Code</>}
                            </Button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="mt-0 min-h-[400px]">
                        {loading ? (
                            <AiLoadingAnimation text="Analyzing the code..." />
                        ) : explanation ? (
                            <div className="p-4 border rounded-lg bg-background/50 h-full overflow-y-auto markdown-content">
                                <h3 className="text-lg font-bold text-primary mb-2">Summary</h3>
                                <p className="mb-4">{explanation.summary}</p>
                                
                                <h3 className="text-lg font-bold text-primary mb-2">Detailed Explanation ({explanation.language})</h3>
                                <ReactMarkdown>{explanation.lineByLineExplanation}</ReactMarkdown>
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg bg-background/50">
                                <p className="text-muted-foreground">The code explanation will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
