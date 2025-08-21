
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search, BrainCircuit, Bot, FileText, ListChecks, UserCircle, LogOut, BookOpen, MessageSquare, Microscope, FlaskConical, Target, Github, Instagram, Mail, HelpCircle, Columns, Sigma, Code, Languages, Hand } from 'lucide-react';
import { AiChatTool } from '@/components/ai-chat-tool';
import { AiSummarizerTool } from '@/components/ai-summarizer-tool';
import { AiQuizTool } from '@/components/ai-quiz-tool';
import { InteractiveAiLogo } from '@/components/interactive-ai-logo';
import { useAuth } from '@/hooks/use-auth';
import { LoginDialog } from '@/components/login-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AiFlashcardTool } from '@/components/ai-flashcard-tool';
import { AiConceptExplainerTool } from '@/components/ai-concept-explainer-tool';
import { AiMathSolverTool } from '@/components/ai-math-solver-tool';
import { AiCodeExplainerTool } from '@/components/ai-code-explainer-tool';
import { AiTranslatorTool } from '@/components/ai-translator-tool';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GestureController } from '@/components/gesture-controller';


type Tool = 'chat' | 'summarizer' | 'quiz' | 'explainer' | 'flashcards' | 'math' | 'code' | 'translator';

const toolComponents: Record<Tool, React.ComponentType<{ onBack: () => void }>> = {
  chat: (props) => <AiChatTool {...props} title="Ask Any Question" />,
  summarizer: AiSummarizerTool,
  quiz: AiQuizTool,
  explainer: AiConceptExplainerTool,
  flashcards: AiFlashcardTool,
  math: AiMathSolverTool,
  code: AiCodeExplainerTool,
  translator: AiTranslatorTool,
};

const featureCards = [
  {
    tool: 'chat' as Tool,
    icon: <HelpCircle />,
    title: 'Ask Any Question',
    description: 'Get instant, detailed answers to your questions from an expert AI tutor.',
  },
  {
    tool: 'summarizer' as Tool,
    icon: <FileText />,
    title: 'Generate Summaries',
    description: 'Automatically create concise summaries and organized notes from any text.',
  },
  {
    tool: 'quiz' as Tool,
    icon: <ListChecks />,
    title: 'Smart Quiz Maker',
    description: 'Test your knowledge with custom quizzes generated from your study materials.',
  },
    {
    tool: 'explainer' as Tool,
    icon: <BrainCircuit />,
    title: 'Concept Explainer',
    description: 'Break down complex topics and concepts into easy-to-understand explanations.',
  },
  {
    tool: 'flashcards' as Tool,
    icon: <Columns />,
    title: 'AI Flashcard Maker',
    description: 'Turn your study notes into interactive flashcards for effective revision.',
  },
  {
    tool: 'math' as Tool,
    icon: <Sigma />,
    title: 'Math Problem Solver',
    description: 'Get step-by-step solutions for complex math problems, from algebra to calculus.',
  },
    {
    tool: 'code' as Tool,
    icon: <Code />,
    title: 'Code Explainer',
    description: 'Understand code snippets in any programming language with detailed explanations.',
  },
  {
    tool: 'translator' as Tool,
    icon: <Languages />,
    title: 'Document Translator',
    description: 'Translate your study documents into multiple languages instantly.',
  },
];


