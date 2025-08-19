"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookCopy, FileText, HelpCircle, LayoutDashboard, MessageSquare, User } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { href: '/dashboard', label: 'My Notes', icon: LayoutDashboard },
  { href: '/dashboard/summaries', label: 'Summaries', icon: FileText },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: BookCopy },
  { href: '/dashboard/quizzes', label: 'Quizzes', icon: HelpCircle },
  { href: '/dashboard/tutor', label: 'Tutor Chat', icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Separator className="my-2 bg-sidebar-border" />
          <div className="flex items-center gap-3">
             <Avatar>
              <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">User</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 flex justify-end md:hidden">
          <SidebarTrigger />
        </header>
        <main className="p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
