import { Logo } from '@/components/logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
