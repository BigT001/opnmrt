import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { APP_BASE_DOMAIN, APP_URL } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: '%s | OPNMRT',
    default: 'OPNMRT | The Sovereign AI Commerce Engine',
  },
  description: "OPNMRT - The world's first independent commerce engine with built-in AI. Build, scale, and own your digital brand with sovereign storefronts and global scale.",
  keywords: [
    'OPNMRT', 'Sovereign Commerce', 'AI Ecommerce',
    'Independent Storefronts', 'Global Ecommerce Engine', 'Start Online Store Nigeria',
    'Multi-tenant Ecommerce Platform', 'Sell Online with AI', 'Commerce Intelligence'
  ],
  authors: [{ name: 'OPNMRT Team' }],
  creator: 'OPNMRT',
  publisher: 'OPNMRT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'OPNMRT',
    title: 'OPNMRT | The Sovereign AI Commerce Engine',
    description: 'Independent storefronts, global scale. Deploy sovereign commerce with AI-powered intelligence using OPNMRT.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OPNMRT - AI Commerce Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OPNMRT | The Sovereign AI Commerce Engine',
    description: 'Build, scale, and own your brand with OPNMRT.',
    images: ['/og-image.png'],
    creator: '@opnmrt',
  },
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
  alternates: {
    canonical: APP_URL,
    languages: {
      'en-US': APP_URL,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-touch-icon.png',
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
