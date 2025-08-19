
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpenCheck, BrainCircuit, FileText, BotMessageSquare, CalendarClock, BarChart3, Bookmark, Mail, Instagram, LogIn, Lightbulb, Pilcrow, Search, Layers, Variable, Code, Languages } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Logo } from "@/components/logo";
import { useAuth } from '@/hooks/use-auth';
import { LoginDialog } from '@/components/login-dialog';
import { InteractiveAiLogo } from '@/components/interactive-ai-logo';
import { AiChatTool } from '@/components/ai-chat-tool';
import { AiQuizTool } from '@/components/ai-quiz-tool';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { AiSummarizerTool } from '@/components/ai-summarizer-tool';
import { ParticleFooter } from '@/components/particle-footer';

type FeatureKey = 'chat' | 'summarizer' | 'quiz' | 'explainer' | 'flashcards' | 'math' | 'code' | 'translator' | null;

const FeatureCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
    <div onClick={onClick} className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:-translate-y-2 cursor-pointer h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <div className="text-primary bg-primary/10 p-2 rounded-lg">{icon}</div>
            <h3 className="text-xl font-bold text-foreground neon-glow">{title}</h3>
        </div>
        <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
)

export default function Home() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const featuresRef = useRef<HTMLElement>(null);

  const handleFeatureClick = (feature: FeatureKey) => {
    if (!user) {
        setIsLoginDialogOpen(true);
    } else {
        setActiveFeature(feature);
        if (featuresRef.current) {
            featuresRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };
  
  const handleLoginLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (user) {
      signOut();
      setActiveFeature(null); // Close any open feature on logout
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  const handleStartStudying = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleGlobalSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!globalSearchQuery.trim()) {
          toast({ variant: 'destructive', title: "Search query can't be empty." });
          return;
      }
      if (!user) {
        setIsLoginDialogOpen(true);
        return;
      }
      setActiveFeature('chat');
      // The AiChatTool will need to be able to accept a default query.
      // We will pass it via a prop.
      // We'll manage this interaction when we switch to the component.
      if (featuresRef.current) {
          featuresRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  };
  
  // Effect to reset active feature if user logs out
  useEffect(() => {
    if (!user) {
        setActiveFeature(null);
    }
  }, [user]);

  const renderActiveFeature = () => {
    switch (activeFeature) {
        case 'chat':
            return <AiChatTool 
                        title="Ask Any Question (AI Chat)"
                        onBack={() => setActiveFeature(null)} 
                        initialQuestion={globalSearchQuery}
                        onSearchPerformed={() => setGlobalSearchQuery("")}
                    />;
        case 'summarizer':
            return <AiSummarizerTool onBack={() => setActiveFeature(null)} />;
        case 'quiz':
            return <AiQuizTool onBack={() => setActiveFeature(null)} />;
        case 'explainer':
            return <AiChatTool title="Concept Explainer" onBack={() => setActiveFeature(null)} />;
        case 'flashcards':
            return <AiChatTool title="AI Flashcard Maker" onBack={() => setActiveFeature(null)} initialQuestion="Generate flashcards based on the following text: " />;
        case 'math':
            return <AiChatTool title="Math Problem Solver" onBack={() => setActiveFeature(null)} initialQuestion="Solve the following math problem: " />;
        case 'code':
            return <AiChatTool title="Code Explainer" onBack={() => setActiveFeature(null)} initialQuestion="Explain this code: " />;
        case 'translator':
            return <AiChatTool title="Document Translator" onBack={() => setActiveFeature(null)} initialQuestion="Translate the following document to " />;
        default:
            return null;
    }
  };

  return (
    <div className="bg-background text-foreground">
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} onLoginSuccess={() => { /* can decide what to do after login, e.g. open the last clicked feature */ }}/>
      {/* Header */}
       <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-primary/20">
        <div className="container mx-auto flex items-center justify-between p-4 gap-4">
           <div className="flex items-center gap-2">
            <Logo />
          </div>
          <div className="flex-1 max-w-lg">
             <form onSubmit={handleGlobalSearch} className="relative">
                <Input 
                    type="search"
                    placeholder="AI General Search..."
                    className="w-full pl-10"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             </form>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-muted-foreground hover:text-primary transition-all">Features</Link>
             <Button onClick={handleLoginLogout} variant="ghost" className="hover:text-primary transition-all">
                {user ? 'Log Out' : 'Log In'}
            </Button>
          </nav>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                <span className="text-primary neon-glow">Your Personal</span>
                <br/>
                <span className="text-primary neon-glow">AI Study Buddy</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Ask questions, generate summaries, create quizzes, and organize your study like never before.
              </p>
               <Link href="#features" onClick={handleStartStudying} passHref>
                 <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-button animate-pulse" >
                    Start Studying Now
                </Button>
              </Link>
            </div>
            <div>
              <InteractiveAiLogo />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" ref={featuresRef} className="py-16 bg-background/50">
           <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Powerful Features to Boost Your Learning</h2>
              <p className="text-lg text-muted-foreground mt-2">Everything you need to succeed in your studies, powered by AI.</p>
            </div>
            
            {activeFeature ? (
                renderActiveFeature()
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard 
                        onClick={() => handleFeatureClick('chat')}
                        icon={<BotMessageSquare size={24}/>}
                        title="Ask Any Question"
                        description="Get instant, detailed answers to your questions from an expert AI tutor."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('summarizer')}
                        icon={<FileText size={24}/>}
                        title="Generate Summaries"
                        description="Automatically create concise summaries and organized notes from any text."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('quiz')}
                        icon={<BrainCircuit size={24}/>}
                        title="Smart Quiz Maker"
                        description="Test your knowledge with custom quizzes generated from your study materials."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('explainer')}
                        icon={<Lightbulb size={24}/>}
                        title="Concept Explainer"
                        description="Break down complex topics and concepts into easy-to-understand explanations."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('flashcards')}
                        icon={<Layers size={24}/>}
                        title="AI Flashcard Maker"
                        description="Turn your study notes into interactive flashcards for effective revision."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('math')}
                        icon={<Variable size={24}/>}
                        title="Math Problem Solver"
                        description="Get step-by-step solutions for complex math problems, from algebra to calculus."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('code')}
                        icon={<Code size={24}/>}
                        title="Code Explainer"
                        description="Understand code snippets in any programming language with detailed explanations."
                    />
                    <FeatureCard
                        onClick={() => handleFeatureClick('translator')}
                        icon={<Languages size={24}/>}
                        title="Document Translator"
                        description="Translate your study documents into multiple languages instantly."
                    />
                </div>
            )}
          </div>
        </section>
      </main>
      <footer className="bg-background border-t border-primary/20 py-8 relative">
        <ParticleFooter />
        <div className="container mx-auto text-center text-muted-foreground relative z-10">
          <p>&copy; 2024 Study Buddy AI. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
             <a href="mailto:patilsopan4148@gmail.com" className="hover:text-primary transition-all" aria-label="Email">
              <Mail className="h-6 w-6" />
            </a>
            <a href="https://github.com/sopan-hub" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all" aria-label="GitHub">
                <GitHubIcon className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/sopan.147/profilecard/?igsh=MXJ3NTF6c3BnM2Fucg==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
