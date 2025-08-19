"use client";

import { useState, useEffect } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { LoginDialog } from "@/components/login-dialog";

const FeatureCard = ({ id, title, description, children, onOpen, isOpen, animationDelay }: { id: string, title: string, description: string, children: React.ReactNode, onOpen?: () => boolean, isOpen?: boolean, animationDelay?: string }) => {
  
  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onOpen && !onOpen()) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  return (
    <Card 
      className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-blast-in"
      style={{ animationDelay }}
    >
      <Accordion type="single" collapsible className="w-full" value={isOpen ? id : ""}>
        <AccordionItem value={id} className="border-b-0">
          <AccordionTrigger onClick={handleTriggerClick} className="p-6 hover:no-underline">
            <div className="text-left">
              <CardTitle className="text-xl font-bold text-primary neon-glow">{title}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-6 pt-0">
              {children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};


export default function DashboardPage() {
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedNotes, setPastedNotes] = useState("");
  const { user, loading } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  useEffect(() => {
    // If not loading and no user, open the login dialog
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

  const checkAuthAndToggle = (featureId: string) => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return false; // Important: prevent accordion from opening
    }
    setActiveFeature(prev => prev === featureId ? null : featureId);
    return true; // Allow accordion to open
  };

  // Do not render anything if loading, show dialog if not logged in
  if (loading || !user) {
    return <LoginDialog open={!loading && !user} onOpenChange={setIsLoginDialogOpen} />;
  }
  
  return (
    <>
    <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4 text-center neon-glow">AI General Search</h2>
        <TutorChat notes={notes} onGenerate={() => checkAuthAndToggle('tutor-main')}/>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
           <FeatureCard 
            id="notes" 
            title="My Notes" 
            description="Start by adding your study materials here."
            isOpen={activeFeature === 'notes'}
            onOpen={() => { setActiveFeature(prev => prev === 'notes' ? null : 'notes'); return true; }}
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
          </FeatureCard>
        </div>

        <FeatureCard 
          id="summarizer"
          title="AI Summarizer"
          description="Generate concise summaries from your notes instantly."
          isOpen={activeFeature === 'summarizer'}
          onOpen={() => checkAuthAndToggle('summarizer')}
          animationDelay="0.1s"
        >
          <Summarizer notes={notes} />
        </FeatureCard>

        <FeatureCard
          id="flashcards"
          title="AI Flashcards"
          description="Turn your notes into interactive flashcards for effective learning."
          isOpen={activeFeature === 'flashcards'}
          onOpen={() => checkAuthAndToggle('flashcards')}
          animationDelay="0.2s"
        >
          <FlashcardGenerator notes={notes} />
        </FeatureCard>
        
        <FeatureCard
          id="quizzes"
          title="AI Quiz Generator"
          description="Test your knowledge with auto-generated quizzes."
          isOpen={activeFeature === 'quizzes'}
          onOpen={() => checkAuthAndToggle('quizzes')}
          animationDelay="0.3s"
        >
          <QuizGenerator notes={notes} />
        </FeatureCard>
        
        <FeatureCard
          id="tutor"
          title="AI Tutor Chat"
          description="Your personal AI tutor, ready to answer your questions."
          isOpen={activeFeature === 'tutor'}
          onOpen={() => checkAuthAndToggle('tutor')}
          animationDelay="0.4s"
        >
          <TutorChat notes={notes} onGenerate={() => checkAuthAndToggle('tutor')} />
        </FeatureCard>
      </div>
    </div>
    </>
  );
}
