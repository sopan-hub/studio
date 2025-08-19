import { Logo } from '@/components/logo';
import { NavMenu } from '@/components/nav-menu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b border-primary/20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Logo />
        <NavMenu />
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
