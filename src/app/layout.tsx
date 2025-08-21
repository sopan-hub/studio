
import type {Metadata} from 'next';
import {AuthProvider} from '@/hooks/use-auth';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import Script from 'next/script';

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
       <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6772455729424378"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
