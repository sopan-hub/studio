
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileUp, BookOpenCheck, BrainCircuit, FileText, BotMessageSquare, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LoginDialog } from "@/components/login-dialog";

const FeatureCard = ({ icon, title, description, children, onToggle, isOpen }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, onToggle: () => void, isOpen: boolean }) => {
  return (
     <Card className="bg-card border-primary/20 overflow-hidden">
      <Accordion type="single" collapsible value={isOpen ? "item-1" : ""}>
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger onClick={onToggle} className="p-6 hover:no-underline">
            <div className="flex items-center gap-4">
              <div className="text-primary">{icon}</div>
              <div>
                <h3 className="text-xl font-bold text-left">{title}</h3>
                <p className="text-muted-foreground text-left text-sm">{description}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState<string | null>(null);

    const checkAuthAndToggle = (feature: string) => {
        if (!user) {
            setIsLoginDialogOpen(true);
        } else {
            setActiveFeature(prev => prev === feature ? null : feature);
        }
    };

  return (
      <div className="space-y-8">
        <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
        <div>
            <h1 className="text-3xl font-bold text-primary neon-glow">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here are your AI-powered study tools.</p>
        </div>

         <div className="grid gap-6">
            {/* My Notes */}
            <FeatureCard 
                title="My Notes" 
                description="Start by adding your study materials here." 
                icon={<FileText size={24} />} 
                isOpen={activeFeature === 'notes'} 
                onToggle={() => checkAuthAndToggle('notes')}
            >
                <div className="space-y-4">
                    <p className="text-muted-foreground">Upload your documents, paste text, or write new notes to get started.</p>
                     <div className="flex gap-4">
                        <Button variant="outline" className="w-full">
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Pencil className="mr-2 h-4 w-4" />
                           Paste Text
                        </Button>
                    </div>
                </div>
            </FeatureCard>

            {/* AI Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FeatureCard 
                    title="AI Summarizer"
                    description="Generate concise summaries from your notes."
                    icon={<BookOpenCheck size={24} />}
                    isOpen={activeFeature === 'summarizer'}
                    onToggle={() => checkAuthAndToggle('summarizer')}
                >
                    <Button className="w-full">Generate Summaries</Button>
                </FeatureCard>

                <FeatureCard 
                    title="AI Flashcards"
                    description="Turn notes into interactive flashcards."
                    icon={<BrainCircuit size={24} />}
                    isOpen={activeFeature === 'flashcards'}
                    onToggle={() => checkAuthAndToggle('flashcards')}
                >
                     <Button className="w-full">Generate Flashcards</Button>
                </FeatureCard>

                <FeatureCard 
                    title="AI Quiz Generator"
                    description="Test your knowledge with auto-generated quizzes."
                    icon={<BotMessageSquare size={24} />}
                    isOpen={activeFeature === 'quizzes'}
                    onToggle={() => checkAuthAndToggle('quizzes')}
                >
                    <Button className="w-full">Generate Quiz</Button>
                </FeatureCard>
            </div>
        </div>
      </div>
  );
}
