"use client";

import { UploadCloud } from "lucide-react";
import { Button } from "./ui/button";

export function FileUpload() {
  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-card hover:border-primary transition-colors duration-300 cursor-pointer">
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
          <Button variant="outline">Browse Files</Button>
        </div>
      </div>
    </div>
  );
}
