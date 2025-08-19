
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';


const navLinks = [
  { href: '#notes', label: 'My Notes' },
  { href: '#summarizer', label: 'Summarizer' },
  { href: '#flashcards', label: 'Flashcards' },
  { href: '#quizzes', label: 'Quizzes' },
  { href: '#tutor', label: 'AI Tutor' },
];

export function NavMenu() {
  const { user, signOut } = useAuth();
  return (
    <>
      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Button key={link.href} asChild variant="ghost">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
         {user ? (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL!} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
         ) : (
            <Button className="bg-gradient-to-r from-secondary to-accent text-white font-bold ml-2">
                Get Help
            </Button>
         )}

      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" className="justify-start text-lg">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
               <Button className="bg-gradient-to-r from-secondary to-accent text-white font-bold mt-4">
                    Get Help
                </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
