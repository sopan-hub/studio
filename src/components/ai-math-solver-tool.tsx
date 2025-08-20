
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { solveMathProblem, MathSolverInput, MathSolverOutput } from '@/ai/flows/math-solver-flow';
import { Textarea } from './ui/textarea';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Label } from './ui/label';

interface AiMathSolverToolProps {
    onBack: () => void;
}

export const AiMathSolverTool = ({ onBack }: AiMathSolverToolProps) => {
    const [solution, setSolution] = useState<MathSolverOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [problem, setProblem] = useState("");
    const { toast } = useToast();
    
    useEffect(() => {
        import("jspdf/dist/polyfills.es.js");
    }, []);

    const handleGenerate = async () => {
        if (!problem.trim()) {
            toast({ variant: "destructive", title: "Input Required", description: "Please enter a math problem." });
            return;
        }
        
        setLoading(true);
        setSolution(null);
        try {
            const input: MathSolverInput = { problem };
            const result = await solveMathProblem(input);
            setSolution(result);
        } catch (error) {
            console.error("AI math solver error:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to solve the problem." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadPdf = () => {
        if (!solution) return;
        
        const doc = new jsPDF();
        doc.addFont('Helvetica', 'normal', 'normal');
        doc.setFont('Helvetica');

        const margin = 15;
        const usableWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let y = 20;

        // Title
        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        doc.text("Math Problem Solver", margin, y);
        y += 10;
        
        // Problem
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'bold');
        doc.text("Problem:", margin, y);
        y += 6;
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');
        const problemLines = doc.splitTextToSize(problem, usableWidth);
        doc.text(problemLines, margin, y);
        y += problemLines.length * 5 + 10;
        
        // Final Answer
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text("Final Answer:", margin, y);
        y += 8;
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        const answerLines = doc.splitTextToSize(solution.finalAnswer, usableWidth);
        doc.text(answerLines, margin + 5, y);
        y += answerLines.length * 6 + 10;
        
        // Steps
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text("Step-by-Step Solution:", margin, y);
        y += 8;

        const addFormattedText = (text: string) => {
            const lines = text.split('\n');
            lines.forEach(line => {
                if (y > 280) { doc.addPage(); y = margin; }
                doc.setFontSize(11);
                doc.setFont('Helvetica', 'normal');
                const textLines = doc.splitTextToSize(line, usableWidth);
                doc.text(textLines, margin, y);
                y += textLines.length * 5 + 2;
            });
        };

        addFormattedText(solution.stepByStepSolution);

        doc.save(`math-solution.pdf`);
    };

    return (
        <Card className="w-full bg-card shadow-lg animate-blast-in">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary"><ArrowLeft /></Button>
                        <CardTitle className="text-2xl font-bold text-foreground">Math Problem Solver</CardTitle>
                    </div>
                     <Button variant="outline" onClick={handleDownloadPdf} disabled={!solution || loading}>
                        <Download className="mr-2" /> Download PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="problem">Enter Math Problem</Label>
                        <Textarea
                            id="problem"
                            placeholder="e.g., Solve for x in 3x - 7 = 11, or 'A train leaves station A...'"
                            className="min-h-[150px] flex-grow font-mono"
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            disabled={loading}
                        />
                        
                        <div className="flex items-center gap-2">
                            <Button onClick={handleGenerate} disabled={loading} className="self-start neon-glow-button">
                                {loading ? <><Loader2 className="animate-spin" /> Solving...</> : <><Sparkles /> Solve Problem</>}
                            </Button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="mt-0 min-h-[400px]">
                        {loading && (
                             <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                <Loader2 className="animate-spin h-8 w-8 text-primary" /><p>Calculating the solution...</p>
                            </div>
                        )}
                        {solution && (
                            <div className="p-4 border rounded-lg bg-background/50 h-full overflow-y-auto markdown-content">
                                <h3 className="text-lg font-bold text-primary mb-2">Final Answer</h3>
                                <div className="p-3 rounded-md bg-muted text-lg font-bold font-mono mb-6">{solution.finalAnswer}</div>
                                
                                <h3 className="text-lg font-bold text-primary mb-2">Step-by-Step Solution</h3>
                                <ReactMarkdown>{solution.stepByStepSolution}</ReactMarkdown>
                            </div>
                        )}
                        {!loading && !solution && (
                             <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-lg bg-background/50">
                                <p className="text-muted-foreground">The solution will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
