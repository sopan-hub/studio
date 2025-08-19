"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, BrainCircuit, FileText, BotMessageSquare, CalendarClock, BarChart3, Bookmark, Mail, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card p-6 rounded-lg border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
    <div className="flex items-center gap-4 mb-4">
      <div className="text-primary">{icon}</div>
      <h3 className="text-xl font-bold text-primary neon-glow">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
)

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
       <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-primary/20">
        <div className="container mx-auto flex items-center justify-between p-4">
           <div className="flex items-center gap-2">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="#features" className="text-muted-foreground hover:text-primary hover:neon-glow transition-all">Features</Link>
            <Link href="#features" className="text-muted-foreground hover:text-primary hover:neon-glow transition-all">Study Assistant</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-primary hover:neon-glow transition-all">Pricing</Link>
          </nav>
          <Button asChild className="bg-primary/90 text-primary-foreground font-bold neon-glow-button">
            <Link href="/dashboard">Get Started</Link>
          </Button>
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
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow-button animate-pulse">
                <Link href="#features">
                  Start Studying Now <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            <div>
              <Image 
                src="https://placehold.co/600x400.png"
                alt="AI Assistant Illustration" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-2xl shadow-primary/20"
                data-ai-hint="futuristic student AI neon"
              />
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
                  icon={<BotMessageSquare size={24}/>}
                  title="Ask Any Question (AI Chat)"
                  description="Get instant, detailed answers to your questions from an expert AI tutor."
                />
                <FeatureCard 
                  icon={<FileText size={24}/>}
                  title="Generate Notes & Summaries"
                  description="Automatically create concise summaries and organized notes from any text."
                />
                 <FeatureCard 
                  icon={<BrainCircuit size={24}/>}
                  title="Smart Quiz Maker"
                  description="Test your knowledge with custom quizzes generated from your study materials."
                />
                 <FeatureCard 
                  icon={<CalendarClock size={24}/>}
                  title="Study Planner & Reminders"
                  description="Organize your study schedule and get timely reminders to stay on track."
                />
                 <FeatureCard 
                  icon={<BarChart3 size={24}/>}
                  title="Progress Tracker"
                  description="Monitor your learning progress and identify areas for improvement."
                />
                 <FeatureCard 
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