export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const { user, signOut } = useAuth();
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isGestureControlEnabled, setGestureControlEnabled] = useState(false);


  const handleToolSelect = (tool: Tool) => {
    setActiveTool(tool);
  };
  
  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setActiveTool('chat');
    }
  };

  const renderContent = () => {
    if (activeTool) {
        if (activeTool === 'chat' && globalSearch) {
            return <AiChatTool onBack={() => { setActiveTool(null); setGlobalSearch(""); }} title="Ask Any Question" initialQuestion={globalSearch} onSearchPerformed={() => setGlobalSearch("")}/>
        }
      const ToolComponent = toolComponents[activeTool];
      return <ToolComponent onBack={() => setActiveTool(null)} />;
    }

    return (
       <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">

        {/* Search Section */}
        <section aria-labelledby="global-search-heading">
            <div className="max-w-2xl mx-auto mt-4 text-center">
                <h2 id="global-search-heading" className="sr-only">Global Search</h2>
                <form onSubmit={handleGlobalSearch} role="search">
                    <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input 
                        placeholder="Ask me anything to get started..." 
                        className="pl-12 h-14 text-lg rounded-full"
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        aria-label="Search across all tools"
                    />
                    </div>
                </form>
            </div>
        </section>

        {/* Features Title Section */}
        <section className="text-center my-12" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-primary">Powerful Features to Boost Your Learning</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                Everything you need to succeed in your studies, powered by AI.
            </p>
        </section>


        {/* Features Section */}
        <section aria-labelledby="feature-cards-heading">
             <h2 id="feature-cards-heading" className="sr-only">Feature Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featureCards.map(({ tool, icon, title, description }) => (
                <Card 
                    key={tool} 
                    className="cursor-pointer hover:border-primary/80 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-300 bg-card/50 backdrop-blur-sm"
                    onClick={() => handleToolSelect(tool)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleToolSelect(tool)}
                >
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary" aria-hidden="true">
                        {icon}
                        </div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <CardDescription>{description}</CardDescription>
                    </CardContent>
                </Card>
                ))}
            </div>
        </section>
      </div>
    );
  };

  return (
    <>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setLoginDialogOpen} />
      {isGestureControlEnabled && <GestureController />}
      <div id="app-container" className="flex flex-col min-h-screen bg-background text-foreground font-body">
          
          <header className="p-4 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="flex items-center gap-2">
                  <BrainCircuit className="h-8 w-8 text-primary" aria-hidden="true"/>
                  <h1 className="text-xl font-bold text-foreground">Study Buddy AI</h1>
              </div>
              <div className='flex items-center gap-4'>
                 <div className="flex items-center space-x-2">
                    <Hand className="text-primary" />
                    <Switch id="gesture-mode" checked={isGestureControlEnabled} onCheckedChange={setGestureControlEnabled} />
                    <Label htmlFor="gesture-mode">Gesture Control</Label>
                </div>
                <nav aria-label="User account">
                    {user ? (
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <UserCircle aria-hidden="true" />
                                {user.email}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={signOut} className="text-red-500 hover:text-red-500">
                                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                            Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline" onClick={() => setLoginDialogOpen(true)}>Sign In / Sign Up</Button>
                    )}
                </nav>
              </div>
          </header>
          
          <main className="flex-1 flex flex-col">
            {/* Hero Section */}
            {!activeTool && (
                <section className="flex items-center justify-center p-8 md:p-16 border-b border-primary/20" aria-labelledby="hero-heading">
                    <div className="grid md:grid-cols-2 items-center gap-8 w-full max-w-6xl">
                        <div className="text-left animate-blast-in">
                            <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-primary">Welcome to Study Buddy AI</h1>
                            <p className="text-muted-foreground mt-4 text-lg">
                                Your personal AI-powered study partner. Generate notes, create quizzes, and get answers to your toughest questions.
                            </p>
                        </div>
                        <div className="flex items-center justify-center" aria-hidden="true">
                            <InteractiveAiLogo />
                        </div>
                    </div>
                </section>
            )}

            {renderContent()}
          </main>

          <footer className="w-full p-6 border-t border-primary/20 text-center text-muted-foreground">
                <div className="flex justify-center gap-6 mb-4">
                    <a href="https://github.com/sopan-hub" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="View source code on Github">
                        <Github className="h-6 w-6" />
                    </a>
                    <a href="https://www.instagram.com/sopan.147/profilecard/?igsh=MXJ3NTF6c3BnM2Fucg==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Follow us on Instagram">
                        <Instagram className="h-6 w-6" />
                    </a>
                    <a href="mailto:patilsopan4148@gmail.com" className="hover:text-primary transition-colors" aria-label="Send us an email">
                        <Mail className="h-6 w-6" />
                    </a>
                </div>
                <span>© {new Date().getFullYear()} Study Buddy AI. All Rights Reserved.</span>
            </footer>
      </div>
    </>
  );
}

    