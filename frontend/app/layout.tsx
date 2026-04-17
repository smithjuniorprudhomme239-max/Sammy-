import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from './providers';
import './globals.css';

// Register service worker for PWA
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'UNIDEV Store', template: '%s | UNIDEV Store' },
  description: 'Your one-stop shop for the latest electronics and gadgets. Best prices on tablets, audio devices, and gaming equipment.',
  keywords: ['electronics', 'gadgets', 'tablets', 'audio', 'gaming', 'tech store'],
  openGraph: {
    type: 'website',
    siteName: 'UNIDEV Store',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  robots: { index: true, follow: true },
  other: {
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
      </body>
    </html>
  );
}