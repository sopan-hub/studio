import { Logo } from '@/components/logo';
import { NavMenu } from '@/components/nav-menu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="p-4 border-b flex items-center justify-between">
        <Logo />
        <NavMenu />
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
