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

export const metadata: Metadata = {
  title: {
    template: '%s | OPNMRT',
    default: 'OPNMRT | The Multi-Tenant AI Commerce Engine',
  },
  description: "Independent storefronts, global scale. Deploy sovereign commerce with AI-powered intelligence.",
  keywords: ['OPNMART', 'OPNMRT', 'OPEN MART', 'OpenMart', 'Ecommerce Platform', 'Start your store', 'Sell online', 'Multi-tenant Ecommerce'],
  openGraph: {
    type: 'website',
    siteName: 'OPNMRT',
    title: 'OPNMRT | The Multi-Tenant AI Commerce Engine',
    description: 'Independent storefronts, global scale. Deploy sovereign commerce with AI-powered intelligence.',
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
