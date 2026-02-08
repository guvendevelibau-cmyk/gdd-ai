import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GDD Generator | AI-Powered Game Design Document',
  description: 'Yapay zeka destekli profesyonel Game Design Document oluşturucu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} dark`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
