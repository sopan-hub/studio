"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, BrainCircuit, FileText, BotMessageSquare, CalendarClock, BarChart3, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-secondary/10 text-secondary p-3 rounded-lg">{icon}</div>
      <h3 className="text-xl font-bold text-primary">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
       <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
           <div className="flex items-center gap-2">
            <BookOpenCheck className="h-8 w-8 text-secondary" />
            <h1 className="text-xl font-headline font-bold text-foreground">
              Study Buddy AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Study Assistant</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <Button asChild className="bg-gradient-to-r from-secondary to-accent text-white font-bold">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="container mx-auto py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
                Your Personal AI Study Buddy
              </h1>
              <p className="text-lg text-muted-foreground">
                Ask questions, generate summaries, create quizzes, and organize your study like never before.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/dashboard">
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
                className="rounded-lg shadow-2xl"
                data-ai-hint="futuristic student AI"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white dark:bg-card">
           <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Powerful Features to Boost Your Learning</h2>
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
    </div>
  );
}
