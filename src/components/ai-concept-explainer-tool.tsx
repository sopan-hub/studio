
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { explainConcept, ConceptExplainerInput, ConceptExplainerOutput } from '@/ai/flows/concept-explainer-flow';
import { Textarea } from './ui/textarea';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AiConceptExplainerToolProps {
    onBack: () => void;
}

export const AiConceptExplainerTool = ({ onBack }: AiConceptExplainerToolProps) => {
    const [explanation, setExplanation] = useState<ConceptExplainerOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [concept, setConcept] = useState("");
    const [audience, setAudience] = useState("a beginner");
    const { toast } = useToast();
    
    useEffect(() => {
        import("jspdf/dist/polyfills.es.js");
    }, []);

    const handleGenerate = async () => {
        if (!concept.trim()) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please enter a concept to explain.",
            });
            return;
        }
        
        setLoading(true);
        setExplanation(null);
        try {
            const input: ConceptExplainerInput = { concept, audience };
            const result = await explainConcept(input);
            setExplanation(result);
        } catch (error) {
            console.error("AI explainer error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate explanation. Please try again.",
            });
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

        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        let y = 20;
        const titleLines = doc.splitTextToSize(explanation.title, usableWidth);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 10;
        
        const addFormattedText = (text: string) => {
            const lines = text.split('\n');

            lines.forEach(line => {
                if (y > 280) {
                    doc.addPage();
                    y = margin;
                }
                
                let currentX = margin;

                if (line.startsWith('# ')) {
                    doc.setFont('Helvetica', 'bold');
                    doc.setFontSize(16);
                    doc.text(line.substring(2), currentX, y);
                    y += 8;
                } else if (line.startsWith('## ')) {
                    doc.setFont('Helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.text(line.substring(3), currentX, y);
                    y += 7;
                } else if (line.startsWith('* ') || line.startsWith('- ')) {
                    doc.setFont('Helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.text(`• ${line.substring(2)}`, currentX + 5, y);
                     y += 6;
                } else {
                    doc.setFont('Helvetica', 'normal');
                    doc.setFontSize(11);
                    const textLines = doc.splitTextToSize(line, usableWidth);
                    doc.text(textLines, currentX, y);
                    y += textLines.length * 5 + 2;
                }
            });
        };

        addFormattedText(explanation.explanation);
        
        if(explanation.analogy) {
            y += 5;
            doc.setFontSize(14);
            doc.setFont('Helvetica', 'bold');
            doc.text("Analogy:", margin, y);
            y += 8;
            addFormattedText(explanation.analogy);
        }

        doc.save(`${explanation.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary"><ArrowLeft /></Button>
                        <CardTitle className="text-2xl font-bold text-foreground">Concept Explainer</CardTitle>
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
                        <Label htmlFor="concept">Concept or Question</Label>
                        <Textarea
                            id="concept"
                            placeholder="e.g., 'What is quantum entanglement?' or 'Explain how a black hole is formed.'"
                            className="min-h-[150px] flex-grow"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            disabled={loading}
                        />

                        <Label htmlFor="audience">Explain it to...</Label>
                         <Input
                            id="audience"
                            placeholder="e.g., 'a 5-year-old'"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            disabled={loading}
                        />
                        
                        <div className="flex items-center gap-2">
                            <Button onClick={handleGenerate} disabled={loading} className="self-start neon-glow-button">
                                {loading ? <><Loader2 className="animate-spin" /> Explaining...</> : <><Sparkles /> Explain</>}
                            </Button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="mt-0 min-h-[400px]">
                        {loading && (
                             <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-8 w-8 text-primary" /><p>Simplifying the concept...</p>
                            </div>
                        )}
                        {explanation && (
                            <div className="p-4 border rounded-lg bg-background/50 h-full overflow-y-auto markdown-content">
                                <h3 className="text-xl font-bold text-primary mb-4">{explanation.title}</h3>
                                <ReactMarkdown>{explanation.explanation}</ReactMarkdown>
                                {explanation.analogy && (
                                    <blockquote className="mt-4">
                                        <p className="font-bold">Analogy:</p>
                                        <ReactMarkdown>{explanation.analogy}</ReactMarkdown>
                                    </blockquote>
                                )}
                            </div>
                        )}
                        {!loading && !explanation && (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg bg-background/50">
                                <p className="text-muted-foreground">The explanation will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
