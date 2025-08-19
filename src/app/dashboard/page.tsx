"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardPaste } from "lucide-react";
import { Summarizer } from "@/components/summarizer";
import { FlashcardGenerator } from "@/components/flashcard-generator";
import { QuizGenerator } from "@/components/quiz-generator";
import { TutorChat } from "@/components/tutor-chat";

const FeatureCard = ({ id, title, description, children }: { id: string, title: string, description: string, children: React.ReactNode }) => (
  <section id={id} className="mb-16 scroll-mt-20">
    <Card className="shadow-2xl transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  </section>
);


export default function DashboardPage() {
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSaveNote = () => {
    // Here you would typically save the notes to a database or state management
    console.log("Saving notes:", notes);
    alert("Note saved!");
  };
  
  return (
    <div className="space-y-16">
       <FeatureCard id="notes" title="My Notes" description="Start by adding your study materials here.">
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
      </FeatureCard>

      <FeatureCard 
        id="summarizer"
        title="AI Summarizer"
        description="Generate concise summaries from your notes instantly."
      >
        <Summarizer />
      </FeatureCard>

      <FeatureCard
        id="flashcards"
        title="AI Flashcards"
        description="Turn your notes into interactive flashcards for effective learning."
      >
        <FlashcardGenerator />
      </FeatureCard>
      
      <FeatureCard
        id="quizzes"
        title="AI Quiz Generator"
        description="Test your knowledge with auto-generated quizzes."
      >
        <QuizGenerator />
      </FeatureCard>
      
      <FeatureCard
        id="tutor"
        title="AI Tutor Chat"
        description="Your personal AI tutor, ready to answer your questions."
      >
        <TutorChat />
      </FeatureCard>
    </div>
  );
}
