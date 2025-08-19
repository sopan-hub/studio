
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '#notes', label: 'My Notes' },
  { href: '#summarizer', label: 'Summarizer' },
  { href: '#flashcards', label: 'Flashcards' },
  { href: '#quizzes', label: 'Quizzes' },
  { href: '#tutor', label: 'AI Tutor' },
];

export function NavMenu() {
  return (
    <>
      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Button key={link.href} asChild variant="ghost">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
        <Button className="bg-gradient-to-r from-secondary to-accent text-white font-bold ml-2">
            Get Help
        </Button>
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
