"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, ClipboardPaste, Wand2, Sparkles, BookOpen, TestTube2, BrainCircuit } from "lucide-react";
import { Summarizer } from "@/components/summarizer";
import { FlashcardGenerator } from "@/components/flashcard-generator";
import { QuizGenerator } from "@/components/quiz-generator";
import { TutorChat } from "@/components/tutor-chat";
import { useAuth } from "@/hooks/use-auth";
import { LoginDialog } from "@/components/login-dialog";

const FeatureCard = ({ icon, title, description, children, onToggle, isOpen }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, onToggle: () => void, isOpen: boolean }) => {
    return (
        <Card className="bg-card border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
            <Accordion type="single" collapsible value={isOpen ? "item-1" : ""}>
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger onClick={onToggle} className="p-6 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                            <div className="text-primary">{icon}</div>
                            <div>
                                <h3 className="text-xl font-bold text-primary neon-glow">{title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        {children}
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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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
  
  const checkAuthAndToggle = (feature: string) => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
    setOpenAccordion(openAccordion === feature ? null : feature);
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
        <TutorChat notes={notes} onGenerate={() => checkAuthAndToggle('tutor')} />
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

         <FeatureCard
          icon={<Wand2 size={24}/>}
          title="AI Summarizer"
          description="Generate concise summaries from your notes instantly."
          onToggle={() => checkAuthAndToggle('summarizer')}
          isOpen={openAccordion === 'summarizer'}
        >
          <Summarizer notes={notes} />
        </FeatureCard>

        <FeatureCard
          icon={<BrainCircuit size={24}/>}
          title="AI Flashcards"
          description="Turn your notes into interactive flashcards for effective learning."
          onToggle={() => checkAuthAndToggle('flashcards')}
          isOpen={openAccordion === 'flashcards'}
        >
          <FlashcardGenerator notes={notes} />
        </FeatureCard>
        
        <FeatureCard
          icon={<TestTube2 size={24}/>}
          title="AI Quiz Generator"
          description="Test your knowledge with auto-generated quizzes."
          onToggle={() => checkAuthAndToggle('quizzes')}
          isOpen={openAccordion === 'quizzes'}
        >
          <QuizGenerator notes={notes} />
        </FeatureCard>
        
        <FeatureCard
          icon={<Sparkles size={24}/>}
          title="AI Tutor Chat"
          description="Your personal AI tutor, ready to answer your questions."
          onToggle={() => checkAuthAndToggle('tutor-chat')}
          isOpen={openAccordion === 'tutor-chat'}
        >
          <TutorChat notes={notes} onGenerate={() => checkAuthAndToggle('tutor-chat')} />
        </FeatureCard>
      </div>
    </div>
    </>
  );
}
