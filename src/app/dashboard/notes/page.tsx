
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, FileText } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="animate-blast-in">
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
          <CardDescription>Upload your study materials or paste them directly. Supports PDF, DOCX, TXT, and even images of handwritten notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paste">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">
                <FileText className="mr-2" /> Paste Text
              </TabsTrigger>
              <TabsTrigger value="upload">
                <UploadCloud className="mr-2" /> Upload File
              </TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="pt-4">
                 <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Paste your notes</h3>
                    <p className="text-sm text-muted-foreground">Copy and paste your notes into the text box below.</p>
                    <Textarea placeholder="Paste your notes here..." className="min-h-[200px]" />
                    <Button className="self-end">Save Note</Button>
                 </div>
            </TabsContent>
            <TabsContent value="upload" className="pt-4">
                 <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg text-center">
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Click to upload or drag and drop</h3>
                    <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT, PNG, JPG</p>
                    <Button variant="outline">Select File</Button>
                </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
