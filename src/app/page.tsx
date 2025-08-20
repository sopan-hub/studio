
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search, BrainCircuit, Bot, FileText, ListChecks, UserCircle, LogOut, BookOpen, MessageSquare, Microscope, FlaskConical, Target, Github, Instagram, Mail } from 'lucide-react';
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


type Tool = 'chat' | 'summarizer' | 'quiz' | 'planner' | 'research' | 'tutor' | 'lab' | 'goals';

const toolComponents: Record<Tool, React.ComponentType<{ onBack: () => void }>> = {
  chat: (props) => <AiChatTool {...props} title="Ask Any Question (AI Chat)" />,
  summarizer: AiSummarizerTool,
  quiz: AiQuizTool,
  // Placeholders for new tools
  planner: (props) => <AiChatTool {...props} title="AI Study Planner" />,
  research: (props) => <AiChatTool {...props} title="AI Research Assistant" />,
  tutor: (props) => <AiChatTool {...props} title="Personal AI Tutor" />,
  lab: (props) => <AiChatTool {...props} title="Virtual Lab Assistant" />,
  goals: (props) => <AiChatTool {...props} title="Learning Goal Setter" />,
};

const featureCards = [
  {
    tool: 'chat' as Tool,
    icon: <MessageSquare />,
    title: 'AI Chat',
    description: 'Ask any question and get detailed, AI-powered answers. Works with text and files.',
  },
  {
    tool: 'summarizer' as Tool,
    icon: <FileText />,
    title: 'Generate Notes',
    description: 'Turn long documents or pasted text into concise summaries and organized notes.',
  },
  {
    tool: 'quiz' as Tool,
    icon: <ListChecks />,
    title: 'Make a Quiz',
    description: 'Automatically generate practice quizzes from your study materials to test your knowledge.',
  },
    {
    tool: 'planner' as Tool,
    icon: <BookOpen />,
    title: 'Study Planner',
    description: 'Let our AI create a customized study schedule to keep you on track.',
  },
  {
    tool: 'research' as Tool,
    icon: <Microscope />,
    title: 'Research Helper',
    description: 'Get help finding and understanding sources for your research papers and projects.',
  },
  {
    tool: 'tutor' as Tool,
    icon: <Bot />,
    title: 'Personal Tutor',
    description: 'Receive one-on-one guidance and explanations on complex topics from your AI tutor.',
  },
    {
    tool: 'lab' as Tool,
    icon: <FlaskConical />,
    title: 'Virtual Lab',
    description: 'Simulate experiments and get help with your lab reports and data analysis.',
  },
  {
    tool: 'goals' as Tool,
    icon: <Target />,
    title: 'Goal Setter',
    description: 'Define your learning objectives and track your progress with AI-driven insights.',
  },
];


export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const { user, signOut } = useAuth();
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);


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
            return <AiChatTool onBack={() => { setActiveTool(null); setGlobalSearch(""); }} title="Ask Any Question (AI Chat)" initialQuestion={globalSearch} onSearchPerformed={() => setGlobalSearch("")}/>
        }
      const ToolComponent = toolComponents[activeTool];
      return <ToolComponent onBack={() => setActiveTool(null)} />;
    }

    return (
       <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">

        {/* Search Section */}
        <section className="text-center mt-4">
             <div className="max-w-2xl mx-auto">
                <form onSubmit={handleGlobalSearch}>
                    <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                        placeholder="Ask me anything to get started..." 
                        className="pl-12 h-14 text-lg rounded-full neon-glow-button"
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                    </div>
                </form>
            </div>
        </section>

        {/* Features Title Section */}
        <section className="text-center my-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary neon-glow">Powerful Features to Boost Your Learning</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
                Everything you need to succeed in your studies, powered by AI.
            </p>
        </section>


        {/* Features Section */}
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featureCards.map(({ tool, icon, title, description }) => (
                <Card 
                    key={tool} 
                    className="cursor-pointer hover:border-primary/80 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-300 bg-card/50 backdrop-blur-sm"
                    onClick={() => handleToolSelect(tool)}
                >
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
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
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
          <header className="p-4 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="flex items-center gap-2">
                  <BrainCircuit className="h-8 w-8 text-primary" />
                  <h1 className="text-xl font-bold text-foreground">Study Buddy AI</h1>
              </div>
              <div>
                {user ? (
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            <UserCircle />
                            {user.email}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="text-red-500 hover:text-red-500">
                            <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="outline" className="neon-glow-button" onClick={() => setLoginDialogOpen(true)}>Sign In / Sign Up</Button>
                )}
              </div>
          </header>
          
          <div className="flex-1 flex flex-col">
            {/* Hero Section */}
            {!activeTool && (
                <section className="flex items-center justify-center p-8 md:p-16 border-b border-primary/20">
                    <div className="grid md:grid-cols-2 items-center gap-8 w-full max-w-6xl">
                        <div className="text-left animate-blast-in">
                            <h1 className="text-4xl md:text-6xl font-bold text-primary neon-glow">Welcome to Study Buddy AI</h1>
                            <p className="text-muted-foreground mt-4 text-lg">
                                Your personal AI-powered study partner. Generate notes, create quizzes, and get answers to your toughest questions.
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <InteractiveAiLogo />
                        </div>
                    </div>
                </section>
            )}

            {renderContent()}
          </div>

          <footer className="w-full p-6 border-t border-primary/20 text-center text-muted-foreground">
                <div className="flex justify-center gap-6 mb-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Github className="h-6 w-6" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Instagram className="h-6 w-6" />
                    </a>
                    <a href="mailto:contact@studybuddy.ai" className="hover:text-primary transition-colors">
                        <Mail className="h-6 w-6" />
                    </a>
                </div>
                © {new Date().getFullYear()} Study Buddy AI. All Rights Reserved.
            </footer>
      </div>
    </>
  );
}

    