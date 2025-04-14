import { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ 
  children, 
  title = 'Chronos Biotech - Health Optimization Tools',
  description = 'Advanced health optimization tools for monitoring and improving your biometrics',
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-primary-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="py-8 bg-secondary-800 text-white text-center">
        <p>© {new Date().getFullYear()} Chronos Biotech. All rights reserved.</p>
      </footer>
    </div>
  );
}
