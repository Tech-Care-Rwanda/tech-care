import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { NavigationBar } from '@/components/layout/NavigationBar'
import { SearchProvider } from "@/lib/contexts/SearchContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechCare - Professional Tech Support Services",
  description: "Connect with qualified technicians for all your technology needs in Rwanda. Computer repair, mobile devices, network setup, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <SearchProvider>
            <NavigationBar />
            <main className="pt-16">
              {children}
              <Toaster position="top-right" />
            </main>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
