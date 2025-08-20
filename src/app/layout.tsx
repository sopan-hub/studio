import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study Buddy AI',
  description: 'Your personal AI-powered study partner',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
