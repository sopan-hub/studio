"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardPaste, Wand2, Sparkles, BookOpen, TestTube2, BrainCircuit } from "lucide-react";
import { Summarizer } from "@/components/summarizer";
import { FlashcardGenerator } from "@/components/flashcard-generator";
import { QuizGenerator } from "@/components/quiz-generator";
import { TutorChat } from "@/components/tutor-chat";
import { useAuth } from "@/hooks/use-auth";
import { LoginDialog } from "@/components/login-dialog";

export default function DashboardPage() {
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedNotes, setPastedNotes] = useState("");
  const { user, loading } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsLoginDialogOpen(true);
    }
  }, [user, loading]);

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
  
  if (loading || !user) {
    return <LoginDialog open={!loading && !user} onOpenChange={setIsLoginDialogOpen} />;
  }
  
  return (
    <>
    <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4 text-center neon-glow">AI General Search</h2>
        <TutorChat notes={notes} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="lg:col-span-2">
           <Card className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center gap-2"><BookOpen /> My Notes</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Start by adding your study materials here.</CardDescription>
              </CardHeader>
              <CardContent>
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
                        <Button onClick={handleSaveNote} disabled={!pastedNotes} className="neon-glow-button">Save Note</Button>
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
              </CardContent>
            </Card>
        </div>

        <Card className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center gap-2"><Wand2 size={24}/> AI Summarizer</CardTitle>
                <CardDescription>Generate concise summaries from your notes instantly.</CardDescription>
            </CardHeader>
            <CardContent>
                <Summarizer notes={notes} />
            </CardContent>
        </Card>

        <Card className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center gap-2"><BrainCircuit size={24}/> AI Flashcards</CardTitle>
                <CardDescription>Turn your notes into interactive flashcards for effective learning.</CardDescription>
            </CardHeader>
            <CardContent>
                <FlashcardGenerator notes={notes} />
            </CardContent>
        </Card>
        
        <Card className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center gap-2"><TestTube2 size={24}/> AI Quiz Generator</CardTitle>
                <CardDescription>Test your knowledge with auto-generated quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
                <QuizGenerator notes={notes} />
            </CardContent>
        </Card>
        
        <Card className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-primary neon-glow flex items-center gap-2"><Sparkles size={24}/> AI Tutor Chat</CardTitle>
                <CardDescription>Your personal AI tutor, ready to answer your questions.</CardDescription>
            </CardHeader>
            <CardContent>
                <TutorChat notes={notes} />
            </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
