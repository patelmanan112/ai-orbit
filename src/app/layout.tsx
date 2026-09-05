import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "AI Companies | AI Orbit",
  description: "Discover companies shaping the future of artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}
      >
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-xl tracking-tight text-white">AI Orbit</Link>
              <Link href="/companies" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Companies</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
