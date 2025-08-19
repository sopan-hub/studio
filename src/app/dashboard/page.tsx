
"use client";

import DashboardHeader from "@/components/dashboard-header";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardPaste } from "lucide-react";
import { useState } from "react";

export default function MyNotesPage() {
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSaveNote = () => {
    // Here you would typically save the notes to a database or state management
    console.log("Saving notes:", notes);
    alert("Note saved!");
  };
  
  return (
    <div>
      <DashboardHeader
        title="My Notes"
        description="Upload and manage your study materials here."
      />
      <div className="mt-8">
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">
              <ClipboardPaste className="mr-2 h-4 w-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="upload">
              <FileText className="mr-2 h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>
          <TabsContent value="paste">
            <Card>
              <CardHeader>
                <CardTitle>Paste your notes</CardTitle>
                <CardDescription>
                  Copy and paste your notes into the text box below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste your notes here..." 
                  className="min-h-[300px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button onClick={handleSaveNote} disabled={!notes}>Save Note</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
             <Card>
                <CardHeader>
                    <CardTitle>Upload from your device</CardTitle>
                    <CardDescription>
                    Select a file from your device to upload.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload onFileSelect={setUploadedFile} />
                    {uploadedFile && (
                        <div className="mt-4 p-4 border rounded-lg">
                            <p className="font-semibold">Selected file:</p>
                            <p>{uploadedFile.name}</p>
                        </div>
                    )}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
