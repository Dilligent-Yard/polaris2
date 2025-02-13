import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POLARIS | Minimalist Fashion',
  description: 'Minimalist fashion collection by POLARIS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}