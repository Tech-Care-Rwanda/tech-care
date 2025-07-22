import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/lib/contexts/SearchContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { NavigationBar } from "@/components/layout/NavigationBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TechCare Rwanda - Professional Tech Support Services",
  description: "Get expert technical support, remote help, training, and 24/7 assistance in Rwanda. Professional technicians at your service.",
  keywords: "tech support, Rwanda, technical assistance, remote help, computer repair, IT services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50`}
        suppressHydrationWarning={true} // Prevents hydration warnings from browser extensions like Grammarly
      >
        <AuthProvider>
          <SearchProvider>
            <div className="min-h-screen flex flex-col">
              {/* Fixed Navigation */}
              <NavigationBar />
              
              {/* Main Content Area */}
              <main className="flex-1 pt-16">
                {children}
              </main>
            </div>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
