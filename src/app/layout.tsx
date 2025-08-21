
import type {Metadata} from 'next';
import {AuthProvider} from '@/hooks/use-auth';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import Script from 'next/script';

const siteTitle = 'Study Buddy AI | Your Personal AI-Powered Study Partner';
const siteDescription = 'Boost your learning with Study Buddy AI. Generate notes, create quizzes, solve math problems, get answers to your toughest questions, and more. Your all-in-one academic assistant.';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | Study Buddy AI`,
  },
  description: siteDescription,
  keywords: ['AI study tool', 'study assistant', 'quiz generator', 'note summarizer', 'math solver', 'education AI', 'learning app'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: 'https://study-buddy-ai.com', // Replace with your actual domain
    siteName: 'Study Buddy AI',
    images: [
      {
        url: '/og-image.png', // It's a good practice to have an Open Graph image
        width: 1200,
        height: 630,
        alt: 'Study Buddy AI application interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
   twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'], // Replace with your actual domain and image path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6772455729424378"
          crossOrigin="anonymous"
        ></script>
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
