import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Learn Swahili - Premium Tutoring Platform',
  description:
    'Connect with native East African tutors and master Kiswahili Sanifu through personalized, real-time video lessons. Pay only for the minutes you learn.',
  keywords: [
    'Swahili',
    'Kiswahili',
    'language learning',
    'tutoring',
    'East Africa',
    'Kenya',
    'Tanzania',
    'online lessons',
  ],
  authors: [{ name: 'Learn Swahili' }],
  openGraph: {
    title: 'Learn Swahili - Premium Tutoring Platform',
    description:
      'Connect with native East African tutors and master Kiswahili Sanifu.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
