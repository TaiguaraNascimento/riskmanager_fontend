"use client"; // Required for usePathname

import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/header'; // Adjust path if necessary
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth-guard'; // Import AuthGuard

// export const metadata: Metadata = { // Metadata should be defined in a server component or a separate file
//   title: 'v0 App',
//   description: 'Created with v0',
//   generator: 'v0.dev',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showHeader = !['/login', '/register'].includes(pathname);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {showHeader && <Header />}
        <main className="flex-grow">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </body>
    </html>
  );
}
