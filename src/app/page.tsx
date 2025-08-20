
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search, BrainCircuit, Bot, FileText, ListChecks } from 'lucide-react';
import { AiChatTool } from '@/components/ai-chat-tool';
import { AiSummarizerTool } from '@/components/ai-summarizer-tool';
import { AiQuizTool } from '@/components/ai-quiz-tool';
import { InteractiveAiLogo } from '@/components/interactive-ai-logo';
import { InteractiveGridFooter } from '@/components/interactive-grid-footer';

type Tool = 'chat' | 'summarizer' | 'quiz';

const toolComponents: Record<Tool, React.ComponentType<{ onBack: () => void }>> = {
  chat: (props) => <AiChatTool {...props} title="Ask Any Question (AI Chat)" />,
  summarizer: AiSummarizerTool,
  quiz: AiQuizTool,
};

const featureCards = [
  {
    tool: 'chat' as Tool,
    icon: <Bot />,
    title: 'AI Chat',
    description: 'Ask any question and get detailed, AI-powered answers. Works with text and files.',
    comingSoon: false,
  },
  {
    tool: 'summarizer' as Tool,
    icon: <FileText />,
    title: 'Generate Notes',
    description: 'Turn long documents or pasted text into concise summaries and organized notes.',
    comingSoon: false,
  },
  {
    tool: 'quiz' as Tool,
    icon: <ListChecks />,
    title: 'Make a Quiz',
    description: 'Automatically generate practice quizzes from your study materials to test your knowledge.',
    comingSoon: false,
  },
];


export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");

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
      const ToolComponent = toolComponents[activeTool];
      return <ToolComponent onBack={() => setActiveTool(null)} />;
    }

    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {/* Main Welcome Section */}
        <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary neon-glow">Welcome to Study Buddy AI</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Your personal AI-powered study partner. Generate notes, create quizzes, and get answers to your toughest questions.
            </p>
        </section>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-primary/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-muted-foreground">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </span>
          </div>
        </div>

        {/* Features Section */}
        <section>
             <div className="max-w-xl mx-auto mb-8">
              <form onSubmit={handleGlobalSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Ask me anything to get started..." 
                    className="pl-10 h-12 text-lg"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureCards.map(({ tool, icon, title, description }) => (
                <Card 
                    key={tool} 
                    className="cursor-pointer hover:border-primary/80 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-300"
                    onClick={() => handleToolSelect(tool)}
                >
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        {icon}
                        </div>
                        <CardTitle>{title}</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <CardDescription>{description}</CardDescription>
                    </CardContent>
                </Card>
                ))}
            </div>
        </section>
      </main>
    );
  };
  
  if (activeTool === 'chat' && globalSearch) {
     const ToolComponent = toolComponents.chat;
     return (
        <div className="flex h-screen bg-background text-foreground font-body">
            <div className="flex-1 flex flex-col relative">
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <AiChatTool onBack={() => { setActiveTool(null); setGlobalSearch(""); }} title="Ask Any Question (AI Chat)" initialQuestion={globalSearch} onSearchPerformed={() => setGlobalSearch("")}/>
                </main>
                 <footer className="relative h-[200px]">
                    <InteractiveGridFooter />
                </footer>
            </div>
        </div>
     )
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-body">
        <div className="flex-1 flex flex-col relative">
            <header className="p-4 border-b border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-bold text-foreground">Study Buddy AI</h1>
                </div>
                <div className="w-1/3">
                  <form onSubmit={handleGlobalSearch}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Ask anything..." 
                            className="pl-10"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                    </div>
                  </form>
                </div>
                <div>
                  <Button variant="ghost">Sign In</Button>
                </div>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 flex-shrink-0 flex items-center justify-center">
                    <InteractiveAiLogo />
                </div>
                <div className="flex-1 overflow-y-auto border-l border-primary/20">
                     {renderContent()}
                </div>
            </div>
             <footer className="relative h-[100px] border-t border-primary/20">
                <InteractiveGridFooter />
            </footer>
        </div>
    </div>
  );
}
