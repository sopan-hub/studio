
"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    onFileRead: (content: string) => void;
}

export function FileUpload({ onFileSelect, onFileRead }: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | null) => {
        if (file) {
            onFileSelect(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                onFileRead(text);
            };
            if (file.type === "application/pdf") {
                // For simplicity, we'll just show an alert. PDF parsing is complex.
                alert("PDF parsing is not implemented in this example.");
                onFileRead("");
            } else {
                reader.readAsText(file);
            }
        } else {
            onFileSelect(null);
            onFileRead("");
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        handleFile(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0] || null;
        handleFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className="w-full">
            <div 
                className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-card hover:border-primary transition-colors duration-300 cursor-pointer"
                onClick={handleBrowseClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".docx,.txt"
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-secondary p-4 rounded-full">
                        <UploadCloud className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold font-headline">
                        Drag & drop your notes here
                    </h2>
                    <p className="text-muted-foreground">
                        or click to browse your files
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Supports: DOCX, TXT
                    </p>
                    <Button variant="outline" type="button" onClick={(e) => { e.stopPropagation(); handleBrowseClick();}}>Browse Files</Button>
                </div>
            </div>
        </div>
    );
}
