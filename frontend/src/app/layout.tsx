import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Executive Performance Dashboard',
  description: 'Tinjauan komprehensif metrik keuangan dan retail.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
