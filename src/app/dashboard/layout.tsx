
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { BarChart3, Bell, BookOpenCheck, BrainCircuit, FileText, Home, LifeBuoy, LogOut, Settings, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-primary/20">
        <div className="p-4 border-b border-primary/20">
          <Logo />
        </div>
        <nav className="flex-grow p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <FileText className="h-4 w-4" />
              My Notes
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <BookOpenCheck className="h-4 w-4" />
              Summaries
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <BrainCircuit className="h-4 w-4" />
              Quizzes
            </Link>
             <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <BarChart3 className="h-4 w-4" />
              Progress
            </Link>
        </nav>
         <div className="mt-auto p-4 border-t border-primary/20">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10">
              <LifeBuoy className="h-4 w-4" />
              Support
            </Link>
          </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-16 items-center justify-between md:justify-end gap-4 border-b bg-card px-6 border-primary/20">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Settings className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5 text-primary" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? user.email ?? 'User'} />
                       <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                     <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                     <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </header>
        <main className="flex-grow p-6 bg-background">
            {children}
        </main>
         <footer className="bg-card border-t border-primary/20 py-4">
            <div className="container mx-auto text-center text-muted-foreground">
              <p>&copy; 2024 Study Buddy AI. All rights reserved.</p>
            </div>
          </footer>
      </div>
    </div>
  );
}
