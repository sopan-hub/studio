
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface AiToolPlaceholderProps {
    title: string;
    onBack: () => void;
    inputType: 'text' | 'text-file' | 'file' | 'none';
}

export const AiToolPlaceholder = ({ title, onBack, inputType }: AiToolPlaceholderProps) => (
    <Card className="w-full bg-card border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                    <ArrowLeft />
                </Button>
                <CardTitle className="text-2xl font-bold text-primary neon-glow">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                {inputType === 'text' && (
                    <Textarea placeholder={`Input for ${title}...`} className="min-h-[200px]" />
                )}
                {inputType === 'file' && (
                     <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary/40 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, TXT, DOCX, etc.</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 
                )}
                {inputType === 'text-file' && (
                     <>
                        <Textarea placeholder={`Paste text or upload a file for ${title}...`} className="min-h-[200px]" />
                        <Button variant="outline" className="self-start">
                            <Upload />
                            Upload File
                        </Button>
                     </>
                )}
                {inputType !== 'none' && (
                    <Button className="self-start neon-glow-button">
                        <Sparkles />
                        Generate
                    </Button>
                )}

                <div className="mt-4 p-4 border border-dashed border-primary/40 rounded-lg min-h-[150px] bg-background/50">
                    <p className="text-muted-foreground">AI output for {title} will appear here...</p>
                </div>
            </div>
        </CardContent>
    </Card>
);
