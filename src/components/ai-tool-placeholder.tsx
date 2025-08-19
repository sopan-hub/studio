
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Sparkles, Download, Paperclip, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

interface AiToolPlaceholderProps {
    title: string;
    onBack: () => void;
    inputType: 'text' | 'text-file' | 'file' | 'none';
}

export const AiToolPlaceholder = ({ title, onBack, inputType }: AiToolPlaceholderProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [file, setFile] = React.useState<File | null>(null);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
    <Card className="w-full bg-card border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in">
        <CardHeader>
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="hover:text-primary">
                        <ArrowLeft />
                    </Button>
                    <CardTitle className="text-2xl font-bold text-primary neon-glow">{title}</CardTitle>
                </div>
                 <Button variant="outline" disabled>
                    <Download className="mr-2" />
                    Download PDF
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                {(inputType === 'text' || inputType === 'text-file') && (
                    <Textarea placeholder={`Input for ${title}...`} className="min-h-[200px]" />
                )}
                
                {file && (
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border border-primary/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                            <span>{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                
                {(inputType === 'file' || inputType === 'text-file') && !file && (
                     <div className="flex items-center justify-center w-full">
                        <label htmlFor={`dropzone-file-${title}`} className="flex flex-col items-center justify-center w-full h-48 border-2 border-primary/40 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, TXT, DOCX, etc.</p>
                            </div>
                            <input id={`dropzone-file-${title}`} type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        </label>
                    </div> 
                )}
                
                <div className="flex items-center gap-4">
                    {inputType !== 'none' && (
                        <Button disabled className="self-start neon-glow-button">
                            <Sparkles />
                            Generate
                        </Button>
                    )}
                    
                    {(inputType === 'text' || inputType === 'text-file') && (
                         <Button variant="outline" onClick={handleUploadClick} className="self-start">
                            <Upload />
                            {file ? 'Change File' : 'Upload File'}
                        </Button>
                    )}
                </div>

                <div className="mt-4 p-4 border border-dashed border-primary/40 rounded-lg min-h-[150px] bg-background/50">
                    <p className="text-muted-foreground">AI output for {title} will appear here...</p>
                </div>
            </div>
        </CardContent>
    </Card>
    );
};
