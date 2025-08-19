import { Logo } from '@/components/logo';
import { NavMenu } from '@/components/nav-menu';
import { Mail, Instagram } from 'lucide-react';

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="p-4 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Logo />
        <NavMenu />
      </header>
      <main className="p-4 md:p-8 flex-grow">
        {children}
      </main>
      <footer className="bg-background border-t border-primary/20 py-6 mt-auto">
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
