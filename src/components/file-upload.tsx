
"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onFileSelect(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0] || null;
        onFileSelect(file);
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
                    accept=".pdf,.docx,.txt"
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
                        Supports: PDF, DOCX, TXT
                    </p>
                    <Button variant="outline" type="button" onClick={(e) => { e.stopPropagation(); handleBrowseClick();}}>Browse Files</Button>
                </div>
            </div>
        </div>
    );
}
