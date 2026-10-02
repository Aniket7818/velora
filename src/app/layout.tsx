import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar } from '@/components/navigation/AnnouncementBar';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'VELORA | Style Beyond Ordinary — Luxury Fashion E-Commerce',
  description:
    "Discover your signature style, build coordinated looks, and shop smarter with VELORA's AI stylist, interactive outfit builder, and curated luxury collections.",
  keywords: ['luxury fashion', 'AI stylist', 'outfit builder', 'designer clothing', 'velora'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F6F1] text-[#171717] antialiased selection:bg-[#702C3B] selection:text-white">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
