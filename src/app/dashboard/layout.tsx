
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LogOut, MessageSquare, FileText, BrainCircuit, BookCopy, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';


const navLinks = [
  { href: '/dashboard', label: 'AI General Search', icon: MessageSquare },
  { href: '/dashboard/notes', label: 'My Notes', icon: FileText },
  { href: '/dashboard/summarizer', label: 'AI Summarizer', icon: BookCopy },
  { href: '/dashboard/flashcards', label: 'AI Flashcards', icon: BrainCircuit },
  { href: '/dashboard/quizzes', label: 'AI Quiz Generator', icon: BarChart3 },
  { href: '/dashboard/tutor-chat', label: 'AI Tutor Chat', icon: MessageSquare },
];


function SidebarNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                    <Button
                        variant={pathname === link.href ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </Button>
                </Link>
            ))}
        </nav>
    );
}

function UserMenu() {
    const { user, signOut } = useAuth();

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                        <AvatarFallback>{user.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName ?? 'New User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-card lg:block">
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Logo />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <SidebarNav />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                 <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6 sticky top-0 z-40">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                           <div className="flex h-[60px] items-center border-b px-6">
                                <Link href="/" className="flex items-center gap-2 font-semibold">
                                    <Logo />
                                </Link>
                            </div>
                            <SidebarNav />
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                       {/* Add search or other header controls here */}
                    </div>
                    <UserMenu />
                </header>
                <main className="flex-1 p-4 sm:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
