import type { FC, ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ title, description, children }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        {children}
      </div>
    </header>
  );
};

export default DashboardHeader;
