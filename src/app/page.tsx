
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, BrainCircuit, FileText, BotMessageSquare, CalendarClock, BarChart3, Bookmark, Mail, Instagram, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Logo } from "@/components/logo";
import { useAuth } from '@/hooks/use-auth';
import { LoginDialog } from '@/components/login-dialog';
import { InteractiveAiLogo } from '@/components/interactive-ai-logo';

const FeatureCard = ({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) => (
    <Link href={href}>
        <div className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] cursor-pointer h-full">
            <div className="flex items-center gap-4 mb-4">
            <div className="text-primary">{icon}</div>
            <h3 className="text-xl font-bold text-primary neon-glow">{title}</h3>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </Link>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
)

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleAuthAction = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
        e.preventDefault();
        setIsLoginDialogOpen(true);
    }
  };
  
  const handleLoginLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (user) {
      signOut();
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  const handleGetStartedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
     if (user) {
        // If user is logged in, default behavior (scrolling) is fine.
        // No special action needed.
     } else {
        // If user is not logged in, prevent default and open dialog.
        e.preventDefault();
        setIsLoginDialogOpen(true);
     }
  }


  return (
    <div className="bg-background text-foreground">
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} onLoginSuccess={() => router.push('/#features')}/>
      {/* Header */}
       <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-primary/20">
        <div className="container mx-auto flex items-center justify-between p-4">
           <div className="flex items-center gap-2">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-primary hover:neon-glow transition-all">Features</Link>
             <Button onClick={handleLoginLogout} variant="ghost" className="hover:text-primary hover:neon-glow transition-all">
                {user ? 'Log Out' : 'Log In'}
            </Button>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight neon-glow">
                Your Personal AI Study Buddy
              </h1>
              <p className="text-xl text-muted-foreground">
                Ask questions, generate summaries, create quizzes, and organize your study like never before.
              </p>
               <Link href="#features" passHref>
                 <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-button animate-pulse" >
                    Start Studying Now <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
            <div>
              <InteractiveAiLogo />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-background">
           <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary neon-glow">Powerful Features to Boost Your Learning</h2>
              <p className="text-lg text-muted-foreground mt-2">Everything you need to succeed in your studies, powered by AI.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                  href="#features"
                  icon={<BotMessageSquare size={24}/>}
                  title="Ask Any Question (AI Chat)"
                  description="Get instant, detailed answers to your questions from an expert AI tutor."
                />
                <FeatureCard
                  href="#features"
                  icon={<FileText size={24}/>}
                  title="Generate Notes & Summaries"
                  description="Automatically create concise summaries and organized notes from any text."
                />
                 <FeatureCard
                  href="#features"
                  icon={<BrainCircuit size={24}/>}
                  title="Smart Quiz Maker"
                  description="Test your knowledge with custom quizzes generated from your study materials."
                />
                 <FeatureCard
                  href="#features"
                  icon={<CalendarClock size={24}/>}
                  title="Study Planner & Reminders"
                  description="Organize your study schedule and get timely reminders to stay on track."
                />
                 <FeatureCard
                  href="#features"
                  icon={<BarChart3 size={24}/>}
                  title="Progress Tracker"
                  description="Monitor your learning progress and identify areas for improvement."
                />
                 <FeatureCard
                  href="#features"
                  icon={<Bookmark size={24}/>}
                  title="Save & Organize"
                  description="Keep all your notes, quizzes, and summaries neatly organized and accessible."
                />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background border-t border-primary/20 py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-primary neon-glow">&copy; 2024 Study Buddy AI. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
             <a href="mailto:patilsopan4148@gmail.com" className="hover:text-primary hover:neon-glow transition-all" aria-label="Email">
              <Mail className="h-6 w-6" />
            </a>
            <a href="https://github.com/sopan-hub" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:neon-glow transition-all" aria-label="GitHub">
                <GitHubIcon className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/sopan.147/profilecard/?igsh=MXJ3NTF6c3BnM2Fucg==" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:neon-glow transition-all" aria-label="Instagram">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
