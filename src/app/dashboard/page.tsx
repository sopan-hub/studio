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
import { ScrollArea } from "@/components/ui/scroll-area";

const FeatureCard = ({ id, title, description, children }: { id: string, title: string, description: string, children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20">
    <Card className="border-4 border-blue-900 shadow-2xl transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-2 hover:scale-105 h-[450px] flex flex-col">
      <div className="cursor-pointer">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl font-headline text-primary">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </div>
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full">
          <CardContent>
            {children}
          </CardContent>
        </ScrollArea>
      </div>
    </Card>
  </section>
);


export default function DashboardPage() {
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedNotes, setPastedNotes] = useState("");

  const handleFileRead = (content: string) => {
    setNotes(content);
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedNotes(text);
    setNotes(text);
  };

  const handleSaveNote = () => {
    console.log("Saving notes:", notes);
    alert("Note saved!");
  };
  
  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg border-4 border-blue-900 shadow-2xl">
        <h2 className="text-2xl font-headline text-primary mb-4 text-center">AI General Search</h2>
        <TutorChat notes={notes} />
      </section>

       <FeatureCard 
        id="notes" 
        title="My Notes" 
        description="Start by adding your study materials here."
      >
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
                    className="min-h-[200px]"
                    value={pastedNotes}
                    onChange={handlePaste}
                  />
                  <Button onClick={handleSaveNote} disabled={!pastedNotes}>Save Note</Button>
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
                      <FileUpload onFileSelect={setUploadedFile} onFileRead={handleFileRead} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard 
          id="summarizer"
          title="AI Summarizer"
          description="Generate concise summaries from your notes instantly."
        >
          <Summarizer notes={notes} />
        </FeatureCard>

        <FeatureCard
          id="flashcards"
          title="AI Flashcards"
          description="Turn your notes into interactive flashcards for effective learning."
        >
          <FlashcardGenerator notes={notes} />
        </FeatureCard>
        
        <FeatureCard
          id="quizzes"
          title="AI Quiz Generator"
          description="Test your knowledge with auto-generated quizzes."
        >
          <QuizGenerator notes={notes} />
        </FeatureCard>
        
        <FeatureCard
          id="tutor"
          title="AI Tutor Chat"
          description="Your personal AI tutor, ready to answer your questions."
        >
          <TutorChat notes={notes} />
        </FeatureCard>
      </div>
    </div>
  );
}
